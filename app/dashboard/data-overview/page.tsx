"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { motion } from "framer-motion";
import { dataOverviewStats, moduleActivityData, recentActivity } from "@/lib/erp-data";
import { cn } from "@/lib/utils";
import {
  Database,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  Layers,
  CircleDot,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const colorClasses = {
  cyan: "text-cyan-600 dark:text-cyan-400 border-cyan-400/20 bg-cyan-400/10",
  blue: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
  amber: "text-amber-400 border-amber-400/20 bg-amber-400/10",
  red: "text-red-400 border-red-400/20 bg-red-400/10",
};

const statusBadge = {
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  alert: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function DataOverviewPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Data Overview"
        subtitle="Global system metrics and active operations log"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataOverviewStats.map((stat, i) => (
            <KpiCard
              key={stat.label}
              title={stat.label}
              value={stat.value}
              change={stat.change}
              changeType={stat.up ? "increase" : "decrease"}
              color={stat.color as any}
              icon={Database}
              index={i}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Module Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card border border-white/8 rounded-2xl p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-600 dark:text-cyan-400">
                  <Activity size={16} />
                </div>
                <h3 className="font-semibold text-foreground">Module Database Records</h3>
              </div>
              <span className="text-xs text-muted-foreground">Active vs Pending database load</span>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="module" stroke="var(--chart-axis)" tick={{ fill: "var(--chart-text)", fontSize: 11 }} />
                  <YAxis stroke="var(--chart-axis)" tick={{ fill: "var(--chart-text)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="active" fill="#22d3ee" name="Active Records" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending Review" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card border border-white/8 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                  <Database size={16} />
                </div>
                <h3 className="font-semibold text-foreground">ERP Sync Engine</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Mainframe Connection</span>
                    <span className="text-emerald-400 font-semibold">Online (12ms)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-50 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Automation pipeline</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Running</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-50 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Security Protocol</span>
                    <span className="text-purple-400 font-semibold">TLS 1.3 Active</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-50 dark:bg-white/5 overflow-hidden">
                    <div className="h-full bg-purple-400 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200 dark:border-white/5 text-xs text-muted-foreground flex items-center gap-2">
              <CircleDot className="text-emerald-400 animate-pulse" size={12} />
              All regional ERP shards synchronized successfully.
            </div>
          </motion.div>
        </div>

        {/* Live Transaction log / Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card border border-white/8 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Global Activity Log</h3>
            <span className="text-xs text-muted-foreground">Real-time system events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-6 py-3">Sr. No.</th>
                  <th className="px-6 py-3">Event ID</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3">Operation Details</th>
                  <th className="px-6 py-3">Executed By</th>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {recentActivity.map((act, idx) => (
                  <tr key={act.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{act.id}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-white/5 border-gray-200 dark:border-white/10 text-foreground">
                        {act.module}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">{act.action}</td>
                    <td className="px-6 py-4 text-muted-foreground">{act.user}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{act.time}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1",
                          statusBadge[act.status as keyof typeof statusBadge]
                        )}>
                          {act.status === "completed" && <CheckCircle size={10} />}
                          {act.status === "pending" && <Clock size={10} />}
                          {act.status === "alert" && <AlertTriangle size={10} />}
                          {act.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
