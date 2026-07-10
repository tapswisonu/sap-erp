"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ordersOverviewList } from "@/lib/erp-data";

export function OrdersTable() {
  const [orders, setOrders] = useState(ordersOverviewList);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    customer: "", material: "", quantity: "", value: "", status: "Pending", date: ""
  });

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter((o) => o !== id));
    } else {
      setSelectedOrders([...selectedOrders, id]);
    }
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    setSelectedOrders(selectedOrders.filter(selectedId => selectedId !== id));
  };

  const handleEdit = (order: any) => {
    setEditingOrder(order);
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

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({
      customer: "", material: "", quantity: "", value: "", status: "Pending", 
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...formData, id: o.id } : o));
    } else {
      // Find the highest number in ORD-XXXX to generate a new one
      const maxIdNum = Math.max(...orders.map(o => parseInt(o.id.split('-')[1] || "1000")));
      const newId = `ORD-${maxIdNum + 1}`;
      setOrders([{ ...formData, id: newId }, ...orders]);
    }
    setIsModalOpen(false);
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card border border-gray-200 dark:border-white/8 rounded-2xl overflow-hidden bg-white dark:bg-background shadow-sm relative z-10"
      >
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-foreground tracking-tight">Orders Overview</h3>
            <p className="text-xs text-gray-500 dark:text-muted-foreground mt-1">Manage and track all manufacturing orders</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-foreground placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-muted-foreground hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <Filter size={14} />
                Filters
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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
                <th className="px-5 py-3 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                </th>
                {["Order ID", "Customer", "Material", "Quantity", "Value", "Status", "Order Date"].map((col) => (
                  <th key={col} className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-muted-foreground tracking-wide">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-700 dark:hover:text-foreground transition-colors w-max">
                      {col}
                      <ChevronsUpDown size={12} className="opacity-40" />
                    </div>
                  </th>
                ))}
                <th className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-muted-foreground tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
              <AnimatePresence>
                {orders.map((order, idx) => {
                  const statusConfig = getStatusConfig(order.status);
                  const isSelected = selectedOrders.includes(order.id);
                  return (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      key={order.id}
                      className={cn(
                        "hover:bg-blue-50/40 dark:hover:bg-white/[0.02] transition-colors group",
                        isSelected && "bg-blue-50/60 dark:bg-white/[0.04]"
                      )}
                    >
                      <td className="px-5 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(order.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-4 font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-foreground whitespace-nowrap">{order.customer}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-muted-foreground whitespace-nowrap">{order.material}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-muted-foreground whitespace-nowrap">{order.quantity}</td>
                      <td className="px-5 py-4 text-gray-900 dark:text-foreground whitespace-nowrap">{order.value}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent", statusConfig.bg, statusConfig.text)}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)} />
                          {order.status}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 dark:text-muted-foreground whitespace-nowrap">{order.date}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 transition-opacity">
                          <button 
                            onClick={() => handleEdit(order)}
                            className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-400/10 border border-blue-200 dark:border-blue-400/20 transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(order.id)}
                            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-400/10 border border-red-200 dark:border-red-400/20 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-gray-500 dark:text-muted-foreground text-sm">
                    No orders found. Click "Add Order" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-white/[0.01]">
          <span className="text-xs text-gray-500 dark:text-muted-foreground">Showing {orders.length} orders</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 dark:bg-blue-500 text-white text-xs font-medium shadow-sm">1</button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors" disabled>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CRUD Modal Overlay */}
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingOrder ? "Edit Order" : "Add New Order"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Customer Name</label>
                  <input required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} type="text" placeholder="e.g. Acme Corp" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Material</label>
                    <input required value={formData.material} onChange={e => setFormData({...formData, material: e.target.value})} type="text" placeholder="e.g. Steel Coil" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity</label>
                    <input required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} type="text" placeholder="e.g. 1,000 KG" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Value</label>
                    <input required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} type="text" placeholder="e.g. ₹12,00,000" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white">
                      <option value="Completed">Completed</option>
                      <option value="Processing">Processing</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                    {editingOrder ? "Save Changes" : "Create Order"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
