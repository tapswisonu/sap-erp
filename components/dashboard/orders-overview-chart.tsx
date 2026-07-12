"use client";

import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend 
} from "recharts";
import { PackageSearch, TrendingUp } from "lucide-react";

const data = [
  { month: "Jan", received: 145, completed: 120 },
  { month: "Feb", received: 180, completed: 150 },
  { month: "Mar", received: 220, completed: 200 },
  { month: "Apr", received: 190, completed: 180 },
  { month: "May", received: 250, completed: 230 },
  { month: "Jun", received: 280, completed: 260 },
  { month: "Jul", received: 320, completed: 300 },
];

export function OrdersOverviewChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card border border-gray-200 dark:border-white/10 rounded-3xl p-5 flex flex-col bg-white dark:bg-[#0a0a0a] shadow-sm relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <PackageSearch size={18} />
            </div>
            <h3 className="text-base font-semibold text-foreground">Orders Overview</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1 ml-11">
            Manufacturing orders received vs completed (Year-to-Date)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
            <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              +14% Growth
            </span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="var(--chart-axis)" 
              fontSize={12} 
              tickMargin={10} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              stroke="var(--chart-axis)" 
              fontSize={12} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "var(--tooltip-bg)", 
                border: "1px solid var(--tooltip-border)", 
                borderRadius: "12px", 
                color: "var(--tooltip-text)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              labelStyle={{ color: "var(--tooltip-label)", fontSize: "12px", marginBottom: "4px" }}
              itemStyle={{ fontSize: "13px", fontWeight: 500 }}
              cursor={{ stroke: "var(--chart-axis)", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
            <Area 
              type="monotone" 
              dataKey="received" 
              name="Orders Received" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorReceived)" 
            />
            <Area 
              type="monotone" 
              dataKey="completed" 
              name="Orders Completed" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCompleted)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
