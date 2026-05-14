"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { WorkflowModule } from "@/components/dashboard/workflow-module";
import { workflowModules } from "@/lib/data";

const stockModule = workflowModules.find((m) => m.id === "stock")!;

export default function StockPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="Stock" subtitle="Raw material and finished goods stock" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <WorkflowModule {...stockModule} index={0} />
          <div className="lg:col-span-2">
            <StockAlerts />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-6">
          <RecentTransactions />
          <ActivityTimeline />
        </div>
      </main>
    </div>
  );
}
