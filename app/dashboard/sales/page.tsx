"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { SalesDonutChart } from "@/components/dashboard/sales-donut-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { WorkflowModule } from "@/components/dashboard/workflow-module";
import { workflowModules } from "@/lib/data";

const salesModule = workflowModules.find((m) => m.id === "sales")!;

export default function SalesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="Sales" subtitle="Sales analytics and performance tracking" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <WorkflowModule {...salesModule} index={0} />
          <div className="lg:col-span-2">
            <SalesDonutChart />
          </div>
        </div>
        <RevenueChart />
        <div className="pb-6">
          <RecentTransactions />
        </div>
      </main>
    </div>
  );
}
