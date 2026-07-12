"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { motion } from "framer-motion";
import { dataPageMock, DataRecord } from "@/lib/erp-mock-data";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Calendar,
  Anchor,
  FileText,
} from "lucide-react";

const statusClasses = {
  Completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "In-Progress": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Delayed: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function DataPage() {
  const [data, setData] = useState<DataRecord[]>(dataPageMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedInco, setSelectedInco] = useState("All Incoterms");
  const [sortField, setSortField] = useState<keyof DataRecord | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Types & Incoterms lists
  const types = ["All Types", ...Array.from(new Set(dataPageMock.map((r) => r.type)))];
  const incoterms = ["All Incoterms", ...Array.from(new Set(dataPageMock.map((r) => r.incoterms)))];

  // Handle Sort
  const handleSort = (field: keyof DataRecord) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);

    const sortedData = [...data].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (typeof valA === "number" && typeof valB === "number") {
        return isAsc ? valB - valA : valA - valB;
      }
      return isAsc
        ? String(valB).localeCompare(String(valA))
        : String(valA).localeCompare(String(valB));
    });
    setData(sortedData);
  };

  // Filters
  const filteredData = data.filter((row) => {
    const matchesSearch =
      row.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.port.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All Types" || row.type === selectedType;
    const matchesInco = selectedInco === "All Incoterms" || row.incoterms === selectedInco;

    return matchesSearch && matchesType && matchesInco;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV
  const handleExport = () => {
    const headers = [
      "PO Number",
      "Customer Name",
      "Section Size",
      "Copper Size",
      "Type",
      "Quantity",
      "Incoterms",
      "Rate",
      "PO Amount",
      "INR",
      "Port",
      "Order Date",
      "Delivery Date",
      "Billet Cutting",
      "Rolling Date",
      "Dholsot",
      "Readiness Date",
      "Vizg Cut Off",
      "Status",
    ];
    const rows = filteredData.map((r) => [
      r.poNumber,
      r.customerName,
      r.sectionSize,
      r.copperSize,
      r.type,
      r.quantity,
      r.incoterms,
      r.rate,
      r.poAmount,
      r.inrValue,
      r.port,
      r.orderDate,
      r.deliveryDate,
      r.billetCuttingDate,
      r.rollingDate,
      r.dholsot,
      r.readinessDate,
      r.vizgCutOff,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ERP_DATA_EXPORT_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader
        title="ERP Data Ledger"
        subtitle="Global production records and complete order execution history"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Controls Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search Customer, PO or Port..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            />
          </div>

          {/* Filters and Export */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Type Dropdown */}
            <div className="flex items-center bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 gap-2">
              <Filter size={14} className="text-muted-foreground" />
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
              >
                {types.map((t) => (
                  <option key={t} value={t} className="bg-slate-900 text-foreground">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Incoterms Dropdown */}
            <div className="flex items-center bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 gap-2">
              <Anchor size={14} className="text-muted-foreground" />
              <select
                value={selectedInco}
                onChange={(e) => {
                  setSelectedInco(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
              >
                {incoterms.map((inc) => (
                  <option key={inc} value={inc} className="bg-slate-900 text-foreground">
                    {inc}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 text-cyan-600 dark:text-cyan-400 rounded-xl px-4 py-2 text-xs font-semibold transition-all ml-auto md:ml-0"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-white/8 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1500px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 text-xs font-semibold text-muted-foreground uppercase bg-white/[0.01]">
                  <th className="px-5 py-3">Sr. No.</th>
                  <th className="px-5 py-3 cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("poNumber")}>
                    <div className="flex items-center gap-1.5">
                      PO Number <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-5 py-3 cursor-pointer select-none hover:text-foreground" onClick={() => handleSort("customerName")}>
                    <div className="flex items-center gap-1.5">
                      Customer Name <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-5 py-3">Section Size</th>
                  <th className="px-5 py-3">Copper Size</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 cursor-pointer select-none hover:text-foreground text-right" onClick={() => handleSort("quantity")}>
                    <div className="flex items-center gap-1.5 justify-end">
                      Quantity <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-5 py-3">Incoterms</th>
                  <th className="px-5 py-3 text-right">Rate</th>
                  <th className="px-5 py-3 cursor-pointer select-none hover:text-foreground text-right" onClick={() => handleSort("poAmount")}>
                    <div className="flex items-center gap-1.5 justify-end">
                      PO Amount <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="px-5 py-3 text-right">INR Value</th>
                  <th className="px-5 py-3">Port</th>
                  <th className="px-5 py-3"><div className="flex items-center gap-1"><Calendar size={12} /> Order Date</div></th>
                  <th className="px-5 py-3"><div className="flex items-center gap-1"><Calendar size={12} /> Delivery Date</div></th>
                  <th className="px-5 py-3">Billet Cutting</th>
                  <th className="px-5 py-3">Rolling Date</th>
                  <th className="px-5 py-3">Dholsot</th>
                  <th className="px-5 py-3">Readiness Date</th>
                  <th className="px-5 py-3">Vizg Cut Off</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {displayedData.map((row, idx) => (
                  <tr key={row.poNumber} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-foreground">{row.poNumber}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{row.customerName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.sectionSize}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.copperSize}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-foreground">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400">{row.quantity.toLocaleString()} units</td>
                    <td className="px-5 py-4 text-foreground font-semibold">{row.incoterms}</td>
                    <td className="px-5 py-4 text-right font-mono">${row.rate}</td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-foreground">${row.poAmount.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right font-mono text-muted-foreground">₹{row.inrValue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-foreground font-medium">{row.port}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.orderDate}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.deliveryDate}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.billetCuttingDate}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.rollingDate}</td>
                    <td className="px-5 py-4 text-xs font-medium text-foreground">{row.dholsot}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.readinessDate}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{row.vizgCutOff}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                          statusClasses[row.status]
                        )}>
                          {row.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={20} className="text-center py-8 text-muted-foreground text-sm">
                      No records found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Showing {displayedData.length} of {filteredData.length} records
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:bg-white/10 disabled:opacity-40 disabled:hover:bg-gray-50 dark:bg-white/5 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-foreground font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:bg-white/10 disabled:opacity-40 disabled:hover:bg-gray-50 dark:bg-white/5 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
