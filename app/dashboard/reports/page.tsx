"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FileText, Download, Filter, Search, Plus, Calendar,
  CheckCircle, Clock, AlertTriangle, Database, RefreshCw,
  FileSpreadsheet, FilePieChart,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useState } from "react";

const reportKpis = [
  { label: "Total Reports", value: "48", change: "+4 this month", icon: FileText, color: "cyan" },
  { label: "Storage Used", value: "24.8 MB", change: "Within limit (100MB)", icon: Database, color: "blue" },
  { label: "Scheduled Tasks", value: "6 Active", change: "Next run at 12:00 AM", icon: Calendar, color: "purple" },
  { label: "Generation Success", value: "99.2%", change: "+0.4% vs last week", icon: CheckCircle, color: "emerald" },
];

const initialReportsList = [
  { name: "Monthly Revenue Report", date: "2026-05-20", type: "Finance", size: "2.4 MB", status: "Generated", format: "PDF", frequency: "Monthly" },
  { name: "Inventory Summary & Reorder Status", date: "2026-05-19", type: "Operations", size: "1.1 MB", status: "Generated", format: "XLSX", frequency: "Weekly" },
  { name: "Purchase Order History & Vendor Rating", date: "2026-05-18", type: "Procurement", size: "0.8 MB", status: "Generated", format: "PDF", frequency: "Weekly" },
  { name: "Production Output & OEE Statistics", date: "2026-05-17", type: "Operations", size: "3.2 MB", status: "Generated", format: "PDF", frequency: "Monthly" },
  { name: "Sales Performance & Customer Mix Q1", date: "2026-04-30", type: "Sales", size: "1.7 MB", status: "Generated", format: "XLSX", frequency: "Quarterly" },
  { name: "Copper Consumption & Procurement Trends", date: "2026-04-28", type: "Materials", size: "0.6 MB", status: "Generated", format: "PDF", frequency: "Monthly" },
  { name: "Yearly Financial Audit Report FY25", date: "2026-04-15", type: "Finance", size: "12.4 MB", status: "Archived", format: "PDF", frequency: "Annually" },
  { name: "Daily Dispatch Logs & Shipping Manifest", date: "2026-05-21", type: "Logistics", size: "0.2 MB", status: "Generating", format: "CSV", frequency: "Daily" },
];

const statusMap: Record<string, string> = {
  Generated: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Generating: "text-blue-400 bg-blue-400/10 border-blue-400/20 animate-pulse",
  Archived: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Failed: "text-red-400 bg-red-400/10 border-red-400/20",
};

const formatColors: Record<string, string> = {
  PDF: "text-red-400 bg-red-400/10 border-red-400/20",
  XLSX: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  CSV: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const colorMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-400/10",
  blue: "text-blue-400 bg-blue-400/10",
  purple: "text-purple-400 bg-purple-400/10",
  emerald: "text-emerald-400 bg-emerald-400/10",
};

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReportsList);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport = {
        name: "Real-time Operations Telemetry & Diagnostics",
        date: new Date().toISOString().split("T")[0],
        type: "Operations",
        size: "0.4 MB",
        status: "Generated",
        format: "PDF",
        frequency: "On-Demand",
      };
      setReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Business Reports"
        subtitle="Access generated analytics, request custom reports, and manage automatic data exports"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Report KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportKpis.map((kpi, i) => (
            <KpiCard
              key={kpi.label}
              title={kpi.label}
              value={kpi.value}
              change={kpi.change}
              color={kpi.color as any}
              icon={kpi.icon}
              index={i}
            />
          ))}
        </section>

        {/* Action Panel */}
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Generated Archives</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              {reports.length} Reports
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search size={13} />
              </span>
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
              <Filter size={13} /> Filter
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <RefreshCw size={13} className={cn(isGenerating && "animate-spin")} />
              {isGenerating ? "Generating..." : "Generate New Report"}
            </button>
          </div>
        </section>

        {/* Reports Table with Sr. No. */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-6 py-3 w-16 text-center">Sr. No.</th>
                  <th className="px-6 py-3">Report Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Format</th>
                  <th className="px-6 py-3">Frequency</th>
                  <th className="px-6 py-3 text-right">File Size</th>
                  <th className="px-6 py-3">Generation Date</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {reports.map((report, idx) => (
                  <motion.tr
                    key={`${report.name}-${idx}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono text-center">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-cyan-400/5 border border-cyan-400/10 flex items-center justify-center flex-shrink-0 text-cyan-400">
                          {report.format === "XLSX" || report.format === "CSV" ? (
                            <FileSpreadsheet size={15} />
                          ) : (
                            <FileText size={15} />
                          )}
                        </div>
                        <span className="font-medium text-foreground hover:text-cyan-400 transition-colors cursor-pointer">
                          {report.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs text-foreground font-medium">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", formatColors[report.format] ?? "text-muted-foreground border-white/10")}>
                        {report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {report.frequency}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-semibold text-foreground">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", statusMap[report.status] ?? "text-muted-foreground")}>
                          {report.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 hover:border-white/20 transition-all">
                        <Download size={12} />
                        Download
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
