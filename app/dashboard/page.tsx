"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { TelemetryDeck } from "@/components/dashboard/telemetry-deck";

import { kpiCards } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Manufacturing Dashboard"
        subtitle="Real-time overview • Last updated just now"
      />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Top Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Welcome Back, Operator 👋
            </h2>
            <p className="text-xs text-muted-foreground">Regional ERP node connected to Mundra and Nhava Sheva terminals.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="refresh-dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <RefreshCw size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
              Refresh
            </button>
            <button
              id="export-report"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/20 transition-all"
            >
              Export Report
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <section id="kpi-section" aria-label="Key Performance Indicators">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card, index) => (
              <KpiCard
                key={card.id}
                {...card}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Live Cyber Telemetry Logs & Operator Controls */}
        <section id="telemetry-section" aria-label="Live System Telemetry">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-foreground">Cyber Diagnostics & Controls</h3>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-400/5 px-2 py-0.5 border border-cyan-400/15 rounded">Online Feed</span>
          </div>
          <TelemetryDeck />
        </section>


      </main>
    </div>
  );
}
