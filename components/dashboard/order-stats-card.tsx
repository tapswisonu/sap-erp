"use client";

import { motion } from "framer-motion";
import { orderStats } from "@/lib/data";
import { Package } from "lucide-react";

const stats = [
  { label: "Pending", value: orderStats.pending, color: "text-amber-400", bg: "bg-amber-400/10", bar: "bg-amber-400" },
  { label: "Processing", value: orderStats.processing, color: "text-blue-400", bg: "bg-blue-400/10", bar: "bg-blue-400" },
  { label: "Shipped", value: orderStats.shipped, color: "text-purple-400", bg: "bg-purple-400/10", bar: "bg-purple-400" },
  { label: "Delivered", value: orderStats.delivered, color: "text-emerald-400", bg: "bg-emerald-400/10", bar: "bg-emerald-400" },
];

export function OrderStatsCard() {
  return (
    <motion.div
      id="order-stats-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className="glass-card border border-white/8 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
          <Package size={16} className="text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Order Statistics</h3>
          <p className="text-xs text-muted-foreground">
            Total: {orderStats.total.toLocaleString()} orders
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => {
          const pct = Math.round((stat.value / orderStats.total) * 100);
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + index * 0.07 }}
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${stat.bar}`} />
                  <span className="text-muted-foreground">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">({pct}%)</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${stat.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-5 pt-4 border-t border-white/8 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Completion rate</span>
        <span className="text-lg font-bold gradient-text">
          {Math.round((orderStats.delivered / orderStats.total) * 100)}%
        </span>
      </div>
    </motion.div>
  );
}
