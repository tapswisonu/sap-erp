"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const salesTrend = [
  { month: "Jan", domestic: 2.2, export: 1.8, total: 4.0 },
  { month: "Feb", domestic: 2.6, export: 2.1, total: 4.7 },
  { month: "Mar", domestic: 3.0, export: 2.4, total: 5.4 },
  { month: "Apr", domestic: 2.8, export: 2.2, total: 5.0 },
  { month: "May", domestic: 3.4, export: 2.8, total: 6.2 },
  { month: "Jun", domestic: 3.8, export: 3.1, total: 6.9 },
  { month: "Jul", domestic: 4.1, export: 3.4, total: 7.5 },
  { month: "Aug", domestic: 3.9, export: 3.2, total: 7.1 },
  { month: "Sep", domestic: 4.4, export: 3.7, total: 8.1 },
  { month: "Oct", domestic: 4.7, export: 3.9, total: 8.6 },
];

const salesBreakdown = [
  { name: "Industrial", value: 38, color: "#22d3ee" },
  { name: "Commercial", value: 28, color: "#3b82f6" },
  { name: "Export", value: 22, color: "#10b981" },
  { name: "Domestic", value: 12, color: "#8b5cf6" },
];

const tt = {
  contentStyle: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" },
  labelStyle: { color: "#94a3b8", fontSize: "12px" },
};

export default function SalesCharts() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2"
      >
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-foreground">Sales Trend — Domestic vs Export</h3>
          <p className="text-[11px] text-muted-foreground">Monthly revenue in ₹ Millions</p>
        </div>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gDom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} />
              <YAxis stroke="var(--chart-axis)" fontSize={11} />
              <Tooltip {...tt} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              <Area type="monotone" dataKey="domestic" stroke="#22d3ee" fill="url(#gDom)" strokeWidth={2} name="Domestic" />
              <Area type="monotone" dataKey="export" stroke="#10b981" fill="url(#gExp)" strokeWidth={2} name="Export" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card border border-white/8 rounded-2xl p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-1">Channel Breakdown</h3>
        <p className="text-[11px] text-muted-foreground mb-3">Sales by segment</p>
        <div className="h-[165px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={salesBreakdown} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={3} dataKey="value">
                {salesBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-3">
          {salesBreakdown.map((s) => (
            <div key={s.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
              </div>
              <span className="font-semibold text-foreground">{s.value}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
