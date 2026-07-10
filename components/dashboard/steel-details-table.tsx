"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Dispatched: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20",
  Rolled: "text-cyan-500 bg-cyan-50 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/20",
  Cutting: "text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20",
  Scheduled: "text-blue-500 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-400/10 dark:border-blue-400/20",
};

export function SteelDetailsTable() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    customerName: "", billetSize: "", billetWeight: "", billetQty: "", 
    steelSize: "", steelWeight: "", steelQty: "",
    rollingDate: "", cuttingDate: "", dispatchDate: "", actualDispatchDate: "", status: "Scheduled"
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch('/api/steel-details');
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
      await fetch(`/api/steel-details?id=${id}`, { method: 'DELETE' });
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      customerName: record.customerName,
      billetSize: record.billetSize,
      billetWeight: String(record.billetWeight),
      billetQty: String(record.billetQty),
      steelSize: record.steelSize,
      steelWeight: String(record.steelWeight),
      steelQty: String(record.steelQty),
      rollingDate: record.rollingDate,
      cuttingDate: record.cuttingDate,
      dispatchDate: record.dispatchDate,
      actualDispatchDate: record.actualDispatchDate,
      status: record.status
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setFormData({
      customerName: "", billetSize: "", billetWeight: "", billetQty: "", 
      steelSize: "", steelWeight: "", steelQty: "",
      rollingDate: "", cuttingDate: "", dispatchDate: "", actualDispatchDate: "", status: "Scheduled"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      ...formData,
      billetWeight: Number(formData.billetWeight),
      billetQty: Number(formData.billetQty),
      steelWeight: Number(formData.steelWeight),
      steelQty: Number(formData.steelQty)
    };
    
    try {
      if (editingRecord) {
        const res = await fetch('/api/steel-details', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingRecord.id })
        });
        const updated = await res.json();
        setData(data.map(item => item.id === editingRecord.id ? updated : item));
      } else {
        const res = await fetch('/api/steel-details', {
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
      <div className="glass-card border border-white/8 rounded-2xl overflow-hidden relative z-10 bg-white dark:bg-[#0a0a0a]/50">
        <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Steel Production Tracker</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">Real-time rolling mill and cutting logs</span>
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
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
              <p className="text-sm">Loading steel details...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
                  {["Customer Name", "Billet Size", "Billet Wt (T)", "Billet Qty", "Steel Size", "Steel Wt (T)", "Steel Qty", "Rolling", "Cutting", "Dispatch", "Actual", "Status", "Actions"].map((col) => (
                    <th key={col} className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                <AnimatePresence>
                  {data.map((row) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      key={row.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{row.customerName}</td>
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">{row.billetSize}</td>
                      <td className="px-5 py-4 text-gray-900 dark:text-white font-mono whitespace-nowrap">{row.billetWeight} T</td>
                      <td className="px-5 py-4 text-gray-900 dark:text-white font-mono whitespace-nowrap">{row.billetQty}</td>
                      <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{row.steelSize}</td>
                      <td className="px-5 py-4 font-semibold text-cyan-600 dark:text-cyan-400 font-mono whitespace-nowrap">{row.steelWeight} T</td>
                      <td className="px-5 py-4 text-gray-900 dark:text-white font-mono whitespace-nowrap">{row.steelQty}</td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.rollingDate}</td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.cuttingDate}</td>
                      <td className="px-5 py-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.dispatchDate}</td>
                      <td className="px-5 py-4 text-xs font-mono text-gray-900 dark:text-white whitespace-nowrap">{row.actualDispatchDate}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                          statusColors[row.status] || "text-slate-500 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-400/10 dark:border-slate-400/20"
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 transition-opacity">
                          <button 
                            onClick={() => handleEdit(row)}
                            className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-400/10 border border-blue-200 dark:border-blue-400/20 transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(row.id)}
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
                    <td colSpan={13} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No records found. Click "Add Record" to create one.
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a] z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editingRecord ? "Edit Steel Record" : "Add Steel Record"}
                </h3>
                <button 
                  type="button"
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
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Billet Size</label>
                    <input required value={formData.billetSize} onChange={e => setFormData({...formData, billetSize: e.target.value})} type="text" placeholder="e.g. 150x150" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Steel Size</label>
                    <input required value={formData.steelSize} onChange={e => setFormData({...formData, steelSize: e.target.value})} type="text" placeholder="e.g. 240mm" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Billet Wt (T)</label>
                    <input required value={formData.billetWeight} onChange={e => setFormData({...formData, billetWeight: e.target.value})} type="number" step="0.01" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Billet Qty</label>
                    <input required value={formData.billetQty} onChange={e => setFormData({...formData, billetQty: e.target.value})} type="number" step="1" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Steel Wt (T)</label>
                    <input required value={formData.steelWeight} onChange={e => setFormData({...formData, steelWeight: e.target.value})} type="number" step="0.01" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Steel Qty</label>
                    <input required value={formData.steelQty} onChange={e => setFormData({...formData, steelQty: e.target.value})} type="number" step="1" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Rolling Date</label>
                    <input required value={formData.rollingDate} onChange={e => setFormData({...formData, rollingDate: e.target.value})} type="date" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Cutting Date</label>
                    <input required value={formData.cuttingDate} onChange={e => setFormData({...formData, cuttingDate: e.target.value})} type="date" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dispatch Date</label>
                    <input required value={formData.dispatchDate} onChange={e => setFormData({...formData, dispatchDate: e.target.value})} type="date" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Actual Dispatch</label>
                    <input value={formData.actualDispatchDate} onChange={e => setFormData({...formData, actualDispatchDate: e.target.value})} type="text" placeholder="YYYY-MM-DD or '—'" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white">
                      <option value="Scheduled">Scheduled</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Rolled">Rolled</option>
                      <option value="Dispatched">Dispatched</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-[#0a0a0a] pb-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
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
