"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Search, Menu, RefreshCw, Download, ChevronRight, LogOut, User, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/use-store";
import { format } from "date-fns";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const setGlobalSearchOpen = useStore((state) => state.setGlobalSearchOpen);
  const [time, setTime] = useState<Date | null>(null);
  
  // For Profile Dropdown
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate breadcrumbs from pathname
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    return { href, label };
  });

  return (
    <motion.header
      id="dashboard-header"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex h-16 items-center justify-between px-6",
        "border-b border-gray-200 dark:border-white/8 glass-card bg-white dark:bg-white dark:bg-[#0a0a0a]",
        "flex-shrink-0 sticky top-0 z-20 backdrop-blur-md"
      )}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-foreground hover:bg-gray-200 dark:hover:bg-gray-100 dark:bg-white/10 transition-colors"
          onClick={() => window.dispatchEvent(new Event("toggle-mobile-sidebar"))}
          aria-label="Toggle mobile menu"
        >
          <Menu size={18} />
        </button>
        
        <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={14} className="text-muted-foreground" />}
              <span className={cn(
                "transition-colors",
                index === breadcrumbs.length - 1 
                  ? "text-foreground font-bold" 
                  : "text-muted-foreground hover:text-foreground cursor-pointer"
              )}>
                {crumb.label}
              </span>
            </div>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Clock */}
        {time && (
          <div className="hidden lg:flex items-center text-xs font-mono text-muted-foreground mr-2 bg-gray-100 dark:bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-200 dark:border-white/5">
            {format(time, "MMM dd, yyyy HH:mm:ss")}
          </div>
        )}

        {/* Global Search */}
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className={cn(
            "hidden sm:flex items-center justify-between gap-2 px-3 py-2 rounded-xl",
            "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10",
            "text-muted-foreground text-sm cursor-pointer",
            "hover:border-cyan-400/30 hover:bg-cyan-50 dark:hover:bg-cyan-400/5 transition-all duration-200",
            "w-48"
          )}
        >
          <div className="flex items-center gap-2">
            <Search size={14} />
            <span className="text-xs">Search...</span>
          </div>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-300 dark:border-gray-200 dark:border-white/10 bg-white dark:bg-gray-50 dark:bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          className="sm:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-muted-foreground hover:text-foreground"
          onClick={() => setGlobalSearchOpen(true)}
        >
          <Search size={16} />
        </button>

        {/* Export Action */}
        <button
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-cyan-400/30 hover:bg-cyan-50 dark:hover:bg-cyan-400/5 transition-all duration-200 text-muted-foreground hover:text-foreground"
          title="Export Data"
        >
          <Download size={16} />
        </button>

        {/* Refresh Action */}
        <button
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-cyan-400/30 hover:bg-cyan-50 dark:hover:bg-cyan-400/5 transition-all duration-200 text-muted-foreground hover:text-foreground"
          title="Refresh Data"
        >
          <RefreshCw size={16} />
        </button>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-100 dark:bg-white/10 mx-1 hidden sm:block" />

        {/* Notifications */}
        <button
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-xl",
            "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10",
            "hover:border-cyan-400/30 hover:bg-cyan-50 dark:hover:bg-cyan-400/5 transition-all duration-200",
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

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl",
              "bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10",
              "hover:border-cyan-400/30 hover:bg-gray-200 dark:hover:bg-gray-100 dark:bg-white/10 transition-all duration-200",
              "text-sm text-foreground cursor-pointer"
            )}
          >
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0" />
            <span className="hidden sm:block text-xs font-medium">Rajesh K.</span>
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden z-50 py-1">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-200 dark:border-white/10 mb-1">
                  <p className="text-sm font-medium">Rajesh K.</p>
                  <p className="text-xs text-muted-foreground">rajesh@forgeaxis.com</p>
                </div>
                <button 
                  onClick={() => { setProfileOpen(false); router.push('/dashboard/profile'); }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-50 dark:bg-white/5"
                >
                  <User size={14} /> Profile
                </button>
                <button 
                  onClick={() => { setProfileOpen(false); router.push('/dashboard/settings'); }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-50 dark:bg-white/5"
                >
                  <Settings size={14} /> Settings
                </button>
                <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    sessionStorage.removeItem('isLoggedIn');
                    router.push('/login');
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
