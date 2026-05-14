"use client";

import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  BarChart3,
  Zap,
  TrendingUp,
  Activity,
  Shield,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "feat-inventory",
    icon: Package,
    title: "Smart Inventory",
    description:
      "Real-time stock tracking with automated alerts, FIFO/LIFO management, and multi-warehouse support.",
    color: "cyan",
    gradient: "from-cyan-500/10 to-transparent",
    border: "border-cyan-400/20 hover:border-cyan-400/40",
  },
  {
    id: "feat-purchase",
    icon: ShoppingBag,
    title: "Purchase Management",
    description:
      "Streamlined procurement with vendor management, PO automation, and approval workflows.",
    color: "blue",
    gradient: "from-blue-500/10 to-transparent",
    border: "border-blue-400/20 hover:border-blue-400/40",
  },
  {
    id: "feat-sales",
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Deep sales insights with channel breakdown, forecasting, and customer performance metrics.",
    color: "emerald",
    gradient: "from-emerald-500/10 to-transparent",
    border: "border-emerald-400/20 hover:border-emerald-400/40",
  },
  {
    id: "feat-copper",
    icon: Zap,
    title: "Raw Material Tracking",
    description:
      "Monitor copper and other raw materials with consumption tracking and reorder point automation.",
    color: "amber",
    gradient: "from-amber-500/10 to-transparent",
    border: "border-amber-400/20 hover:border-amber-400/40",
  },
  {
    id: "feat-revenue",
    icon: TrendingUp,
    title: "Revenue Optimization",
    description:
      "AI-powered revenue analytics with profit margin tracking and cost reduction recommendations.",
    color: "purple",
    gradient: "from-purple-500/10 to-transparent",
    border: "border-purple-400/20 hover:border-purple-400/40",
  },
  {
    id: "feat-production",
    icon: Cpu,
    title: "Production Monitoring",
    description:
      "Live production floor metrics, OEE tracking, and shift performance dashboards.",
    color: "pink",
    gradient: "from-pink-500/10 to-transparent",
    border: "border-pink-400/20 hover:border-pink-400/40",
  },
  {
    id: "feat-analytics",
    icon: Activity,
    title: "Real-Time Analytics",
    description:
      "Live dashboards with drill-down reports, KPI monitoring, and customizable data views.",
    color: "cyan",
    gradient: "from-cyan-500/10 to-transparent",
    border: "border-cyan-400/20 hover:border-cyan-400/40",
  },
  {
    id: "feat-security",
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Role-based access control, audit logs, data encryption, and compliance reporting.",
    color: "emerald",
    gradient: "from-emerald-500/10 to-transparent",
    border: "border-emerald-400/20 hover:border-emerald-400/40",
  },
];

const colorMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-400/10",
  blue: "text-blue-400 bg-blue-400/10",
  emerald: "text-emerald-400 bg-emerald-400/10",
  amber: "text-amber-400 bg-amber-400/10",
  purple: "text-purple-400 bg-purple-400/10",
  pink: "text-pink-400 bg-pink-400/10",
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/20 bg-blue-400/5 text-blue-400 text-xs font-medium mb-6"
          >
            Platform Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-foreground mb-4"
          >
            Everything Your Factory Needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            A comprehensive suite of manufacturing management tools designed
            to optimize every aspect of your production and business operations.
          </motion.p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                id={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                className={cn(
                  "glass-card rounded-2xl p-5 border transition-all duration-300",
                  "bg-gradient-to-br",
                  feature.gradient,
                  feature.border,
                  "group cursor-default"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl mb-4",
                    "transition-transform duration-300 group-hover:scale-110",
                    colorMap[feature.color]
                  )}
                >
                  <IconComponent size={20} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
