"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Target, Activity, DollarSign, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableActions } from "@/components/ui/table-actions";
import { Select } from "@/components/ui/select";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { monthPlanKpis, monthPlanData } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ComposedChart, Line, Bar,
} from "recharts";
import { useQuery, useMutation, useQueryClient , keepPreviousData } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const monthPlanSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Customer Name is required"),
  type: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Type is required"),
  incoterm: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Incoterm is required"),
  port: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Port is required"),
  weightOrBars: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Weight / Bars is required"),
  monthTo: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Destination is required"),
  monthQty: z.coerce.number().min(0),
  monthWeight: z.coerce.number().min(0),
  rate: z.coerce.number().min(0),
  poAmount: z.coerce.number().min(0),
  inrValue: z.coerce.number().min(0),
});
type MonthPlanFormValues = z.infer<typeof monthPlanSchema>;

export default function MonthPlanPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [activeRecord, setActiveRecord] = useState<MonthPlanFormValues | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const form = useForm<MonthPlanFormValues>({
    resolver: zodResolver(monthPlanSchema) as any,
    defaultValues: {
      customerName: "", type: "Export", incoterm: "", port: "",
      weightOrBars: "", rate: 0, poAmount: 0, inrValue: 0,
      monthQty: 0, monthTo: "", monthWeight: 0
    }
  });

  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['month-plan'],
    queryFn: async () => {
      const res = await fetch('/api/month-plan');
      if (!res.ok) throw new Error("Failed to fetch month plan details");
      return res.json();
    },
    placeholderData: keepPreviousData
  });

  const saveMutation = useMutation({
    mutationFn: async (data: MonthPlanFormValues) => {
      const isNew = !data.id;
      const payload = {
        ...data,
        id: isNew ? `MP-${Math.floor(Math.random() * 10000)}` : data.id,
      };
      const res = await fetch('/api/month-plan', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-plan'] });
      toast.success(activeRecord ? "Plan updated successfully" : "Plan created successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to save plan")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/month-plan?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-plan'] });
      toast.success("Plan deleted successfully");
      setIsConfirmDeleteOpen(false);
    },
    onError: () => toast.error("Failed to delete plan")
  });

  const handleAdd = () => {
    setActiveRecord(null);
    form.reset({
      customerName: "", type: "Export", incoterm: "", port: "",
      weightOrBars: "", rate: 0, poAmount: 0, inrValue: 0,
      monthQty: 0, monthTo: "", monthWeight: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setActiveRecord(record);
    form.reset(record);
    setIsModalOpen(true);
  };

  const handleView = (record: any) => {
    setActiveRecord(record);
    setIsViewOpen(true);
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const onSubmit = (data: any) => {
    saveMutation.mutate(data);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ row }) => <span className="font-semibold text-foreground whitespace-nowrap">{row.original.customerName}</span>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-xs font-semibold border whitespace-nowrap",
          row.original.type === "Export" ? "text-cyan-600 bg-cyan-50 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/20" : "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20"
        )}>
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: "monthTo",
      header: "Month To",
      cell: ({ row }) => <span className="font-medium text-foreground whitespace-nowrap">{row.original.monthTo}</span>,
    },
    {
      accessorKey: "monthQty",
      header: "Month Qty",
      cell: ({ row }) => <span className="font-mono font-bold text-cyan-600 dark:text-cyan-600 dark:text-cyan-400 whitespace-nowrap">{row.original.monthQty?.toLocaleString()} units</span>,
    },
    {
      accessorKey: "monthWeight",
      header: "Month Weight",
      cell: ({ row }) => <span className="font-mono font-semibold text-foreground whitespace-nowrap">{row.original.monthWeight} T</span>,
    },
    {
      accessorKey: "poAmount",
      header: "PO Amount",
      cell: ({ row }) => <span className="font-mono font-bold text-foreground whitespace-nowrap">${row.original.poAmount?.toLocaleString()}</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <TableActions 
            onView={() => handleView(row.original)}
            onEdit={() => handleEdit(row.original)}
            onDelete={() => confirmDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader title="Monthly Planning & Forecasting" subtitle="Formulate monthly targets, forecast revenue pipelines, and track production efficiency" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <section id="month-plan-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {monthPlanKpis.map((kpi, idx) => (
              <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} change={kpi.change} changeType={kpi.up ? "increase" : "decrease"} color={kpi.color as any} icon={CalendarRange} index={idx} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl p-5 lg:col-span-2 shadow-sm bg-white dark:bg-[#0a0a0a]">
            <h3 className="text-sm font-semibold text-foreground mb-4">Production Targets vs Actual Achievements</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthPlanData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} />
                  <YAxis stroke="var(--chart-axis)" fontSize={11} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }} labelStyle={{ color: "var(--tooltip-label)", fontSize: "12px", marginBottom: "4px" }} />
                  <Bar dataKey="actual" fill="#a78bfa" name="Actual Units Produced" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={2} name="Target Plan" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-sm bg-white dark:bg-[#0a0a0a]">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">June Planning Schedule</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <Target size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Billet Sizing Signoff</p>
                    <p className="text-[10px] text-muted-foreground">Due June 02. Draft complete.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Activity size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Customs Booking Window</p>
                    <p className="text-[10px] text-muted-foreground">Opens June 08 for Nhava Sheva berths.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">LME Pricing Review</p>
                    <p className="text-[10px] text-muted-foreground">Automatic spot hedge trigger set for $8,400.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-200 dark:border-white/5 mt-4 text-[10px] text-muted-foreground font-semibold">
              Planned target completion score: 96.2%
            </div>
          </div>
        </section>

        <section className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm relative z-10 bg-white dark:bg-[#0a0a0a]">
          <div className="p-5 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Monthly Planning & Forecast Ledger</h3>
              <p className="text-xs text-muted-foreground mt-1">Comprehensive projections for upcoming manufacturing batches</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-900/20">
                <Plus size={16} /> Add Plan
              </button>
            </div>
          </div>
          <DataTable columns={columns} data={records} isLoading={isLoading} onRefresh={refetch} exportFilename="MonthPlan_Export" searchPlaceholder="Search plans..." />
        </section>
      </main>

      {/* CRUD Edit / Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-white/5 z-10">
                <h3 className="text-lg font-bold text-foreground">
                  {activeRecord ? "Edit Month Plan" : "Add Month Plan"}
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-muted-foreground hover:bg-gray-100 dark:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
                    <input {...form.register("customerName")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                    {form.formState.errors.customerName && <span className="text-[10px] text-red-500">{form.formState.errors.customerName.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Type</label>
                    <Select 
                      value={form.watch("type")} 
                      onChange={val => form.setValue("type", val)} 
                      options={[
                        { label: "Domestic", value: "Domestic" },
                        { label: "Export", value: "Export" }
                      ]}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Incoterm</label>
                    <input {...form.register("incoterm")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Port</label>
                    <input {...form.register("port")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Weight / Bars Detail</label>
                    <input {...form.register("weightOrBars")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Month To (Destination)</label>
                    <input {...form.register("monthTo")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Month Qty</label>
                    <input {...form.register("monthQty")} type="number" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Month Weight (T)</label>
                    <input {...form.register("monthWeight")} type="number" step="0.1" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Rate ($)</label>
                    <input {...form.register("rate")} type="number" step="0.01" onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      const monthQty = form.getValues("monthQty") || 0;
                      const poAmount = rate * monthQty;
                      const inrValue = poAmount * 83;
                      form.setValue("rate", rate);
                      form.setValue("poAmount", poAmount);
                      form.setValue("inrValue", inrValue);
                    }} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">PO Amount ($)</label>
                    <input {...form.register("poAmount")} type="number" readOnly className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-white/10 border border-transparent rounded-xl focus:outline-none text-muted-foreground" />
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-200 dark:border-white/5 flex justify-end gap-2 sticky bottom-0 bg-background pb-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-50 dark:bg-white/5 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                    {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                    {activeRecord ? "Save Changes" : "Create Record"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Modal */}
      <AnimatePresence>
        {isConfirmDeleteOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#0a0a0a] border border-red-500/20 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center"
            >
              <div className="h-12 w-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
                <X size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Record</h3>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this plan? This action cannot be undone.</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setIsConfirmDeleteOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:bg-white/10 text-foreground transition-colors">Cancel</button>
                <button 
                  onClick={() => recordToDelete && deleteMutation.mutate(recordToDelete)} 
                  disabled={deleteMutation.isPending} 
                  className="flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors shadow-sm disabled:opacity-70"
                >
                  {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Drawer */}
      <AnimatePresence>
        {isViewOpen && activeRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Month Plan Details</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{activeRecord.id}</p>
                </div>
                <button onClick={() => setIsViewOpen(false)} className="p-2 hover:bg-gray-100 dark:bg-white/10 rounded-full transition-colors">
                  <X size={16} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Customer Name</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Type</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Incoterm</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.incoterm}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Port</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.port}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Weight / Bars</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.weightOrBars}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Month To (Destination)</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.monthTo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Month Qty</p>
                    <p className="text-sm font-mono text-cyan-500 font-bold">{activeRecord.monthQty?.toLocaleString()} units</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Month Weight</p>
                    <p className="text-sm font-mono text-foreground font-bold">{activeRecord.monthWeight} T</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Rate</p>
                    <p className="text-sm font-mono text-foreground">${activeRecord.rate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">PO Amount</p>
                    <p className="text-sm font-mono font-bold text-foreground">${activeRecord.poAmount?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">INR Value</p>
                    <p className="text-sm font-mono font-bold text-foreground">₹{activeRecord.inrValue?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <button 
                  onClick={() => { setIsViewOpen(false); handleEdit(activeRecord); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-sm"
                >
                  Edit Record
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
