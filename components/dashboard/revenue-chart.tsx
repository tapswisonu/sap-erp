"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { revenueData } from "@/lib/data";
import { TrendingUp } from "lucide-react";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border border-gray-200 dark:border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-bold text-foreground">₹{entry.value}L</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <motion.div
      id="revenue-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="glass-card border border-white/8 rounded-2xl p-6 lg:col-span-2"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground">Revenue Analytics</h3>
          </div>
          <p className="text-xs text-muted-foreground ml-10">
            12-month revenue, expenses & profit overview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs ml-10 sm:ml-0">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-muted-foreground">Profit</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={revenueData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="var(--chart-axis)"
            tick={{ fill: "var(--chart-text)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="var(--chart-axis)"
            tick={{ fill: "var(--chart-text)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}L`}
          />
          <Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#gradRevenue)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f87171"
            strokeWidth={2}
            fill="url(#gradExpenses)"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradProfit)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
