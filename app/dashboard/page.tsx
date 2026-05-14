"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { WorkflowModule } from "@/components/dashboard/workflow-module";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesDonutChart } from "@/components/dashboard/sales-donut-chart";
import { ProductionChart } from "@/components/dashboard/production-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { OrderStatsCard } from "@/components/dashboard/order-stats-card";
import { kpiCards, workflowModules } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowRight, Package2, RefreshCw } from "lucide-react";

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
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Good afternoon, Rajesh 👋
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Here's what's happening at XYZ Manufacturing today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="refresh-dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/5 transition-all"
            >
              <RefreshCw size={13} />
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

        {/* KPI Cards — To Do / Total Orders / Balance / Revenue */}
        <section id="kpi-section" aria-label="Key Performance Indicators">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card, index) => (
              <KpiCard
                key={card.id}
                {...card}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Workflow Modules — Stock / Purchase / Sales / Copper */}
        <section id="workflow-section" aria-label="Manufacturing Workflow">
          <div className="flex items-center gap-2 mb-4">
            <Package2 size={16} className="text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Manufacturing Workflow</h3>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-muted-foreground">Stock → Purchase → Sales / Copper</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowModules.map((module, index) => (
              <WorkflowModule
                key={module.id}
                {...module}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Charts Row 1 — Revenue chart (wide) + Sales donut */}
        <section id="analytics-section" aria-label="Analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RevenueChart />
            <SalesDonutChart />
          </div>
        </section>

        {/* Charts Row 2 — Recent Transactions (wide) + Production + Order Stats */}
        <section id="data-section" aria-label="Transactions and Statistics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RecentTransactions />
            <div className="space-y-4">
              <ProductionChart />
              <OrderStatsCard />
            </div>
          </div>
        </section>

        {/* Bottom Row — Stock Alerts + Activity Timeline */}
        <section id="alerts-section" aria-label="Alerts and Activity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
            <StockAlerts />
            <ActivityTimeline />
          </div>
        </section>

      </main>
    </div>
  );
}
