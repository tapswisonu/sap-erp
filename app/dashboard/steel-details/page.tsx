"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { steelKpis, steelStockTrend } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SteelDetailsTable } from "@/components/dashboard/steel-details-table";
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
} from "recharts";
import { Layers, Activity, Truck, Settings } from "lucide-react";

const statusColors = {
  Dispatched: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Rolled: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Cutting: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Scheduled: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

export default function SteelDetailsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Steel Production Tracking"
        subtitle="Monitor billet cutting, rolling timelines, and final structural steel dispatches"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI metrics */}
        <section id="steel-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steelKpis.map((kpi, idx) => (
              <KpiCard
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.change === "safe" ? "neutral" : (kpi.up ? "increase" : "decrease")}
                color={kpi.color as any}
                icon={Layers}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Workflow & Processing Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Steel processing line graph */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Steel Stock and Consumed Over Time</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={steelStockTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSteel" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} />
                  <YAxis stroke="var(--chart-axis)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }}
                    labelStyle={{ color: "var(--tooltip-label)", fontSize: "12px", marginBottom: "4px" }}
                  />
                  <Area type="monotone" dataKey="stock" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSteel)" name="Steel Stock (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workflow Flow Status */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Active Production Stages</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Settings size={14} className="animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Billet Cutting Line 1</p>
                    <p className="text-[10px] text-muted-foreground">Currently cutting 150x150 billets for Rohan Steel.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Activity size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Hot Rolling Mills</p>
                    <p className="text-[10px] text-muted-foreground">Mill speed stabilized at 120 RPM. Temperature 1,150°C.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Truck size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Dispatch Yard B</p>
                    <p className="text-[10px] text-muted-foreground">Logistics queue clear. Weight scales calibrated.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-white/5 text-[10px] text-muted-foreground">
              Production line uptime: 99.85% MTD
            </div>
          </div>
        </section>

        {/* Steel Details Table */}
        <SteelDetailsTable />
      </main>
    </div>
  );
}
