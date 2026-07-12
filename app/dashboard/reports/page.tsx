"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { cn } from "@/lib/utils";
import {
  FileText, Download, Filter, Search, Plus, Calendar,
  CheckCircle, Database, RefreshCw,
  FileSpreadsheet, FilePieChart,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

const reportKpis = [
  { label: "Total Reports", value: "48", change: "+4 this month", icon: FileText, color: "cyan" },
  { label: "Storage Used", value: "24.8 MB", change: "Within limit (100MB)", icon: Database, color: "blue" },
  { label: "Scheduled Tasks", value: "6 Active", change: "Next run at 12:00 AM", icon: Calendar, color: "purple" },
  { label: "Generation Success", value: "99.2%", change: "+0.4% vs last week", icon: CheckCircle, color: "emerald" },
];

const initialReportsList = [
  { id: "1", name: "Monthly Revenue Report", date: "2026-05-20", type: "Finance", size: "2.4 MB", status: "Generated", format: "PDF", frequency: "Monthly" },
  { id: "2", name: "Inventory Summary & Reorder Status", date: "2026-05-19", type: "Operations", size: "1.1 MB", status: "Generated", format: "XLSX", frequency: "Weekly" },
  { id: "3", name: "Purchase Order History & Vendor Rating", date: "2026-05-18", type: "Procurement", size: "0.8 MB", status: "Generated", format: "PDF", frequency: "Weekly" },
  { id: "4", name: "Production Output & OEE Statistics", date: "2026-05-17", type: "Operations", size: "3.2 MB", status: "Generated", format: "PDF", frequency: "Monthly" },
  { id: "5", name: "Sales Performance & Customer Mix Q1", date: "2026-04-30", type: "Sales", size: "1.7 MB", status: "Generated", format: "XLSX", frequency: "Quarterly" },
  { id: "6", name: "Copper Consumption & Procurement Trends", date: "2026-04-28", type: "Materials", size: "0.6 MB", status: "Generated", format: "PDF", frequency: "Monthly" },
  { id: "7", name: "Yearly Financial Audit Report FY25", date: "2026-04-15", type: "Finance", size: "12.4 MB", status: "Archived", format: "PDF", frequency: "Annually" },
  { id: "8", name: "Daily Dispatch Logs & Shipping Manifest", date: "2026-05-21", type: "Logistics", size: "0.2 MB", status: "Generating", format: "CSV", frequency: "Daily" },
];

const statusMap: Record<string, string> = {
  Generated: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20",
  Generating: "text-blue-500 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20 animate-pulse",
  Archived: "text-purple-500 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20",
  Failed: "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20",
};

const formatColors: Record<string, string> = {
  PDF: "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20",
  XLSX: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20",
  CSV: "text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20",
};

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReportsList);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport = {
        id: Math.random().toString(),
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
      toast.success("Report generated successfully");
    }, 1500);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Report Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-cyan-400/5 border border-cyan-400/10 flex items-center justify-center flex-shrink-0 text-cyan-600 dark:text-cyan-400">
            {row.original.format === "XLSX" || row.original.format === "CSV" ? (
              <FileSpreadsheet size={15} />
            ) : (
              <FileText size={15} />
            )}
          </div>
          <div>
            <span className="font-medium text-foreground hover:text-cyan-600 dark:text-cyan-400 transition-colors cursor-pointer line-clamp-1">
              {row.original.name}
            </span>
            <span className={cn("inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border mt-1", formatColors[row.original.format] ?? "text-muted-foreground border-gray-200 dark:border-white/10")}>
              {row.original.format}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Category",
      cell: ({ row }) => (
        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-foreground font-medium">
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: "frequency",
      header: "Frequency",
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.frequency}</span>,
    },
    {
      accessorKey: "size",
      header: "File Size",
      cell: ({ row }) => <span className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">{row.original.size}</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span className="text-xs text-muted-foreground font-mono whitespace-nowrap">{row.original.date}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap", statusMap[row.original.status] ?? "text-muted-foreground")}>
          {row.original.status}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-50 dark:bg-white/5 transition-all">
            <Download size={14} />
            Download
          </button>
        </div>
      ),
    },
  ];

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

        {/* Reports Table via DataTable */}
        <section className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm relative z-10 bg-white dark:bg-[#0a0a0a]">
          <div className="p-5 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Generated Archives</h3>
              <p className="text-xs text-muted-foreground mt-1">Automatic and manual report records</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={14} className={cn(isGenerating && "animate-spin")} />
                {isGenerating ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
          <DataTable columns={columns} data={reports} isLoading={false} searchPlaceholder="Search reports..." exportFilename="Reports_List" />
        </section>

      </main>
    </div>
  );
}
