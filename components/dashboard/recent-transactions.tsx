"use client";

import { motion } from "framer-motion";
import { recentTransactions } from "@/lib/data";
import { ShoppingBag, BarChart3, Clock, CheckCircle, Loader2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  completed: {
    label: "Completed",
    className: "text-emerald-400 bg-emerald-400/10",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    className: "text-amber-400 bg-amber-400/10",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    className: "text-blue-400 bg-blue-400/10",
    icon: Loader2,
  },
};

const typeConfig = {
  purchase: {
    icon: ShoppingBag,
    className: "bg-blue-400/10 text-blue-400",
  },
  sales: {
    icon: BarChart3,
    className: "bg-emerald-400/10 text-emerald-400",
  },
};

export function RecentTransactions() {
  return (
    <motion.div
      id="recent-transactions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card border border-white/8 rounded-2xl p-6 lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest purchase & sales activity
          </p>
        </div>
        <button
          id="view-all-transactions"
          className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View All
          <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="space-y-2">
        {recentTransactions.map((txn, index) => {
          const typeConf = typeConfig[txn.type as keyof typeof typeConfig];
          const statusConf = statusConfig[txn.status as keyof typeof statusConfig];
          const TypeIcon = typeConf.icon;
          const StatusIcon = statusConf.icon;

          return (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.06 }}
              className="flex items-center gap-4 rounded-xl p-3 hover:bg-white/3 transition-colors group"
            >
              <div
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                  typeConf.className
                )}
              >
                <TypeIcon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {txn.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {txn.vendor}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {txn.id}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">{txn.amount}</p>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs mt-0.5",
                    statusConf.className
                  )}
                >
                  <StatusIcon size={10} />
                  {statusConf.label}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
