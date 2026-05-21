"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { copperPageMock } from "@/lib/erp-mock-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { copperKpis, copperStockTrend, copperSuppliers } from "@/lib/erp-data";
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
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Copper Allocations & Logistics</h3>
            <span className="text-xs text-muted-foreground">Real-time status updates from Mundra Hub</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3">Sr. No.</th>
                  <th className="px-5 py-3">Customer Name</th>
                  <th className="px-5 py-3">Steel Size</th>
                  <th className="px-5 py-3">Copper Size</th>
                  <th className="px-5 py-3 text-right">LME Price (MT)</th>
                  <th className="px-5 py-3 text-right">Copper Qty</th>
                  <th className="px-5 py-3">Copper Vendor</th>
                  <th className="px-5 py-3">Transporter</th>
                  <th className="px-5 py-3 text-center">Booking Status</th>
                  <th className="px-5 py-3">Delivery Date</th>
                  <th className="px-5 py-3 text-center">Logistics Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {copperPageMock.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{row.customerName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.steelSize}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.copperSize}</td>
                    <td className="px-5 py-4 text-right font-mono text-foreground">${row.lme.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-amber-400">{row.copperQty} MT</td>
                    <td className="px-5 py-4 text-foreground font-medium">{row.copperVendor}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Truck size={12} className="text-muted-foreground" />
                        {row.transporter}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-semibold border",
                          row.bookingStatus === "Confirmed" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                        )}>
                          {row.bookingStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.deliveryDate}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-semibold border",
                          row.actualDeliveryStatus === "Delivered" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                          row.actualDeliveryStatus === "In-Transit" ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
                          "text-red-400 bg-red-400/10 border-red-400/20"
                        )}>
                          {row.actualDeliveryStatus}
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
