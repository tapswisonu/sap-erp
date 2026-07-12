"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ShoppingCart, TrendingUp, Users, Star, MapPin,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { KpiCard } from "@/components/dashboard/kpi-card";

const SalesCharts = dynamic(
  () => import("@/components/dashboard/charts/sales-charts"),
  {
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartSkeleton type="area" className="lg:col-span-2" />
        <ChartSkeleton type="donut" />
      </div>
    ),
    ssr: false,
  }
);

const salesKpis = [
  { label: "Total Sales (MTD)", value: "₹8.6M", change: "+18.5%", up: true, icon: ShoppingCart, color: "cyan" },
  { label: "Orders Received", value: "1,847", change: "+12.5%", up: true, icon: TrendingUp, color: "emerald" },
  { label: "Active Customers", value: "214", change: "+8", up: true, icon: Users, color: "blue" },
  { label: "Avg. Order Value", value: "₹4,655", change: "+5.1%", up: true, icon: Star, color: "purple" },
];

const topCustomers = [
  { rank: 1, name: "PowerTech Industries", location: "Pune", orders: 148, value: "₹86.4L", growth: "+24%", segment: "Industrial" },
  { rank: 2, name: "GridPower Solutions", location: "Delhi", orders: 96, value: "₹54.0L", growth: "+18%", segment: "Commercial" },
  { rank: 3, name: "TechSystems Co.", location: "Hyderabad", orders: 82, value: "₹32.0L", growth: "+31%", segment: "Electronics" },
  { rank: 4, name: "ElectroBuild Pvt.", location: "Chennai", orders: 64, value: "₹28.0L", growth: "+15%", segment: "Industrial" },
  { rank: 5, name: "BuildMax Ltd.", location: "Ahmedabad", orders: 58, value: "₹24.5L", growth: "+9%", segment: "Commercial" },
  { rank: 6, name: "SteelFab Corp.", location: "Mumbai", orders: 47, value: "₹18.2L", growth: "+6%", segment: "Industrial" },
];

const colorMap: Record<string, string> = {
  cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10",
  emerald: "text-emerald-400 bg-emerald-400/10",
  blue: "text-blue-400 bg-blue-400/10",
  purple: "text-purple-400 bg-purple-400/10",
};

const segmentColors: Record<string, string> = {
  Industrial: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Commercial: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Electronics: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

export default function SalesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Sales & Orders"
        subtitle="Monitor sales performance, top customers, and order analytics across all channels"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {salesKpis.map((kpi, i) => (
            <KpiCard
              key={kpi.label}
              title={kpi.label}
              value={kpi.value}
              change={kpi.change}
              description="vs last month"
              color={kpi.color as any}
              icon={kpi.icon}
              index={i}
            />
          ))}
        </section>

        {/* Dynamic Heavy Charts Component */}
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartSkeleton type="area" className="lg:col-span-2" />
            <ChartSkeleton type="donut" />
          </div>
        }>
          <SalesCharts />
        </Suspense>

        {/* Top Customers Table */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Users size={13} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Top Customers by Revenue</h3>
            </div>
            <span className="text-xs text-muted-foreground">YTD 2026</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3 w-16 text-center">Sr. No.</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Segment</th>
                  <th className="px-5 py-3 text-right">Orders</th>
                  <th className="px-5 py-3 text-right">Revenue Value</th>
                  <th className="px-5 py-3 text-right">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {topCustomers.map((c, idx) => (
                  <motion.tr
                    key={c.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.06 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 text-xs font-mono text-muted-foreground text-center">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">{c.name}</td>
                    <td className="px-5 py-4 text-muted-foreground flex items-center gap-1.5">
                      <MapPin size={11} className="text-cyan-600 dark:text-cyan-400" />{c.location}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-semibold border", segmentColors[c.segment] ?? "text-muted-foreground bg-white/5 border-gray-200 dark:border-white/10")}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono">{c.orders}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-foreground">{c.value}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-emerald-400 font-semibold text-xs">{c.growth}</span>
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
