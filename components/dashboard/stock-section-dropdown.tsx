"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  Package,
  ChevronDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Layers,
} from "lucide-react";

// ── Material definitions ─────────────────────────────────────────────
const MATERIALS = [
  {
    id: "copper",
    label: "Copper",
    icon: Zap,
    color: "amber",
    value: "4,820",
    unit: "kg",
    status: "low" as const,
    percentage: 34,
    trend: "-8.1%",
    alerts: 3,
    capacity: "14,000 kg",
    grade: "Grade A",
    location: "Warehouse B-2",
    lastUpdated: "Today, 10:30 AM",
    minThreshold: "6,000 kg",
    description: "Primary winding material",
  },
  {
    id: "steel",
    label: "Steel",
    icon: Layers,
    color: "blue",
    value: "8,200",
    unit: "kg",
    status: "optimal" as const,
    percentage: 68,
    trend: "+3.4%",
    alerts: 0,
    capacity: "12,000 kg",
    grade: "3mm Sheet",
    location: "Warehouse A-1",
    lastUpdated: "Today, 09:15 AM",
    minThreshold: "3,000 kg",
    description: "Structural & casing material",
  },
] as const;

type MaterialId = (typeof MATERIALS)[number]["id"];

// ── Color maps ───────────────────────────────────────────────────────
const colorMap = {
  amber: {
    gradient: "from-amber-500/15 to-transparent",
    border: "border-amber-400/30 hover:border-amber-400/60",
    activeBorder: "border-amber-400/70",
    icon: "bg-amber-400/15 text-amber-400",
    badge: "text-amber-400",
    progress: "bg-amber-400",
    tag: "text-amber-400 bg-amber-400/10",
    glow: "shadow-amber-500/10",
    dot: "bg-amber-400",
    dropdownBg: "from-amber-500/8",
    selectedBg: "bg-amber-400/10 border-amber-400/40",
  },
  blue: {
    gradient: "from-blue-500/15 to-transparent",
    border: "border-blue-400/30 hover:border-blue-400/60",
    activeBorder: "border-blue-400/70",
    icon: "bg-blue-400/15 text-blue-400",
    badge: "text-blue-400",
    progress: "bg-blue-400",
    tag: "text-blue-400 bg-blue-400/10",
    glow: "shadow-blue-500/10",
    dot: "bg-blue-400",
    dropdownBg: "from-blue-500/8",
    selectedBg: "bg-blue-400/10 border-blue-400/40",
  },
};

const statusColors = {
  optimal: "text-emerald-400 bg-emerald-400/10",
  low: "text-amber-400 bg-amber-400/10",
  critical: "text-red-400 bg-red-400/10",
  high: "text-cyan-400 bg-cyan-400/10",
  active: "text-blue-400 bg-blue-400/10",
};

// ── Sub-card ─────────────────────────────────────────────────────────
function MaterialCard({
  material,
  isSelected,
  onClick,
}: {
  material: (typeof MATERIALS)[number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const colors = colorMap[material.color];
  const isPositive = material.trend.startsWith("+");
  const Icon = material.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative overflow-hidden w-full text-left rounded-xl p-4",
        "border transition-all duration-200 cursor-pointer",
        isSelected
          ? colors.selectedBg
          : "border-white/10 bg-white/3 hover:bg-white/5 hover:border-white/20"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", colors.icon)}>
            <Icon size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{material.label}</p>
            <p className="text-[11px] text-muted-foreground">{material.grade}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {material.alerts > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 rounded-full px-1.5 py-0.5">
              <AlertTriangle size={8} />
              {material.alerts}
            </span>
          )}
          <span className={cn("text-[10px] font-medium rounded-full px-1.5 py-0.5", statusColors[material.status])}>
            {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-xl font-bold text-foreground">{material.value}</span>
          <span className="ml-1 text-xs text-muted-foreground">{material.unit}</span>
        </div>
        <span className={cn("flex items-center gap-0.5 text-xs font-medium", isPositive ? "text-emerald-400" : "text-red-400")}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {material.trend}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Capacity</span>
          <span className={colors.badge}>{material.percentage}%</span>
        </div>
        <Progress value={material.percentage} className="h-1" />
      </div>
    </motion.button>
  );
}

// ── Detail panel ─────────────────────────────────────────────────────
function MaterialDetail({ material }: { material: (typeof MATERIALS)[number] }) {
  const colors = colorMap[material.color];
  const isPositive = material.trend.startsWith("+");
  const Icon = material.icon;

  return (
    <motion.div
      key={material.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-5",
        "bg-gradient-to-br",
        colors.dropdownBg,
        colors.activeBorder
      )}
    >
      {/* Gradient overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", colors.gradient)} />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors.icon)}>
              <Icon size={20} />
            </div>
            <div>
              <h4 className="font-bold text-foreground">{material.label} — Detail View</h4>
              <p className="text-xs text-muted-foreground">{material.description}</p>
            </div>
          </div>
          <span className={cn("text-xs font-medium rounded-full px-2 py-0.5", statusColors[material.status])}>
            {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Current Stock", value: `${material.value} ${material.unit}` },
            { label: "Capacity", value: material.capacity },
            { label: "Min Threshold", value: material.minThreshold },
            { label: "Location", value: material.location },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/5 border border-white/8 p-3">
              <p className="text-[10px] text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Progress + trend */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Stock level ({material.percentage}% of capacity)</span>
            <span className={cn("flex items-center gap-0.5 font-medium", isPositive ? "text-emerald-400" : "text-red-400")}>
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {material.trend} this week
            </span>
          </div>
          <Progress value={material.percentage} className="h-2" />
        </div>

        <p className="text-[10px] text-muted-foreground">
          Last updated: {material.lastUpdated}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────
export function StockSectionDropdown({ index = 0 }: { index?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<MaterialId | null>(null);

  const selectedMaterial = MATERIALS.find((m) => m.id === selected) ?? null;

  const handleSelect = (id: MaterialId) => {
    setSelected((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div
      id="workflow-stock"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className="relative overflow-hidden rounded-2xl glass-card border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-60 pointer-events-none" />

      <div className="relative z-10 p-6 space-y-4">
        {/* ── Dropdown trigger ── */}
        <button
          id="stock-dropdown-trigger"
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center justify-between group"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
              <Package size={22} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground">Stock Section Wise</h3>
              <p className="text-xs text-muted-foreground">
                {selected
                  ? `Viewing: ${selectedMaterial?.label}`
                  : "Select a material to view details"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Summary badges */}
            <div className="hidden sm:flex items-center gap-1.5">
              {MATERIALS.map((m) => (
                <span
                  key={m.id}
                  className={cn(
                    "text-[10px] rounded-full px-1.5 py-0.5 font-medium",
                    statusColors[m.status]
                  )}
                >
                  {m.label}
                </span>
              ))}
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-muted-foreground"
            >
              <ChevronDown size={18} />
            </motion.div>
          </div>
        </button>

        {/* ── Total stock summary bar ── */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-3xl font-bold text-foreground">13,020</span>
            <span className="ml-1 text-sm text-muted-foreground">kg total</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Overall Capacity</span>
              <span className="text-cyan-400">50%</span>
            </div>
            <Progress value={50} className="h-1.5" />
          </div>
        </div>

        {/* ── Dropdown panel ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-1 space-y-3 border-t border-white/8">
                {/* Material selector cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {MATERIALS.map((material) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      isSelected={selected === material.id}
                      onClick={() => handleSelect(material.id as MaterialId)}
                    />
                  ))}
                </div>

                {/* Detail panel */}
                <AnimatePresence mode="wait">
                  {selectedMaterial && (
                    <MaterialDetail key={selectedMaterial.id} material={selectedMaterial} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
