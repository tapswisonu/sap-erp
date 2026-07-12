"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Package, AlertTriangle, CheckCircle, TrendingDown,
  Boxes, RefreshCw, Archive,
} from "lucide-react";
import { inventoryData, stockAlerts } from "@/lib/data";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { KpiCard } from "@/components/dashboard/kpi-card";

const StockCharts = dynamic(
  () => import("@/components/dashboard/charts/stock-charts"),
  {
    loading: () => <ChartSkeleton type="bar" />,
    ssr: false,
  }
);

const stockSummary = [
  { label: "Total SKUs", value: "6", icon: Boxes, color: "cyan" },
  { label: "Total Stock Units", value: "75,820", icon: Package, color: "blue" },
  { label: "Low / Critical", value: "2", icon: AlertTriangle, color: "red" },
  { label: "Optimal / High", value: "4", icon: CheckCircle, color: "emerald" },
];

const statusConfig = {
  low: { label: "Low Stock", cls: "text-amber-400 bg-amber-400/10 border-amber-400/20", bar: "bg-amber-400", icon: AlertTriangle },
  optimal: { label: "Optimal", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", bar: "bg-emerald-400", icon: CheckCircle },
  high: { label: "High", cls: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10 border-cyan-400/20", bar: "bg-cyan-400", icon: TrendingDown },
  critical: { label: "Critical", cls: "text-red-400 bg-red-400/10 border-red-400/20", bar: "bg-red-400", icon: AlertTriangle },
};

const colorMap: Record<string, string> = {
  cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10",
  blue: "text-blue-400 bg-blue-400/10",
  red: "text-red-400 bg-red-400/10",
  emerald: "text-emerald-400 bg-emerald-400/10",
};

export default function StockPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Stock Overview"
        subtitle="Monitor raw material and finished goods stock levels across all categories"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Summary KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stockSummary.map((s, i) => (
            <KpiCard
              key={s.label}
              title={s.label}
              value={s.value}
              color={s.color as any}
              icon={s.icon}
              index={i}
            />
          ))}
        </section>

        {/* Stock Levels Table + Alerts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stock Inventory Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="glass-card border border-white/8 rounded-2xl overflow-hidden lg:col-span-2"
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center">
                <Archive size={13} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Stock Level Monitor</h3>
            </div>
            <div className="divide-y divide-white/5">
              {inventoryData.map((item, idx) => {
                const pct = Math.round((item.stock / item.capacity) * 100);
                const conf = statusConfig[item.status as keyof typeof statusConfig];
                const Icon = conf.icon;
                return (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.07 }}
                    className="px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.category}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.stock.toLocaleString()} / {item.capacity.toLocaleString()} {item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border", conf.cls)}>
                          <Icon size={9} />{conf.label}
                        </span>
                        <span className="text-xs font-bold text-foreground font-mono w-10 text-right">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", conf.bar)}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + idx * 0.07 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Stock Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card border border-white/8 rounded-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-red-400/10 text-red-400 flex items-center justify-center">
                <AlertTriangle size={13} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Stock Alerts</h3>
            </div>
            <div className="divide-y divide-white/5">
              {stockAlerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + idx * 0.1 }}
                  className={cn("px-5 py-4", alert.severity === "critical" ? "bg-red-500/3" : "")}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                      alert.severity === "critical" ? "bg-red-400/10 text-red-400" : "bg-amber-400/10 text-amber-400"
                    )}>
                      <AlertTriangle size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{alert.item}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px]">
                        <span className={cn(alert.severity === "critical" ? "text-red-400" : "text-amber-400", "font-mono font-bold")}>
                          {alert.current.toLocaleString()} {alert.unit}
                        </span>
                        <span className="text-muted-foreground">Min: {alert.minimum.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Reorder action */}
              <div className="px-5 py-4">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold hover:bg-cyan-400/20 transition-all">
                  <RefreshCw size={12} /> Generate Reorder List
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stock Activity Chart */}
        <Suspense fallback={<ChartSkeleton type="bar" />}>
          <StockCharts />
        </Suspense>

      </main>
    </div>
  );
}
