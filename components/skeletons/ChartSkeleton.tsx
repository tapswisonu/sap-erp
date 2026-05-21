"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  type?: "bar" | "area" | "donut" | "generic";
  className?: string;
}

export function ChartSkeleton({ type = "generic", className }: ChartSkeletonProps) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn(
        "glass-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[340px] relative overflow-hidden",
        className
      )}
      style={{
        boxShadow: "0 0 30px rgba(34, 211, 238, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)"
      }}
    >
      {/* Dynamic diagonal accent highlights behind chart */}
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-gradient-to-br from-cyan-500/5 via-blue-500/0 to-transparent pointer-events-none rounded-bl-full" />

      {/* Chart Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          {/* Icon placeholder */}
          <div className="relative">
            <Skeleton className="h-9 w-9 rounded-xl bg-white/5 border border-white/10" />
            <span className="absolute inset-0 rounded-xl bg-cyan-400/5 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            {/* Title */}
            <Skeleton className="h-4 w-36 bg-white/10" />
            {/* Subtitle */}
            <Skeleton className="h-2.5 w-48 bg-white/5" />
          </div>
        </div>
        {/* Legend/Actions placeholder */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-lg bg-white/5 border border-white/10" />
          <Skeleton className="h-5 w-14 rounded-lg bg-white/5 border border-white/10" />
        </div>
      </div>

      {/* Main Chart Body */}
      <div className="flex-1 w-full flex items-end justify-between px-2 gap-4 pb-4 relative z-10">
        {type === "bar" && (
          <div className="w-full h-full flex items-end justify-between gap-3 pt-6">
            {Array.from({ length: 7 }).map((_, idx) => {
              const heights = [
                "h-[35%]", "h-[55%]", "h-[85%]", "h-[45%]", "h-[70%]", "h-[90%]", "h-[60%]"
              ];
              const glowColors = [
                "from-cyan-500/20 to-cyan-500/0 border-cyan-500/20",
                "from-blue-500/20 to-blue-500/0 border-blue-500/20",
                "from-cyan-500/20 to-cyan-500/0 border-cyan-500/20",
                "from-purple-500/20 to-purple-500/0 border-purple-500/20",
                "from-emerald-500/20 to-emerald-500/0 border-emerald-500/20",
                "from-cyan-500/20 to-cyan-500/0 border-cyan-500/20",
                "from-blue-500/20 to-blue-500/0 border-blue-500/20"
              ];
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-2.5">
                  <motion.div 
                    variants={itemVariants}
                    className="w-full h-full flex items-end"
                  >
                    <div className="relative w-full h-full flex items-end">
                      <Skeleton 
                        className={cn(
                          "w-full rounded-t-xl bg-gradient-to-t border-t border-x", 
                          heights[idx % heights.length],
                          glowColors[idx % glowColors.length]
                        )} 
                      />
                      {/* Pulse circle on top of columns */}
                      <span className={cn(
                        "absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full animate-ping opacity-60",
                        idx % 3 === 0 ? "bg-cyan-400" : (idx % 3 === 1 ? "bg-blue-400" : "bg-purple-400")
                      )} />
                    </div>
                  </motion.div>
                  <Skeleton className="h-2 w-8 bg-white/5" />
                </div>
              );
            })}
          </div>
        )}

        {type === "area" && (
          <div className="relative w-full h-full flex flex-col justify-between pt-6">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-40">
              <div className="border-t border-white/5 w-full" />
              <div className="border-t border-white/5 w-full" />
              <div className="border-t border-white/5 w-full" />
              <div className="border-t border-white/5 w-full" />
            </div>

            {/* Shimmer Area Representation */}
            <div className="relative flex-1 w-full overflow-hidden flex items-end">
              <svg className="w-full h-[85%] opacity-20 text-cyan-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGlowCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,100 C15,80 25,20 40,45 C55,70 65,15 80,35 C90,50 95,25 100,8 L100,100 Z"
                  fill="url(#areaGlowCyan)"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <svg className="absolute inset-0 w-full h-[85%] opacity-15 text-blue-400" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGlowBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,100 C20,90 30,55 45,75 C60,95 70,35 85,55 C95,70 98,45 100,25 L100,100 Z"
                  fill="url(#areaGlowBlue)"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.1 }}
                />
              </svg>

              {/* Laser line moving across the area chart grid */}
              <motion.div 
                className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-cyan-400 via-blue-400/40 to-transparent pointer-events-none opacity-50"
                animate={{ x: ["0%", "100%", "0%"] }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
              />
            </div>

            {/* X-axis ticks */}
            <div className="flex justify-between px-2 pt-3.5 border-t border-white/5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} className="h-2 w-12 bg-white/5" />
              ))}
            </div>
          </div>
        )}

        {type === "donut" && (
          <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around gap-6 pt-4">
            {/* Big donut circle with hologram ring */}
            <div className="relative flex h-36 w-36 items-center justify-center flex-shrink-0">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-[pulse_3s_infinite]" />
              {/* Spinning glass ring */}
              <div className="absolute h-[120px] w-[120px] rounded-full border-[10px] border-white/5 before:absolute before:inset-[-10px] before:rounded-full before:border-[10px] before:border-transparent before:border-t-cyan-400/20 before:border-r-blue-400/10 before:animate-[spin_6s_linear_infinite]" />
              <div className="absolute h-16 w-16 rounded-full bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[9px] font-mono text-muted-foreground mt-1">SYNC</span>
              </div>
            </div>

            {/* Labels beside donut with shimmering progress lines */}
            <div className="space-y-4 flex-1 max-w-[200px] w-full">
              {Array.from({ length: 4 }).map((_, idx) => {
                const badgeColors = ["bg-cyan-400", "bg-blue-400", "bg-emerald-400", "bg-purple-400"];
                return (
                  <div key={idx} className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", badgeColors[idx % 4])} />
                        <Skeleton className="h-3 w-16 bg-white/10" />
                      </div>
                      <Skeleton className="h-3 w-8 bg-white/10 font-mono" />
                    </div>
                    {/* Tiny status progress shimmer bar */}
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
                      <Skeleton className="absolute left-0 top-0 bottom-0 bg-white/15 w-[60%]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {type === "generic" && (
          <div className="w-full h-full flex flex-col justify-between py-2 pt-6">
            <div className="relative w-full h-[75%] rounded-xl overflow-hidden bg-white/2 border border-white/5">
              <Skeleton className="w-full h-full bg-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.01)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />
            </div>
            <div className="flex justify-between px-2 pt-3">
              <Skeleton className="h-2.5 w-16 bg-white/5" />
              <Skeleton className="h-2.5 w-16 bg-white/5" />
              <Skeleton className="h-2.5 w-16 bg-white/5" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
