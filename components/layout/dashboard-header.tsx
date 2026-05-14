"use client";

import { motion } from "framer-motion";
import { Bell, Search, Settings, ChevronDown, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  return (
    <motion.header
      id="dashboard-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex h-16 items-center justify-between px-6",
        "border-b border-white/8 glass-card",
        "flex-shrink-0 sticky top-0 z-20"
      )}
    >
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors"
          onClick={() => window.dispatchEvent(new Event("toggle-mobile-sidebar"))}
          aria-label="Toggle mobile menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          id="header-search"
          className={cn(
            "hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl",
            "bg-white/5 border border-white/10",
            "text-muted-foreground text-sm cursor-pointer",
            "hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all duration-200",
            "w-48"
          )}
        >
          <Search size={14} />
          <span className="text-xs">Search... ⌘K</span>
        </div>

        {/* Notifications */}
        <button
          id="notifications-btn"
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-xl",
            "bg-white/5 border border-white/10",
            "hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all duration-200",
            "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User pill */}
        <button
          id="user-menu-btn"
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-xl",
            "bg-white/5 border border-white/10",
            "hover:border-cyan-400/30 transition-all duration-200",
            "text-sm text-foreground"
          )}
        >
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600" />
          <span className="hidden sm:block text-xs font-medium">Rajesh K.</span>
          <ChevronDown size={12} className="text-muted-foreground" />
        </button>
      </div>
    </motion.header>
  );
}
