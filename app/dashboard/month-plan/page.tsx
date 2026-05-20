"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { monthPlanPageMock } from "@/lib/erp-mock-data";
import { monthPlanKpis, monthPlanData } from "@/lib/erp-data";
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
  ComposedChart,
  Line,
  Bar,
} from "recharts";
import { CalendarRange, DollarSign, Activity, Target } from "lucide-react";

export default function MonthPlanPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Monthly Planning & Forecasting"
        subtitle="Formulate monthly targets, forecast revenue pipelines, and track production efficiency"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI metrics */}
        <section id="month-plan-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthPlanKpis.map((kpi, idx) => (
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
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <CalendarRange size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Forecasting */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Production Targets vs Actual Achievements</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthPlanData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
                  />
                  <Bar dataKey="actual" fill="#a78bfa" name="Actual Units Produced" />
                  <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={2} name="Target Plan" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Schedule Calendar */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">June Planning Schedule</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Target size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Billet Sizing Signoff</p>
                    <p className="text-[10px] text-muted-foreground">Due June 02. Draft complete.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Activity size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Customs Booking Window</p>
                    <p className="text-[10px] text-muted-foreground">Opens June 08 for Nhava Sheva berths.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">LME Pricing Review</p>
                    <p className="text-[10px] text-muted-foreground">Automatic spot hedge trigger set for $8,400.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] text-muted-foreground">
              Planned target completion score: 96.2%
            </div>
          </div>
        </section>

        {/* Month Plan Table */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Monthly Planning & Forecast Ledger</h3>
            <span className="text-xs text-muted-foreground">Comprehensive projections for upcoming manufacturing batches</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Inco Term</th>
                  <th className="px-5 py-3">Port</th>
                  <th className="px-5 py-3">Weight/Bars</th>
                  <th className="px-5 py-3 text-right">Rate</th>
                  <th className="px-5 py-3 text-right">PO Amount</th>
                  <th className="px-5 py-3 text-right">INR Value</th>
                  <th className="px-5 py-3 text-right">Month Qty</th>
                  <th className="px-5 py-3">Month To</th>
                  <th className="px-5 py-3 text-right">Month Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {monthPlanPageMock.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold text-foreground">{row.customerName}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-semibold border",
                        row.type === "Export" ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" : "text-purple-400 bg-purple-400/10 border-purple-400/20"
                      )}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-foreground font-semibold">{row.incoterm}</td>
                    <td className="px-5 py-4 text-foreground font-medium">{row.port}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.weightOrBars}</td>
                    <td className="px-5 py-4 text-right font-mono">${row.rate}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-foreground">${row.poAmount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono text-muted-foreground">₹{row.inrValue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono text-cyan-400 font-bold">{row.monthQty.toLocaleString()} units</td>
                    <td className="px-5 py-4 text-foreground font-medium">{row.monthTo}</td>
                    <td className="px-5 py-4 text-right font-mono font-semibold text-foreground">{row.monthWeight} T</td>
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
