"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { dispatchPageMock } from "@/lib/erp-mock-data";
import { dispatchKpis, dispatchTrend, dispatchStatusBreakdown } from "@/lib/erp-data";
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
import { Truck, MapPin, ClipboardList, CheckCircle, Package } from "lucide-react";

const statusClasses = {
  Delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "In-Transit": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

export default function DispatchDetailsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Domestic" | "Export">("All");

  const filteredData = dispatchPageMock.filter((item) => {
    if (activeTab === "All") return true;
    return item.type === activeTab;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Shipment & Dispatch Management"
        subtitle="Manage logistics routes, domestic and export customs gates, and transport manifests"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI metrics */}
        <section id="dispatch-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dispatchKpis.map((kpi, idx) => (
              <KpiCard
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.up ? "increase" : "decrease"}
                color={kpi.color as any}
                icon={Truck}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Dispatch Trend */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Shipment Manifest Trends (Weekly)</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dispatchTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDisp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
                  />
                  <Area type="monotone" dataKey="dispatched" stroke="#10b981" fillOpacity={1} fill="url(#colorDisp)" name="Shipments Dispatched" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status breakdown & export widgets */}
          <div className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Export Gateway Tracker</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-cyan-400" />
                    <span className="text-xs text-foreground font-semibold">Mundra Port Terminal</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">GATE OPEN</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-cyan-400" />
                    <span className="text-xs text-foreground font-semibold">Nhava Sheva Terminal</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">GATE OPEN</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-cyan-400" />
                    <span className="text-xs text-foreground font-semibold">Kandla Customs Gate</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 font-medium">HOLD (CLEARED IN 2H)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Dispatch Quality Index</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-sm font-bold text-foreground">99.4% Delivery Accuracy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Domestic/Export Tabs and Table */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Active Dispatch Ledger</h3>
              <p className="text-xs text-muted-foreground">Detailed logs of gate-pass outputs and invoice weights</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5">
              {(["All", "Domestic", "Export"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-all",
                    activeTab === tab
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-muted-foreground hover:text-foreground border border-transparent"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3">Sr. No.</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Vendor Name</th>
                  <th className="px-5 py-3">To</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Section Size</th>
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3 text-right">No. of Bars</th>
                  <th className="px-5 py-3 font-mono">Invoice Number</th>
                  <th className="px-5 py-3 text-right">Weight (T)</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.date}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{row.vendorName}</td>
                    <td className="px-5 py-4 text-foreground font-medium">{row.to}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-semibold border",
                        row.type === "Export" ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" : "text-purple-400 bg-purple-400/10 border-purple-400/20"
                      )}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{row.sectionSize}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{row.customerName}</td>
                    <td className="px-5 py-4 text-right font-mono">{row.noOfBars}</td>
                    <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold">{row.invoiceNumber}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-cyan-400">{row.weight} T</td>
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
