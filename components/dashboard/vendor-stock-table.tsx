"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient , keepPreviousData } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TableActions } from "@/components/ui/table-actions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

// --- Schema ---
const vendorSchema = z.object({
  id: z.string().optional(),
  customerName: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Customer Name is required"),
  steelSize: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Steel Size is required"),
  copperSize: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Copper Size is required"),
  steelOpenStock: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Steel Open Stock is required"),
  copperOpenQty: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Copper Open Qty is required"),
  steelQty: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Steel Qty is required"),
  copperQty: z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(1, "Copper Qty is required"),
});
type VendorFormValues = z.infer<typeof vendorSchema>;

export function VendorStockTable() {
  const queryClient = useQueryClient();
  
  // Modals & Drawers State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [activeRecord, setActiveRecord] = useState<VendorFormValues | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      customerName: "", steelSize: "", copperSize: "", 
      steelOpenStock: "", copperOpenQty: "", steelQty: "", copperQty: ""
    }
  });

  // --- Queries & Mutations ---
  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['vendor-stock'],
    queryFn: async () => {
      const res = await fetch('/api/vendor-stock');
      if (!res.ok) throw new Error("Failed to fetch vendor stock");
      return res.json();
    },
    placeholderData: keepPreviousData
  });

  const saveMutation = useMutation({
    mutationFn: async (data: VendorFormValues) => {
      const isNew = !data.id;
      const payload = {
        ...data,
        steelOpenStock: Number(data.steelOpenStock),
        copperOpenQty: Number(data.copperOpenQty),
        steelQty: Number(data.steelQty),
        copperQty: Number(data.copperQty)
      };
      const res = await fetch('/api/vendor-stock', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save record");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-stock'] });
      toast.success(activeRecord ? "Record updated successfully" : "Record created successfully");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to save record");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/vendor-stock?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete record");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-stock'] });
      toast.success("Record deleted successfully");
      setIsConfirmDeleteOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete record");
    }
  });

  // --- Handlers ---
  const handleAdd = () => {
    setActiveRecord(null);
    form.reset({
      customerName: "", steelSize: "", copperSize: "", 
      steelOpenStock: "", copperOpenQty: "", steelQty: "", copperQty: ""
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setActiveRecord(record);
    form.reset({
      ...record,
      steelOpenStock: String(record.steelOpenStock),
      copperOpenQty: String(record.copperOpenQty),
      steelQty: String(record.steelQty),
      copperQty: String(record.copperQty)
    });
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

  const onSubmit = (data: VendorFormValues) => {
    saveMutation.mutate(data);
  };

  // --- Table Columns ---
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ row }) => <span className="font-semibold text-foreground whitespace-nowrap">{row.original.customerName}</span>,
    },
    {
      accessorKey: "steelSize",
      header: "Steel Size",
      cell: ({ row }) => <span className="text-muted-foreground whitespace-nowrap">{row.original.steelSize}</span>,
    },
    {
      accessorKey: "steelOpenStock",
      header: "Steel Open Stock",
      cell: ({ row }) => <span className="font-medium text-foreground whitespace-nowrap">{row.original.steelOpenStock} MT</span>,
    },
    {
      accessorKey: "copperOpenQty",
      header: "Copper Open Qty",
      cell: ({ row }) => <span className="font-medium text-amber-500 whitespace-nowrap">{row.original.copperOpenQty} MT</span>,
    },
    {
      accessorKey: "steelQty",
      header: "Steel Qty",
      cell: ({ row }) => <span className="font-medium text-cyan-500 whitespace-nowrap">{row.original.steelQty} MT</span>,
    },
    {
      accessorKey: "copperQty",
      header: "Copper Qty",
      cell: ({ row }) => <span className="font-medium text-foreground whitespace-nowrap">{row.original.copperQty} MT</span>,
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-sm relative z-10"
      >
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">Vendor Stock Inventory Ledger</h3>
            <p className="text-xs text-muted-foreground mt-1">Active steel and copper logs by manufacturing partner</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl transition-all shadow-md shadow-blue-900/20"
          >
            <Plus size={16} />
            Add Record
          </button>
        </div>

        <DataTable 
          columns={columns} 
          data={records} 
          isLoading={isLoading} 
          onRefresh={refetch}
          exportFilename="Vendor_Stock_Export"
          searchPlaceholder="Search vendor stock..."
        />
      </motion.div>

      {/* CRUD Edit / Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-white/5 z-10">
                <h3 className="text-lg font-bold text-foreground">
                  {activeRecord ? "Edit Inventory Record" : "Add Inventory Record"}
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
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
                  <input {...form.register("customerName")} type="text" placeholder="e.g. Acme Corp" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  {form.formState.errors.customerName && <span className="text-[10px] text-red-500">{form.formState.errors.customerName.message}</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Steel Size</label>
                    <input {...form.register("steelSize")} type="text" placeholder="e.g. 240mm" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                    {form.formState.errors.steelSize && <span className="text-[10px] text-red-500">{form.formState.errors.steelSize.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Copper Size</label>
                    <input {...form.register("copperSize")} type="text" placeholder="e.g. 4.5mm" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                    {form.formState.errors.copperSize && <span className="text-[10px] text-red-500">{form.formState.errors.copperSize.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Steel Open Stock (MT)</label>
                    <input {...form.register("steelOpenStock")} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                    {form.formState.errors.steelOpenStock && <span className="text-[10px] text-red-500">{form.formState.errors.steelOpenStock.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Copper Open Qty (MT)</label>
                    <input {...form.register("copperOpenQty")} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                    {form.formState.errors.copperOpenQty && <span className="text-[10px] text-red-500">{form.formState.errors.copperOpenQty.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Steel Quantity (MT)</label>
                    <input {...form.register("steelQty")} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                    {form.formState.errors.steelQty && <span className="text-[10px] text-red-500">{form.formState.errors.steelQty.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Copper Quantity (MT)</label>
                    <input {...form.register("copperQty")} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                    {form.formState.errors.copperQty && <span className="text-[10px] text-red-500">{form.formState.errors.copperQty.message}</span>}
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
                  <h2 className="text-lg font-bold text-foreground">Vendor Stock Details</h2>
                  <p className="text-sm text-muted-foreground">{activeRecord.customerName}</p>
                </div>
                <button onClick={() => setIsViewOpen(false)} className="p-2 hover:bg-gray-100 dark:bg-white/10 rounded-full transition-colors">
                  <X size={16} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</label>
                  <p className="text-base font-medium text-foreground mt-1">{activeRecord.customerName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steel Size</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.steelSize}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Copper Size</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.copperSize}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steel Open Stock</label>
                    <p className="text-base font-bold text-foreground mt-1">{activeRecord.steelOpenStock} MT</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Copper Open Qty</label>
                    <p className="text-base font-bold text-amber-600 dark:text-amber-500 mt-1">{activeRecord.copperOpenQty} MT</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div>
                    <label className="text-xs font-semibold text-cyan-700 dark:text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Steel Quantity</label>
                    <p className="text-base font-bold text-cyan-700 dark:text-cyan-600 dark:text-cyan-400 mt-1">{activeRecord.steelQty} MT</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">Copper Quantity</label>
                    <p className="text-base font-bold text-foreground mt-1">{activeRecord.copperQty} MT</p>
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
    </>
  );
}
