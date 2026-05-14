"use client";

import { motion } from "framer-motion";
import { stockAlerts } from "@/lib/data";
import { AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const severityConfig = {
  critical: {
    label: "Critical",
    className: "border-red-500/30 bg-red-500/5",
    badge: "text-red-400 bg-red-400/10",
    icon: "text-red-400",
    bar: "bg-red-400",
  },
  warning: {
    label: "Warning",
    className: "border-amber-500/30 bg-amber-500/5",
    badge: "text-amber-400 bg-amber-400/10",
    icon: "text-amber-400",
    bar: "bg-amber-400",
  },
};

export function StockAlerts() {
  return (
    <motion.div
      id="stock-alerts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="glass-card border border-white/8 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-400/10">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Stock Alerts</h3>
            <p className="text-xs text-muted-foreground">
              {stockAlerts.length} items need attention
            </p>
          </div>
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold text-red-400">
          {stockAlerts.length}
        </span>
      </div>

      <div className="space-y-3">
        {stockAlerts.map((alert, index) => {
          const conf = severityConfig[alert.severity as keyof typeof severityConfig];
          const pct = Math.round((alert.current / alert.minimum) * 100);

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.08 }}
              className={cn(
                "rounded-xl border p-3.5 space-y-2",
                conf.className
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {alert.item}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {alert.message}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs rounded-full px-2 py-0.5 flex-shrink-0 font-medium",
                    conf.badge
                  )}
                >
                  {conf.label}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Current:{" "}
                  <strong className="text-foreground">
                    {alert.current.toLocaleString()} {alert.unit}
                  </strong>
                </span>
                <ArrowRight size={10} />
                <span>
                  Min:{" "}
                  <strong className="text-foreground">
                    {alert.minimum.toLocaleString()} {alert.unit}
                  </strong>
                </span>
              </div>

              {/* Stock bar */}
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", conf.bar)}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
