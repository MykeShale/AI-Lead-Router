import rules from "./rules.json";
import { evaluateConditions } from "./evaluator";
import { dispatchAction } from "./dispatcher";

export async function processEngineRules(leadId: string, enrichedPayload: any) {
  try {
    for (const rule of rules) {
      const isMatch = evaluateConditions(enrichedPayload, rule.conditions as Record<string, string>);
      if (isMatch) {
        console.log(`Lead ${leadId} matched rule: ${rule.name}`);
        // Dispatch the action for the matched rule.
        // For this demo, we assume the first matched rule handles routing and we stop.
        await dispatchAction(leadId, rule.action, rule.id);
        return;
      }
    }
    
    // If no rule matches, we can assign a default owner or do nothing.
    console.log(`Lead ${leadId} did not match any routing rules.`);
    await dispatchAction(leadId, {
      type: "assign_owner",
      payload: { owner: "General Queue" }
    }, "default_rule");

  } catch (error) {
    console.error("Error processing engine rules:", error);
    throw error;
  }
}
