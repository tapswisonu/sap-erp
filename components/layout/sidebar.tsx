"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Database,
  Zap,
  Warehouse,
  Layers,
  Truck,
  ClipboardCheck,
  CalendarRange,
  FileText,
  BarChart3,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Factory,
} from "lucide-react";

const navItems = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, id: "nav-dashboard" },
      { href: "/dashboard/data", label: "Data", icon: Database, id: "nav-data" },
    ],
  },
  {
    group: "Materials",
    items: [
      { href: "/dashboard/copper-details", label: "Copper Details", icon: Zap, id: "nav-copper-details" },
      { href: "/dashboard/vendor-stock", label: "Vendor Stock", icon: Warehouse, id: "nav-vendor-stock" },
      { href: "/dashboard/steel-details", label: "Steel Details", icon: Layers, id: "nav-steel-details" },
    ],
  },
  {
    group: "Operations",
    items: [
      { href: "/dashboard/dispatch-details", label: "Dispatch Details", icon: Truck, id: "nav-dispatch-details" },
      { href: "/dashboard/nomination-details", label: "Nomination Details", icon: ClipboardCheck, id: "nav-nomination-details" },
      { href: "/dashboard/month-plan", label: "Month Plan", icon: CalendarRange, id: "nav-month-plan" },
    ],
  },
  {
    group: "Analysis & Settings",
    items: [
      { href: "/dashboard/reports", label: "Reports", icon: FileText, id: "nav-reports" },
      { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, id: "nav-analytics" },
      { href: "/dashboard/settings", label: "Settings", icon: Settings, id: "nav-settings" },
    ],
  },
];

function SidebarContent({ collapsed, pathname, setCollapsed }: { collapsed: boolean, pathname: string, setCollapsed: (val: boolean) => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-white/8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Factory size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p
                  className="text-sm font-bold text-foreground whitespace-nowrap"
                  style={{ letterSpacing: "-0.03em", lineHeight: 1.2 }}
                >
                  ForgeAxis
                </p>
                <p
                  className="text-[10px] text-muted-foreground whitespace-nowrap font-mono"
                  style={{ letterSpacing: "0.04em" }}
                >
                  ERP Platform v2.4
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const IconComponent = item.icon;

                return (
                  <Link key={item.href} href={item.href} id={item.id}>
                    <motion.div
                      whileHover={{ x: collapsed ? 0 : 3 }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                        "group relative",
                        isActive
                          ? "bg-cyan-400/10 text-cyan-400 font-medium sidebar-active"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <IconComponent
                        size={18}
                        className={cn(
                          "flex-shrink-0 transition-colors",
                          isActive ? "text-cyan-400" : "group-hover:text-foreground"
                        )}
                      />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Tooltip for collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl">
                          {item.label}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-white/8 p-3 flex-shrink-0">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2",
            "hover:bg-white/5 transition-colors cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <div className="relative flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-xs font-bold text-white">RK</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background status-online" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 overflow-hidden min-w-0"
              >
                <p className="text-sm font-medium text-foreground whitespace-nowrap">
                  Rajesh Kumar
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  Admin
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle (Desktop only) */}
      <button
        id="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "hidden md:flex absolute -right-3.5 top-20 z-10",
          "h-7 w-7 items-center justify-center rounded-full",
          "bg-slate-800 border border-white/10",
          "text-muted-foreground hover:text-foreground hover:border-cyan-400/30",
          "transition-all duration-200 shadow-lg"
        )}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        id="sidebar-desktop"
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "relative hidden md:flex flex-col h-screen flex-shrink-0",
          "glass-card border-r border-white/8",
          "overflow-visible" // Make overflow visible so the toggle button isn't clipped
        )}
      >
        <SidebarContent collapsed={collapsed} pathname={pathname} setCollapsed={setCollapsed} />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 z-50 flex flex-col h-screen w-[260px] glass-card border-r border-white/8 bg-background md:hidden"
            >
              <SidebarContent collapsed={false} pathname={pathname} setCollapsed={setCollapsed} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
