import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrichLead } from "@/lib/enrichLead";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, message, source } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
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
