"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { productionMetrics } from "@/lib/data";
import { Factory } from "lucide-react";

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
      <div className="glass-card border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-muted-foreground capitalize">
              {entry.name}:
            </span>
            <span className="font-bold text-foreground">
              {entry.value} units
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ProductionChart() {
  return (
    <motion.div
      id="production-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card border border-white/8 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-400/10">
          <Factory size={16} className="text-purple-400" />
        </div>
        <h3 className="font-semibold text-foreground">Production Metrics</h3>
      </div>
      <p className="text-xs text-muted-foreground ml-10 mb-4">
        Weekly output vs target
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={productionMetrics}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          barGap={4}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="rgba(255,255,255,0.2)"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={400}
            stroke="rgba(139,92,246,0.4)"
            strokeDasharray="4 4"
          />
          <Bar
            dataKey="target"
            fill="rgba(139,92,246,0.2)"
            radius={[4, 4, 0, 0]}
            name="target"
          />
          <Bar
            dataKey="production"
            fill="url(#productionGrad)"
            radius={[4, 4, 0, 0]}
            name="production"
          />
          <defs>
            <linearGradient id="productionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
