const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app/dashboard'),
  path.join(__dirname, 'components/dashboard'),
  path.join(__dirname, 'components/dashboard/charts')
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // 1. Zod Validation improvements
      content = content.replace(/z\.string\(\)\.min\(/g, 'z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(');
      
      // 2. React Query keepPreviousData
      if (content.includes('useQuery({') && !content.includes('keepPreviousData')) {
        if (content.includes('@tanstack/react-query')) {
          content = content.replace(/import {([^}]+)} from "@tanstack\/react-query";/, (match, p1) => {
            if (!p1.includes('keepPreviousData')) {
              return `import {${p1}, keepPreviousData } from "@tanstack/react-query";`;
            }
            return match;
          });
        }
        
        // SAFE regex for injecting placeholderData at the end of useQuery
        content = content.replace(/queryFn:\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)\n\s*\}\s*\n\s*\}\);/g, (match, p1) => {
          return `queryFn: async () => {${p1}\n    },\n    placeholderData: keepPreviousData\n  });`;
        });
      }

      // 3. Descriptive Toasts
      content = content.replace(/toast\.success\("Record added"\)/g, 'toast.success("Successfully created new record", { description: "The data has been saved to the database." })');
      content = content.replace(/toast\.success\("Record updated"\)/g, 'toast.success("Successfully updated record", { description: "Changes have been applied successfully." })');
      content = content.replace(/toast\.success\("Record deleted"\)/g, 'toast.success("Successfully deleted record", { description: "The record has been permanently removed." })');

      // 4. Tooltips fix (SAFE)
      content = content.replace(/<Tooltip(.*?)(\/?>)/g, (match, p1, p2) => {
        if (p1.includes('wrapperStyle')) return match;
        const p = p1.trim();
        if (p2 === '/>') {
            return `<Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} ${p} />`;
        }
        return `<Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} ${p}>`;
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

for (const dir of dirs) {
  processDir(dir);
}

// 5. Performance: Dynamic imports in app/dashboard/page.tsx
const dashboardPagePath = path.join(__dirname, 'app/dashboard/page.tsx');
if (fs.existsSync(dashboardPagePath)) {
  let pageContent = fs.readFileSync(dashboardPagePath, 'utf8');
  
  if (!pageContent.includes('next/dynamic')) {
    pageContent = pageContent.replace(/import {([^}]+)} from "\@\/components\/dashboard\/(orders-overview-chart|production-chart|revenue-chart|sales-donut-chart|recent-transactions)";/g, '// Replaced with dynamic imports');
    
    const dynamicImports = `import dynamic from 'next/dynamic';\n
const OrdersOverviewChart = dynamic(() => import("@/components/dashboard/orders-overview-chart").then(m => m.OrdersOverviewChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const ProductionChart = dynamic(() => import("@/components/dashboard/production-chart").then(m => m.ProductionChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const RevenueChart = dynamic(() => import("@/components/dashboard/revenue-chart").then(m => m.RevenueChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const SalesDonutChart = dynamic(() => import("@/components/dashboard/sales-donut-chart").then(m => m.SalesDonutChart), { ssr: false, loading: () => <div className="h-[300px] bg-gray-50/50 dark:bg-white/5 animate-pulse rounded-2xl w-full" /> });
const RecentTransactions = dynamic(() => import("@/components/dashboard/recent-transactions").then(m => m.RecentTransactions), { ssr: false });
`;

    pageContent = pageContent.replace(/import { OrdersOverviewChart } from "\@\/components\/dashboard\/orders-overview-chart";/, "");
    pageContent = pageContent.replace(/import { ProductionChart } from "\@\/components\/dashboard\/production-chart";/, "");
    pageContent = pageContent.replace(/import { RevenueChart } from "\@\/components\/dashboard\/revenue-chart";/, "");
    pageContent = pageContent.replace(/import { SalesDonutChart } from "\@\/components\/dashboard\/sales-donut-chart";/, "");
    pageContent = pageContent.replace(/import { RecentTransactions } from "\@\/components\/dashboard\/recent-transactions";/, "");

    pageContent = pageContent.replace(/import {([^}]+)} from "lucide-react";/, (match) => match + '\n' + dynamicImports);
    fs.writeFileSync(dashboardPagePath, pageContent, 'utf8');
    console.log('Fixed dynamic imports in', dashboardPagePath);
  }
}

// 6. Performance: Dynamic imports in lib/export-utils.ts
const exportUtilsPath = path.join(__dirname, 'lib/export-utils.ts');
if (fs.existsSync(exportUtilsPath)) {
  let exportContent = fs.readFileSync(exportUtilsPath, 'utf8');
  
  if (exportContent.includes('import * as XLSX from "xlsx"')) {
    exportContent = exportContent.replace(/import \* as XLSX from "xlsx";\n/, '');
    exportContent = exportContent.replace(/import jsPDF from "jspdf";\n/, '');
    exportContent = exportContent.replace(/import autoTable from "jspdf-autotable";\n/, '');

    exportContent = exportContent.replace(/const worksheet = XLSX\.utils\.json_to_sheet\(data\);/, `const XLSX = await import("xlsx");\n  const worksheet = XLSX.utils.json_to_sheet(data);`);
    exportContent = exportContent.replace(/export const exportToExcel = \(data: any\[\], filename: string\) => {/, 'export const exportToExcel = async (data: any[], filename: string) => {');

    exportContent = exportContent.replace(/const doc = new jsPDF\(\);/, `const jsPDF = (await import("jspdf")).default;\n  const autoTable = (await import("jspdf-autotable")).default;\n  const doc = new jsPDF();`);
    exportContent = exportContent.replace(/export const exportToPDF = \(data: any\[\], filename: string, columns: any\[\]\) => {/, 'export const exportToPDF = async (data: any[], filename: string, columns: any[]) => {');
    
    fs.writeFileSync(exportUtilsPath, exportContent, 'utf8');
    console.log('Fixed dynamic exports in', exportUtilsPath);
  }
}

console.log('Done executing all QA fixes');
