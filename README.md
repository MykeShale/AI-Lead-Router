# AI-Powered Lead Intake & Routing System

A portfolio-grade automation project demonstrating workflow automation, AI-assisted drafting, human-in-the-loop review, and reporting.

**Tech Stack**: Next.js (App Router) + TypeScript + Tailwind CSS, Prisma + PostgreSQL, Anthropic Claude API, Recharts, deployed on Vercel.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your actual values:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure you have a valid PostgreSQL database running for `DATABASE_URL`.*

3. **Database Migration**
   Initialize the database schema:
   ```bash
   npx prisma generate
   npx prisma db push
   # or npx prisma migrate dev
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Progress

### ✅ Phase 1: Scaffold + Schema + Intake Endpoint (Completed)
- Scaffolded Next.js + TypeScript + Tailwind project with a clean folder structure (`/app`, `/lib`, `/components`, `/prisma`).
- Created `.env.example` with placeholders for `ANTHROPIC_API_KEY` and `DATABASE_URL`.
- Configured Prisma schema with the `Lead` model including status, priority, AI enrichment fields, and metadata.
- Implemented `POST /api/leads/intake` endpoint to validate payload and create new leads.
- Added hook placeholder for Phase 2 AI Enrichment.
- Implemented `GET /api/leads` endpoint for dashboard listing.

### ✅ Phase 2: AI Enrichment Module (Completed)
- Implemented AI enrichment using Anthropic Claude API via `@anthropic-ai/sdk`.
- Provided a strict JSON prompt to automatically summarize the lead message, categorize, prioritize, and generate a draft reply.
- Included robust JSON parsing with a retry mechanism and fallback to "NeedsManualReview" on repeated failures.
- Connected enrichment logic to the intake endpoint synchronously.

### ⏳ Phase 3: Dashboard + Lead Detail/Approval UI (Next)
- Dashboard view: table or Kanban-by-status listing all leads with priority badges, category tags, source, and quick status. Sortable/filterable.
- Lead detail view: shows AI summary + draft reply, with Approve & Send / Edit & Send / Reject actions.
- Routing logic: simple category/priority-based assignment to a mock queue/owner.
