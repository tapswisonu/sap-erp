"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiCardSkeleton } from "@/components/skeletons/KpiCardSkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { InventorySkeleton } from "@/components/skeletons/InventorySkeleton";
import { WorkflowSkeleton } from "@/components/skeletons/WorkflowSkeleton";
import { Activity, ShieldAlert, Cpu, Sparkles } from "lucide-react";

const LOADING_MESSAGES = [
  "Initializing Manufacturing Systems...",
  "Syncing Inventory Analytics...",
  "Processing ERP Data...",
  "Loading Revenue Intelligence...",
  "Preparing Smart Dashboard...",
];

export default function DashboardLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background relative">
      
      {/* Laser line moving across the top of the header as a subtle page loader indicator */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-50 animate-[pulse_2s_infinite]" />

      {/* Loading Header */}
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between flex-shrink-0 bg-white/[0.01] relative z-10">
        <div className="space-y-2">
          {/* Header Title Loading */}
          <Skeleton className="h-6 w-56 bg-white/10" />
          {/* Header Subtitle Loading */}
          <Skeleton className="h-3 w-80 bg-white/5" />
        </div>
        
        {/* Dynamic Status Synchronizer Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-400/5 border border-cyan-400/10 text-cyan-400 text-xs font-mono">
            <Cpu size={12} className="animate-spin" style={{ animationDuration: "3s" }} />
            <AnimatePresence mode="wait">
              <motion.span
                key={messageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          
          {/* Header Action Button skeletons */}
          <Skeleton className="h-9 w-20 bg-white/5 rounded-xl" />
          <Skeleton className="h-9 w-28 bg-white/10 rounded-xl" />
        </div>
      </div>

      {/* Main content skeletons */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        
        {/* Sync Status Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 bg-gradient-to-r from-cyan-950/20 via-blue-950/20 to-transparent border border-cyan-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
          style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.02)" }}
        >
          {/* Holographic scanner sheen */}
          <motion.div 
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none"
            animate={{ left: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center border border-cyan-400/20">
              <Sparkles size={16} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-foreground tracking-wide uppercase font-mono">Real-Time Core Live-Sync</span>
              </div>
              <p className="text-[10px] text-muted-foreground/80 leading-normal">Connecting regional manufacturing nodes. Operational status nominal.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 bg-white/5 rounded-lg border border-white/10" />
          </div>
        </motion.div>

        {/* KPI Grid Loading */}
        <section aria-label="Key Performance Indicators Loading">
          <KpiCardSkeleton count={4} />
        </section>

        {/* Workflow Loading UI */}
        <section aria-label="Workflow Pipelines Loading">
          <WorkflowSkeleton />
        </section>

        {/* Charts & Inventory Grid Loading */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Charts and Stock Inventory Loading">
          <div className="lg:col-span-2 space-y-6">
            <ChartSkeleton type="area" />
          </div>
          <div className="space-y-6">
            <InventorySkeleton count={2} />
          </div>
        </section>

        {/* Charts Second Row Grid Loading */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Secondary Charts Loading">
          <ChartSkeleton type="bar" />
          <ChartSkeleton type="donut" />
          <ChartSkeleton type="generic" />
        </section>

        {/* Transactions Table Loading */}
        <section aria-label="Transaction Audit Records Loading">
          <TableSkeleton rows={6} cols={6} />
        </section>

      </main>
    </div>
  );
}
