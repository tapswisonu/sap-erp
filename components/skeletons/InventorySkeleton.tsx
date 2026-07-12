"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface InventorySkeletonProps {
  count?: number;
  className?: string;
}

export function InventorySkeleton({ count = 2, className }: InventorySkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {Array.from({ length: count }).map((_, idx) => {
        const borderGlow = idx === 0 
          ? "border-blue-500/10 hover:border-blue-500/20" 
          : "border-cyan-500/10 hover:border-cyan-500/20";
        const themeGlow = idx === 0 
          ? "rgba(59, 130, 246, 0.03)" 
          : "rgba(34, 211, 238, 0.03)";
        const barColor = idx === 0 ? "bg-blue-500/20" : "bg-cyan-500/20";
        const textLabel = idx === 0 ? "Steel Inventory" : "Copper Inventory";

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -2 }}
            className={cn(
              "relative overflow-hidden rounded-2xl glass-card p-5 border transition-all duration-300",
              borderGlow
            )}
            style={{
              boxShadow: `0 0 25px ${themeGlow}, inset 0 1px 0 0 rgba(255, 255, 255, 0.03)`
            }}
          >
            {/* Top title bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Skeleton className="h-8 w-8 rounded-lg bg-white/5 border border-gray-200 dark:border-white/10" />
                  <span className="absolute inset-0 rounded-lg bg-gray-50 dark:bg-white/5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground tracking-wide">{textLabel}</h4>
                  <Skeleton className="h-2.5 w-20 bg-gray-50 dark:bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded bg-white/5 border border-gray-200 dark:border-white/10" />
            </div>

            {/* Capacity bars with progress shimmer bars */}
            <div className="space-y-4 pt-1">
              {Array.from({ length: 3 }).map((_, barIdx) => (
                <div key={barIdx} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Skeleton className="h-3 w-28 bg-gray-100 dark:bg-white/10" />
                    <div className="flex items-center gap-1.5 font-mono">
                      <Skeleton className="h-3 w-10 bg-gray-100 dark:bg-white/10" />
                      <span className="text-muted-foreground/40">/</span>
                      <Skeleton className="h-3 w-10 bg-gray-50 dark:bg-white/5" />
                    </div>
                  </div>
                  
                  {/* Capacity Bar Placeholder */}
                  <div className="h-2.5 w-full bg-white/5 border border-gray-200 dark:border-white/5 rounded-full overflow-hidden relative">
                    {/* Shimmer Progress fill */}
                    <div 
                      className={cn("absolute left-0 top-0 bottom-0 rounded-full", barColor)}
                      style={{ width: `${barIdx === 0 ? 68 : barIdx === 1 ? 42 : 79}%` }}
                    />
                    {/* Dynamic pulse scanner on the active capacity node */}
                    <motion.div 
                      className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                      animate={{ left: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3 + barIdx, ease: "easeInOut", repeat: Infinity }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom details panel */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full animate-ping", idx === 0 ? "bg-blue-400" : "bg-cyan-400")} />
                <Skeleton className="h-3 w-24 bg-gray-50 dark:bg-white/5" />
              </div>
              <Skeleton className="h-3 w-16 bg-gray-50 dark:bg-white/5" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
