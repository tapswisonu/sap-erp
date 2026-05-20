"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { steelPageMock } from "@/lib/erp-mock-data";
import { steelKpis, steelStockTrend } from "@/lib/erp-data";
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
  Rolled: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
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
              <div
                key={kpi.label}
                className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-2 text-foreground font-mono">{kpi.value}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    kpi.up ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"
                  )}>
                    {kpi.change}
                  </span>
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Layers size={14} />
                  </div>
                </div>
              </div>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
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
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
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

            <div className="pt-4 border-t border-white/5 text-[10px] text-muted-foreground">
              Production line uptime: 99.85% MTD
            </div>
          </div>
        </section>

        {/* Steel Details Table */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Steel Production Tracker</h3>
            <span className="text-xs text-muted-foreground">Real-time rolling mill and cutting logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Billet Size</th>
                  <th className="px-5 py-3 text-right">Billet Weight (T)</th>
                  <th className="px-5 py-3 text-right">Billet Qty</th>
                  <th className="px-5 py-3">Steel Size</th>
                  <th className="px-5 py-3 text-right">Steel Weight (T)</th>
                  <th className="px-5 py-3 text-right">Steel Qty</th>
                  <th className="px-5 py-3">Rolling Date</th>
                  <th className="px-5 py-3">Cutting Date</th>
                  <th className="px-5 py-3">Dispatch Date</th>
                  <th className="px-5 py-3">Actual Dispatch</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {steelPageMock.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">{row.customerName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.billetSize}</td>
                    <td className="px-5 py-4 text-right font-mono">{row.billetWeight} T</td>
                    <td className="px-5 py-4 text-right font-mono">{row.billetQty}</td>
                    <td className="px-5 py-4 text-foreground font-semibold">{row.steelSize}</td>
                    <td className="px-5 py-4 text-right font-mono text-cyan-400 font-semibold">{row.steelWeight} T</td>
                    <td className="px-5 py-4 text-right font-mono">{row.steelQty}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.rollingDate}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.cuttingDate}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.dispatchDate}</td>
                    <td className="px-5 py-4 text-xs font-mono">{row.actualDispatchDate}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                          statusColors[row.status] || "text-slate-400 bg-slate-400/10 border-slate-400/20"
                        )}>
                          {row.status}
                        </span>
                      </div>
                    </td>
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
