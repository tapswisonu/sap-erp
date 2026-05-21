"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { nominationPageMock } from "@/lib/erp-mock-data";
import { nominationKpis, nominationTrend } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ClipboardCheck, DollarSign, Archive, Ship, Calendar } from "lucide-react";

const statusClasses = {
  Approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Rejected: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function NominationDetailsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Nomination & Allocation Management"
        subtitle="Approve allocations, track designated containers, and monitor export weight parameters"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI metrics */}
        <section id="nomination-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nominationKpis.map((kpi, idx) => (
              <KpiCard
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.up ? "increase" : "decrease"}
                color={kpi.color as any}
                icon={ClipboardCheck}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Allocation analytics chart */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Nomination Trend (Approval vs Rejected)</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nominationTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="approved" fill="#10b981" name="Approved Nominations" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending Nominations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Container tracking & export workflow UI */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Container Yard Allocation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Ship size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Terminal Yard Section A</p>
                    <p className="text-[10px] text-muted-foreground">3 export containers awaiting customs clearance seal.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Archive size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Heavy Steel Bars Lot 4</p>
                    <p className="text-[10px] text-muted-foreground">Assigned to Rohan Steel PO-2026-8801.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Booking Window</p>
                    <p className="text-[10px] text-muted-foreground">Next vessel arrival: May 26 Terminal 2 Mundra.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 text-[10px] text-muted-foreground">
              Allocation priority: High-volume exports active
            </div>
          </div>
        </section>

        {/* Nomination Details Table */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Customer Nominations Ledger</h3>
            <span className="text-xs text-muted-foreground">Allocation authorization parameters and PO balances</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3">Sr. No.</th>
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Incoterm</th>
                  <th className="px-5 py-3">Port</th>
                  <th className="px-5 py-3 text-right">Weight (T)</th>
                  <th className="px-5 py-3 font-mono">PO Number</th>
                  <th className="px-5 py-3">Bars/Container</th>
                  <th className="px-5 py-3 text-right">Qty</th>
                  <th className="px-5 py-3 text-right">Rate</th>
                  <th className="px-5 py-3 text-right">PO Amount</th>
                  <th className="px-5 py-3 text-right">INR Value</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {nominationPageMock.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono">{idx + 1}</td>
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
                    <td className="px-5 py-4 text-right font-mono font-semibold text-cyan-400">{row.weight} T</td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground">{row.poNumber}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.barsOrContainer}</td>
                    <td className="px-5 py-4 text-right font-mono">{row.qty.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono">${row.rate}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-foreground">${row.poAmount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono text-muted-foreground">₹{row.inrValue.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                          statusClasses[row.status]
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
