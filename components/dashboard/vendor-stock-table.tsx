"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function VendorStockTable() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    customerName: "", steelSize: "", copperSize: "", 
    steelOpenStock: "", copperOpenQty: "", steelQty: "", copperQty: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch('/api/vendor-stock');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/vendor-stock?id=${id}`, { method: 'DELETE' });
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      customerName: record.customerName,
      steelSize: record.steelSize,
      copperSize: record.copperSize,
      steelOpenStock: String(record.steelOpenStock),
      copperOpenQty: String(record.copperOpenQty),
      steelQty: String(record.steelQty),
      copperQty: String(record.copperQty)
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setFormData({
      customerName: "", steelSize: "", copperSize: "", 
      steelOpenStock: "", copperOpenQty: "", steelQty: "", copperQty: ""
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Parse numeric fields
    const payload = {
      ...formData,
      steelOpenStock: Number(formData.steelOpenStock),
      copperOpenQty: Number(formData.copperOpenQty),
      steelQty: Number(formData.steelQty),
      copperQty: Number(formData.copperQty)
    };
    
    try {
      if (editingRecord) {
        const res = await fetch('/api/vendor-stock', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingRecord.id })
        });
        const updated = await res.json();
        setData(data.map(item => item.id === editingRecord.id ? updated : item));
      } else {
        const res = await fetch('/api/vendor-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        setData([created, ...data]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="glass-card border border-gray-200 dark:border-white/8 rounded-2xl overflow-hidden bg-white dark:bg-background shadow-sm relative z-10">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Vendor Stock Inventory Ledger</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active steel and copper logs by manufacturing partner</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fetchData(true)}
              className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
            </button>
            <button 
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
              <p className="text-sm">Loading inventory data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
                  {["Customer Name", "Steel Size", "Copper Size", "Steel Open Stock", "Copper Open Qty", "Steel Qty", "Copper Qty", "Actions"].map((col) => (
                    <th key={col} className="px-5 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                <AnimatePresence>
                  {data.map((record, idx) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      key={record.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{record.customerName}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{record.steelSize}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{record.copperSize}</td>
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{record.steelOpenStock} MT</td>
                      <td className="px-5 py-4 font-medium text-amber-500 whitespace-nowrap">{record.copperOpenQty} MT</td>
                      <td className="px-5 py-4 font-medium text-cyan-500 whitespace-nowrap">{record.steelQty} MT</td>
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{record.copperQty} MT</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 transition-opacity">
                          <button 
                            onClick={() => handleEdit(record)}
                            className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-400/10 border border-blue-200 dark:border-blue-400/20 transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-400/10 border border-red-200 dark:border-red-400/20 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {data.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-muted-foreground text-sm">
                      No inventory records found. Click "Add Record" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CRUD Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingRecord ? "Edit Inventory Record" : "Add Inventory Record"}
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
                  <input required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} type="text" placeholder="e.g. Acme Corp" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Steel Size</label>
                    <input required value={formData.steelSize} onChange={e => setFormData({...formData, steelSize: e.target.value})} type="text" placeholder="e.g. 240mm" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Copper Size</label>
                    <input required value={formData.copperSize} onChange={e => setFormData({...formData, copperSize: e.target.value})} type="text" placeholder="e.g. 4.5mm" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Steel Open Stock (MT)</label>
                    <input required value={formData.steelOpenStock} onChange={e => setFormData({...formData, steelOpenStock: e.target.value})} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Copper Open Qty (MT)</label>
                    <input required value={formData.copperOpenQty} onChange={e => setFormData({...formData, copperOpenQty: e.target.value})} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Steel Quantity (MT)</label>
                    <input required value={formData.steelQty} onChange={e => setFormData({...formData, steelQty: e.target.value})} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Copper Quantity (MT)</label>
                    <input required value={formData.copperQty} onChange={e => setFormData({...formData, copperQty: e.target.value})} type="number" step="0.01" placeholder="0" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    {editingRecord ? "Save Changes" : "Create Record"}
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
