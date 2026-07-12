"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

const revenueTrend = [
  { month: "Jan", revenue: 65, expenses: 42, profit: 23 },
  { month: "Feb", revenue: 78, expenses: 48, profit: 30 },
  { month: "Mar", revenue: 90, expenses: 52, profit: 38 },
  { month: "Apr", revenue: 81, expenses: 45, profit: 36 },
  { month: "May", revenue: 96, expenses: 58, profit: 38 },
  { month: "Jun", revenue: 110, expenses: 61, profit: 49 },
  { month: "Jul", revenue: 124, expenses: 67, profit: 57 },
  { month: "Aug", revenue: 118, expenses: 63, profit: 55 },
  { month: "Sep", revenue: 135, expenses: 72, profit: 63 },
  { month: "Oct", revenue: 148, expenses: 78, profit: 70 },
];

const salesBreakdown = [
  { name: "Industrial", value: 38, color: "#22d3ee" },
  { name: "Commercial", value: 28, color: "#3b82f6" },
  { name: "Export", value: 22, color: "#10b981" },
  { name: "Domestic", value: 12, color: "#8b5cf6" },
];

const productionByLine = [
  { line: "Line A", output: 14200, target: 14000, efficiency: 101 },
  { line: "Line B", output: 7200, target: 8000, efficiency: 90 },
  { line: "Line C", output: 13600, target: 16000, efficiency: 85 },
  { line: "Line D", output: 8400, target: 10000, efficiency: 84 },
];

const tooltipStyle = {
  contentStyle: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" },
  labelStyle: { color: "#94a3b8", fontSize: "12px" },
};

export default function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue vs Expenses Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <BarChart3 size={15} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Revenue vs Expenses</h3>
                <p className="text-[11px] text-muted-foreground">Monthly financial trend (₹ Lakhs)</p>
              </div>
            </div>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} />
                <YAxis stroke="var(--chart-axis)" fontSize={11} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fill="url(#gRev)" name="Revenue" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" fill="url(#gExp)" name="Expenses" strokeWidth={1.5} />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#gPro)" name="Profit" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sales Mix Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="glass-card border border-white/8 rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Sales Channel Mix</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Revenue breakdown by segment</p>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                  {salesBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
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

      {/* Production Output Bar Chart */}
      <section className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card border border-white/8 rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Production Output by Line</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Actual vs target (units)</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionByLine} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="line" stroke="var(--chart-axis)" fontSize={11} />
                <YAxis stroke="var(--chart-axis)" fontSize={11} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="output" fill="#22d3ee" name="Actual Output" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="rgba(255,255,255,0.12)" name="Target" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
