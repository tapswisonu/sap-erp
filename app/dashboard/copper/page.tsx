"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { WorkflowModule } from "@/components/dashboard/workflow-module";
import { workflowModules } from "@/lib/data";
import { motion } from "framer-motion";
import { Zap, TrendingDown, AlertTriangle } from "lucide-react";

const copperModule = workflowModules.find((m) => m.id === "copper")!;

export default function CopperPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="Copper" subtitle="Raw copper material tracking and monitoring" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        {/* Alert banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl border border-amber-400/30 bg-amber-400/5"
        >
          <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Copper Stock Low Alert
            </p>
            <p className="text-xs text-muted-foreground">
              Current copper stock is 34% of capacity. Reorder recommended by May 16, 2026.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <WorkflowModule {...copperModule} index={0} />
          <div className="lg:col-span-2">
            <StockAlerts />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
          <ActivityTimeline />
          {/* Copper metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card border border-white/8 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10">
                <Zap size={16} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-foreground">Copper Metrics</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Current Stock", value: "4,820 kg", color: "text-amber-400" },
                { label: "Monthly Consumption", value: "6,200 kg", color: "text-foreground" },
                { label: "Reorder Level", value: "6,000 kg", color: "text-red-400" },
                { label: "Lead Time", value: "7 days", color: "text-blue-400" },
                { label: "Last Purchase", value: "May 10, 2026", color: "text-foreground" },
                { label: "Pending PO", value: "2,500 kg", color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
