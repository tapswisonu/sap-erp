"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { salesBreakdown } from "@/lib/data";
import { PieChart as PieIcon } from "lucide-react";

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="glass-card border border-white/10 rounded-xl p-3 shadow-xl text-sm">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: item.payload.color }}
          />
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-bold text-foreground">{item.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function SalesDonutChart() {
  return (
    <motion.div
      id="sales-donut-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card border border-white/8 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/10">
          <PieIcon size={16} className="text-blue-400" />
        </div>
        <h3 className="font-semibold text-foreground">Sales Breakdown</h3>
      </div>
      <p className="text-xs text-muted-foreground ml-10 mb-4">
        Revenue by channel
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={salesBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {salesBreakdown.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {salesBreakdown.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-muted-foreground flex-1">{item.name}</span>
            <span className="font-semibold text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
