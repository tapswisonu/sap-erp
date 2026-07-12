"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { revenueData } from "@/lib/data";

const revenueByCategory = [
  { name: "Industrial", value: 48, color: "#22d3ee" },
  { name: "Commercial", value: 28, color: "#3b82f6" },
  { name: "Export", value: 15, color: "#10b981" },
  { name: "Domestic", value: 9, color: "#8b5cf6" },
];

const quarterlyRevenue = [
  { q: "Q1 FY25", revenue: 233, target: 220 },
  { q: "Q2 FY25", revenue: 287, target: 260 },
  { q: "Q3 FY25", revenue: 401, target: 380 },
  { q: "Q4 FY25", revenue: 420, target: 400 },
  { q: "Q1 FY26", revenue: 486, target: 460 },
  { q: "Q2 FY26", revenue: 524, target: 500 },
];

const tt = {
  contentStyle: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" },
  labelStyle: { color: "#94a3b8", fontSize: "12px" },
};

export default function RevenueCharts() {
  return (
    <div className="space-y-6">
      {/* Revenue Trend + Donut */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Monthly Revenue & Profit</h3>
              <p className="text-[11px] text-muted-foreground">Revenue vs expenses vs net profit (₹ Lakhs)</p>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} />
                <YAxis stroke="var(--chart-axis)" fontSize={11} />
                <Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} {...tt} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#gR)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" fill="url(#gE)" strokeWidth={1.5} name="Expenses" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#gP)" strokeWidth={1.5} name="Profit" />
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
          <h3 className="text-sm font-semibold text-foreground mb-1">Revenue by Segment</h3>
          <p className="text-[11px] text-muted-foreground mb-3">Contribution breakdown</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {revenueByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {revenueByCategory.map((s) => (
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

      {/* Quarterly Chart */}
      <section className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card border border-white/8 rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Quarterly Revenue vs Target</h3>
          <p className="text-[11px] text-muted-foreground mb-4">(₹ Lakhs)</p>
          <div className="h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyRevenue} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="q" stroke="var(--chart-axis)" fontSize={10} />
                <YAxis stroke="var(--chart-axis)" fontSize={11} />
                <Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} {...tt} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="revenue" fill="#22d3ee" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="rgba(255,255,255,0.1)" name="Target" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
