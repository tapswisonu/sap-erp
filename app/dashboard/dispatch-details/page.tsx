"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2, MapPin, CheckCircle, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableActions } from "@/components/ui/table-actions";
import { Select } from "@/components/ui/select";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { dispatchKpis, dispatchTrend } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import { useQuery, useMutation, useQueryClient , keepPreviousData } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

const statusClasses: Record<string, string> = {
  Delivered: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20",
  "In-Transit": "text-blue-500 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20",
  Pending: "text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20",
};

const dispatchSchema = z.object({
  id: z.string().optional(),
  date: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Date is required"),
  vendorName: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Vendor Name is required"),
  to: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Destination is required"),
  type: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Type is required"),
  sectionSize: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Section Size is required"),
  customerName: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Customer Name is required"),
  noOfBars: z.coerce.number().min(0),
  invoiceNumber: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Invoice Number is required"),
  weight: z.coerce.number().min(0),
  status: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Status is required"),
});
type DispatchFormValues = z.infer<typeof dispatchSchema>;

export default function DispatchDetailsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"All" | "Domestic" | "Export">("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [activeRecord, setActiveRecord] = useState<DispatchFormValues | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const form = useForm<DispatchFormValues>({
    resolver: zodResolver(dispatchSchema) as any,
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      vendorName: "", to: "", type: "Domestic",
      sectionSize: "", customerName: "", noOfBars: 0,
      invoiceNumber: "", weight: 0, status: "Pending"
    }
  });

  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['dispatch-details'],
    queryFn: async () => {
      const res = await fetch('/api/dispatch-details');
      if (!res.ok) throw new Error("Failed to fetch dispatch data");
      return res.json();
    },
    placeholderData: keepPreviousData
  });

  const saveMutation = useMutation({
    mutationFn: async (data: DispatchFormValues) => {
      const isNew = !data.id;
      const payload = {
        ...data,
        id: isNew ? `DISP-${Math.floor(Math.random() * 10000)}` : data.id,
      };
      const res = await fetch('/api/dispatch-details', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save record");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-details'] });
      toast.success(activeRecord ? "Record updated successfully" : "Record created successfully");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Failed to save record")
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/dispatch-details?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete record");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatch-details'] });
      toast.success("Record deleted successfully");
      setIsConfirmDeleteOpen(false);
    },
    onError: () => toast.error("Failed to delete record")
  });

  const filteredData = records.filter((item: any) => {
    if (activeTab === "All") return true;
    return item.type === activeTab;
  });

  const handleAdd = () => {
    setActiveRecord(null);
    form.reset({
      date: new Date().toISOString().split("T")[0],
      vendorName: "", to: "", type: "Domestic",
      sectionSize: "", customerName: "", noOfBars: 0,
      invoiceNumber: "", weight: 0, status: "Pending"
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
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <span className="text-muted-foreground whitespace-nowrap">{row.original.date}</span>,
    },
    {
      accessorKey: "vendorName",
      header: "Vendor Name",
      cell: ({ row }) => <span className="font-semibold text-foreground whitespace-nowrap">{row.original.vendorName}</span>,
    },
    {
      accessorKey: "to",
      header: "To",
      cell: ({ row }) => <span className="text-foreground font-medium whitespace-nowrap">{row.original.to}</span>,
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ row }) => <span className="font-semibold text-foreground whitespace-nowrap">{row.original.customerName}</span>,
    },
    {
      accessorKey: "weight",
      header: "Weight (T)",
      cell: ({ row }) => <span className="font-bold text-cyan-600 dark:text-cyan-600 dark:text-cyan-400 font-mono whitespace-nowrap">{row.original.weight} T</span>,
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
      <DashboardHeader title="Shipment & Dispatch Management" subtitle="Manage logistics routes, domestic and export customs gates, and transport manifests" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <section id="dispatch-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dispatchKpis.map((kpi, idx) => (
              <KpiCard key={kpi.label} title={kpi.label} value={kpi.value} change={kpi.change} changeType={kpi.up ? "increase" : "decrease"} color={kpi.color as any} icon={Truck} index={idx} />
            ))}
          </div>
        </section>
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
           <div className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl p-5 lg:col-span-2 shadow-sm bg-white dark:bg-[#0a0a0a]">
             <h3 className="text-sm font-semibold text-foreground mb-4">Shipment Manifest Trends (Weekly)</h3>
             <div className="h-[240px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={dispatchTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorDisp" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                   <XAxis dataKey="week" stroke="var(--chart-axis)" fontSize={11} />
                   <YAxis stroke="var(--chart-axis)" fontSize={11} />
                   <RechartsTooltip contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }} labelStyle={{ color: "var(--tooltip-label)", fontSize: "12px", marginBottom: "4px" }} />
                   <Area type="monotone" dataKey="dispatched" stroke="#10b981" fillOpacity={1} fill="url(#colorDisp)" name="Shipments Dispatched" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>
 
           <div className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-sm bg-white dark:bg-[#0a0a0a]">
             <div>
               <h3 className="text-sm font-semibold text-foreground mb-4">Export Gateway Tracker</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-200 dark:border-white/5 pb-2">
                   <div className="flex items-center gap-2">
                     <MapPin size={13} className="text-cyan-500" />
                     <span className="text-xs text-foreground font-semibold">Mundra Port Terminal</span>
                   </div>
                   <span className="text-xs font-mono font-bold text-emerald-500">GATE OPEN</span>
                 </div>
                 <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-200 dark:border-white/5 pb-2">
                   <div className="flex items-center gap-2">
                     <MapPin size={13} className="text-cyan-500" />
                     <span className="text-xs text-foreground font-semibold">Nhava Sheva Terminal</span>
                   </div>
                   <span className="text-xs font-mono font-bold text-emerald-500">GATE OPEN</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <MapPin size={13} className="text-cyan-500" />
                     <span className="text-xs text-foreground font-semibold">Kandla Customs Gate</span>
                   </div>
                   <span className="text-xs font-mono font-bold text-amber-500 font-medium">HOLD (2H)</span>
                 </div>
               </div>
             </div>
             <div className="pt-4 border-t border-gray-100 dark:border-gray-200 dark:border-white/5 mt-4">
               <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Dispatch Quality Index</p>
               <div className="flex items-center gap-2 mt-1">
                 <CheckCircle size={14} className="text-emerald-500" />
                 <span className="text-sm font-bold text-foreground">99.4% Delivery Accuracy</span>
               </div>
             </div>
           </div>
        </section>

        <section className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-sm relative z-10 bg-white dark:bg-[#0a0a0a]">
          <div className="p-5 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">Active Dispatch Ledger</h3>
              <p className="text-xs text-muted-foreground mt-1">Detailed logs of gate-pass outputs and invoice weights</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 dark:bg-gray-50 dark:bg-white/5 p-0.5 rounded-lg border border-gray-200 dark:border-white/10">
                {(["All", "Domestic", "Export"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                      activeTab === tab
                        ? "bg-white dark:bg-cyan-500/20 text-blue-600 dark:text-cyan-600 dark:text-cyan-400 shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-blue-900/20">
                <Plus size={16} /> Add Record
              </button>
            </div>
          </div>
          <DataTable columns={columns} data={filteredData} isLoading={isLoading} onRefresh={refetch} exportFilename="Dispatch_Export" searchPlaceholder="Search dispatch..." />
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
                  {activeRecord ? "Edit Dispatch Record" : "Add Dispatch Record"}
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
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Date</label>
                    <input {...form.register("date")} type="date" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                    {form.formState.errors.date && <span className="text-[10px] text-red-500">{form.formState.errors.date.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Status</label>
                    <Select 
                      value={form.watch("status")} 
                      onChange={val => form.setValue("status", val)} 
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "In-Transit", value: "In-Transit" },
                        { label: "Delivered", value: "Delivered" }
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Vendor Name</label>
                    <input {...form.register("vendorName")} type="text" placeholder="e.g. Hindustan Copper" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                    {form.formState.errors.vendorName && <span className="text-[10px] text-red-500">{form.formState.errors.vendorName.message}</span>}
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
                    <input {...form.register("customerName")} type="text" placeholder="e.g. Rohan Steel Corp" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground">To (Destination)</label>
                    <input {...form.register("to")} type="text" placeholder="e.g. Nhava Sheva" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <label className="text-xs font-semibold text-muted-foreground">Section Size</label>
                    <input {...form.register("sectionSize")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">No. of Bars</label>
                    <input {...form.register("noOfBars")} type="number" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Weight (T)</label>
                    <input {...form.register("weight")} type="number" step="0.01" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Invoice Number</label>
                  <input {...form.register("invoiceNumber")} type="text" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
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
                  <h2 className="text-lg font-bold text-foreground">Dispatch Details</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{activeRecord.id}</p>
                </div>
                <button onClick={() => setIsViewOpen(false)} className="p-2 hover:bg-gray-100 dark:bg-white/10 rounded-full transition-colors">
                  <X size={16} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Date</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.date}</p>
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
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Section Size</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.sectionSize}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Vendor Name</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.vendorName}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Customer Name</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.customerName}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">To (Destination)</p>
                    <p className="text-sm font-medium text-foreground">{activeRecord.to}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">No. of Bars</p>
                    <p className="text-sm font-mono text-foreground">{activeRecord.noOfBars}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Weight</p>
                    <p className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">{activeRecord.weight} T</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Invoice Number</p>
                    <p className="text-sm font-mono text-foreground">{activeRecord.invoiceNumber}</p>
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
