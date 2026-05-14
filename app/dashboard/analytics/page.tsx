"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesDonutChart } from "@/components/dashboard/sales-donut-chart";
import { ProductionChart } from "@/components/dashboard/production-chart";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const analyticsKpis = [
  { label: "YoY Growth", value: "+22.1%", trend: "up", desc: "Revenue growth" },
  { label: "Gross Margin", value: "47.8%", trend: "up", desc: "This quarter" },
  { label: "COGS Ratio", value: "52.2%", trend: "down", desc: "Cost of goods" },
  { label: "OEE Score", value: "83.4%", trend: "up", desc: "Overall Equip. Effectiveness" },
  { label: "Cycle Time", value: "2.4h", trend: "neutral", desc: "Avg. production cycle" },
  { label: "Defect Rate", value: "0.18%", trend: "down", desc: "Quality metric" },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Analytics"
        subtitle="Performance metrics and business intelligence"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {analyticsKpis.map((kpi, i) => {
            const TrendIcon =
              kpi.trend === "up"
                ? TrendingUp
                : kpi.trend === "down"
                ? TrendingDown
                : Minus;
            const trendColor =
              kpi.trend === "up"
                ? "text-emerald-400"
                : kpi.trend === "down"
                ? "text-red-400"
                : "text-muted-foreground";
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card border border-white/8 rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <TrendIcon size={13} className={trendColor} />
                </div>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueChart />
          <SalesDonutChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
          <ProductionChart />
          <div className="glass-card border border-white/8 rounded-2xl p-6 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm font-medium">More analytics coming soon</p>
              <p className="text-xs mt-1">Advanced ML-powered insights</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
