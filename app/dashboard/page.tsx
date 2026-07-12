"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import dynamic from 'next/dynamic';

const OrdersOverviewChart = dynamic(() => import("@/components/dashboard/orders-overview-chart").then(m => m.OrdersOverviewChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const ProductionChart = dynamic(() => import("@/components/dashboard/production-chart").then(m => m.ProductionChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const RevenueChart = dynamic(() => import("@/components/dashboard/revenue-chart").then(m => m.RevenueChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const SalesDonutChart = dynamic(() => import("@/components/dashboard/sales-donut-chart").then(m => m.SalesDonutChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });

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
