"use client";

import { useState } from "react";
import { Lead } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function LeadDetailClient({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [draftReply, setDraftReply] = useState(lead.draft_reply || "");
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateLeadStatus = async (newStatus: string, reply: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, final_reply: reply }),
      });
      if (res.ok) {
        setStatus(newStatus);
        
        if (newStatus === "Sent") {
          // Integration point for real SMTP/SendGrid
          console.log(`[MOCK EMAIL SENT to ${lead.email}]:\n${reply}`);
        }
        
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update lead", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{lead.email} &bull; {lead.company || "No Company"} &bull; {lead.source || "Unknown Source"}</p>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm">
          <span className="px-2 py-1 bg-gray-100 rounded-md font-medium text-gray-700">Owner: {lead.owner || "Unassigned"}</span>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{lead.category}</span>
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded-md">{lead.priority}</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Original Message</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {lead.message}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">AI Summary</h3>
          <div className="bg-purple-50 p-4 rounded-lg text-sm text-purple-900 leading-relaxed border border-purple-100">
            {lead.ai_summary || "No summary available."}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Draft Reply</h3>
          {!isEditing && status !== "Sent" && status !== "Rejected" && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 font-medium hover:text-blue-800"
            >
              Edit Draft
            </button>
          )}
        </div>
        
        {isEditing ? (
          <textarea
            value={draftReply}
            onChange={(e) => setDraftReply(e.target.value)}
            className="w-full h-48 p-4 border border-blue-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50/30"
          />
        ) : (
          <div className="w-full p-4 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap bg-white">
            {draftReply || "No draft available."}
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-500">
            Status: <span className="text-gray-900 bg-white px-2 py-1 rounded border border-gray-200 ml-1">{status}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {(status === "Enriched" || status === "New" || status === "NeedsManualReview") && (
            <>
              <button
                onClick={() => updateLeadStatus("Rejected", draftReply)}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  if (isEditing) setIsEditing(false);
                  updateLeadStatus("Sent", draftReply);
                }}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isEditing ? "Save & Send" : "Approve & Send"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
