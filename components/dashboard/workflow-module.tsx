"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  ShoppingBag,
  BarChart3,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const iconMap = {
  Package,
  ShoppingBag,
  BarChart3,
  Zap,
};

const colorMap = {
  cyan: {
    gradient: "from-cyan-500/15 to-transparent",
    border: "border-cyan-400/20 hover:border-cyan-400/50",
    icon: "bg-cyan-400/10 text-cyan-400",
    badge: "text-cyan-400",
    progress: "bg-cyan-400",
    dot: "bg-cyan-400",
  },
  blue: {
    gradient: "from-blue-500/15 to-transparent",
    border: "border-blue-400/20 hover:border-blue-400/50",
    icon: "bg-blue-400/10 text-blue-400",
    badge: "text-blue-400",
    progress: "bg-blue-400",
    dot: "bg-blue-400",
  },
  emerald: {
    gradient: "from-emerald-500/15 to-transparent",
    border: "border-emerald-400/20 hover:border-emerald-400/50",
    icon: "bg-emerald-400/10 text-emerald-400",
    badge: "text-emerald-400",
    progress: "bg-emerald-400",
    dot: "bg-emerald-400",
  },
  amber: {
    gradient: "from-amber-500/15 to-transparent",
    border: "border-amber-400/20 hover:border-amber-400/50",
    icon: "bg-amber-400/10 text-amber-400",
    badge: "text-amber-400",
    progress: "bg-amber-400",
    dot: "bg-amber-400",
  },
};

const statusColors = {
  optimal: "text-emerald-400 bg-emerald-400/10",
  active: "text-blue-400 bg-blue-400/10",
  high: "text-cyan-400 bg-cyan-400/10",
  low: "text-amber-400 bg-amber-400/10",
  critical: "text-red-400 bg-red-400/10",
};

interface WorkflowModuleProps {
  id: string;
  title: string;
  value: string;
  unit: string;
  status: keyof typeof statusColors;
  percentage: number;
  color: keyof typeof colorMap;
  icon: keyof typeof iconMap;
  description: string;
  alerts: number;
  trend: string;
  index?: number;
}

export function WorkflowModule({
  id,
  title,
  value,
  unit,
  status,
  percentage,
  color,
  icon,
  description,
  alerts,
  trend,
  index = 0,
}: WorkflowModuleProps) {
  const colors = colorMap[color];
  const IconComponent = iconMap[icon];
  const isPositive = trend.startsWith("+");

  return (
    <motion.div
      id={`workflow-${id}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass-card p-6",
        "border transition-all duration-300 cursor-default group",
        colors.border
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50",
          colors.gradient
        )}
      />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                colors.icon
              )}
            >
              <IconComponent size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            {alerts > 0 && (
              <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 rounded-full px-2 py-0.5">
                <AlertTriangle size={10} />
                {alerts}
              </div>
            )}
            <span
              className={cn(
                "text-xs font-medium rounded-full px-2 py-0.5",
                statusColors[status]
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end justify-between">
          <div>
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && (
              <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium",
              isPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trend}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Capacity</span>
            <span className={colors.badge}>{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-1.5" />
        </div>
      </div>
    </motion.div>
  );
}
