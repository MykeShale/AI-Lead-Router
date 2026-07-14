import { prisma } from "./prisma";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy-key-to-prevent-startup-crash",
});

const SYSTEM_PROMPT = `You are an expert sales development representative and AI assistant for a B2B SaaS company.
Your task is to analyze an incoming lead's message and metadata, and provide enrichment data.
You must return your analysis strictly as a valid JSON object matching this exact schema:

{
  "summary": "A concise 1-2 sentence summary of the lead's request or situation.",
  "priority": "Hot", // Must be exactly "Hot", "Warm", or "Cold". Hot = ready to buy/urgent, Warm = evaluating/interested, Cold = general inquiry/unqualified.
  "category": "Sales", // E.g., "Sales", "Support", "Partnership", "General"
  "draft_reply": "A professional, personalized draft email reply addressing their specific needs. Keep it concise, engaging, and action-oriented."
}

Do not include any text outside of the JSON object. Do not wrap the JSON in markdown formatting blocks. Return only the raw JSON string.`;

export async function enrichLead(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error("Lead not found");

  const prompt = `Lead Information:
Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || "Not provided"}
Source: ${lead.source || "Not provided"}
Message:
${lead.message}`;

  let attempts = 0;
  let maxAttempts = 3; // Initial try + 2 retries
  let currentPrompt = prompt;

  while (attempts < maxAttempts) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: currentPrompt }],
        temperature: 0.2,
      });

      const messageContent = response.content[0];
      if (messageContent.type !== 'text') {
          throw new Error("Unexpected response type from Claude");
      }
      
      let rawJson = messageContent.text.trim();
      // Try to clean markdown block if present
      if (rawJson.startsWith("```json")) {
        rawJson = rawJson.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (rawJson.startsWith("```")) {
        rawJson = rawJson.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(rawJson);

      // Basic validation
      if (!parsed.summary || !parsed.priority || !parsed.category || !parsed.draft_reply) {
        throw new Error("Missing required fields in JSON response");
      }

      // Routing Logic (Mock)
      let owner = "General Queue";
      if (parsed.priority === "Hot" && parsed.category === "Sales") owner = "Enterprise AE";
      else if (parsed.priority === "Warm" && parsed.category === "Sales") owner = "Mid-Market AE";
      else if (parsed.category === "Support") owner = "Support Team";
      else if (parsed.category === "Partnership") owner = "BD Team";

      // Update lead with enriched data and assigned owner
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          status: "Enriched",
          ai_summary: parsed.summary,
          priority: parsed.priority,
          category: parsed.category,
          draft_reply: parsed.draft_reply,
          owner: owner,
        },
      });

      return; // Success
    } catch (error: any) {
      attempts++;
      console.error(`Enrichment attempt ${attempts} failed:`, error);
      
      if (attempts >= maxAttempts) {
        // Repeated failure, set to NeedsManualReview
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            status: "NeedsManualReview",
            error_log: `AI Enrichment failed after ${maxAttempts} attempts. Last error: ${error.message}`,
          },
        });
        return;
      }
      
      // Corrective follow-up prompt
      currentPrompt = `Lead Information:
Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || "Not provided"}
Source: ${lead.source || "Not provided"}
Message:
${lead.message}

Your previous response was malformed or missing required fields. Please ensure you return ONLY valid JSON matching the exact schema requested, with no extra text or formatting. Error details: ${error.message}`;
    }
  }
}
