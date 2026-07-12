"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const stockActivity = [
  { category: "Copper Wire", received: 2000, consumed: 2340, opening: 5160 },
  { category: "Steel Sheets", received: 3780, consumed: 3480, opening: 7900 },
  { category: "Aluminum Rods", received: 800, consumed: 680, opening: 3480 },
  { category: "Plastic Casing", received: 4000, consumed: 3200, opening: 11600 },
  { category: "Circuit Boards", received: 500, consumed: 700, opening: 2000 },
  { category: "Fasteners", received: 8000, consumed: 5000, opening: 42000 },
];

const tt = {
  contentStyle: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" },
  labelStyle: { color: "#94a3b8", fontSize: "12px" },
};

export default function StockCharts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card border border-white/8 rounded-2xl p-5"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Stock Movement (MTD)</h3>
          <p className="text-[11px] text-muted-foreground">Received vs Consumed per category</p>
        </div>
      </div>
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stockActivity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="category" stroke="var(--chart-axis)" fontSize={10} />
            <YAxis stroke="var(--chart-axis)" fontSize={11} />
            <Tooltip {...tt} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="received" fill="#10b981" name="Received" radius={[3, 3, 0, 0]} />
            <Bar dataKey="consumed" fill="#f59e0b" name="Consumed" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
