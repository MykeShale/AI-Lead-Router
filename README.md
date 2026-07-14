# AI-Powered Lead Intake & Routing System

**Live Demo**: [https://lead-routing-system-demo.vercel.app](https://lead-routing-system-demo.vercel.app)

## System Overview
This project is a portfolio-grade workflow automation system that seamlessly integrates an intake pipeline, AI-driven enrichment (via Anthropic Claude), a human-in-the-loop review interface, automated routing, and comprehensive reporting. It demonstrates the ability to handle raw inputs, process them intelligently with AI, apply business logic for assignment, and present the data in a clean, production-ready dashboard.

## Architecture

```mermaid
graph TD
    A[Lead Intake API] --> B[Prisma DB / Postgres]
    B --> C[AI Enrichment Module]
    C -->|Claude API| D[Categorize, Summarize, Prioritize & Draft Reply]
    D --> E[Routing Logic]
    E --> F[Dashboard & Reporting]
    E --> G[Human Review Gate]
    G -->|Approve/Edit/Reject| H[Mock Send/SMTP]
```

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

## How This Maps to Real Automation Work

*   **Intake (`/api/leads/intake`)**: Mimics the webhook or form endpoint that receives raw data from marketing channels (like Hubspot or Typeform).
*   **AI Enrichment**: Instead of a human SDR spending 5 minutes reading and categorizing an email, Claude parses the intent, flags urgency, and drafts a baseline response instantly.
*   **Human Review Gate**: AI isn't perfect. By holding leads in an "Enriched" state, humans maintain control. They review the AI's draft, make quick edits, and hit approve. This drastically reduces handle time while maintaining quality.
*   **Routing Logic**: Uses the AI's categorization to assign leads to the right queue (e.g., Enterprise Sales vs. Support), preventing bottlenecks and misaligned reps.
*   **Monitoring & Reporting**: Provides oversight on system health (catching AI hallucinations or timeouts) and tracks KPI metrics like average time-to-response to prove the ROI of the automation.

## Known Limitations / Future Enhancements
- **Queueing**: Currently, enrichment is synchronous. In production, this should move to a background job queue (e.g., Inngest, BullMQ) to avoid holding up the HTTP request and to handle retries gracefully.
- **Authentication**: The dashboard currently lacks Auth. Needs NextAuth or Clerk integration.
- **Real Email Sending**: The "Approve & Send" action is currently mocked. Needs integration with an SMTP provider like SendGrid or Postmark.
- **Rate Limiting & Backoff**: Added retry logic, but production would need exponential backoff and strict rate limiting on the intake endpoint.
