"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, RefreshCw, Loader2, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { TableActions } from "@/components/ui/table-actions";
import { Select } from "@/components/ui/select";

export function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals & Drawers State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer: "", material: "", quantity: "", value: "", status: "Pending", date: ""
  });

  const { toast } = useToast();

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch('/api/orders');
      const result = await res.json();
      setOrders(result);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({ title: "Error", message: "Failed to fetch orders", type: "error" });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setActiveOrder(null);
    setFormData({
      customer: "", material: "", quantity: "", value: "", status: "Pending", 
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setIsModalOpen(true);
  };

  const handleEdit = (order: any) => {
    setActiveOrder(order);
    setFormData({
      customer: order.customer,
      material: order.material,
      quantity: order.quantity,
      value: order.value,
      status: order.status,
      date: order.date
    });
    setIsModalOpen(true);
  };

  const handleView = (order: any) => {
    setActiveOrder(order);
    setIsViewOpen(true);
  };

  const confirmDelete = (id: string) => {
    setOrderToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!orderToDelete) return;
    setIsSaving(true);
    try {
      await fetch(`/api/orders?id=${orderToDelete}`, { method: 'DELETE' });
      setOrders(orders.filter(o => o.id !== orderToDelete));
      toast({ title: "Order Deleted", message: `Order ${orderToDelete} was removed.`, type: "success" });
    } catch (error) {
      console.error("Failed to delete", error);
      toast({ title: "Delete Failed", message: "An error occurred while deleting.", type: "error" });
    } finally {
      setIsSaving(false);
      setIsConfirmDeleteOpen(false);
      setOrderToDelete(null);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrder) {
      setIsConfirmEditOpen(true);
    } else {
      executeSave(); // create new directly
    }
  };

  const executeSave = async () => {
    setIsSaving(true);
    try {
      if (activeOrder) {
        const res = await fetch('/api/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: activeOrder.id })
        });
        const updated = await res.json();
        setOrders(orders.map(o => o.id === activeOrder.id ? updated : o));
        toast({ title: "Order Updated", message: `Order ${updated.id} has been saved.`, type: "success" });
      } else {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const created = await res.json();
        setOrders([created, ...orders]);
        toast({ title: "Order Created", message: `Order ${created.id} was successfully created.`, type: "success" });
      }
      setIsModalOpen(false);
      setIsConfirmEditOpen(false);
    } catch (error) {
      console.error("Failed to save", error);
      toast({ title: "Save Failed", message: "There was an error saving the order.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0a0a0a] shadow-sm relative z-10"
      >
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">Orders Overview</h3>
            <p className="text-xs text-muted-foreground mt-1">Manage and track all manufacturing orders</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => fetchData(true)}
                className="flex-1 sm:flex-none flex items-center justify-center p-2 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm"
                title="Refresh Data"
              >
                <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
              </button>
              <button 
                onClick={handleAdd}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Plus size={16} />
                Add Order
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
              <p className="text-sm">Loading orders...</p>
            </div>
          ) : (
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 z-20 bg-gray-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
              <tr>
                {["Order ID", "Customer", "Material", "Quantity", "Status", "Order Date"].map((col) => (
                  <th key={col} className="px-5 py-4 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors w-max">
                      {col}
                      <ChevronsUpDown size={12} className="opacity-40" />
                    </div>
                  </th>
                ))}
                <th className="px-5 py-4 text-xs font-semibold text-muted-foreground tracking-wide uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
              <AnimatePresence>
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  return (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      key={order.id}
                      className={cn(
                        "h-16 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] even:bg-gray-50/30 dark:even:bg-white/[0.01] transition-colors duration-200"
                      )}
                    >
                      <td className="px-5 font-medium text-primary hover:underline cursor-pointer whitespace-nowrap" onClick={() => handleView(order)}>
                        {order.id}
                      </td>
                      <td className="px-5 font-semibold text-foreground whitespace-nowrap">{order.customer}</td>
                      <td className="px-5 text-muted-foreground whitespace-nowrap">{order.material}</td>
                      <td className="px-5 font-medium text-foreground whitespace-nowrap">{order.quantity}</td>
                      <td className="px-5 whitespace-nowrap">
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent", statusConfig.bg, statusConfig.text)}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)} />
                          {order.status}
                        </div>
                      </td>
                      <td className="px-5 text-muted-foreground whitespace-nowrap">{order.date}</td>
                      <td className="px-5 text-right">
                        <TableActions 
                          onView={() => handleView(order)}
                          onEdit={() => handleEdit(order)}
                          onDelete={() => confirmDelete(order.id)}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              
              {filteredOrders.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground text-sm">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
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
              <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  {activeOrder ? "Edit Order" : "Add New Order"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={onFormSubmit} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
                  <input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} type="text" placeholder="e.g. Acme Corp" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Material</label>
                    <input required value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} type="text" placeholder="e.g. Steel Coil" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Quantity</label>
                    <input required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} type="text" placeholder="e.g. 1,000 KG" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Value</label>
                    <input required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} type="text" placeholder="e.g. ₹12,00,000" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Status</label>
                    <Select 
                      value={formData.status} 
                      onChange={val => setFormData({...formData, status: val})} 
                      options={[
                        { label: "Completed", value: "Completed" },
                        { label: "Processing", value: "Processing" },
                        { label: "Pending", value: "Pending" },
                        { label: "Cancelled", value: "Cancelled" }
                      ]}
                    />
                  </div>
                </div>
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    {activeOrder ? "Save Changes" : "Create Order"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Edit Modal */}
      <AnimatePresence>
        {isConfirmEditOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Confirm Update</h3>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to update this order?</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsConfirmEditOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                <button onClick={executeSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  Update
                </button>
              </div>
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
              className="w-full max-w-sm bg-white dark:bg-[#0a0a0a] border border-red-200 dark:border-red-900/50 rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Order</h3>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsConfirmDeleteOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                <button onClick={executeDelete} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Drawer */}
      <AnimatePresence>
        {isViewOpen && activeOrder && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Order Details</h2>
                  <p className="text-sm text-muted-foreground">{activeOrder.id}</p>
                </div>
                <button onClick={() => setIsViewOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={16} className="text-muted-foreground" />
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
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
                <button 
                  onClick={() => { setIsViewOpen(false); handleEdit(activeOrder); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Edit Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
