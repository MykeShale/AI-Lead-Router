import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LeadDetailClient from "@/components/LeadDetailClient";
import Link from "next/link";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!lead) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            &larr; Back to Dashboard
          </Link>
        </div>
        <LeadDetailClient lead={lead} />
      </div>
    </main>
  );
}
