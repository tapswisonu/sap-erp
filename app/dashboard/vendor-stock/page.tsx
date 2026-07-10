"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { vendorStockPageMock } from "@/lib/erp-mock-data";
import { vendorKpis, vendorPerformance, vendorCategoryBreakdown } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", backdropFilter: "blur(12px)" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
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

            <div className="pt-4 border-t border-white/5">
              <p className="text-xs font-semibold text-foreground mb-2">Warehouse Capacity Status</p>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
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
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Vendor Stock Inventory Ledger</h3>
            <span className="text-xs text-muted-foreground">Active steel and copper logs by manufacturing partner</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3">Sr. No.</th>
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Steel Size</th>
                  <th className="px-5 py-3">Copper Size</th>
                  <th className="px-5 py-3 text-right">Steel Open Stock</th>
                  <th className="px-5 py-3 text-right">Copper Open Qty</th>
                  <th className="px-5 py-3 text-right">Steel Quantity</th>
                  <th className="px-5 py-3 text-right">Copper Quantity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {vendorStockPageMock.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{row.customerName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.steelSize}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.copperSize}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-foreground">{row.steelOpenStock.toLocaleString()} MT</td>
                    <td className="px-5 py-4 text-right font-mono text-amber-400 font-semibold">{row.copperOpenQty} MT</td>
                    <td className="px-5 py-4 text-right font-mono text-cyan-400 font-bold">{row.steelQty.toLocaleString()} MT</td>
                    <td className="px-5 py-4 text-right font-mono text-foreground font-semibold">{row.copperQty} MT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
