"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SidebarSkeletonProps {
  className?: string;
}

export function SidebarSkeleton({ className }: SidebarSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-screen w-[260px] glass-card border-r border-white/8 relative overflow-hidden flex-shrink-0",
        className
      )}
    >
      {/* Decorative gradient orb inside sidebar background */}
      <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-cyan-500/5 blur-[80px] pointer-events-none" />

      {/* Header / Brand Logo Placeholder */}
      <div className="flex h-16 items-center px-4 border-b border-white/8 flex-shrink-0 relative z-10 gap-3">
        <Skeleton className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24 bg-white/10" />
          <Skeleton className="h-2 w-16 bg-white/5" />
        </div>
      </div>

      {/* Navigation List Shimmer */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 relative z-10">
        {Array.from({ length: 3 }).map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            {/* Nav Group Label */}
            <Skeleton className="h-2.5 w-16 bg-white/5 ml-3" />
            
            {/* Group Items */}
            <div className="space-y-1.5">
              {Array.from({ length: gIdx === 0 ? 2 : gIdx === 1 ? 3 : 2 }).map((item, iIdx) => (
                <div 
                  key={iIdx}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/[0.01] border border-white/[0.02]"
                >
                  {/* Icon circle */}
                  <Skeleton className="h-5 w-5 rounded bg-white/10 flex-shrink-0" />
                  {/* Label text */}
                  <Skeleton className="h-3 w-28 bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom User Profile card skeleton */}
      <div className="border-t border-white/8 p-4 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-3 rounded-xl p-1 bg-white/[0.01]">
          {/* Avatar frame */}
          <div className="relative">
            <Skeleton className="h-8 w-8 rounded-full bg-white/10 border border-white/10" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500/20 border-2 border-background animate-pulse" />
          </div>
          {/* Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <Skeleton className="h-3.5 w-24 bg-white/10" />
            <Skeleton className="h-2 w-12 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
