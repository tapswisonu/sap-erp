"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ClipboardList,
  ShoppingCart,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import React from "react";

const iconMap = {
  ClipboardList,
  ShoppingCart,
  Wallet,
  TrendingUp,
};

const colorMap = {
  cyan: {
    gradient: "from-cyan-500/20 via-cyan-400/10 to-transparent",
    border: "border-cyan-400/20 hover:border-cyan-400/40",
    icon: "bg-cyan-400/10 text-cyan-400",
    glow: "hover:shadow-cyan-500/10",
    badge: "bg-cyan-400/10 text-cyan-400",
    indicator: "bg-cyan-400",
  },
  blue: {
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    border: "border-blue-400/20 hover:border-blue-400/40",
    icon: "bg-blue-400/10 text-blue-400",
    glow: "hover:shadow-blue-500/10",
    badge: "bg-blue-400/10 text-blue-400",
    indicator: "bg-blue-400",
  },
  emerald: {
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    border: "border-emerald-400/20 hover:border-emerald-400/40",
    icon: "bg-emerald-400/10 text-emerald-400",
    glow: "hover:shadow-emerald-500/10",
    badge: "bg-emerald-400/10 text-emerald-400",
    indicator: "bg-emerald-400",
  },
  purple: {
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
    border: "border-purple-400/20 hover:border-purple-400/40",
    icon: "bg-purple-400/10 text-purple-400",
    glow: "hover:shadow-purple-500/10",
    badge: "bg-purple-400/10 text-purple-400",
    indicator: "bg-purple-400",
  },
  amber: {
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    border: "border-amber-400/20 hover:border-amber-400/40",
    icon: "bg-amber-400/10 text-amber-400",
    glow: "hover:shadow-amber-500/10",
    badge: "bg-amber-400/10 text-amber-400",
    indicator: "bg-amber-400",
  },
  red: {
    gradient: "from-red-500/20 via-red-400/10 to-transparent",
    border: "border-red-400/20 hover:border-red-400/40",
    icon: "bg-red-400/10 text-red-400",
    glow: "hover:shadow-red-500/10",
    badge: "bg-red-400/10 text-red-400",
    indicator: "bg-red-400",
  },
};

interface KpiCardProps {
  id?: string;
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease" | "neutral";
  description?: string;
  color: keyof typeof colorMap;
  icon: React.ComponentType<any> | keyof typeof iconMap;
  index?: number;
}

export function KpiCard({
  id = "kpi-card",
  title,
  value,
  change,
  changeType,
  description,
  color,
  icon,
  index = 0,
}: KpiCardProps) {
  const colors = colorMap[color] || colorMap.cyan;
  const IconComponent = typeof icon === "string" ? (iconMap[icon as keyof typeof iconMap] || ClipboardList) : icon;

  const isIncrease = changeType === "increase" || (!changeType && change?.startsWith("+"));
  const isDecrease = changeType === "decrease" || (!changeType && change?.startsWith("-"));

  return (
    <motion.div
      id={`kpi-card-${id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative overflow-hidden rounded-2xl glass-card p-6",
        "border transition-all duration-300 cursor-pointer",
        "hover:shadow-2xl hover:shadow-cyan-500/10 shine-effect",
        colors.border,
        colors.glow
      )}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60",
          colors.gradient
        )}
      />

      {/* Top indicator line */}
      <div
        className={cn(
          "absolute top-0 left-6 right-6 h-px",
          colors.indicator,
          "opacity-40"
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              colors.icon
            )}
          >
            <IconComponent size={20} />
          </div>
          {change && (
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                colors.badge
              )}
            >
              {isIncrease && <ArrowUpRight size={12} />}
              {isDecrease && <ArrowDownRight size={12} />}
              {!isIncrease && !isDecrease && <Minus size={12} />}
              {change}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium tracking-[-0.01em] uppercase">{title}</p>
          <p
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFeatureSettings: "'tnum', 'cv02', 'cv03'", letterSpacing: "-0.03em", lineHeight: 1.15 }}
          >
            {value}
          </p>
          {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}
        </div>
      </div>
    </motion.div>
  );
}

