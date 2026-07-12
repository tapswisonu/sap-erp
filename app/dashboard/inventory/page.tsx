"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { motion } from "framer-motion";
import { inventoryData } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Boxes,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const statusConfig = {
  low: {
    label: "Low Stock",
    className: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    icon: AlertTriangle,
  },
  optimal: {
    label: "Optimal",
    className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    icon: CheckCircle,
  },
  high: {
    label: "High",
    className: "text-cyan-600 dark:text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    icon: TrendingUp,
  },
  critical: {
    label: "Critical",
    className: "text-red-400 bg-red-400/10 border-red-400/20",
    icon: AlertTriangle,
  },
};

const barColors = {
  low: "bg-amber-400",
  optimal: "bg-emerald-400",
  high: "bg-cyan-400",
  critical: "bg-red-400",
};

export default function InventoryPage() {
  const totalItems = inventoryData.reduce((sum, item) => sum + item.stock, 0);
  const criticalItems = inventoryData.filter(
    (item) => item.status === "critical" || item.status === "low"
  ).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Inventory Management"
        subtitle="Track and manage all stock levels"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Items",
              value: inventoryData.length.toString(),
              color: "cyan" as const,
              icon: Boxes,
            },
            {
              label: "Total Stock",
              value: totalItems.toLocaleString(),
              color: "blue" as const,
              icon: Boxes,
            },
            {
              label: "Alerts",
              value: criticalItems.toString(),
              color: "amber" as const,
              icon: AlertTriangle,
            },
            {
              label: "Optimal",
              value: (inventoryData.length - criticalItems).toString(),
              color: "emerald" as const,
              icon: CheckCircle,
            },
          ].map((card, i) => (
            <KpiCard
              key={card.label}
              title={card.label}
              value={card.value}
              color={card.color}
              icon={card.icon}
              index={i}
            />
          ))}
        </div>

        {/* Table toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Boxes size={16} className="text-muted-foreground" />
            <h2 className="font-semibold text-foreground">
              Inventory Overview
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-muted-foreground">
              <Search size={13} />
              <span className="text-xs hidden sm:block">Search items...</span>
            </div>
            <button
              id="filter-inventory"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:bg-white/5 transition-all"
            >
              <Filter size={13} />
              Filter
            </button>
            <button
              id="add-inventory"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-cyan-400/10 border border-cyan-400/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-400/20 transition-all"
            >
              <Plus size={13} />
              Add Item
            </button>
          </div>
        </div>

        {/* Inventory table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card border border-white/8 rounded-2xl overflow-x-auto"
        >
          <div className="min-w-[800px]">
            {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/8 text-xs font-medium text-muted-foreground">
            <div className="col-span-1">Sr. No.</div>
            <div className="col-span-3 flex items-center gap-1">
              Category <ArrowUpDown size={10} />
            </div>
            <div className="col-span-2 text-right">Current Stock</div>
            <div className="col-span-2 text-right">Capacity</div>
            <div className="col-span-2">Utilization</div>
            <div className="col-span-2 text-center">Status</div>
          </div>

          {/* Rows */}
          {inventoryData.map((item, index) => {
            const pct = Math.round((item.stock / item.capacity) * 100);
            const conf = statusConfig[item.status as keyof typeof statusConfig];
            const StatusIcon = conf.icon;
            const barColor = barColors[item.status as keyof typeof barColors];

            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.07 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-white/5 hover:bg-white/2 transition-colors items-center group"
              >
                <div className="col-span-1 text-sm font-semibold text-muted-foreground font-mono">
                  {index + 1}
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-medium text-foreground">
                    {item.category}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Unit: {item.unit}
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm font-bold text-foreground">
                    {item.stock.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {item.unit}
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-sm text-muted-foreground">
                    {item.capacity.toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", barColor)}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.4 + index * 0.07,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {pct}%
                    </span>
                  </div>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 border",
                      conf.className
                    )}
                  >
                    <StatusIcon size={10} />
                    {conf.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
