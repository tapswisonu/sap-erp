"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Zap, TrendingUp, AlertTriangle,
  ShieldCheck, RefreshCw, Database, Truck
} from "lucide-react";
import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { KpiCard } from "@/components/dashboard/kpi-card";

const CopperCharts = dynamic(
  () => import("@/components/dashboard/charts/copper-charts"),
  {
    loading: () => <ChartSkeleton type="area" className="lg:col-span-2" />,
    ssr: false,
  }
);

const copperKpis = [
  { label: "Total Copper Stock", value: "4,820 kg", sub: "34% of capacity", status: "low", icon: Database, color: "amber" },
  { label: "LME Copper Price", value: "$9,652.50", sub: "+1.85% today", status: "up", icon: TrendingUp, color: "emerald" },
  { label: "MTD Consumption", value: "6,200 kg", sub: "Avg. 200 kg/day", status: "optimal", icon: Zap, color: "cyan" },
  { label: "Pending Shipments", value: "2,500 kg", sub: "ETA: May 24, 2026", status: "pending", icon: Truck, color: "blue" },
];

const copperGrades = [
  { grade: "Grade A Cathode", stock: "2,400 kg", capacity: 6000, pct: 40, color: "cyan" },
  { grade: "Oxygen-Free Rods", stock: "1,220 kg", capacity: 4000, pct: 30.5, color: "blue" },
  { grade: "Copper Wire 0.8mm", stock: "800 kg", capacity: 2000, pct: 40, color: "emerald" },
  { grade: "Scrap & Offcuts", stock: "400 kg", capacity: 2000, pct: 20, color: "purple" },
];

const copperSuppliers = [
  { name: "Andes Mining Corp.", contract: "CTR-8849", rating: "9.8/10", quality: "99.99%", status: "Active" },
  { name: "EuroCu Resources", contract: "CTR-8850", rating: "9.2/10", quality: "99.96%", status: "Active" },
  { name: "IndoCopper Smelters", contract: "CTR-8852", rating: "8.9/10", quality: "99.92%", status: "Under Review" },
  { name: "Oceanic Metals Ltd.", contract: "CTR-8855", rating: "9.5/10", quality: "99.98%", status: "Active" },
];

const barColors: Record<string, string> = {
  cyan: "bg-cyan-400",
  blue: "bg-blue-400",
  emerald: "bg-emerald-400",
  purple: "bg-purple-400",
};

const textColors: Record<string, string> = {
  cyan: "text-cyan-600 dark:text-cyan-400",
  blue: "text-blue-400",
  emerald: "text-emerald-400",
  purple: "text-purple-400",
};

const statusMap: Record<string, string> = {
  Active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Under Review": "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

const colorMap: Record<string, string> = {
  amber: "text-amber-400 bg-amber-400/10",
  emerald: "text-emerald-400 bg-emerald-400/10",
  cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10",
  blue: "text-blue-400 bg-blue-400/10",
};

export default function CopperPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Copper Analytics & Tracking"
        subtitle="Monitor copper grades, track real-time LME pricing, manage supplier ratings, and review stock telemetry"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Alert banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl border border-amber-400/30 bg-amber-400/5"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Copper Stock Critical Warning
              </p>
              <p className="text-xs text-muted-foreground">
                Current copper stock is at 34% capacity. Reorder suggested by May 24 to avoid production line bottlenecks.
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-gray-200 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw size={12} className={cn(isRefreshing && "animate-spin")} />
            Update Feed
          </button>
        </motion.div>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {copperKpis.map((kpi, i) => (
            <KpiCard
              key={kpi.label}
              title={kpi.label}
              value={kpi.value}
              change={kpi.status === "up" ? kpi.sub : undefined}
              description={kpi.status !== "up" ? kpi.sub : undefined}
              color={kpi.color as any}
              icon={kpi.icon}
              index={i}
            />
          ))}
        </section>

        {/* Charts & Grade Breakdown */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LME Price Trend */}
          <Suspense fallback={<ChartSkeleton type="area" className="lg:col-span-2" />}>
            <CopperCharts />
          </Suspense>

          {/* Grade Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card border border-white/8 rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-1">Copper Grade Breakdown</h3>
            <p className="text-[11px] text-muted-foreground mb-5">Live capacity allocation</p>
            <div className="space-y-4">
              {copperGrades.map((g) => (
                <div key={g.grade}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">{g.grade}</span>
                    <span className={cn("text-xs font-bold font-mono", textColors[g.color])}>{g.stock}</span>
                  </div>
                  <div className="h-1.5 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", barColors[g.color])}
                      initial={{ width: 0 }}
                      animate={{ width: `${g.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{g.pct}% of {g.capacity.toLocaleString()} kg max</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Suppliers Table with Sr. No. */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <ShieldCheck size={13} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Verified Copper Suppliers</h3>
            </div>
            <span className="text-xs text-muted-foreground">Compliance Rating Q2 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-6 py-3 w-16 text-center">Sr. No.</th>
                  <th className="px-6 py-3">Supplier Name</th>
                  <th className="px-6 py-3">Active Contract</th>
                  <th className="px-6 py-3">Quality Index</th>
                  <th className="px-6 py-3">Compliance Score</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {copperSuppliers.map((supplier, idx) => (
                  <motion.tr
                    key={supplier.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.07 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono text-center">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{supplier.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">{supplier.contract}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{supplier.quality}</td>
                    <td className="px-6 py-4 text-foreground font-bold font-mono">{supplier.rating}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", statusMap[supplier.status])}>
                          {supplier.status}
                        </span>
                      </div>
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
