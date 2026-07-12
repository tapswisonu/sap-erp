"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, Ship, Archive, Calendar, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableActions } from "@/components/ui/table-actions";
import { Select } from "@/components/ui/select";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { nominationKpis, nominationTrend } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const statusClasses: Record<string, string> = {
  Approved: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20",
  Pending: "text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20",
  Rejected: "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20",
};

const nominationSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().min(1, "Customer Name is required"),
  type: z.string().min(1, "Type is required"),
  poNumber: z.string().min(1, "PO Number is required"),
  weight: z.coerce.number().min(0),
  inrValue: z.coerce.number().min(0),
  status: z.string().min(1, "Status is required"),
  incoterm: z.string().min(1, "Incoterm is required"),
  port: z.string().min(1, "Port is required"),
  qty: z.coerce.number().min(0),
  barsOrContainer: z.string().min(1, "Bars / Container is required"),
  rate: z.coerce.number().min(0),
  poAmount: z.coerce.number().min(0)
});

type NominationFormValues = z.infer<typeof nominationSchema>;

export default function NominationDetailsPage() {
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [activeRecord, setActiveRecord] = useState<NominationFormValues | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const form = useForm<NominationFormValues>({
    resolver: zodResolver(nominationSchema) as any,
    defaultValues: {
      customerName: "", type: "Export", poNumber: "", weight: 0,
      inrValue: 0, status: "Pending", incoterm: "", port: "",
      qty: 0, barsOrContainer: "", rate: 0, poAmount: 0
    }
  });

  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['nomination-details'],
    queryFn: async () => {
      const res = await fetch('/api/nomination-details');
      if (!res.ok) throw new Error("Failed to fetch nomination details");
      return res.json();
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: NominationFormValues) => {
      const isNew = !data.id;
      const payload = {
        ...data,
        id: isNew ? `NOM-${Math.floor(Math.random() * 10000)}` : data.id,
      };
      const res = await fetch('/api/nomination-details', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nomination-details'] });
      toast.success(activeRecord ? "Nomination updated successfully" : "Nomination created successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to save nomination")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/nomination-details?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nomination-details'] });
      toast.success("Nomination deleted successfully");
      setIsConfirmDeleteOpen(false);
    },
    onError: () => toast.error("Failed to delete nomination")
  });

  const handleAdd = () => {
    setActiveRecord(null);
    form.reset({
      customerName: "", type: "Export", poNumber: "", weight: 0,
      inrValue: 0, status: "Pending", incoterm: "", port: "",
      qty: 0, barsOrContainer: "", rate: 0, poAmount: 0
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
      accessorKey: "poNumber",
      header: "PO Number",
      cell: ({ row }) => <span className="font-mono text-xs font-semibold text-foreground whitespace-nowrap">{row.original.poNumber}</span>,
    },
    {
      accessorKey: "weight",
      header: "Weight (T)",
      cell: ({ row }) => <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-600 dark:text-cyan-400 whitespace-nowrap">{row.original.weight} T</span>,
    },
    {
      accessorKey: "inrValue",
      header: "INR Value",
      cell: ({ row }) => <span className="font-mono text-muted-foreground whitespace-nowrap">₹{row.original.inrValue?.toLocaleString()}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap", statusClasses[row.original.status])}>
          {row.original.status}
        </span>
      ),
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
      <DashboardHeader title="Nomination & Allocation Management" subtitle="Approve allocations, track designated containers, and monitor export weight parameters" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <section id="nomination-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nominationKpis.map((kpi, idx) => (
              <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} change={kpi.change} changeType={kpi.up ? "increase" : "decrease"} color={kpi.color as any} icon={ClipboardCheck} index={idx} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl p-5 lg:col-span-2 shadow-sm bg-white dark:bg-[#0a0a0a]">
            <h3 className="text-sm font-semibold text-foreground mb-4">Nomination Trend (Approval vs Rejected)</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nominationTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={11} />
                  <YAxis stroke="var(--chart-axis)" fontSize={11} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }} labelStyle={{ color: "var(--tooltip-label)", fontSize: "12px", marginBottom: "4px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="approved" fill="#10b981" name="Approved Nominations" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending Nominations" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-sm bg-white dark:bg-[#0a0a0a]">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Container Yard Allocation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Ship size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Terminal Yard Section A</p>
                    <p className="text-[10px] text-muted-foreground">3 export containers awaiting customs clearance seal.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <Archive size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Heavy Steel Bars Lot 4</p>
                    <p className="text-[10px] text-muted-foreground">Assigned to Rohan Steel PO-2026-8801.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Booking Window</p>
                    <p className="text-[10px] text-muted-foreground">Next vessel arrival: May 26 Terminal 2 Mundra.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-200 dark:border-white/5 mt-4 text-[10px] text-muted-foreground font-semibold">
              Allocation priority: High-volume exports active
            </div>
          </div>
        </section>

        <section className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm relative z-10 bg-white dark:bg-[#0a0a0a]">
          <div className="p-5 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Customer Nominations Ledger</h3>
              <p className="text-xs text-muted-foreground mt-1">Allocation authorization parameters and PO balances</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-900/20">
                <Plus size={16} /> New Nomination
              </button>
            </div>
          </div>
          <DataTable columns={columns} data={records} isLoading={isLoading} onRefresh={refetch} exportFilename="Nominations_Export" searchPlaceholder="Search nominations..." />
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
                  {activeRecord ? "Edit Nomination" : "Add Nomination"}
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
                    <label className="text-xs font-semibold text-muted-foreground">Status</label>
                    <Select 
                      value={form.watch("status")} 
                      onChange={val => form.setValue("status", val)} 
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Approved", value: "Approved" },
                        { label: "Rejected", value: "Rejected" }
                      ]}
                    />
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
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">PO Number</label>
                    <input {...form.register("poNumber")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
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
                    <label className="text-xs font-semibold text-muted-foreground">Weight (T)</label>
                    <input {...form.register("weight")} type="number" step="0.1" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Quantity</label>
                    <input {...form.register("qty")} type="number" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Bars / Container Detail</label>
                    <input {...form.register("barsOrContainer")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Rate ($)</label>
                    <input {...form.register("rate")} type="number" step="0.01" onChange={(e) => {
                      const rate = parseFloat(e.target.value) || 0;
                      const qty = form.getValues("qty") || 0;
                      const poAmount = rate * qty;
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
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
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
                  <h2 className="text-lg font-bold text-foreground">Nomination Details</h2>
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
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Status</p>
                    <span className={cn("inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-1", statusClasses[activeRecord.status])}>
                      {activeRecord.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Type</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.type}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">PO Number</p>
                    <p className="text-sm font-mono text-foreground">{activeRecord.poNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Weight</p>
                    <p className="text-sm font-mono font-bold text-cyan-500">{activeRecord.weight} T</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Qty</p>
                    <p className="text-sm font-mono text-foreground">{activeRecord.qty}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Incoterm</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.incoterm}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Port</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.port}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Bars / Container</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.barsOrContainer}</p>
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
