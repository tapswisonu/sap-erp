"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { OrderStatsCard } from "@/components/dashboard/order-stats-card";
import { WorkflowModule } from "@/components/dashboard/workflow-module";
import { workflowModules } from "@/lib/data";

const purchaseModule = workflowModules.find((m) => m.id === "purchase")!;

export default function PurchasePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="Purchase" subtitle="Procurement and vendor management" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <WorkflowModule {...purchaseModule} index={0} />
          <div className="lg:col-span-2">
            <OrderStatsCard />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 pb-6">
          <RecentTransactions />
        </div>
      </main>
    </div>
  );
}
