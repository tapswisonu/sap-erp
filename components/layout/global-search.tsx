"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, LayoutDashboard, Database, Zap, Warehouse, Layers, Truck, ClipboardCheck, CalendarRange, FileText, BarChart3, Settings } from "lucide-react";
import { useStore } from "@/store/use-store";
import { AnimatePresence, motion } from "framer-motion";

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Main" },
  { href: "/dashboard/data", label: "Data", icon: Database, group: "Main" },
  { href: "/dashboard/copper-details", label: "Copper Details", icon: Zap, group: "Materials" },
  { href: "/dashboard/vendor-stock", label: "Vendor Stock", icon: Warehouse, group: "Materials" },
  { href: "/dashboard/steel-details", label: "Steel Details", icon: Layers, group: "Materials" },
  { href: "/dashboard/dispatch-details", label: "Dispatch Details", icon: Truck, group: "Operations" },
  { href: "/dashboard/nomination-details", label: "Nomination Details", icon: ClipboardCheck, group: "Operations" },
  { href: "/dashboard/month-plan", label: "Month Plan", icon: CalendarRange, group: "Operations" },
  { href: "/dashboard/reports", label: "Reports", icon: FileText, group: "Analysis & Settings" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, group: "Analysis & Settings" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, group: "Analysis & Settings" },
];

export function GlobalSearch() {
  const router = useRouter();
  const open = useStore((state) => state.globalSearchOpen);
  const setOpen = useStore((state) => state.setGlobalSearchOpen);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm p-4 flex items-start justify-center pt-[10vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <Command
            className="w-full h-full flex flex-col"
            shouldFilter={true}
          >
            <div className="flex items-center border-b border-gray-200 dark:border-white/10 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
              <Command.Input 
                autoFocus
                placeholder="Type a command or search..."
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground border-none focus:ring-0 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false);
                }}
              />
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 cmdk-list">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              <Command.Group heading={<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>}>
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Command.Item
                      key={route.href}
                      value={route.label}
                      onSelect={() => {
                        router.push(route.href);
                        setOpen(false);
                      }}
                      className="relative flex cursor-default select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none aria-selected:bg-cyan-500/10 aria-selected:text-cyan-500 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-50 dark:bg-white/5 cursor-pointer text-foreground transition-colors group"
                    >
                      <Icon className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                      <span>{route.label}</span>
                      <span className="ml-auto text-xs text-muted-foreground opacity-60">{route.group}</span>
                    </Command.Item>
                  );
                })}
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
        <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
      </div>
    </AnimatePresence>
  );
}
