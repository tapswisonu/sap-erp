"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, RefreshCw, Loader2, Ship, Archive, Calendar, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { TableActions } from "@/components/ui/table-actions";
import { Select } from "@/components/ui/select";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { nominationKpis, nominationTrend } from "@/lib/erp-data";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const statusClasses: Record<string, string> = {
  Approved: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20",
  Pending: "text-amber-500 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20",
  Rejected: "text-red-500 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-400/10 dark:border-red-400/20",
};

export default function NominationDetailsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modals & Drawers State
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/nomination-details");
      const json = await res.json();
      setData(json);
    } catch (error) {
      addToast("Failed to fetch nomination details", "error");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setIsViewOpen(true);
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setFormData({ ...record });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (record: any) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setFormData({
      customerName: "",
      type: "Export",
      incoterm: "",
      port: "",
      weight: 0,
      poNumber: "",
      barsOrContainer: "",
      qty: 0,
      rate: 0,
      poAmount: 0,
      inrValue: 0,
      status: "Pending"
    });
    setIsEditModalOpen(true);
  };

  const triggerUpdateConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord) {
      setIsUpdateConfirmOpen(true);
    } else {
      handleSave();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const isNew = !selectedRecord;
      const method = isNew ? "POST" : "PUT";
      const recordToSave = {
        ...formData,
        id: isNew ? `NOM-${Math.floor(Math.random() * 10000)}` : formData.id,
      };

      const res = await fetch("/api/nomination-details", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recordToSave),
      });

      if (!res.ok) throw new Error("Failed to save");

      const saved = await res.json();
      
      if (isNew) {
        setData([...data, saved]);
        addToast("Nomination created successfully", "success");
      } else {
        setData(data.map(d => d.id === saved.id ? saved : d));
        addToast("Nomination updated successfully", "success");
      }
      
      setIsEditModalOpen(false);
      setIsUpdateConfirmOpen(false);
    } catch (error) {
      addToast("Failed to save nomination", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/nomination-details?id=${selectedRecord.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      
      setData(data.filter(d => d.id !== selectedRecord.id));
      addToast("Nomination deleted successfully", "success");
      setIsDeleteModalOpen(false);
    } catch (error) {
      addToast("Failed to delete nomination", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="Nomination & Allocation Management"
        subtitle="Approve allocations, track designated containers, and monitor export weight parameters"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <section id="nomination-kpis">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nominationKpis.map((kpi, idx) => (
              <KpiCard
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                change={kpi.change}
                changeType={kpi.up ? "increase" : "decrease"}
                color={kpi.color as any}
                icon={ClipboardCheck}
                index={idx}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card border border-white/8 rounded-2xl p-5 lg:col-span-2 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground mb-4">Nomination Trend (Approval vs Rejected)</h3>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nominationTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="approved" fill="#10b981" name="Approved Nominations" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending Nominations" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card border border-white/8 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
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
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-4 text-[10px] text-muted-foreground font-semibold">
              Allocation priority: High-volume exports active
            </div>
          </div>
        </section>

        <section className="glass-card border border-white/8 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 dark:bg-transparent">
            <div>
              <h3 className="text-base font-semibold text-foreground">Customer Nominations Ledger</h3>
              <p className="text-xs text-muted-foreground mt-1">Allocation authorization parameters and PO balances</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                disabled={isRefreshing}
                className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all"
              >
                <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-blue-900/20"
              >
                <Plus size={16} />
                New Nomination
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
                <p className="text-sm">Loading nominations...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 z-20 bg-gray-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm">
                  <tr>
                    {["Customer Name", "Type", "PO Number", "Weight (T)", "INR Value", "Status", "Actions"].map((col, i) => (
                      <th key={col} className={cn("px-5 py-4 text-xs font-semibold text-muted-foreground tracking-wide uppercase", i === 6 && "text-right")}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                  {data.map((row) => (
                    <tr 
                      key={row.id} 
                      className="h-16 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] even:bg-gray-50/30 dark:even:bg-white/[0.01] transition-colors duration-200"
                    >
                      <td className="px-5 py-4 font-semibold text-foreground whitespace-nowrap">{row.customerName}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-semibold border",
                          row.type === "Export" ? "text-cyan-600 bg-cyan-50 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-400/10 dark:border-cyan-400/20" : "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-400/10 dark:border-purple-400/20"
                        )}>
                          {row.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground whitespace-nowrap">{row.poNumber}</td>
                      <td className="px-5 py-4 text-right font-mono font-semibold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">{row.weight} T</td>
                      <td className="px-5 py-4 text-right font-mono text-muted-foreground whitespace-nowrap">₹{row.inrValue.toLocaleString()}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold border",
                          statusClasses[row.status]
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <TableActions 
                          onView={() => handleView(row)} 
                          onEdit={() => handleEdit(row)} 
                          onDelete={() => handleDeleteClick(row)} 
                        />
                      </td>
                    </tr>
                  ))}
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                        No nominations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Side Drawer for View */}
      <AnimatePresence>
        {isViewOpen && selectedRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsViewOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-background border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Nomination Details</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{selectedRecord.id}</p>
                </div>
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Customer Name</p>
                    <p className="text-sm font-medium text-foreground">{selectedRecord.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Status</p>
                    <span className={cn(
                      "inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border mt-1",
                      statusClasses[selectedRecord.status]
                    )}>
                      {selectedRecord.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Type</p>
                    <p className="text-sm font-medium text-foreground">{selectedRecord.type}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">PO Number</p>
                    <p className="text-sm font-mono text-foreground">{selectedRecord.poNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Weight</p>
                    <p className="text-sm font-mono font-bold text-cyan-500">{selectedRecord.weight} T</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Qty</p>
                    <p className="text-sm font-mono text-foreground">{selectedRecord.qty}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Incoterm</p>
                    <p className="text-sm font-medium text-foreground">{selectedRecord.incoterm}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Port</p>
                    <p className="text-sm font-medium text-foreground">{selectedRecord.port}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Bars / Container</p>
                    <p className="text-sm font-medium text-foreground">{selectedRecord.barsOrContainer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Rate</p>
                    <p className="text-sm font-mono text-foreground">${selectedRecord.rate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">PO Amount</p>
                    <p className="text-sm font-mono font-bold text-foreground">${selectedRecord.poAmount?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">INR Value</p>
                    <p className="text-sm font-mono font-bold text-foreground">₹{selectedRecord.inrValue?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 bg-white/5">
                <button
                  onClick={() => setIsViewOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-foreground font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-background border border-white/10 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                  <h2 className="text-lg font-bold text-foreground">
                    {selectedRecord ? "Edit Nomination" : "Add Nomination"}
                  </h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form id="nomination-form" onSubmit={triggerUpdateConfirm} className="flex-1 overflow-y-auto p-5 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">Customer Name</label>
                      <input 
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={e => setFormData({...formData, customerName: e.target.value})}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Status</label>
                      <Select 
                        value={formData.status} 
                        onChange={val => setFormData({...formData, status: val})} 
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
                        value={formData.type} 
                        onChange={val => setFormData({...formData, type: val})} 
                        options={[
                          { label: "Domestic", value: "Domestic" },
                          { label: "Export", value: "Export" }
                        ]}
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">PO Number</label>
                      <input 
                        type="text"
                        required
                        value={formData.poNumber}
                        onChange={e => setFormData({...formData, poNumber: e.target.value})}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Incoterm</label>
                      <input 
                        type="text"
                        required
                        value={formData.incoterm}
                        onChange={e => setFormData({...formData, incoterm: e.target.value})}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Port</label>
                      <input 
                        type="text"
                        required
                        value={formData.port}
                        onChange={e => setFormData({...formData, port: e.target.value})}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Weight (T)</label>
                      <input 
                        type="number"
                        step="0.1"
                        required
                        value={formData.weight}
                        onChange={e => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Quantity</label>
                      <input 
                        type="number"
                        required
                        value={formData.qty}
                        onChange={e => setFormData({...formData, qty: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs font-semibold text-muted-foreground">Bars / Container Detail</label>
                      <input 
                        type="text"
                        required
                        value={formData.barsOrContainer}
                        onChange={e => setFormData({...formData, barsOrContainer: e.target.value})}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Rate ($)</label>
                      <input 
                        type="number"
                        step="0.01"
                        required
                        value={formData.rate}
                        onChange={e => {
                          const rate = parseFloat(e.target.value) || 0;
                          const poAmount = rate * (formData.qty || 0);
                          const inrValue = poAmount * 83; // rough conversion
                          setFormData({...formData, rate, poAmount, inrValue});
                        }}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-foreground"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">PO Amount ($)</label>
                      <input 
                        type="number"
                        readOnly
                        value={formData.poAmount}
                        className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-white/10 border border-transparent rounded-xl focus:outline-none text-muted-foreground"
                      />
                    </div>
                  </div>
                </form>

                <div className="p-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="nomination-form"
                    disabled={isSaving}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                    {selectedRecord ? "Update Record" : "Create Record"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Edit */}
      <AnimatePresence>
        {isUpdateConfirmOpen && (
          <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-white/10 shadow-2xl rounded-2xl w-full max-w-sm p-6 flex flex-col items-center text-center"
            >
              <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <RefreshCw size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Confirm Update</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to update this nomination? Ensure all details are correct.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setIsUpdateConfirmOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Delete */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedRecord && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-red-500/20 shadow-2xl rounded-2xl w-full max-w-sm p-6 flex flex-col items-center text-center"
            >
              <div className="h-12 w-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
                <X size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Record</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete this nomination ({selectedRecord.id})? This action cannot be undone.
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
