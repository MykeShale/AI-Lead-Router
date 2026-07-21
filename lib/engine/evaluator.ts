export function evaluateConditions(payload: any, conditions: Record<string, string>): boolean {
  // Simple equality matcher for now
  for (const [key, expectedValue] of Object.entries(conditions)) {
    if (payload[key] !== expectedValue) {
      return false;
    }
  }
  return true;
}
