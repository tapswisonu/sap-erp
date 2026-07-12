"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Download, 
  Printer, 
  RefreshCw, 
  FileText, 
  FileSpreadsheet, 
  FileIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV, exportToExcel, exportToPDF, printTable } from "@/lib/export-utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRefresh?: () => void;
  exportFilename?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRefresh,
  exportFilename = "export_data",
  searchPlaceholder = "Search records...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleExport = (type: "csv" | "excel" | "pdf" | "print") => {
    setShowExportMenu(false);
    
    // Extract exportable columns (excluding Actions)
    const exportColumns = columns
      .filter(col => col.id !== "actions" && (col as any).accessorKey)
      .map(col => ({
        header: typeof col.header === 'string' ? col.header : (col as any).accessorKey,
        dataKey: (col as any).accessorKey
      }));

    if (type === "csv") exportToCSV(data, exportFilename);
    if (type === "excel") exportToExcel(data, exportFilename);
    if (type === "pdf") exportToPDF(data, exportFilename, exportColumns);
    if (type === "print") printTable(data, exportColumns);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 dark:bg-transparent">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-foreground transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-muted-foreground hover:text-foreground transition-all"
              title="Refresh Data"
            >
              <RefreshCw size={16} className={cn(isLoading && "animate-spin")} />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-muted-foreground hover:text-foreground rounded-xl text-sm font-medium transition-all"
            >
              <Download size={16} />
              Export
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden z-50 py-1">
                  <button onClick={() => handleExport("csv")} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:bg-white/5">
                    <FileText size={14} /> CSV
                  </button>
                  <button onClick={() => handleExport("excel")} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:bg-white/5">
                    <FileSpreadsheet size={14} /> Excel
                  </button>
                  <button onClick={() => handleExport("pdf")} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:bg-white/5">
                    <FileIcon size={14} /> PDF
                  </button>
                  <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                  <button onClick={() => handleExport("print")} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 dark:bg-white/5">
                    <Printer size={14} /> Print
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 bg-gray-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th 
                      key={header.id} 
                      className={cn(
                        "px-5 py-4 text-xs font-semibold text-muted-foreground tracking-wide uppercase select-none transition-colors",
                        header.column.getCanSort() && "cursor-pointer hover:text-foreground"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <span className="text-cyan-500">↑</span>,
                          desc: <span className="text-cyan-500">↓</span>,
                        }[isSorted as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
            {isLoading ? (
              // Skeleton Loader
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="h-16 animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-100 dark:bg-white/10 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="h-16 group hover:bg-gray-50/50 dark:hover:bg-white/[0.02] even:bg-gray-50/30 dark:even:bg-white/[0.01] transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-4 opacity-20" />
                    <p className="text-sm">No results found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 dark:bg-transparent">
        <div className="text-xs text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of{" "}
          {data.length} entries
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-muted-foreground hover:bg-gray-100 dark:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-muted-foreground hover:bg-gray-100 dark:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
