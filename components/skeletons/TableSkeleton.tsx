"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function TableSkeleton({ rows = 6, cols = 6, className }: TableSkeletonProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 80 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn(
        "glass-card border border-white/5 rounded-2xl overflow-hidden w-full relative",
        className
      )}
      style={{
        boxShadow: "0 0 30px rgba(34, 211, 238, 0.01), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)"
      }}
    >
      {/* Table Action Controls Header */}
      <div className="px-5 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          {/* Table Icon */}
          <div className="relative">
            <Skeleton className="h-8 w-8 rounded-lg bg-white/5 border border-white/10" />
            <span className="absolute inset-0 rounded-lg bg-blue-400/5 animate-pulse" />
          </div>
          {/* Title */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-36 bg-white/10" />
            <Skeleton className="h-2.5 w-24 bg-white/5" />
          </div>
        </div>
        
        {/* Search bar & filter skeleton */}
        <div className="flex items-center gap-2">
          {/* Mock search input */}
          <div className="relative">
            <Skeleton className="h-8 w-40 rounded-lg bg-white/5 border border-white/10" />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border border-white/10" />
          </div>
          {/* Mock filters */}
          <Skeleton className="h-8 w-16 rounded-lg bg-white/5 border border-white/10" />
          <Skeleton className="h-8 w-16 rounded-lg bg-white/5 border border-white/10" />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.015] text-[10px] uppercase tracking-wider text-muted-foreground">
              {Array.from({ length: cols }).map((_, i) => {
                const headerWidths = ["w-12 text-center", "w-40", "w-32", "w-24", "w-24", "w-28 text-center"];
                return (
                  <th key={i} className={cn("px-5 py-3.5", headerWidths[i % headerWidths.length])}>
                    <Skeleton className="h-2.5 w-16 bg-white/10 inline-block" />
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <motion.tbody 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-white/5"
          >
            {Array.from({ length: rows }).map((_, rIdx) => (
              <motion.tr 
                key={rIdx} 
                variants={rowVariants}
                className="hover:bg-white/[0.015] transition-colors group"
              >
                {Array.from({ length: cols }).map((_, cIdx) => {
                  const widths = [
                    "w-6 mx-auto",  // Sr. No
                    "w-36 font-semibold", // Name
                    "w-20 text-muted-foreground", // Detail/Item
                    "w-14 font-mono", // Code/Qty
                    "w-20", // Date/Amount
                    "w-24 mx-auto" // Status
                  ];
                  const widthClass = widths[cIdx % widths.length];

                  return (
                    <td key={cIdx} className="px-5 py-4">
                      {cIdx === cols - 1 ? (
                        // Render glowing badge skeleton in the last column
                        <div className="flex justify-center">
                          <Skeleton className={cn(
                            "h-5 w-20 rounded-full bg-white/5 border",
                            rIdx % 3 === 0 && "border-cyan-500/10",
                            rIdx % 3 === 1 && "border-emerald-500/10",
                            rIdx % 3 === 2 && "border-amber-500/10"
                          )} />
                        </div>
                      ) : cIdx === 0 ? (
                        // Render centered Sr No
                        <div className="text-center font-mono text-xs">
                          <Skeleton className="h-3 w-4 bg-white/10 mx-auto" />
                        </div>
                      ) : (
                        <Skeleton className={cn("h-3 bg-white/5", widthClass)} />
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Pagination control footer skeleton */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
        <Skeleton className="h-3 w-44 bg-white/5" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-7 w-7 rounded bg-white/5 border border-white/10" />
          <Skeleton className="h-7 w-7 rounded bg-white/10 border border-white/10 text-center flex items-center justify-center" />
          <Skeleton className="h-7 w-7 rounded bg-white/5 border border-white/10" />
          <Skeleton className="h-7 w-7 rounded bg-white/5 border border-white/10" />
        </div>
      </div>
    </motion.div>
  );
}
