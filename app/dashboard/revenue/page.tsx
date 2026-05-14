"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesDonutChart } from "@/components/dashboard/sales-donut-chart";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

export default function RevenuePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="Revenue" subtitle="Financial performance and revenue tracking" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        {/* Revenue KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: "₹124.7M", change: "+22.1%", color: "emerald" },
            { label: "Gross Profit", value: "₹59.6M", change: "+18.4%", color: "cyan" },
            { label: "Net Profit", value: "₹38.2M", change: "+15.7%", color: "blue" },
            { label: "EBITDA", value: "₹44.8M", change: "+19.2%", color: "purple" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`glass-card border border-${kpi.color}-400/20 rounded-2xl p-5`}
            >
              <p className="text-xs text-muted-foreground mb-2">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className={`text-xs text-${kpi.color}-400 mt-1 flex items-center gap-1`}>
                <ArrowUpRight size={12} />
                {kpi.change} vs last year
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueChart />
          <SalesDonutChart />
        </div>
      </main>
    </div>
  );
}
