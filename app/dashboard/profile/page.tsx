"use client";

import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Shield, Key, Bell, Moon, Smartphone, CheckCircle, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full pb-10">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Profile & Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your personal information and security preferences.</p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - User Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card border border-gray-200 dark:border-white/8 rounded-3xl overflow-hidden shadow-sm bg-white dark:bg-background"
          >
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>

            {/* Avatar & Details */}
            <div className="px-6 pb-6 pt-0 text-center relative -top-12">
              <div className="mx-auto w-24 h-24 rounded-full border-4 border-white dark:border-[#0a0a0a] bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl flex items-center justify-center relative overflow-hidden group">
                <span className="text-3xl font-bold text-white relative z-10">RK</span>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                  <Plus className="text-white" size={24} />
                </div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">Rajesh Kumar</h2>
              <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400 mt-1 uppercase tracking-wider">System Administrator</p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail size={16} className="text-gray-400 dark:text-white/40" />
                  <span>admin@test.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone size={16} className="text-gray-400 dark:text-white/40" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin size={16} className="text-gray-400 dark:text-white/40" />
                  <span>Mumbai, India HQ</span>
                </div>
              </div>

              <button className="w-full mt-6 px-4 py-2.5 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium text-sm rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                Edit Profile
              </button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card border border-gray-200 dark:border-white/8 rounded-3xl p-6 shadow-sm bg-white dark:bg-background"
          >
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Account Activity</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Login</span>
                <span className="text-sm font-medium text-foreground">Today, 09:42 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Session Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Devices</span>
                <span className="text-sm font-medium text-foreground">2 (MacBook, iPhone)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-2 space-y-6">

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card border border-gray-200 dark:border-white/8 rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-background"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                <Shield size={20} />
              </div>
              <h2 className="text-lg font-bold text-foreground">Security Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Change Password */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Key size={14} className="text-muted-foreground" />
                    Account Password
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Last changed 45 days ago. We recommend updating it regularly.</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors whitespace-nowrap text-foreground">
                  Update Password
                </button>
              </div>

              {/* 2FA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Smartphone size={14} className="text-muted-foreground" />
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                    <CheckCircle size={14} /> Enabled
                  </span>
                  <button className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-foreground">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card border border-gray-200 dark:border-white/8 rounded-3xl p-6 md:p-8 shadow-sm bg-white dark:bg-background"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
                <Settings size={20} />
              </div>
              <h2 className="text-lg font-bold text-foreground">App Preferences</h2>
            </div>

            <div className="space-y-6">
              {/* Theme */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Moon size={14} className="text-muted-foreground" />
                    Appearance & Theme
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Toggle between light and dark mode interfaces.</p>
                </div>
                <div className="transform scale-110">
                  <ThemeToggle />
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <div>
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Bell size={14} className="text-muted-foreground" />
                    Email Notifications
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">Receive daily reports and urgent stock alerts via email.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
              <button className="px-6 py-2.5 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-opacity text-sm shadow-sm">
                Save Preferences
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
