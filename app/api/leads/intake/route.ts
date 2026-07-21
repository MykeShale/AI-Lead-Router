import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrichLead } from "@/lib/enrichLead";

// Simple in-memory rate limiting for demo purposes
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 5;
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export async function POST(req: Request) {
  try {
    // Basic Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

    if (now > rateLimitInfo.resetTime) {
      rateLimitInfo.count = 1;
      rateLimitInfo.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
      rateLimitInfo.count++;
      if (rateLimitInfo.count > MAX_REQUESTS) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }
    rateLimitMap.set(ip, rateLimitInfo);

    let body;
    try {
      body = await req.json();
    } catch(e) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
    
    const { name, email, company, message, source } = body;

    // Strict Input Validation
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Valid name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Valid message is required." }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        company,
        message,
        source,
        status: "New",
      },
    });

    // Enriches lead synchronously on creation
    // Note: In production, this could/should be moved to a background job/queue to avoid holding the HTTP request.
    await enrichLead(lead.id);

    // Fetch the enriched lead to return it
    const enrichedLead = await prisma.lead.findUnique({ where: { id: lead.id } });

    return NextResponse.json(enrichedLead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
