"use client";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { FileText, Download, Filter } from "lucide-react";

const reports = [
  { name: "Monthly Revenue Report", date: "May 2026", type: "Finance", size: "2.4 MB" },
  { name: "Inventory Summary", date: "May 2026", type: "Operations", size: "1.1 MB" },
  { name: "Purchase Order Log", date: "May 2026", type: "Procurement", size: "0.8 MB" },
  { name: "Production Efficiency", date: "Apr 2026", type: "Operations", size: "3.2 MB" },
  { name: "Sales Performance Q1", date: "Apr 2026", type: "Sales", size: "1.7 MB" },
  { name: "Copper Consumption Analysis", date: "Apr 2026", type: "Materials", size: "0.6 MB" },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="Reports" subtitle="Generate and download business reports" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-foreground">Available Reports</h2>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
            <Filter size={13} /> Filter
          </button>
        </div>
        <div className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          {reports.map((report, i) => (
            <motion.div
              key={report.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 flex-shrink-0">
                <FileText size={16} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{report.name}</p>
                <p className="text-xs text-muted-foreground">{report.date} · {report.type} · {report.size}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/10 text-muted-foreground hover:text-foreground transition-all">
                <Download size={12} /> Download
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
