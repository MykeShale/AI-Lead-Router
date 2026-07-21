# AI-Powered Lead Intake & Routing Engine

**Live Demo**: [https://lead-routing-system-demo.vercel.app](https://lead-routing-system-demo.vercel.app)

## System Overview
This project is a portfolio-grade workflow automation system that demonstrates the underlying mechanics of tools like Zapier or Make.com (trigger -> condition -> action -> retry/log). Rather than relying on a no-code tool, this engine is built from scratch. It seamlessly integrates an intake pipeline, AI-driven enrichment (via Anthropic Claude), an external rules evaluation engine, an action dispatcher with exponential backoff, and comprehensive execution logging.

## Architecture

```mermaid
graph TD
    A[Trigger: Webhook Intake API] --> B[Rate Limiting & Input Validation]
    B --> C[AI Enrichment Module]
    C -->|Claude API| D[Categorize, Summarize, Prioritize & Draft Reply]
    D --> E[Engine Evaluator: Reads External rules.json]
    E -->|Condition Match| F[Engine Dispatcher: Executes Action]
    F -->|Success or Max Retries| G[RunLog: Database Logging]
```

## Worked Example

### 1. Sample Rule Config (JSON)
The engine evaluates external rules stored in `rules.json`:
```json
{
  "id": "rule_1",
  "name": "Enterprise Routing",
  "conditions": {
    "priority": "Hot",
    "category": "Sales"
  },
  "action": {
    "type": "assign_owner",
    "payload": {
      "owner": "Enterprise AE"
    }
  }
}
```

### 2. Sample Incoming Payload
A lead submits a form requesting a demo of the enterprise tier:
```json
{
  "name": "Alice Smith",
  "email": "alice@hugecorp.com",
  "company": "Huge Corp",
  "message": "We need to deploy your platform to 10,000 users immediately."
}
```

### 3. Step-by-Step Flow
1. **Trigger**: The webhook endpoint receives the JSON payload, validates it, and enforces rate limits.
2. **Enrichment**: Claude analyzes the message and outputs `{"priority": "Hot", "category": "Sales", ...}`.
3. **Condition Evaluator**: The engine checks the enriched payload against `rules.json`. It matches `rule_1` because `priority === "Hot"` and `category === "Sales"`.
4. **Action Dispatcher**: The engine fires the `assign_owner` action, passing `"Enterprise AE"`. If the database update fails, it will retry up to 3 times with exponential backoff.
5. **RunLog**: The engine writes a record to the `RunLog` table, tracking the successful execution of `rule_1` for full observability.

## Why Build This Instead of Just Using Zapier?
The honest answer is: understanding the internals means faster debugging, better judgment about when a no-code tool is enough vs. when custom code is needed, and the ability to build custom actions that no-code tools don't natively support. While Zapier and Make are incredible for rapid prototyping, an internal rules engine guarantees that you own your data flow, bypass rate limits and expensive task-based pricing, and can integrate deeply into proprietary microservices with custom telemetry.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/leaddb"
   ANTHROPIC_API_KEY="sk-ant-..."
   ```

3. **Database Migration & Seeding**
   Initialize the schema and seed fake leads:
   ```bash
   npx prisma db push
   node seed.mjs
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Known Limitations
- **Background Processing**: Currently, enrichment and engine dispatch are synchronous. In production, this is a lite/demo engine; a real system would use a distributed queue (e.g., Inngest, BullMQ, or Kafka) to avoid holding up the HTTP request and to manage concurrent retries asynchronously.
- **Rule Management UI**: There is no UI for rule editing yet. Rules are statically defined in `rules.json`.
- **Scheduled Jobs**: This engine is currently event-driven (webhook triggers). It does not support CRON or scheduled jobs.
- **Authentication**: The dashboard currently lacks Auth. Needs NextAuth or Clerk integration.
- **Real Email Sending**: The "Approve & Send" action is currently mocked. Needs integration with an SMTP provider like SendGrid or Postmark.
