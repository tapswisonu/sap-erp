"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { OrdersOverviewChart } from "@/components/dashboard/orders-overview-chart";
import { ProductionChart } from "@/components/dashboard/production-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesDonutChart } from "@/components/dashboard/sales-donut-chart";

import { kpiCards } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Manufacturing Dashboard"
        subtitle="Real-time overview • Last updated just now"
      />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">

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

        {/* Charts Summary Grid */}
        <section id="charts-summary" aria-label="Dashboard Analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main spanning chart */}
            <div className="lg:col-span-2">
              <OrdersOverviewChart />
            </div>
            {/* Side chart */}
            <div className="lg:col-span-1">
              <SalesDonutChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* <ProductionChart /> */}
            <RevenueChart />
          </div>
        </section>

      </main>
    </div>
  );
}
