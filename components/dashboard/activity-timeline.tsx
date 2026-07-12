"use client";

import { motion } from "framer-motion";
import { activityTimeline } from "@/lib/data";
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  Factory,
  UserPlus,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  CheckCircle,
  AlertTriangle,
  FileText,
  Factory,
  UserPlus,
  Download,
};

const typeColors = {
  purchase: "text-blue-400 bg-blue-400/10",
  alert: "text-amber-400 bg-amber-400/10",
  sales: "text-emerald-400 bg-emerald-400/10",
  production: "text-purple-400 bg-purple-400/10",
  system: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10",
  report: "text-slate-400 bg-slate-400/10",
};

export function ActivityTimeline() {
  return (
    <motion.div
      id="activity-timeline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass-card border border-white/8 rounded-2xl p-6"
    >
      <div className="mb-5">
        <h3 className="font-semibold text-foreground">Activity Timeline</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Live system events</p>
      </div>

      <div className="space-y-4">
        {activityTimeline.map((item, index) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];
          const colorClass = typeColors[item.type as keyof typeof typeColors];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.07 }}
              className="flex gap-3 group"
            >
              {/* Icon + line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                    colorClass
                  )}
                >
                  <IconComponent size={14} />
                </div>
                {index < activityTimeline.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-white/6 min-h-4" />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 min-w-0">
                <p className="text-sm text-foreground leading-tight">
                  {item.action}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {item.user}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
