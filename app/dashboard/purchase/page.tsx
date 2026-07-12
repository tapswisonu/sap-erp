"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ShoppingBag, Clock, AlertCircle, TrendingUp, Building2, FileText,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { KpiCard } from "@/components/dashboard/kpi-card";

const PurchaseCharts = dynamic(
  () => import("@/components/dashboard/charts/purchase-charts"),
  {
    loading: () => <ChartSkeleton type="bar" className="lg:col-span-2" />,
    ssr: false,
  }
);

const purchaseKpis = [
  { label: "Active POs", value: "127", change: "+18", up: true, icon: ShoppingBag, color: "cyan" },
  { label: "MTD Spend", value: "₹2.4Cr", change: "+14.2%", up: true, icon: TrendingUp, color: "emerald" },
  { label: "Pending Approval", value: "23", change: "-5", up: false, icon: Clock, color: "amber" },
  { label: "Overdue POs", value: "9", change: "-4", up: false, icon: AlertCircle, color: "red" },
];

const purchaseOrders = [
  { id: "PO-2849", vendor: "MetalCorp Ltd.", item: "Copper Wire (Grade A)", qty: "500 kg", value: "₹4,55,000", date: "2026-05-14", status: "Delivered", category: "Copper" },
  { id: "PO-2850", vendor: "SteelWorks Inc.", item: "MS Sheets 3mm — 2T", qty: "2,000 kg", value: "₹1,80,000", date: "2026-05-13", status: "In Transit", category: "Steel" },
  { id: "PO-2851", vendor: "AlumaCraft Pvt.", item: "Aluminum Rods", qty: "800 kg", value: "₹2,88,000", date: "2026-05-12", status: "Approved", category: "Aluminum" },
  { id: "PO-2852", vendor: "TechSystems Co.", item: "Circuit Boards (Type B)", qty: "200 units", value: "₹1,80,000", date: "2026-05-12", status: "Pending", category: "Electronics" },
  { id: "PO-2853", vendor: "PlastiForm Ltd.", item: "Plastic Casings — Lot C", qty: "5,000 units", value: "₹75,000", date: "2026-05-11", status: "Delivered", category: "Casing" },
  { id: "PO-2854", vendor: "FastFix Supplies", item: "Fasteners (M10 Hex)", qty: "10,000 units", value: "₹22,000", date: "2026-05-10", status: "Approved", category: "Fasteners" },
  { id: "PO-2855", vendor: "ShineCu Pvt.", item: "Copper Rods", qty: "300 kg", value: "₹2,68,500", date: "2026-05-09", status: "Overdue", category: "Copper" },
];

const topVendors = [
  { name: "MetalCorp Ltd.", spend: "₹20.2L", orders: 24, onTime: 96, category: "Copper" },
  { name: "SteelWorks Inc.", spend: "₹38.2L", orders: 31, onTime: 92, category: "Steel" },
  { name: "FastFix Supplies", spend: "₹2.2L", orders: 68, onTime: 99, category: "Fasteners" },
  { name: "AlumaCraft Pvt.", spend: "₹12.8L", orders: 18, onTime: 94, category: "Aluminum" },
];

const statusMap: Record<string, string> = {
  Delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Approved: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  "In Transit": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Overdue: "text-red-400 bg-red-400/10 border-red-400/20",
};

const colorMap: Record<string, string> = {
  cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10",
  emerald: "text-emerald-400 bg-emerald-400/10",
  amber: "text-amber-400 bg-amber-400/10",
  red: "text-red-400 bg-red-400/10",
};

export default function PurchasePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Purchase & Procurement"
        subtitle="Manage vendor purchase orders, approvals, and procurement analytics"
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPI Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {purchaseKpis.map((kpi, i) => (
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

        {/* Chart + Top Vendors */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Suspense fallback={<ChartSkeleton type="bar" className="lg:col-span-2" />}>
            <PurchaseCharts />
          </Suspense>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card border border-white/8 rounded-2xl overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 flex items-center gap-2 bg-white/[0.01]">
              <div className="h-7 w-7 rounded-lg bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Building2 size={13} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Top Vendors</h3>
            </div>
            <div className="divide-y divide-white/5">
              {topVendors.map((v) => (
                <div key={v.name} className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{v.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{v.category} · {v.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">{v.spend}</p>
                      <p className="text-[10px] text-emerald-400 mt-0.5">{v.onTime}% on-time</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PO Table */}
        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue-400/10 text-blue-400 flex items-center justify-center">
                <FileText size={13} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Active Purchase Orders</h3>
            </div>
            <span className="text-xs text-muted-foreground">{purchaseOrders.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3 w-16 text-center">Sr. No.</th>
                  <th className="px-5 py-3">PO Number</th>
                  <th className="px-5 py-3">Vendor</th>
                  <th className="px-5 py-3">Item / Description</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Quantity</th>
                  <th className="px-5 py-3 text-right">Value</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {purchaseOrders.map((po, idx) => (
                  <motion.tr
                    key={po.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono text-center">{idx + 1}</td>
                    <td className="px-5 py-4 font-mono text-xs font-bold text-foreground">{po.id}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{po.vendor}</td>
                    <td className="px-5 py-4 text-muted-foreground">{po.item}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-foreground">{po.category}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm">{po.qty}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-foreground">{po.value}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{po.date}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", statusMap[po.status])}>
                          {po.status}
                        </span>
                      </div>
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
