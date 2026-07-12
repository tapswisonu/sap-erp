"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";

interface WorkflowSkeletonProps {
  className?: string;
}

export function WorkflowSkeleton({ className }: WorkflowSkeletonProps) {
  const nodes = [
    { label: "Material Stock", color: "cyan" },
    { label: "Purchase & Procurement", color: "blue" },
    { label: "Operations & Flow", color: "purple" },
    { label: "Sales & Dispatch", color: "emerald" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={cn(
        "glass-card border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden",
        className
      )}
      style={{
        boxShadow: "0 0 35px rgba(34, 211, 238, 0.015), inset 0 1px 0 0 rgba(255, 255, 255, 0.03)"
      }}
    >
      {/* Top Banner details */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-lg bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-400/20">
            <Zap size={14} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">ERP Workflow Synchronizer</h3>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">Active data pipelines syncing...</p>
          </div>
        </div>
        <Skeleton className="h-5 w-24 bg-gray-50 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/5" />
      </div>

      {/* Main flow line grid */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 py-4">
        {/* Decorative background industrial scan grid */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_100%] opacity-40 pointer-events-none" />

        {nodes.map((node, index) => {
          const glows = {
            cyan: "shadow-cyan-500/10 border-cyan-400/25 text-cyan-600 dark:text-cyan-400 bg-cyan-400/5",
            blue: "shadow-blue-500/10 border-blue-400/25 text-blue-400 bg-blue-400/5",
            purple: "shadow-purple-500/10 border-purple-400/25 text-purple-400 bg-purple-400/5",
            emerald: "shadow-emerald-500/10 border-emerald-400/25 text-emerald-400 bg-emerald-400/5",
          };

          return (
            <div key={index} className="flex-1 w-full flex flex-col lg:flex-row items-center relative z-10">
              {/* Pulsing Node Box */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl border glass-card shadow-lg relative overflow-hidden group",
                  glows[node.color as keyof typeof glows]
                )}
              >
                {/* Node glowing light bar */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  node.color === "cyan" && "bg-cyan-400",
                  node.color === "blue" && "bg-blue-400",
                  node.color === "purple" && "bg-purple-400",
                  node.color === "emerald" && "bg-emerald-400"
                )} />

                <div className="flex items-center gap-3">
                  {/* Round blinking node dot */}
                  <div className="relative h-6 w-6 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-white/10">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      node.color === "cyan" && "bg-cyan-400",
                      node.color === "blue" && "bg-blue-400",
                      node.color === "purple" && "bg-purple-400",
                      node.color === "emerald" && "bg-emerald-400"
                    )} />
                    <span className={cn(
                      "absolute inset-0 rounded-full animate-ping opacity-60",
                      node.color === "cyan" && "bg-cyan-400",
                      node.color === "blue" && "bg-blue-400",
                      node.color === "purple" && "bg-purple-400",
                      node.color === "emerald" && "bg-emerald-400"
                    )} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">{node.label}</p>
                    <Skeleton className="h-2 w-16 bg-gray-50 dark:bg-white/5" />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <Skeleton className="h-3 w-8 bg-gray-100 dark:bg-white/10 font-mono" />
                  <Skeleton className="h-2 w-12 bg-gray-50 dark:bg-white/5" />
                </div>
              </motion.div>

              {/* Connecting line between nodes (Desktop: Arrow/Line; Mobile: none or vertical) */}
              {index < nodes.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-12 h-6 flex-shrink-0 relative">
                  {/* Line SVG with moving particles */}
                  <svg className="absolute inset-0 w-full h-full text-white/10" viewBox="0 0 48 24" fill="none">
                    <path d="M0,12 L48,12" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
                    {/* Animated laser dot */}
                    <motion.circle 
                      cx="0" cy="12" r="3" 
                      className={cn(
                        node.color === "cyan" && "fill-cyan-400",
                        node.color === "blue" && "fill-blue-400",
                        node.color === "purple" && "fill-purple-400"
                      )}
                      animate={{ cx: [0, 48] }}
                      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    />
                  </svg>
                  <ChevronRight size={14} className="text-muted-foreground/30 relative z-10 translate-x-2" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Synchronizing telemetry text log area */}
      <div className="mt-5 p-3 rounded-lg bg-white/[0.015] border border-gray-200 dark:border-white/5 font-mono text-[10px] text-muted-foreground/75 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="animate-[pulse_1.5s_infinite]">SYNCING DATABASE INSTANCES [NODE-MUNDRA-A]</span>
        </div>
        <div className="flex gap-2">
          <span>TXNS: OK</span>
          <span>LATENCY: 4ms</span>
        </div>
      </div>
    </motion.div>
  );
}
