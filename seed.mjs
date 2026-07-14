import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const fakeLeads = [
  { name: "Alice Johnson", email: "alice@techcorp.com", company: "TechCorp", message: "We need a new enterprise routing system immediately.", source: "Website Form", status: "Sent", priority: "Hot", category: "Sales", ai_summary: "Wants enterprise routing system ASAP.", owner: "Enterprise AE" },
  { name: "Bob Smith", email: "bob@startup.io", company: "Startup.io", message: "Can you provide pricing for your starter tier?", source: "Inbound Email", status: "Enriched", priority: "Warm", category: "Sales", ai_summary: "Looking for pricing details.", owner: "Mid-Market AE" },
  { name: "Charlie Davis", email: "charlie@freelance.net", company: null, message: "My account is locked, please help.", source: "Support Portal", status: "New", priority: "Hot", category: "Support", ai_summary: "Account is locked.", owner: "Support Team" },
  { name: "Dana Lee", email: "dana@agency.co", company: "Agency Co", message: "Would love to discuss a potential partnership.", source: "LinkedIn", status: "NeedsManualReview", priority: "Cold", category: "Partnership", ai_summary: "Wants to discuss partnership.", owner: "BD Team" },
  { name: "Eve Martinez", email: "eve@retail.com", company: "Retail Inc", message: "Do you integrate with Shopify?", source: "Website Form", status: "Sent", priority: "Warm", category: "Sales", ai_summary: "Asking about Shopify integration.", owner: "Mid-Market AE" },
  { name: "Frank White", email: "frank@corp.com", company: "Corp Ltd", message: "How secure is your platform? We have strict compliance needs.", source: "Website Form", status: "Enriched", priority: "Hot", category: "Sales", ai_summary: "Asking about security and compliance.", owner: "Enterprise AE" },
  { name: "Grace Kim", email: "grace@design.co", company: "Design Co", message: "I can't log in since yesterday.", source: "Support Portal", status: "Sent", priority: "Hot", category: "Support", ai_summary: "Login issues.", owner: "Support Team" },
  { name: "Henry Adams", email: "henry@edu.org", company: "Edu Org", message: "Are there discounts for non-profits?", source: "Inbound Email", status: "Rejected", priority: "Cold", category: "Sales", ai_summary: "Asking for non-profit discounts.", owner: "General Queue" },
  { name: "Isabel Garcia", email: "isabel@health.net", company: "Health Net", message: "We are migrating off Salesforce and need a new routing tool.", source: "Website Form", status: "New", priority: "Hot", category: "Sales", ai_summary: "Migrating from Salesforce, needs routing tool.", owner: "Enterprise AE" },
  { name: "Jack Wilson", email: "jack@dev.io", company: "Dev IO", message: "The API is returning 500 errors on the /leads endpoint.", source: "Support Portal", status: "NeedsManualReview", priority: "Hot", category: "Support", ai_summary: "API is returning 500 errors.", owner: "Support Team", error_log: "AI Enrichment failed. Model timed out." },
  { name: "Karen Young", email: "karen@media.com", company: "Media Com", message: "Just saying hi and wanted to learn more about the product.", source: "Social Media", status: "Enriched", priority: "Cold", category: "General", ai_summary: "General inquiry about the product.", owner: "General Queue" },
  { name: "Leo Thomas", email: "leo@fintech.io", company: "Fintech IO", message: "We process 10k leads a day. Can you handle that volume?", source: "Website Form", status: "New", priority: "Hot", category: "Sales", ai_summary: "Asking about high volume capabilities (10k/day).", owner: "Enterprise AE" },
  { name: "Mia Lewis", email: "mia@consulting.com", company: "Consulting", message: "Can we get a demo next week?", source: "Website Form", status: "Sent", priority: "Warm", category: "Sales", ai_summary: "Requesting a demo for next week.", owner: "Mid-Market AE" },
  { name: "Noah Walker", email: "noah@startup.com", company: "Startup", message: "Is there a free trial available?", source: "Inbound Email", status: "Enriched", priority: "Cold", category: "Sales", ai_summary: "Asking for a free trial.", owner: "General Queue" },
  { name: "Olivia Hall", email: "olivia@enterprise.com", company: "Enterprise Com", message: "Our legal team needs to review your terms of service.", source: "Inbound Email", status: "Sent", priority: "Warm", category: "Sales", ai_summary: "Legal team needs to review TOS.", owner: "Enterprise AE" },
  { name: "Paul Allen", email: "paul@local.com", company: "Local Biz", message: "How do I update my billing info?", source: "Support Portal", status: "Enriched", priority: "Cold", category: "Support", ai_summary: "Wants to update billing info.", owner: "Support Team" },
  { name: "Quinn Nelson", email: "quinn@logistics.com", company: "Logistics", message: "We need a custom integration built.", source: "Website Form", status: "NeedsManualReview", priority: "Warm", category: "Partnership", ai_summary: "Needs custom integration.", owner: "BD Team", error_log: "AI failed to categorize properly." },
  { name: "Rachel King", email: "rachel@marketing.co", company: "Marketing Co", message: "Looking for an agency partner program.", source: "Website Form", status: "New", priority: "Warm", category: "Partnership", ai_summary: "Looking for agency partner program.", owner: "BD Team" },
  { name: "Sam Wright", email: "sam@tech.com", company: "Tech Inc", message: "Your app keeps crashing on iOS 17.", source: "Support Portal", status: "Enriched", priority: "Hot", category: "Support", ai_summary: "App crashing on iOS 17.", owner: "Support Team" },
  { name: "Tina Scott", email: "tina@design.com", company: "Design", message: "I want to cancel my subscription.", source: "Inbound Email", status: "Sent", priority: "Hot", category: "Support", ai_summary: "Wants to cancel subscription.", owner: "Support Team" },
  { name: "Ursula Green", email: "ursula@green.com", company: "Green Energy", message: "Can you share a case study for the renewable energy sector?", source: "Website Form", status: "Enriched", priority: "Warm", category: "Sales", ai_summary: "Requesting renewable energy case study.", owner: "Mid-Market AE" },
  { name: "Victor Baker", email: "victor@baker.com", company: "Baker Bros", message: "How much does it cost?", source: "Social Media", status: "Rejected", priority: "Cold", category: "Sales", ai_summary: "Asking for pricing.", owner: "General Queue" },
  { name: "Wendy Hill", email: "wendy@hill.com", company: "Hill Corp", message: "We need SSO and SAML support.", source: "Website Form", status: "New", priority: "Hot", category: "Sales", ai_summary: "Needs SSO and SAML support.", owner: "Enterprise AE" },
  { name: "Xavier Perez", email: "xavier@perez.com", company: null, message: "Where can I find the API documentation?", source: "Inbound Email", status: "Enriched", priority: "Cold", category: "Support", ai_summary: "Asking for API docs.", owner: "Support Team" },
  { name: "Yvonne Adams", email: "yvonne@adams.com", company: "Adams Family", message: "Do you support multi-language routing?", source: "Website Form", status: "Sent", priority: "Warm", category: "Sales", ai_summary: "Asking about multi-language routing.", owner: "Mid-Market AE" }
];

async function main() {
  console.log("Seeding database...");
  await prisma.lead.deleteMany();
  for (const data of fakeLeads) {
    // Generate some random createdAt dates over the last 30 days
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 30));
    
    // Some random updated dates
    const updatedDate = new Date(pastDate);
    updatedDate.setHours(updatedDate.getHours() + Math.floor(Math.random() * 48));

    await prisma.lead.create({
      data: {
        ...data,
        draft_reply: "This is a generated draft reply based on the message.",
        createdAt: pastDate,
        updatedAt: updatedDate,
      },
    });
  }
  console.log("Seeded database with fake leads!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
