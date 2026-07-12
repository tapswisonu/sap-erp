"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { TableActions } from "@/components/ui/table-actions";
import { Select } from "@/components/ui/select";

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
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmEditOpen, setIsConfirmEditOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [activeRecord, setActiveRecord] = useState<any | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "", billetSize: "", billetWeight: "", billetQty: "", 
    steelSize: "", steelWeight: "", steelQty: "",
    rollingDate: "", cuttingDate: "", dispatchDate: "", actualDispatchDate: "", status: "Scheduled"
  });

  const { toast } = useToast();

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch('/api/steel-details');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({ title: "Error", message: "Failed to fetch steel records.", type: "error" });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setActiveRecord(null);
    setFormData({
      customerName: "", billetSize: "", billetWeight: "", billetQty: "", 
      steelSize: "", steelWeight: "", steelQty: "",
      rollingDate: "", cuttingDate: "", dispatchDate: "", actualDispatchDate: "", status: "Scheduled"
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setActiveRecord(record);
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

  const handleView = (record: any) => {
    setActiveRecord(record);
    setIsViewOpen(true);
  };

  const confirmDelete = (id: string) => {
    setRecordToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!recordToDelete) return;
    setIsSaving(true);
    try {
      await fetch(`/api/steel-details?id=${recordToDelete}`, { method: 'DELETE' });
      setData(data.filter(item => item.id !== recordToDelete));
      toast({ title: "Record Deleted", message: "The steel record was removed successfully.", type: "success" });
    } catch (error) {
      console.error("Failed to delete", error);
      toast({ title: "Delete Failed", message: "An error occurred while deleting.", type: "error" });
    } finally {
      setIsSaving(false);
      setIsConfirmDeleteOpen(false);
      setRecordToDelete(null);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeRecord) {
      setIsConfirmEditOpen(true);
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {
    setIsSaving(true);
    const payload = {
      ...formData,
      billetWeight: Number(formData.billetWeight),
      billetQty: Number(formData.billetQty),
      steelWeight: Number(formData.steelWeight),
      steelQty: Number(formData.steelQty)
    };
    
    try {
      if (activeRecord) {
        const res = await fetch('/api/steel-details', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: activeRecord.id })
        });
        const updated = await res.json();
        setData(data.map(item => item.id === activeRecord.id ? updated : item));
        toast({ title: "Record Updated", message: "Steel record saved successfully.", type: "success" });
      } else {
        const res = await fetch('/api/steel-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const created = await res.json();
        setData([created, ...data]);
        toast({ title: "Record Created", message: "New steel record created successfully.", type: "success" });
      }
      setIsModalOpen(false);
      setIsConfirmEditOpen(false);
    } catch (error) {
      console.error("Failed to save", error);
      toast({ title: "Save Failed", message: "There was an error saving the record.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="glass-card border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden relative z-10 bg-white dark:bg-[#0a0a0a] shadow-sm">
        <div className="p-5 md:p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">Steel Production Tracker</h3>
            <span className="text-xs text-muted-foreground mt-1">Real-time rolling mill and cutting logs</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={() => fetchData(true)}
              className="w-full sm:w-auto flex items-center justify-center p-2.5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
            </button>
            <button 
              onClick={handleAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add Record
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
              <p className="text-sm">Loading steel details...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="sticky top-0 z-20 bg-gray-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm">
                <tr>
                  {["Customer Name", "Billet Wt (T)", "Steel Size", "Steel Wt (T)", "Dispatch", "Status", "Actions"].map((col, i) => (
                    <th key={col} className={cn("px-5 py-4 text-xs font-semibold text-muted-foreground tracking-wide uppercase", i === 6 && "text-right")}>
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
                      className="h-16 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] even:bg-gray-50/30 dark:even:bg-white/[0.01] transition-colors duration-200"
                    >
                      <td className="px-5 py-4 font-semibold text-foreground whitespace-nowrap">{row.customerName}</td>
                      <td className="px-5 py-4 text-foreground font-mono whitespace-nowrap">{row.billetWeight} T</td>
                      <td className="px-5 py-4 font-semibold text-foreground whitespace-nowrap">{row.steelSize}</td>
                      <td className="px-5 py-4 font-semibold text-cyan-600 dark:text-cyan-400 font-mono whitespace-nowrap">{row.steelWeight} T</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{row.dispatchDate}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold border",
                          statusColors[row.status] || "text-slate-500 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-400/10 dark:border-slate-400/20"
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <TableActions 
                          onView={() => handleView(row)}
                          onEdit={() => handleEdit(row)}
                          onDelete={() => confirmDelete(row.id)}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {data.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={13} className="px-5 py-12 text-center text-muted-foreground text-sm">
                      No records found. Click "Add Record" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
              <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a] z-10">
                <h3 className="text-lg font-bold text-foreground">
                  {activeRecord ? "Edit Steel Record" : "Add Steel Record"}
                </h3>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={onFormSubmit} className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
                  <input required value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} type="text" placeholder="e.g. Acme Corp" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Billet Size</label>
                    <input required value={formData.billetSize} onChange={e => setFormData({...formData, billetSize: e.target.value})} type="text" placeholder="e.g. 150x150" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Steel Size</label>
                    <input required value={formData.steelSize} onChange={e => setFormData({...formData, steelSize: e.target.value})} type="text" placeholder="e.g. 240mm" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Billet Wt (T)</label>
                    <input required value={formData.billetWeight} onChange={e => setFormData({...formData, billetWeight: e.target.value})} type="number" step="0.01" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Billet Qty</label>
                    <input required value={formData.billetQty} onChange={e => setFormData({...formData, billetQty: e.target.value})} type="number" step="1" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Steel Wt (T)</label>
                    <input required value={formData.steelWeight} onChange={e => setFormData({...formData, steelWeight: e.target.value})} type="number" step="0.01" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Steel Qty</label>
                    <input required value={formData.steelQty} onChange={e => setFormData({...formData, steelQty: e.target.value})} type="number" step="1" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Rolling Date</label>
                    <input required value={formData.rollingDate} onChange={e => setFormData({...formData, rollingDate: e.target.value})} type="date" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Cutting Date</label>
                    <input required value={formData.cuttingDate} onChange={e => setFormData({...formData, cuttingDate: e.target.value})} type="date" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Dispatch Date</label>
                    <input required value={formData.dispatchDate} onChange={e => setFormData({...formData, dispatchDate: e.target.value})} type="date" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Actual Dispatch</label>
                    <input value={formData.actualDispatchDate} onChange={e => setFormData({...formData, actualDispatchDate: e.target.value})} type="text" placeholder="YYYY-MM-DD or '—'" className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground placeholder:text-gray-400" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Status</label>
                    <Select 
                      value={formData.status} 
                      onChange={val => setFormData({...formData, status: val})} 
                      options={[
                        { label: "Scheduled", value: "Scheduled" },
                        { label: "Cutting", value: "Cutting" },
                        { label: "Rolled", value: "Rolled" },
                        { label: "Dispatched", value: "Dispatched" }
                      ]}
                    />
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5 flex justify-end gap-2 sticky bottom-0 bg-white dark:bg-[#0a0a0a] pb-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                    {isSaving && <Loader2 size={14} className="animate-spin" />}
                    {activeRecord ? "Save Changes" : "Create Record"}
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
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Record</h3>
              <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete this record? This action cannot be undone.</p>
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
        {isViewOpen && activeRecord && (
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
                  <h2 className="text-lg font-bold text-foreground">Steel Record Details</h2>
                  <p className="text-sm text-muted-foreground">{activeRecord.customerName}</p>
                </div>
                <button onClick={() => setIsViewOpen(false)} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</label>
                  <p className="text-base font-medium text-foreground mt-1">{activeRecord.customerName}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Billet Size</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.billetSize}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Billet Weight</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.billetWeight} T</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Billet Quantity</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.billetQty}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steel Size</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.steelSize}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steel Weight</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.steelWeight} T</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Steel Quantity</label>
                    <p className="text-base font-medium text-foreground mt-1">{activeRecord.steelQty}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rolling Date</label>
                    <p className="text-sm font-medium text-foreground mt-1">{activeRecord.rollingDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cutting Date</label>
                    <p className="text-sm font-medium text-foreground mt-1">{activeRecord.cuttingDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dispatch Date</label>
                    <p className="text-sm font-medium text-foreground mt-1">{activeRecord.dispatchDate}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actual Dispatch</label>
                    <p className="text-sm font-medium text-foreground mt-1">{activeRecord.actualDispatchDate || "—"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                  <div className="mt-2">
                    <span className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-semibold border",
                      statusColors[activeRecord.status] || "text-slate-500 bg-slate-50 border-slate-200 dark:text-slate-400 dark:bg-slate-400/10 dark:border-slate-400/20"
                    )}>
                      {activeRecord.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.01]">
                <button 
                  onClick={() => { setIsViewOpen(false); handleEdit(activeRecord); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Edit Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
