"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  LogIn,
  Package,
  BarChart3,
  ShoppingBag,
  TrendingUp,
  FileText,
  Users,
  Settings,
  Activity,
  Boxes,
  Zap,
  Layers,
  Bell,
  Map,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Sitemap tree definition ──────────────────────────────────────────
const siteTree = [
  {
    section: "Authentication",
    color: "purple",
    icon: LogIn,
    pages: [
      {
        href: "/login",
        label: "Login",
        description: "User authentication — User ID & Password",
        icon: LogIn,
      },
    ],
  },
  {
    section: "Overview",
    color: "cyan",
    icon: LayoutDashboard,
    pages: [
      {
        href: "/dashboard",
        label: "Dashboard",
        description: "Main ERP overview with KPIs, charts & activity feed",
        icon: LayoutDashboard,
        children: [
          { label: "KPI Cards", anchor: "#kpi-section" },
          { label: "Stock Section (Dropdown)", anchor: "#stock-section" },
          { label: "Revenue & Sales Analytics", anchor: "#analytics-section" },
          { label: "Transactions & Production", anchor: "#data-section" },
          { label: "Alerts & Activity Timeline", anchor: "#alerts-section" },
        ],
      },
      {
        href: "/dashboard/analytics",
        label: "Analytics",
        description: "Detailed manufacturing analytics & trends",
        icon: Activity,
      },
    ],
  },
  {
    section: "Manufacturing",
    color: "amber",
    icon: Package,
    pages: [
      {
        href: "/dashboard/inventory",
        label: "Inventory",
        description: "Full inventory list, stock levels & categorization",
        icon: Boxes,
      },
      {
        href: "/dashboard/stock",
        label: "Stock Section Wise",
        description: "Section-wise stock with Copper & Steel breakdown",
        icon: Package,
        children: [
          { label: "Copper Stock", anchor: "#copper" },
          { label: "Steel Stock", anchor: "#steel" },
        ],
      },
      {
        href: "/dashboard/purchase",
        label: "Purchase",
        description: "Purchase orders, vendors & procurement tracking",
        icon: ShoppingBag,
      },
      {
        href: "/dashboard/sales",
        label: "Sales",
        description: "Sales orders, invoices & customer management",
        icon: BarChart3,
      },
      {
        href: "/dashboard/copper",
        label: "Copper",
        description: "Copper wire inventory, grades & usage tracking",
        icon: Zap,
      },
    ],
  },
  {
    section: "Finance",
    color: "emerald",
    icon: TrendingUp,
    pages: [
      {
        href: "/dashboard/revenue",
        label: "Revenue",
        description: "Revenue reports, profitability & financial metrics",
        icon: TrendingUp,
      },
      {
        href: "/dashboard/reports",
        label: "Reports",
        description: "Exportable reports — monthly, quarterly, annual",
        icon: FileText,
      },
    ],
  },
  {
    section: "Admin",
    color: "blue",
    icon: Users,
    pages: [
      {
        href: "/dashboard/users",
        label: "Users",
        description: "User management, roles & access control",
        icon: Users,
      },
      {
        href: "/dashboard/settings",
        label: "Settings",
        description: "Platform configuration, integrations & preferences",
        icon: Settings,
      },
    ],
  },
  {
    section: "Utilities",
    color: "slate",
    icon: Map,
    pages: [
      {
        href: "/sitemap",
        label: "Sitemap",
        description: "Visual site map of all pages (this page)",
        icon: Map,
      },
    ],
  },
];

type Color = "purple" | "cyan" | "amber" | "emerald" | "blue" | "slate";

const colorMap: Record<Color, { border: string; icon: string; section: string; badge: string; childDot: string }> = {
  purple: {
    border: "border-purple-400/25 hover:border-purple-400/50",
    icon: "bg-purple-400/10 text-purple-400",
    section: "text-purple-400",
    badge: "bg-purple-400/10 text-purple-400",
    childDot: "bg-purple-400",
  },
  cyan: {
    border: "border-cyan-400/25 hover:border-cyan-400/50",
    icon: "bg-cyan-400/10 text-cyan-400",
    section: "text-cyan-400",
    badge: "bg-cyan-400/10 text-cyan-400",
    childDot: "bg-cyan-400",
  },
  amber: {
    border: "border-amber-400/25 hover:border-amber-400/50",
    icon: "bg-amber-400/10 text-amber-400",
    section: "text-amber-400",
    badge: "bg-amber-400/10 text-amber-400",
    childDot: "bg-amber-400",
  },
  emerald: {
    border: "border-emerald-400/25 hover:border-emerald-400/50",
    icon: "bg-emerald-400/10 text-emerald-400",
    section: "text-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400",
    childDot: "bg-emerald-400",
  },
  blue: {
    border: "border-blue-400/25 hover:border-blue-400/50",
    icon: "bg-blue-400/10 text-blue-400",
    section: "text-blue-400",
    badge: "bg-blue-400/10 text-blue-400",
    childDot: "bg-blue-400",
  },
  slate: {
    border: "border-slate-400/25 hover:border-slate-400/50",
    icon: "bg-slate-400/10 text-slate-300",
    section: "text-slate-300",
    badge: "bg-slate-400/10 text-slate-300",
    childDot: "bg-slate-400",
  },
};

export default function SitemapPage() {
  const totalPages = siteTree.reduce((acc, s) => acc + s.pages.length, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-white/8 glass-card flex-shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground">Site Map</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {totalPages} pages across {siteTree.length} sections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">ForgeAxis ERP</span>
          <div className="h-2 w-2 rounded-full bg-emerald-400 status-online" />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
              <Map size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Site Map</h2>
              <p className="text-sm text-muted-foreground">
                Complete navigation structure of the ForgeAxis ERP platform
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections grid */}
        <div className="space-y-8 pb-10">
          {siteTree.map((section, si) => {
            const colors = colorMap[section.color as Color];
            const SectionIcon = section.icon;

            return (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: si * 0.08 }}
              >
                {/* Section header */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", colors.icon)}>
                    <SectionIcon size={14} />
                  </div>
                  <h3 className={cn("text-xs font-bold uppercase tracking-widest", colors.section)}>
                    {section.section}
                  </h3>
                  <div className="flex-1 h-px bg-white/6" />
                  <span className={cn("text-[10px] font-medium rounded-full px-2 py-0.5", colors.badge)}>
                    {section.pages.length} {section.pages.length === 1 ? "page" : "pages"}
                  </span>
                </div>

                {/* Pages grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.pages.map((page, pi) => {
                    const PageIcon = page.icon;
                    const hasChildren = "children" in page && page.children && page.children.length > 0;

                    return (
                      <motion.div
                        key={page.href}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: si * 0.08 + pi * 0.05 }}
                        whileHover={{ y: -3 }}
                        className={cn(
                          "relative glass-card border rounded-2xl p-5 transition-all duration-200 group",
                          colors.border
                        )}
                      >
                        {/* Page header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", colors.icon)}>
                              <PageIcon size={18} />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground text-sm">{page.label}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">{page.href}</p>
                            </div>
                          </div>
                          <Link
                            href={page.href}
                            className="opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10 transition-all"
                            aria-label={`Go to ${page.label}`}
                          >
                            <ExternalLink size={12} />
                          </Link>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                          {page.description}
                        </p>

                        {/* Children / sub-sections */}
                        {hasChildren && (
                          <div className="space-y-1.5 pt-3 border-t border-white/6">
                            {(page as typeof page & { children: { label: string; anchor: string }[] }).children.map((child) => (
                              <div key={child.label} className="flex items-center gap-2">
                                <ChevronRight size={10} className="text-muted-foreground flex-shrink-0" />
                                <div className={cn("h-1 w-1 rounded-full flex-shrink-0", colors.childDot)} />
                                <span className="text-[11px] text-muted-foreground">{child.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
