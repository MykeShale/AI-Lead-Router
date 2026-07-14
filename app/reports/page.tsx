import { prisma } from "@/lib/prisma";
import ReportsClient from "@/components/ReportsClient";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "asc" }, // chronological order for charts
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/monitoring" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Monitoring Log
            </Link>
          </nav>
        </header>
        <ReportsClient leads={leads} />
      </div>
    </main>
  );
}
