"use client";

import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const poTrend = [
  { month: "Jan", raised: 42, approved: 38, delivered: 35 },
  { month: "Feb", raised: 48, approved: 44, delivered: 40 },
  { month: "Mar", raised: 55, approved: 50, delivered: 46 },
  { month: "Apr", raised: 50, approved: 47, delivered: 43 },
  { month: "May", raised: 61, approved: 56, delivered: 52 },
  { month: "Jun", raised: 58, approved: 53, delivered: 49 },
];

const tt = {
  contentStyle: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" },
  labelStyle: { color: "#94a3b8", fontSize: "12px" },
};

export default function PurchaseCharts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2"
    >
      <h3 className="text-sm font-semibold text-foreground mb-1">Purchase Order Trend</h3>
      <p className="text-[11px] text-muted-foreground mb-4">Raised vs Approved vs Delivered</p>
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={poTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} />
            <YAxis stroke="var(--chart-axis)" fontSize={11} />
            <Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} {...tt} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar dataKey="raised" fill="#22d3ee" name="Raised" radius={[3, 3, 0, 0]} />
            <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[3, 3, 0, 0]} />
            <Bar dataKey="delivered" fill="#8b5cf6" name="Delivered" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
