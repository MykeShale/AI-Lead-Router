import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MonitoringPage() {
  // Fetch leads that have an error_log entry
  const errorLeads = await prisma.lead.findMany({
    where: {
      error_log: { not: null },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">System Monitoring & Errors</h1>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link href="/reports" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Reports
            </Link>
          </nav>
        </header>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-base font-medium leading-6 text-gray-900">Enrichment Failures</h3>
            <p className="mt-1 text-sm text-gray-500">
              Leads that encountered AI enrichment failures or system errors requiring manual review.
            </p>
          </div>
          <ul role="list" className="divide-y divide-gray-200">
            {errorLeads.length === 0 ? (
              <li className="px-6 py-12 text-center text-sm text-gray-500">
                No system errors or enrichment failures found. The system is healthy!
              </li>
            ) : (
              errorLeads.map((lead) => (
                <li key={lead.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-red-600 truncate">System Error</p>
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                          {lead.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-900 font-mono bg-gray-100 p-3 rounded-md">
                        {lead.error_log}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>Lead: {lead.name} ({lead.email})</span>
                        <span>&bull;</span>
                        <span>Logged {new Date(lead.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <Link href={`/leads/${lead.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View Lead &rarr;
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
