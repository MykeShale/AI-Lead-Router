"use client";

import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b"];

export default function ReportsClient({ leads }: { leads: any[] }) {
  const data = useMemo(() => {
    // 1. Leads over time (grouped by day)
    const leadsByDate = leads.reduce((acc, lead) => {
      const date = new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const timeData = Object.keys(leadsByDate).map(date => ({ date, count: leadsByDate[date] }));

    // 2. Status breakdown
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const statusData = Object.keys(statusCounts).map(status => ({ name: status, value: statusCounts[status] }));

    // 3. Priority breakdown
    const priorityCounts = leads.reduce((acc, lead) => {
      const prio = lead.priority || "Unknown";
      acc[prio] = (acc[prio] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const priorityData = Object.keys(priorityCounts).map(priority => ({ name: priority, value: priorityCounts[priority] }));

    // 4. Source breakdown
    const sourceCounts = leads.reduce((acc, lead) => {
      const src = lead.source || "Unknown";
      acc[src] = (acc[src] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const sourceData = Object.keys(sourceCounts).map(source => ({ name: source, count: sourceCounts[source] }));

    // 5. Avg time to response (from createdAt to updatedAt where status is Sent/Rejected)
    let totalTime = 0;
    let respondedCount = 0;
    leads.forEach(lead => {
      if (lead.status === "Sent" || lead.status === "Rejected") {
        const timeDiff = new Date(lead.updatedAt).getTime() - new Date(lead.createdAt).getTime();
        totalTime += timeDiff;
        respondedCount++;
      }
    });
    
    const avgResponseHours = respondedCount > 0 ? (totalTime / respondedCount / (1000 * 60 * 60)).toFixed(1) : "0.0";

    return { timeData, statusData, priorityData, sourceData, avgResponseHours, totalLeads: leads.length, respondedCount };
  }, [leads]);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.totalLeads}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Responded Leads</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.respondedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Avg Time to Response</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.avgResponseHours} <span className="text-lg font-normal text-gray-500">hrs</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 mb-6">Leads Over Time</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                />
                <Line type="monotone" dataKey="count" stroke="#111827" strokeWidth={2} dot={{ r: 4, fill: "#111827" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 mb-6">Status Breakdown</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 mb-6">Leads by Source</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.sourceData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#4b5563" }} />
                <Tooltip cursor={{ fill: "#f9fafb" }} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-96 flex flex-col">
          <h3 className="text-sm font-medium text-gray-900 mb-6">Priority Breakdown</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {data.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === "Hot" ? "#ef4444" : 
                      entry.name === "Warm" ? "#f59e0b" : 
                      entry.name === "Cold" ? "#3b82f6" : "#9ca3af"
                    } />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
