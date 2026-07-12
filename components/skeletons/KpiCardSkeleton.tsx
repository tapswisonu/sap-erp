"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KpiCardSkeletonProps {
  count?: number;
  className?: string;
}

export function KpiCardSkeleton({ count = 4, className }: KpiCardSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => {
        // Dynamic decorative glow highlights for extra premium feel
        const glows = [
          "rgba(34, 211, 238, 0.05)",  // Cyan
          "rgba(59, 130, 246, 0.05)",  // Blue
          "rgba(16, 185, 129, 0.05)",  // Emerald
          "rgba(139, 92, 246, 0.05)"   // Purple
        ];
        const colors = [
          "border-cyan-500/10 hover:border-cyan-500/20",
          "border-blue-500/10 hover:border-blue-500/20",
          "border-emerald-500/10 hover:border-emerald-500/20",
          "border-purple-500/10 hover:border-purple-500/20"
        ];
        const lineColors = [
          "text-cyan-600 dark:text-cyan-400/20",
          "text-blue-400/20",
          "text-emerald-400/20",
          "text-purple-400/20"
        ];

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -2 }}
            className={cn(
              "relative overflow-hidden rounded-2xl glass-card p-6 border transition-all duration-300",
              colors[i % colors.length]
            )}
            style={{
              boxShadow: `0 0 25px ${glows[i % glows.length]}, inset 0 1px 0 0 rgba(255, 255, 255, 0.03)`
            }}
          >
            {/* Ambient subtle accent gradient spot inside the card */}
            <div 
              className="absolute inset-0 opacity-40 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" 
            />

            {/* Glowing top line highlight */}
            <div 
              className={cn(
                "absolute top-0 left-6 right-6 h-[1px] opacity-40",
                i % 4 === 0 && "bg-cyan-500",
                i % 4 === 1 && "bg-blue-500",
                i % 4 === 2 && "bg-emerald-500",
                i % 4 === 3 && "bg-purple-500"
              )}
            />

            <div className="relative z-10 space-y-4">
              {/* Header: Title and Icon */}
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 flex-1">
                  {/* Category label skeleton */}
                  <Skeleton className="h-2.5 w-24 bg-gray-50 dark:bg-white/5" />
                  {/* Title text skeleton */}
                  <Skeleton className="h-3.5 w-16 bg-gray-100 dark:bg-white/10" />
                </div>
                {/* Glowing Icon shape placeholder */}
                <div className="relative flex-shrink-0">
                  <Skeleton className="h-9 w-9 rounded-xl bg-white/5 border border-gray-200 dark:border-white/10" />
                  <div className="absolute inset-0 rounded-xl bg-gray-50 dark:bg-white/5 animate-pulse" />
                </div>
              </div>

              {/* Middle: Big Value and Trend Badge */}
              <div className="flex items-end justify-between pt-1">
                <div className="space-y-1">
                  {/* Value skeleton */}
                  <Skeleton className="h-9 w-28 bg-white/15" />
                  <Skeleton className="h-2.5 w-32 bg-gray-50 dark:bg-white/5" />
                </div>
                {/* Trend Badge skeleton */}
                <Skeleton className="h-6 w-14 rounded-full bg-white/5 border border-gray-200 dark:border-white/5" />
              </div>

              {/* Bottom: Sparkline/Mini Graph placeholder */}
              <div className="pt-2 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                <div className="flex-1 h-8 mr-4 relative overflow-hidden">
                  {/* Mini sparkline chart SVG */}
                  <svg className={cn("w-full h-full", lineColors[i % lineColors.length])} viewBox="0 0 100 30" preserveAspectRatio="none">
                    <motion.path
                      d="M0,25 Q15,5 30,20 T60,10 T90,25 L100,15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    />
                  </svg>
                </div>
                {/* Mini status indicator */}
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full animate-ping",
                    i % 4 === 0 && "bg-cyan-400",
                    i % 4 === 1 && "bg-blue-400",
                    i % 4 === 2 && "bg-emerald-400",
                    i % 4 === 3 && "bg-purple-400"
                  )} />
                  <Skeleton className="h-2 w-10 bg-gray-50 dark:bg-white/5" />
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
