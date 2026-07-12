"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { vendorKpis, vendorPerformance, vendorCategoryBreakdown } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { VendorStockTable } from "@/components/dashboard/vendor-stock-table";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Warehouse, AlertTriangle, HelpCircle, HardDrive } from "lucide-react";

export default function VendorStockPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Vendor Stock Management"
        subtitle="Track open steel, raw copper stocks, and material supplier balances"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Inventory Summary Cards */}
        <section id="vendor-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vendorKpis.map((kpi, idx) => (
              <KpiCard
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.up ? "increase" : "decrease"}
                color={kpi.color as any}
                icon={Warehouse}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Charts & Progress Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Material Usage Analytics */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Vendor Delivery Performance Trends (%)</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vendorPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--chart-axis)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }}
                    labelStyle={{ color: "var(--tooltip-label)", fontSize: "12px", marginBottom: "4px" }}
                  />
                  <Area type="monotone" dataKey="onTime" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorOnTime)" name="On Time" />
                  <Area type="monotone" dataKey="delayed" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorDelayed)" name="Delayed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Alerts & Capacity Progress */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Low Stock Warnings</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-400/5 border border-red-400/10 text-red-400">
                  <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Copper wire shortage</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Apex Infra Developers: Open copper stock is 8.5 MT. Less than reorder point (10 MT).</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10 text-amber-400">
                  <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">Steel stock warning</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Zenith Automotives: Steel Open Stock is 90 MT. Recommended reserve target is 100 MT.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-white/5">
              <p className="text-xs font-semibold text-foreground mb-2">Warehouse Capacity Status</p>
              <div className="w-full bg-gray-50 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full" style={{ width: "68%" }} />
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                <span>Total Stored: 1,24,800 units</span>
                <span>68% Utilized</span>
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Stock Table */}
        <VendorStockTable />
      </main>
    </div>
  );
}
