import { prisma } from "@/lib/prisma";

export default async function RunsPage() {
  const runs = await prisma.runLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Engine Run Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">Timestamp</th>
              <th className="py-2 px-4 text-left">Lead ID</th>
              <th className="py-2 px-4 text-left">Rule Matched</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
              <th className="py-2 px-4 text-left">Attempts</th>
              <th className="py-2 px-4 text-left">Error</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No runs recorded yet.
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr key={run.id} className="border-b">
                  <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-700">
                    {run.createdAt.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-sm font-mono text-gray-700">
                    {run.leadId?.slice(0, 8) || "N/A"}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {run.ruleId || "default"}
                  </td>
                  <td className="py-2 px-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        run.status === "Success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {run.actionType}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {run.attempts}
                  </td>
                  <td className="py-2 px-4 text-sm text-red-600 max-w-xs truncate" title={run.error || ""}>
                    {run.error || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
