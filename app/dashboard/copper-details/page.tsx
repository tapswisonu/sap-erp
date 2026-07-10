"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { copperKpis, copperStockTrend, copperSuppliers } from "@/lib/erp-data";
import { CopperDetailsTable } from "@/components/dashboard/copper-details-table";
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
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Zap, MapPin, Truck, TrendingUp, AlertTriangle } from "lucide-react";

export default function CopperDetailsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Copper Inventory & Analytics"
        subtitle="Manage copper alloy stocks, LME bookings, and delivery logistics"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards Row */}
        <section id="copper-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {copperKpis.map((kpi, idx) => (
              <KpiCard
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.change === "threshold" ? "neutral" : (kpi.up ? "increase" : "decrease")}
                color={kpi.color as any}
                icon={Zap}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stock & Consumed Trends */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Stock & Consumption Trend (LME Adjusted)</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={copperStockTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="stock" stroke="#f59e0b" fillOpacity={1} fill="url(#colorStock)" name="Total Stock (kg)" />
                  <Area type="monotone" dataKey="consumed" stroke="#06b6d4" fillOpacity={1} fill="url(#colorConsumed)" name="Consumed (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Supplier Ratings & Performance */}
          <div className="glass-card border border-white/8 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Vendor Performance Ratings</h3>
            <div className="space-y-4">
              {copperSuppliers.map((sup, idx) => (
                <div key={sup.name} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{sup.name}</p>
                    <p className="text-[10px] text-muted-foreground">{sup.supplied} kg supplied • {sup.pending} kg pending</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-cyan-400">{sup.rating} ★</span>
                    <p className={cn(
                      "text-[9px] uppercase tracking-wider font-semibold mt-0.5",
                      sup.status === "active" ? "text-emerald-400" : "text-amber-400"
                    )}>{sup.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Copper Ledger Table */}
        <CopperDetailsTable />
      </main>
    </div>
  );
}
