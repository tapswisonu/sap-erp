"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TableActions } from "@/components/ui/table-actions";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

// --- Schema ---
const orderSchema = z.object({
  id: z.string().optional(),
  customer: z.string().min(1, "Customer is required"),
  material: z.string().min(1, "Material is required"),
  quantity: z.string().min(1, "Quantity is required"),
  value: z.string().min(1, "Value is required"),
  status: z.string(),
  date: z.string().min(1, "Date is required"),
});
type OrderFormValues = z.infer<typeof orderSchema>;

export function OrdersTable() {
  const queryClient = useQueryClient();
  
  // Modals & Drawers State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const [activeOrder, setActiveOrder] = useState<OrderFormValues | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer: "", material: "", quantity: "", value: "", status: "Pending", date: ""
    }
  });

  // --- Queries & Mutations ---
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: OrderFormValues) => {
      const isNew = !data.id;
      const res = await fetch('/api/orders', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to save order");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success(activeOrder ? "Order updated successfully" : "Order created successfully");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to save order");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete order");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success("Order deleted successfully");
      setIsConfirmDeleteOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete order");
    }
  });

  // --- Handlers ---
  const handleAdd = () => {
    setActiveOrder(null);
    form.reset({
      customer: "", material: "", quantity: "", value: "", status: "Pending", 
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setIsModalOpen(true);
  };

  const handleEdit = (order: OrderFormValues) => {
    setActiveOrder(order);
    form.reset(order);
    setIsModalOpen(true);
  };

  const handleView = (order: OrderFormValues) => {
    setActiveOrder(order);
    setIsViewOpen(true);
  };

  const confirmDelete = (id: string) => {
    setOrderToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const onSubmit = (data: OrderFormValues) => {
    saveMutation.mutate(data);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Completed":
        return { bg: "bg-emerald-500/10 dark:bg-emerald-400/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500 dark:bg-emerald-400" };
      case "Processing":
        return { bg: "bg-blue-500/10 dark:bg-blue-400/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500 dark:bg-blue-400" };
      case "Pending":
        return { bg: "bg-amber-500/10 dark:bg-amber-400/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500 dark:bg-amber-400" };
      case "Cancelled":
        return { bg: "bg-red-500/10 dark:bg-red-400/10", text: "text-red-600 dark:text-red-400", dot: "bg-red-500 dark:bg-red-400" };
      default:
        return { bg: "bg-gray-500/10", text: "text-gray-600", dot: "bg-gray-500" };
    }
  };

  // --- Table Columns ---
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-medium text-cyan-600 dark:text-cyan-600 dark:text-cyan-400 cursor-pointer hover:underline" onClick={() => handleView(row.original)}>
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.customer}</span>,
    },
    {
      accessorKey: "material",
      header: "Material",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.quantity}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const statusConfig = getStatusConfig(row.original.status);
        return (
          <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusConfig.bg, statusConfig.text)}>
            <div className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)} />
            {row.original.status}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Order Date",
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
        className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm relative z-10"
      >
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">Orders Overview</h3>
            <p className="text-xs text-muted-foreground mt-1">Manage and track all manufacturing orders</p>
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl transition-all shadow-md shadow-blue-900/20"
          >
            <Plus size={16} />
            Add Order
          </button>
        </div>

        <DataTable 
          columns={columns} 
          data={orders} 
          isLoading={isLoading} 
          onRefresh={refetch}
          exportFilename="Orders_Export"
          searchPlaceholder="Search orders, customers, materials..."
        />
      </motion.div>

      {/* CRUD Edit / Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-200 dark:border-white/5 flex items-center justify-between bg-gray-50 dark:bg-white/5">
                <h3 className="text-lg font-bold text-foreground">
                  {activeOrder ? "Edit Order" : "Add New Order"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
                  <input 
                    {...form.register("customer")} 
                    type="text" 
                    placeholder="e.g. Acme Corp" 
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-foreground" 
                  />
                  {form.formState.errors.customer && <span className="text-[10px] text-red-500">{form.formState.errors.customer.message}</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Material</label>
                    <input 
                      {...form.register("material")} 
                      type="text" 
                      placeholder="e.g. Steel Coil" 
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-foreground" 
                    />
                    {form.formState.errors.material && <span className="text-[10px] text-red-500">{form.formState.errors.material.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Quantity</label>
                    <input 
                      {...form.register("quantity")} 
                      type="text" 
                      placeholder="e.g. 1,000 KG" 
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-foreground" 
                    />
                    {form.formState.errors.quantity && <span className="text-[10px] text-red-500">{form.formState.errors.quantity.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Value</label>
                    <input 
                      {...form.register("value")} 
                      type="text" 
                      placeholder="e.g. ₹12,00,000" 
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-foreground" 
                    />
                    {form.formState.errors.value && <span className="text-[10px] text-red-500">{form.formState.errors.value.message}</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Status</label>
                    <Select 
                      value={form.watch("status")} 
                      onChange={val => form.setValue("status", val)} 
                      options={[
                        { label: "Completed", value: "Completed" },
                        { label: "Processing", value: "Processing" },
                        { label: "Pending", value: "Pending" },
                        { label: "Cancelled", value: "Cancelled" }
                      ]}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Date</label>
                  <input 
                    {...form.register("date")} 
                    type="text" 
                    placeholder="e.g. 12 May 2026" 
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-foreground" 
                  />
                  {form.formState.errors.date && <span className="text-[10px] text-red-500">{form.formState.errors.date.message}</span>}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-200 dark:border-white/5 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-50 dark:bg-white/5 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                    {saveMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                    {activeOrder ? "Save Changes" : "Create Order"}
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
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Order</h3>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setIsConfirmDeleteOpen(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:bg-white/10 text-foreground transition-colors">Cancel</button>
                <button 
                  onClick={() => orderToDelete && deleteMutation.mutate(orderToDelete)} 
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
        {isViewOpen && activeOrder && (
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
                  <h2 className="text-lg font-bold text-foreground">Order Details</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{activeOrder.id}</p>
                </div>
                <button onClick={() => setIsViewOpen(false)} className="p-2 hover:bg-gray-100 dark:bg-white/10 rounded-full transition-colors">
                  <X size={16} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</label>
                  <p className="text-base font-medium text-foreground mt-1">{activeOrder.customer}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Material</label>
                  <p className="text-base font-medium text-foreground mt-1">{activeOrder.material}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantity</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeOrder.quantity}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeOrder.value}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 dark:border-white/10 text-foreground">
                      {activeOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order Date</label>
                  <p className="text-base font-medium text-foreground mt-1">{activeOrder.date}</p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <button 
                  onClick={() => { setIsViewOpen(false); handleEdit(activeOrder); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-sm"
                >
                  Edit Order
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
