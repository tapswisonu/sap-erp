const fs = require('fs');
const path = require('path');

// 1. Tooltips fix
const dirs = [
  path.join(__dirname, 'components/dashboard'),
  path.join(__dirname, 'components/dashboard/charts')
];

function processTooltips(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processTooltips(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Add wrapperStyle to Tooltips to prevent mobile overflow
      content = content.replace(/<Tooltip\b([^>]*)\/?>/g, (match, p1) => {
        // if it already has wrapperStyle, skip it or append. For simplicity, if it has it, skip.
        if (p1.includes('wrapperStyle')) return match;
        // ensure it closes properly
        if (match.endsWith('/>')) {
          return `<Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} ${p1}/>`;
        }
        return `<Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} ${p1}>`;
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed Tooltips in', fullPath);
      }
    }
  }
}

for (const dir of dirs) {
  processTooltips(dir);
}

// 2. Performance: Dynamic imports in app/dashboard/page.tsx
const dashboardPagePath = path.join(__dirname, 'app/dashboard/page.tsx');
if (fs.existsSync(dashboardPagePath)) {
  let pageContent = fs.readFileSync(dashboardPagePath, 'utf8');
  
  if (!pageContent.includes('next/dynamic')) {
    pageContent = pageContent.replace(/import {([^}]+)} from "\@\/components\/dashboard\/(orders-overview-chart|production-chart|revenue-chart|sales-donut-chart|recent-transactions)";/g, '// Replaced with dynamic imports');
    
    const dynamicImports = `import dynamic from 'next/dynamic';

const OrdersOverviewChart = dynamic(() => import("@/components/dashboard/orders-overview-chart").then(m => m.OrdersOverviewChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const ProductionChart = dynamic(() => import("@/components/dashboard/production-chart").then(m => m.ProductionChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const RevenueChart = dynamic(() => import("@/components/dashboard/revenue-chart").then(m => m.RevenueChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const SalesDonutChart = dynamic(() => import("@/components/dashboard/sales-donut-chart").then(m => m.SalesDonutChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const RecentTransactions = dynamic(() => import("@/components/dashboard/recent-transactions").then(m => m.RecentTransactions), { ssr: false });
`;

    // Remove the original static imports
    pageContent = pageContent.replace(/import { OrdersOverviewChart } from "\@\/components\/dashboard\/orders-overview-chart";/, "");
    pageContent = pageContent.replace(/import { ProductionChart } from "\@\/components\/dashboard\/production-chart";/, "");
    pageContent = pageContent.replace(/import { RevenueChart } from "\@\/components\/dashboard\/revenue-chart";/, "");
    pageContent = pageContent.replace(/import { SalesDonutChart } from "\@\/components\/dashboard\/sales-donut-chart";/, "");
    pageContent = pageContent.replace(/import { RecentTransactions } from "\@\/components\/dashboard\/recent-transactions";/, "");

    // Inject dynamic imports below 'lucide-react'
    pageContent = pageContent.replace(/import {([^}]+)} from "lucide-react";/, (match) => match + '\n' + dynamicImports);

    fs.writeFileSync(dashboardPagePath, pageContent, 'utf8');
    console.log('Fixed dynamic imports in', dashboardPagePath);
  }
}

// 3. Performance: Dynamic imports in lib/export-utils.ts
const exportUtilsPath = path.join(__dirname, 'lib/export-utils.ts');
if (fs.existsSync(exportUtilsPath)) {
  let exportContent = fs.readFileSync(exportUtilsPath, 'utf8');
  
  if (exportContent.includes('import * as XLSX from "xlsx"')) {
    // Replace static imports with dynamic ones
    exportContent = exportContent.replace(/import \* as XLSX from "xlsx";\n/, '');
    exportContent = exportContent.replace(/import jsPDF from "jspdf";\n/, '');
    exportContent = exportContent.replace(/import autoTable from "jspdf-autotable";\n/, '');

    // Inside exportToExcel
    exportContent = exportContent.replace(/const worksheet = XLSX\.utils\.json_to_sheet\(data\);/, `const XLSX = await import("xlsx");\n  const worksheet = XLSX.utils.json_to_sheet(data);`);
    exportContent = exportContent.replace(/export const exportToExcel = \(data: any\[\], filename: string\) => {/, 'export const exportToExcel = async (data: any[], filename: string) => {');

    // Inside exportToPDF
    exportContent = exportContent.replace(/const doc = new jsPDF\(\);/, `const jsPDF = (await import("jspdf")).default;\n  const autoTable = (await import("jspdf-autotable")).default;\n  const doc = new jsPDF();`);
    exportContent = exportContent.replace(/export const exportToPDF = \(data: any\[\], filename: string, columns: any\[\]\) => {/, 'export const exportToPDF = async (data: any[], filename: string, columns: any[]) => {');
    
    fs.writeFileSync(exportUtilsPath, exportContent, 'utf8');
    console.log('Fixed dynamic exports in', exportUtilsPath);
  }
}

console.log('Done qa 2');
