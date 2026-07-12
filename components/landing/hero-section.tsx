"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Package,
  BarChart3,
  Zap,
  TrendingUp,
  Activity,
  Shield,
} from "lucide-react";

const floatingCards = [
  {
    id: "float-revenue",
    icon: TrendingUp,
    label: "Revenue",
    value: "₹124.7M",
    change: "+22.1%",
    color: "emerald",
    className: "absolute -top-8 -right-8 hidden lg:flex",
  },
  {
    id: "float-stock",
    icon: Package,
    label: "Stock Units",
    value: "8,432",
    change: "Optimal",
    color: "cyan",
    className: "absolute -bottom-8 -left-8 hidden lg:flex",
  },
];

const stats = [
  { label: "Uptime", value: "99.9%" },
  { label: "Transactions", value: "2M+" },
  { label: "Partners", value: "150+" },
  { label: "Accuracy", value: "99.8%" },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-500/3 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 status-online" />
            Industry 4.0 Manufacturing Platform
            <ArrowRight size={12} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight"
          >
            Smart Manufacturing
            <span className="block gradient-text mt-1">
              Management Platform
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed mb-10"
          >
            Automate operations, track inventory in real-time, and optimize
            revenue with our enterprise ERP platform. Built for modern
            industrial manufacturers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/dashboard"
              id="hero-cta-primary"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300"
            >
              View Dashboard
              <ArrowRight size={18} />
            </Link>
            <Link
              href="#features"
              id="hero-cta-secondary"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-medium border border-gray-200 dark:border-white/10 hover:border-white/20 hover:bg-gray-50 dark:bg-white/5 transition-all duration-300 text-foreground"
            >
              <Play size={16} />
              Get Started
            </Link>
          </motion.div>

          {/* Platform illustration */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Main dashboard preview */}
            <div className="relative glass-card border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-muted-foreground font-mono bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-0.5">
                    sap-manufacturing.app/dashboard
                  </span>
                </div>
              </div>

              {/* Dashboard miniature */}
              <div className="p-6 bg-gradient-to-br from-slate-950 to-slate-900">
                {/* KPI row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "To Do", val: "24", color: "cyan" },
                    { label: "Orders", val: "1,847", color: "blue" },
                    { label: "Balance", val: "₹48.2M", color: "emerald" },
                    { label: "Revenue", val: "₹124.7M", color: "purple" },
                  ].map((card, i) => (
                    <div
                      key={card.label}
                      className={`rounded-xl p-3 border border-${card.color}-400/10 bg-${card.color}-400/5`}
                    >
                      <p className="text-[10px] text-muted-foreground mb-1">{card.label}</p>
                      <p className="text-sm font-bold text-foreground">{card.val}</p>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 rounded-xl border border-white/8 bg-white/2 p-3 h-28 flex flex-col">
                    <p className="text-[10px] text-muted-foreground mb-2">Revenue Analytics</p>
                    <div className="flex-1 flex items-end gap-1">
                      {[65, 78, 90, 81, 96, 110, 124, 118, 135, 148, 142, 160].map((v, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-cyan-500/40 to-transparent"
                          style={{ height: `${(v / 160) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/2 p-3 h-28 flex flex-col">
                    <p className="text-[10px] text-muted-foreground mb-2">Workflow</p>
                    <div className="space-y-2 flex-1">
                      {[
                        { label: "Stock", pct: 78, color: "bg-cyan-400" },
                        { label: "Purchase", pct: 65, color: "bg-blue-400" },
                        { label: "Sales", pct: 92, color: "bg-emerald-400" },
                        { label: "Copper", pct: 34, color: "bg-amber-400" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                            <span>{item.label}</span>
                            <span>{item.pct}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-gray-100 dark:bg-white/10">
                            <div
                              className={`h-full rounded-full ${item.color}`}
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating analytics cards */}
            <motion.div
              id="float-revenue-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-5 -right-5 glass-card border border-emerald-400/20 rounded-2xl p-3 shadow-xl hidden lg:flex items-center gap-3 float-animation"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
                <TrendingUp size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Revenue</p>
                <p className="text-sm font-bold text-emerald-400">₹124.7M</p>
              </div>
            </motion.div>

            <motion.div
              id="float-stock-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute -bottom-5 -left-5 glass-card border border-cyan-400/20 rounded-2xl p-3 shadow-xl hidden lg:flex items-center gap-3 float-animation"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                <Activity size={16} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">System Status</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">All Systems Go</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
