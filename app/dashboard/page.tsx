"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { TelemetryDeck } from "@/components/dashboard/telemetry-deck";
import { StockSectionDropdown } from "@/components/dashboard/stock-section-dropdown";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { OrderStatsCard } from "@/components/dashboard/order-stats-card";
import { SalesDonutChart } from "@/components/dashboard/sales-donut-chart";
import { kpiCards } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Cpu, Brain, Zap, ShieldCheck } from "lucide-react";

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

        {/* Revenue Analytics & Sales Breakdown */}
        <section id="analytics-section" aria-label="Analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RevenueChart />
            <SalesDonutChart />
          </div>
        </section>

        {/* Workflow Overview (Stock Section wise) */}
        <section id="stock-section" aria-label="Stock Section Wise">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-foreground">Manufacturing Workflow Overview</h3>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-muted-foreground">Stock → Material Details</span>
          </div>
          <StockSectionDropdown index={0} />
        </section>

        {/* Order Statistics, Timeline & Insights */}
        <section id="insights-timeline-section" aria-label="Timeline and Insights">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-6">
            <OrderStatsCard />
            <ActivityTimeline />

            {/* Manufacturing Insights */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card border border-white/8 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                    <Brain size={16} />
                  </div>
                  <h3 className="font-semibold text-foreground">Manufacturing Insights</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-emerald-400/10 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Optimal Capacity</p>
                      <p className="text-[11px] text-muted-foreground">Line C efficiency reached 85%. Steel stocks are sufficient for the next 14 cycles.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Zap size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Copper Alert</p>
                      <p className="text-[11px] text-muted-foreground">Copper rods booking status pending for Global Metal Connect. Reorder advised soon.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-md bg-blue-400/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Cpu size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">AI Forecasting</p>
                      <p className="text-[11px] text-muted-foreground">FOB Mundra export rates projected to increase by 1.4% in the next week. Plan nominations accordingly.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-[10px] text-muted-foreground">
                Powered by ERP Prediction Engine v2.4
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </div>
  );
}
