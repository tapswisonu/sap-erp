"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  TrendingUp, DollarSign, Target, Banknote,
  Store, Factory, Globe
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { KpiCard } from "@/components/dashboard/kpi-card";

const RevenueCharts = dynamic(
  () => import("@/components/dashboard/charts/revenue-charts"),
  {
    loading: () => (
      <div className="space-y-6">
        <ChartSkeleton type="area" className="w-full" />
        <ChartSkeleton type="generic" className="w-full" />
      </div>
    ),
    ssr: false,
  }
);

const revenueKpis = [
  { label: "Total Revenue", value: "₹124.7M", change: "+22.1%", up: true, icon: DollarSign, color: "emerald", sub: "FY 2026" },
  { label: "Gross Profit", value: "₹59.6M", change: "+18.4%", up: true, icon: TrendingUp, color: "cyan", sub: "47.8% margin" },
  { label: "Net Profit", value: "₹38.2M", change: "+15.7%", up: true, icon: Banknote, color: "blue", sub: "30.6% margin" },
  { label: "EBITDA", value: "₹44.8M", change: "+19.2%", up: true, icon: Target, color: "purple", sub: "35.9% EBITDA margin" },
];

const revenueTargets = [
  { category: "Industrial", icon: Factory, target: 480, achieved: 392, color: "cyan" },
  { category: "Commercial", icon: Store, target: 360, achieved: 310, color: "blue" },
  { category: "Export", icon: Globe, target: 240, achieved: 198, color: "emerald" },
  { category: "Domestic", icon: TrendingUp, target: 120, achieved: 109, color: "purple" },
];

const colorMap: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  cyan: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  blue: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  purple: "text-purple-400 bg-purple-400/10 border-purple-400/30",
};

const barColors: Record<string, string> = {
  cyan: "bg-cyan-400",
  blue: "bg-blue-400",
  emerald: "bg-emerald-400",
  purple: "bg-purple-400",
};

export default function RevenuePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Revenue & Financials"
        subtitle="Track revenue streams, profit margins, and category-wise financial performance"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueKpis.map((kpi, i) => (
            <KpiCard
              key={kpi.label}
              title={kpi.label}
              value={kpi.value}
              change={kpi.change}
              description={kpi.sub}
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
            <ChartSkeleton type="donut" className="w-full" />
          </div>
        }>
          <RevenueCharts />
        </Suspense>

        {/* Revenue Targets list with Sr. No. */}
        <section className="grid grid-cols-1 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
            className="glass-card border border-white/8 rounded-2xl p-5"
          >
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2 mb-5 -mx-5 -mt-5 bg-white/[0.01]">
              <div className="h-7 w-7 rounded-lg bg-purple-400/10 text-purple-400 flex items-center justify-center">
                <Target size={13} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Revenue Targets Breakdown (₹ Lakhs)</h3>
                <p className="text-[10px] text-muted-foreground">Category-wise target vs YTD achieved performance</p>
              </div>
            </div>
            <div className="space-y-5">
              {revenueTargets.map((t, idx) => {
                const pct = Math.round((t.achieved / t.target) * 100);
                const Icon = t.icon;
                return (
                  <div key={t.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground font-bold">{(idx + 1).toString().padStart(2, '0')}</span>
                        <Icon size={13} className={`text-${t.color}-400`} />
                        <span className="text-xs font-medium text-foreground">{t.category}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold text-${t.color}-400`}>₹{t.achieved}L</span>
                        <span className="text-[10px] text-muted-foreground ml-1">/ ₹{t.target}L</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", barColors[t.color])}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{pct}% achieved</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
