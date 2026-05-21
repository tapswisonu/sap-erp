"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const lmePriceTrend = [
  { date: "May 12", price: 9480 },
  { date: "May 13", price: 9510 },
  { date: "May 14", price: 9490 },
  { date: "May 15", price: 9550 },
  { date: "May 16", price: 9580 },
  { date: "May 17", price: 9560 },
  { date: "May 18", price: 9610 },
  { date: "May 19", price: 9630 },
  { date: "May 20", price: 9652.5 },
];

const tt = {
  contentStyle: { backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" },
  labelStyle: { color: "#94a3b8", fontSize: "12px" },
};

export default function CopperCharts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">LME Copper price trend</h3>
          <p className="text-[11px] text-muted-foreground">Historical daily closing price ($ per Ton)</p>
        </div>
      </div>
      <div className="h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={lmePriceTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} domain={[9400, 9700]} />
            <Tooltip {...tt} />
            <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#gPrice)" strokeWidth={2.5} name="Price ($/T)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
