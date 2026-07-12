import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function exportToCSV(data: any[], filename: string) {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export async function exportToPDF(data: any[], filename: string, columns: { header: string, dataKey: string }[]) {
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();
  
  // Create table body
  const body = data.map(item => {
    const row: any = {};
    columns.forEach(col => {
      row[col.dataKey] = item[col.dataKey];
    });
    return row;
  });

  autoTable(doc, {
    head: [columns.map(c => c.header)],
    body: body.map(row => columns.map(c => row[c.dataKey])),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`${filename}.pdf`);
}

export function printTable(data: any[], columns: { header: string, dataKey: string }[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Print Table</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Data Export</h2>
        <table>
          <thead>
            <tr>
              ${columns.map(c => `<th>${c.header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${columns.map(c => `<td>${item[c.dataKey] || ''}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 500);
          }
        </script>
      </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
}
