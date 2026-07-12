"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { Settings, Shield, Cpu, Sliders, Database, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="System Settings"
        subtitle="Configure ERP server nodes, prediction engines, and system defaults"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* General Node Config */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card border border-white/8 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Database size={16} />
              </div>
              <h3 className="font-semibold text-foreground">ERP Node Configuration</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Active Database Node</label>
                <select className="w-full bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-cyan-500/50">
                  <option className="bg-slate-900">Primary Cluster - Mundra Hub (Active)</option>
                  <option className="bg-slate-900">Backup Cluster - Nhava Sheva (Standby)</option>
                  <option className="bg-slate-900">Local Cache Node</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Data Sync Frequency</label>
                <select className="w-full bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-cyan-500/50">
                  <option className="bg-slate-900">Real-time HMR Sync</option>
                  <option className="bg-slate-900">Every 5 Minutes</option>
                  <option className="bg-slate-900">Hourly Batch</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* AI Prediction Settings */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card border border-white/8 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Cpu size={16} />
              </div>
              <h3 className="font-semibold text-foreground">Prediction Engine</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Forecast Sensitivity</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  defaultValue="75"
                  className="w-full h-1 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                  <span>Conservative</span>
                  <span>Optimal (75%)</span>
                  <span>Aggressive</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">LME Auto-Hedging Limit (USD)</label>
                <input
                  type="text"
                  defaultValue="$8,450"
                  className="w-full bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          </motion.div>

          {/* Security & Access */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card border border-white/8 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <h3 className="font-semibold text-foreground">Security & Access</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Multi-Factor Authentication</p>
                  <p className="text-[10px] text-muted-foreground">Require OTP check on dispatch gate-pass</p>
                </div>
                <div className="w-9 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded-full p-0.5 cursor-pointer flex items-center justify-end">
                  <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">Audit Log Trail</p>
                  <p className="text-[10px] text-muted-foreground">Keep complete rolling and cutting logs for 365 days</p>
                </div>
                <div className="w-9 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded-full p-0.5 cursor-pointer flex items-center justify-end">
                  <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interface settings */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card border border-white/8 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Sliders size={16} />
                </div>
                <h3 className="font-semibold text-foreground">User Preferences</h3>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Dark Glassmorphism UI</p>
                    <p className="text-[10px] text-muted-foreground">High contrast industrial glow</p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">ENABLED</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Automated System Alerts</p>
                    <p className="text-[10px] text-muted-foreground">Highlight low stocks automatically</p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">ENABLED</span>
                </div>
              </div>
            </div>

            <button className="flex items-center justify-center gap-1.5 w-full bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 text-cyan-600 dark:text-cyan-400 rounded-xl py-2 text-xs font-semibold transition-all mt-4">
              <Save size={13} />
              Save Configurations
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
