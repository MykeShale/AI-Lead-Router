"use client";

import { useState } from "react";
import Link from "next/link";
import { Lead } from "@prisma/client";

export default function DashboardClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [filterStatus, setFilterStatus] = useState("All");
  
  const leads = initialLeads.filter(
    (lead) => filterStatus === "All" || lead.status === filterStatus
  );

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "Hot": return "bg-red-100 text-red-700 border-red-200";
      case "Warm": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Cold": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-purple-100 text-purple-700";
      case "Enriched": return "bg-indigo-100 text-indigo-700";
      case "NeedsManualReview": return "bg-yellow-100 text-yellow-700";
      case "Sent": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["All", "New", "Enriched", "NeedsManualReview", "Sent", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filterStatus === status 
                ? "bg-gray-900 text-white" 
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Lead Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-sm">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {lead.name}
                    <div className="text-xs text-gray-500 font-normal">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {lead.company || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                      {lead.priority || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {lead.category || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {lead.owner || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:text-blue-900 text-sm">
                      View details
                    </Link>
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
