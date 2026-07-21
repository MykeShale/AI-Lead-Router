import { prisma } from "../prisma";

export async function dispatchAction(leadId: string, action: any, ruleId: string): Promise<void> {
  const maxRetries = 3;
  let attempts = 0;
  let success = false;
  let lastError = null;

  while (attempts < maxRetries && !success) {
    attempts++;
    try {
      if (action.type === "assign_owner") {
        await prisma.lead.update({
          where: { id: leadId },
          data: { owner: action.payload.owner }
        });
      } else {
        throw new Error(`Unknown action type: ${action.type}`);
      }
      
      success = true;
      
      await prisma.runLog.create({
        data: {
          leadId,
          ruleId,
          status: "Success",
          actionType: action.type,
          payload: JSON.stringify(action.payload),
          attempts
        }
      });
      
    } catch (error: any) {
      lastError = error;
      console.error(`Action dispatch failed (attempt ${attempts}):`, error);
      if (attempts < maxRetries) {
        // Exponential backoff: 500ms, 1000ms, etc.
        const delay = Math.pow(2, attempts - 1) * 500;
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }

  if (!success) {
    await prisma.runLog.create({
        data: {
          leadId,
          ruleId,
          status: "Failed",
          actionType: action.type,
          payload: JSON.stringify(action.payload),
          error: lastError?.message || "Unknown error",
          attempts
        }
    });
    throw new Error(`Action dispatch failed after ${maxRetries} attempts: ${lastError?.message}`);
  }
}
