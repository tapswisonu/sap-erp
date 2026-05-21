"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Minus, Activity, Target, AlertTriangle, CheckCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";

// Dynamic import of heavy Recharts dashboard section
const AnalyticsCharts = dynamic(
  () => import("@/components/dashboard/charts/analytics-charts"),
  {
    loading: () => (
      <div className="space-y-6">
        <ChartSkeleton type="area" className="w-full" />
        <ChartSkeleton type="bar" className="w-full" />
      </div>
    ),
    ssr: false,
  }
);

const analyticsKpis = [
  { label: "YoY Growth", value: "+22.1%", trend: "up", desc: "Revenue growth", icon: TrendingUp, color: "emerald" },
  { label: "Gross Margin", value: "47.8%", trend: "up", desc: "This quarter", icon: Target, color: "cyan" },
  { label: "COGS Ratio", value: "52.2%", trend: "down", desc: "Cost of goods", icon: TrendingDown, color: "amber" },
  { label: "OEE Score", value: "83.4%", trend: "up", desc: "Overall Equipment Effectiveness", icon: Activity, color: "blue" },
  { label: "Cycle Time", value: "2.4h", trend: "neutral", desc: "Avg. production cycle", icon: Minus, color: "purple" },
  { label: "Defect Rate", value: "0.18%", trend: "down", desc: "Quality metric", icon: AlertTriangle, color: "red" },
];

const oeMetrics = [
  { metric: "Availability", value: "94.2%", benchmark: "90%", status: "above" },
  { metric: "Performance", value: "88.6%", benchmark: "85%", status: "above" },
  { metric: "Quality Rate", value: "99.82%", benchmark: "99.5%", status: "above" },
  { metric: "Mean Time Between Failures", value: "86h", benchmark: "72h", status: "above" },
  { metric: "Planned Downtime", value: "3.2%", benchmark: "5%", status: "above" },
  { metric: "Unplanned Downtime", value: "2.6%", benchmark: "3%", status: "above" },
];

const colorMap: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-400/10",
  cyan: "text-cyan-400 bg-cyan-400/10",
  amber: "text-amber-400 bg-amber-400/10",
  blue: "text-blue-400 bg-blue-400/10",
  purple: "text-purple-400 bg-purple-400/10",
  red: "text-red-400 bg-red-400/10",
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Analytics & Intelligence"
        subtitle="Business performance metrics, production intelligence, and financial KPIs"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {analyticsKpis.map((kpi, i) => (
            <KpiCard
              key={kpi.label}
              title={kpi.label}
              value={kpi.value}
              description={kpi.desc}
              color={kpi.color as any}
              icon={kpi.icon}
              index={i}
            />
          ))}
        </section>

        {/* Dynamic Heavy Charts Component */}
        <Suspense fallback={
          <div className="space-y-6">
            <ChartSkeleton type="area" className="w-full" />
            <ChartSkeleton type="bar" className="w-full" />
          </div>
        }>
          <AnalyticsCharts />
        </Suspense>

        {/* OEE Metrics Breakdown list with Sr. No. */}
        <section className="grid grid-cols-1 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="glass-card border border-white/8 rounded-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2 bg-white/[0.01]">
              <div className="h-7 w-7 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                <Activity size={13} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">OEE Metrics Breakdown</h3>
                <p className="text-[10px] text-muted-foreground">Overall Equipment Effectiveness diagnostics</p>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {oeMetrics.map((m, idx) => (
                <div key={m.metric} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{m.metric}</p>
                      <p className="text-[10px] text-muted-foreground">Benchmark: {m.benchmark}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground font-mono">{m.value}</span>
                    <CheckCircle size={13} className="text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
