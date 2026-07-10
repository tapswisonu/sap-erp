// ─── ERP Mock Data for All Modules ──────────────────────────────────────────

// ── Data Overview ─────────────────────────────────────────────────────────────
export const dataOverviewStats = [
  { label: "Total Records", value: "1,24,856", change: "+2.4%", up: true, color: "cyan" },
  { label: "Active Modules", value: "8", change: "+1", up: true, color: "blue" },
  { label: "Sync Status", value: "98.7%", change: "+0.3%", up: true, color: "emerald" },
  { label: "Pending Approvals", value: "47", change: "-12", up: false, color: "amber" },
];

export const moduleActivityData = [
  { module: "Copper", records: 4820, active: 3200, pending: 1620 },
  { module: "Steel", records: 8200, active: 6100, pending: 2100 },
  { module: "Vendor", records: 3400, active: 2800, pending: 600 },
  { module: "Dispatch", records: 5600, active: 4900, pending: 700 },
  { module: "Sales", records: 9200, active: 7800, pending: 1400 },
  { module: "Purchase", records: 6700, active: 5300, pending: 1400 },
];

export const recentActivity = [
  { id: "ACT-001", module: "Copper", action: "Stock updated", user: "Rajesh Kumar", time: "2 min ago", status: "completed" },
  { id: "ACT-002", module: "Dispatch", action: "Shipment dispatched", user: "Priya Sharma", time: "15 min ago", status: "completed" },
  { id: "ACT-003", module: "Vendor", action: "PO raised #PO-2849", user: "Amit Verma", time: "32 min ago", status: "pending" },
  { id: "ACT-004", module: "Steel", action: "Stock alert triggered", user: "System", time: "1h ago", status: "alert" },
  { id: "ACT-005", module: "Month Plan", action: "June plan submitted", user: "Finance Team", time: "2h ago", status: "completed" },
  { id: "ACT-006", module: "Nomination", action: "Allocation approved", user: "Admin", time: "3h ago", status: "completed" },
];

// ── Copper Details ─────────────────────────────────────────────────────────────
export const copperKpis = [
  { label: "Total Stock", value: "4,820 kg", change: "-8.1%", up: false, color: "amber" },
  { label: "Consumed (MTD)", value: "2,340 kg", change: "+5.2%", up: true, color: "cyan" },
  { label: "Reorder Level", value: "6,000 kg", change: "threshold", up: false, color: "red" },
  { label: "Avg. Price/kg", value: "₹842", change: "+1.2%", up: true, color: "emerald" },
];

export const copperStockTrend = [
  { month: "Jan", stock: 8200, consumed: 2100, received: 1800 },
  { month: "Feb", stock: 7900, consumed: 2300, received: 2000 },
  { month: "Mar", stock: 7600, consumed: 2500, received: 2200 },
  { month: "Apr", stock: 7300, consumed: 2200, received: 1900 },
  { month: "May", stock: 6800, consumed: 2400, received: 1800 },
  { month: "Jun", stock: 6200, consumed: 2600, received: 2000 },
  { month: "Jul", stock: 5800, consumed: 2800, received: 2400 },
  { month: "Aug", stock: 5400, consumed: 2600, received: 2200 },
  { month: "Sep", stock: 5100, consumed: 2700, received: 2400 },
  { month: "Oct", stock: 4820, consumed: 2340, received: 2000 },
];

export const copperGrades = [
  { grade: "Grade A (99.9%)", stock: 2100, capacity: 5000, unit: "kg", status: "low", price: "₹910/kg" },
  { grade: "Grade B (99.5%)", stock: 1420, capacity: 4000, unit: "kg", status: "critical", price: "₹862/kg" },
  { grade: "Grade C (99.0%)", stock: 800, capacity: 3000, unit: "kg", status: "low", price: "₹820/kg" },
  { grade: "Copper Rods", stock: 500, capacity: 2000, unit: "kg", status: "critical", price: "₹895/kg" },
];

export const copperSuppliers = [
  { name: "MetalCorp Ltd.", supplied: 1200, pending: 300, rating: 4.8, status: "active" },
  { name: "CopperTech Industries", supplied: 800, pending: 0, rating: 4.5, status: "active" },
  { name: "ShineCu Pvt. Ltd.", supplied: 500, pending: 200, rating: 4.2, status: "delayed" },
  { name: "AlloyCraft Corp.", supplied: 400, pending: 100, rating: 4.0, status: "active" },
];

// ── Vendor Stock ───────────────────────────────────────────────────────────────
export const vendorKpis = [
  { label: "Total Vendors", value: "48", change: "+3", up: true, color: "cyan" },
  { label: "Active POs", value: "127", change: "+18", up: true, color: "blue" },
  { label: "Stock Value", value: "₹4.2Cr", change: "+6.4%", up: true, color: "emerald" },
  { label: "Delayed Orders", value: "9", change: "-4", up: false, color: "red" },
];

export const vendorList = [
  { id: "V-001", name: "MetalCorp Ltd.", category: "Copper", stock: 2400, unit: "kg", value: "₹20.2L", status: "active", lead: "7 days", rating: 4.8, orders: 24 },
  { id: "V-002", name: "SteelWorks Inc.", category: "Steel", stock: 8500, unit: "kg", value: "₹38.2L", status: "active", lead: "10 days", rating: 4.6, orders: 31 },
  { id: "V-003", name: "AlumaCraft Pvt.", category: "Aluminum", stock: 3200, unit: "kg", value: "₹12.8L", status: "active", lead: "5 days", rating: 4.4, orders: 18 },
  { id: "V-004", name: "TechSystems Co.", category: "Circuits", stock: 1800, unit: "units", value: "₹9.0L", status: "delayed", lead: "14 days", rating: 3.9, orders: 12 },
  { id: "V-005", name: "PlastiForm Ltd.", category: "Casing", stock: 12400, unit: "units", value: "₹6.2L", status: "active", lead: "3 days", rating: 4.7, orders: 42 },
  { id: "V-006", name: "ShineCu Pvt.", category: "Copper", stock: 1200, unit: "kg", value: "₹10.3L", status: "delayed", lead: "12 days", rating: 4.2, orders: 8 },
  { id: "V-007", name: "FastFix Supplies", category: "Fasteners", stock: 45000, unit: "units", value: "₹2.2L", status: "active", lead: "2 days", rating: 4.9, orders: 68 },
  { id: "V-008", name: "GridPower Solutions", category: "Transformers", stock: 24, unit: "units", value: "₹14.4L", status: "active", lead: "21 days", rating: 4.3, orders: 6 },
];

export const vendorPerformance = [
  { month: "Jan", onTime: 92, delayed: 8, cancelled: 2 },
  { month: "Feb", onTime: 88, delayed: 10, cancelled: 2 },
  { month: "Mar", onTime: 95, delayed: 4, cancelled: 1 },
  { month: "Apr", onTime: 90, delayed: 8, cancelled: 2 },
  { month: "May", onTime: 87, delayed: 11, cancelled: 2 },
  { month: "Jun", onTime: 93, delayed: 6, cancelled: 1 },
];

export const vendorCategoryBreakdown = [
  { name: "Copper", value: 32, color: "#f59e0b" },
  { name: "Steel", value: 28, color: "#60a5fa" },
  { name: "Aluminum", value: 15, color: "#a78bfa" },
  { name: "Electronics", value: 14, color: "#34d399" },
  { name: "Others", value: 11, color: "#94a3b8" },
];

// ── Steel Details ──────────────────────────────────────────────────────────────
export const steelKpis = [
  { label: "Total Stock", value: "8,200 kg", change: "+3.1%", up: true, color: "blue" },
  { label: "Consumed (MTD)", value: "3,480 kg", change: "+7.2%", up: true, color: "cyan" },
  { label: "Reorder Level", value: "5,000 kg", change: "safe", up: true, color: "emerald" },
  { label: "Avg. Price/kg", value: "₹58", change: "-0.8%", up: false, color: "amber" },
];

export const steelStockTrend = [
  { month: "Jan", stock: 9200, consumed: 3200, received: 3800 },
  { month: "Feb", stock: 9800, consumed: 3400, received: 4000 },
  { month: "Mar", stock: 10200, consumed: 3600, received: 3000 },
  { month: "Apr", stock: 9600, consumed: 3800, received: 3200 },
  { month: "May", stock: 9000, consumed: 3500, received: 2900 },
  { month: "Jun", stock: 8500, consumed: 3600, received: 3100 },
  { month: "Jul", stock: 8000, consumed: 3700, received: 3200 },
  { month: "Aug", stock: 7500, consumed: 3600, received: 3100 },
  { month: "Sep", stock: 7900, consumed: 3400, received: 3800 },
  { month: "Oct", stock: 8200, consumed: 3480, received: 3780 },
];

export const steelGrades = [
  { grade: "MS Sheets (3mm)", stock: 3200, capacity: 6000, unit: "kg", status: "optimal", price: "₹62/kg" },
  { grade: "MS Sheets (5mm)", stock: 2400, capacity: 5000, unit: "kg", status: "optimal", price: "₹65/kg" },
  { grade: "HR Coils", stock: 1800, capacity: 4000, unit: "kg", status: "low", price: "₹58/kg" },
  { grade: "Structural (Angle)", stock: 800, capacity: 3000, unit: "kg", status: "low", price: "₹54/kg" },
];

export const steelAlerts = [
  { item: "HR Coils", current: 1800, minimum: 2500, severity: "warning" },
  { item: "Structural Angle", current: 800, minimum: 1500, severity: "critical" },
];

// ── Dispatch Details ───────────────────────────────────────────────────────────
export const dispatchKpis = [
  { label: "Dispatched (MTD)", value: "203", change: "+14.6%", up: true, color: "emerald" },
  { label: "In Transit", value: "38", change: "+5", up: true, color: "blue" },
  { label: "Delivered", value: "1,469", change: "+22.1%", up: true, color: "cyan" },
  { label: "Returns", value: "7", change: "-3", up: false, color: "red" },
];

export const dispatchList = [
  { id: "DIS-1021", customer: "PowerTech Industries", items: "Industrial Motors x 48", value: "₹8,64,000", destination: "Pune", status: "delivered", date: "2026-05-14", eta: "2026-05-14" },
  { id: "DIS-1022", customer: "TechSystems Co.", items: "Circuit Assembly x 200", value: "₹3,20,000", destination: "Hyderabad", status: "in-transit", date: "2026-05-13", eta: "2026-05-16" },
  { id: "DIS-1023", customer: "GridPower Solutions", items: "Transformer Units x 12", value: "₹5,40,000", destination: "Delhi", status: "in-transit", date: "2026-05-13", eta: "2026-05-17" },
  { id: "DIS-1024", customer: "ElectroBuild Pvt.", items: "Control Panels x 8", value: "₹2,80,000", destination: "Chennai", status: "dispatched", date: "2026-05-12", eta: "2026-05-18" },
  { id: "DIS-1025", customer: "SteelFab Corp.", items: "Custom Fabrication Lot", value: "₹1,20,000", destination: "Mumbai", status: "delivered", date: "2026-05-11", eta: "2026-05-13" },
  { id: "DIS-1026", customer: "BuildMax Ltd.", items: "Steel Assemblies x 30", value: "₹4,50,000", destination: "Ahmedabad", status: "pending", date: "2026-05-15", eta: "2026-05-19" },
];

export const dispatchTrend = [
  { week: "Wk 1", dispatched: 48, delivered: 42, returned: 1 },
  { week: "Wk 2", dispatched: 52, delivered: 48, returned: 2 },
  { week: "Wk 3", dispatched: 61, delivered: 56, returned: 1 },
  { week: "Wk 4", dispatched: 58, delivered: 54, returned: 2 },
  { week: "Wk 5", dispatched: 70, delivered: 65, returned: 1 },
  { week: "Wk 6", dispatched: 65, delivered: 60, returned: 2 },
];

export const dispatchStatusBreakdown = [
  { name: "Delivered", value: 72, color: "#10b981" },
  { name: "In Transit", value: 18, color: "#3b82f6" },
  { name: "Dispatched", value: 7, color: "#22d3ee" },
  { name: "Pending", value: 3, color: "#f59e0b" },
];

// ── Nomination Details ─────────────────────────────────────────────────────────
export const nominationKpis = [
  { label: "Total Nominations", value: "284", change: "+32", up: true, color: "purple" },
  { label: "Approved", value: "198", change: "+28", up: true, color: "emerald" },
  { label: "Pending Review", value: "62", change: "+4", up: false, color: "amber" },
  { label: "Rejected", value: "24", change: "-8", up: false, color: "red" },
];

export const nominationList = [
  { id: "NOM-501", customer: "PowerTech Industries", material: "Copper Wire (Grade A)", qty: "500 kg", value: "₹4,55,000", allocatedBy: "Rajesh Kumar", status: "approved", date: "2026-05-14", priority: "high" },
  { id: "NOM-502", customer: "TechSystems Co.", material: "Circuit Boards (Type B)", qty: "200 units", value: "₹1,80,000", allocatedBy: "Priya Sharma", status: "pending", date: "2026-05-13", priority: "medium" },
  { id: "NOM-503", customer: "GridPower Solutions", material: "Steel Sheets (3mm)", qty: "2 tons", value: "₹1,24,000", allocatedBy: "Amit Verma", status: "approved", date: "2026-05-13", priority: "medium" },
  { id: "NOM-504", customer: "ElectroBuild Pvt.", material: "Aluminum Rods", qty: "800 kg", value: "₹2,88,000", allocatedBy: "Rajesh Kumar", status: "pending", date: "2026-05-12", priority: "low" },
  { id: "NOM-505", customer: "SteelFab Corp.", material: "HR Coils", qty: "1.5 tons", value: "₹87,000", allocatedBy: "System", status: "rejected", date: "2026-05-11", priority: "low" },
  { id: "NOM-506", customer: "BuildMax Ltd.", material: "Fasteners (Lot)", qty: "10,000 units", value: "₹22,000", allocatedBy: "Priya Sharma", status: "approved", date: "2026-05-10", priority: "high" },
];

export const nominationTrend = [
  { month: "Jan", approved: 42, pending: 12, rejected: 6 },
  { month: "Feb", approved: 38, pending: 15, rejected: 5 },
  { month: "Mar", approved: 50, pending: 10, rejected: 4 },
  { month: "Apr", approved: 45, pending: 14, rejected: 7 },
  { month: "May", approved: 52, pending: 11, rejected: 2 },
  { month: "Jun", approved: 48, pending: 13, rejected: 5 },
];

export const nominationPriorityBreakdown = [
  { name: "High", value: 38, color: "#ef4444" },
  { name: "Medium", value: 42, color: "#f59e0b" },
  { name: "Low", value: 20, color: "#10b981" },
];

// ── Month Plan ─────────────────────────────────────────────────────────────────
export const monthPlanKpis = [
  { label: "Plan Completion", value: "78.4%", change: "+4.2%", up: true, color: "cyan" },
  { label: "Revenue Target", value: "₹12Cr", change: "June 2026", up: true, color: "emerald" },
  { label: "Production Target", value: "48,000 units", change: "+8.3%", up: true, color: "blue" },
  { label: "Efficiency Score", value: "91.2%", change: "+2.1%", up: true, color: "purple" },
];

export const monthPlanData = [
  { month: "Jan", target: 40000, actual: 38400, revenue: 980, expense: 620 },
  { month: "Feb", target: 42000, actual: 41200, revenue: 1020, expense: 640 },
  { month: "Mar", target: 44000, actual: 46000, revenue: 1100, expense: 660 },
  { month: "Apr", target: 44000, actual: 43200, revenue: 1080, expense: 650 },
  { month: "May", target: 46000, actual: 48800, revenue: 1180, expense: 700 },
  { month: "Jun", target: 48000, actual: 44800, revenue: 1120, expense: 680 },
  { month: "Jul", target: 50000, actual: 52000, revenue: 1280, expense: 740 },
  { month: "Aug", target: 50000, actual: 49200, revenue: 1240, expense: 720 },
  { month: "Sep", target: 52000, actual: 54400, revenue: 1340, expense: 760 },
  { month: "Oct", target: 54000, actual: 51200, revenue: 1300, expense: 750 },
  { month: "Nov", target: 54000, actual: 56800, revenue: 1380, expense: 780 },
  { month: "Dec", target: 56000, actual: 60000, revenue: 1480, expense: 820 },
];

export const productionSchedule = [
  { line: "Line A — Motors", target: 14000, completed: 10800, pending: 3200, efficiency: 77 },
  { line: "Line B — Transformers", target: 8000, completed: 7200, pending: 800, efficiency: 90 },
  { line: "Line C — Circuits", target: 16000, completed: 13600, pending: 2400, efficiency: 85 },
  { line: "Line D — Assembly", target: 10000, completed: 8400, pending: 1600, efficiency: 84 },
];

export const revenueTargets = [
  { category: "Industrial", target: 480, achieved: 392, unit: "L" },
  { category: "Commercial", target: 360, achieved: 310, unit: "L" },
  { category: "Export", target: 240, achieved: 198, unit: "L" },
  { category: "Domestic", target: 120, achieved: 109, unit: "L" },
];

export const ordersOverviewList = [
  { id: "ORD-1001", customer: "Shree Metal Pvt Ltd", material: "Copper Rod 8mm", quantity: "2,500 KG", value: "₹12,45,000", status: "Completed", date: "28 May 2025" },
  { id: "ORD-1002", customer: "Jai Steel Industries", material: "Steel Coil 5mm", quantity: "5,000 KG", value: "₹18,75,000", status: "Processing", date: "27 May 2025" },
  { id: "ORD-1003", customer: "Bhavani Enterprises", material: "Copper Pipe 15mm", quantity: "1,200 KG", value: "₹8,64,000", status: "Pending", date: "26 May 2025" },
  { id: "ORD-1004", customer: "Sharma Metals", material: "Steel Plate 10mm", quantity: "3,750 KG", value: "₹14,06,250", status: "Processing", date: "25 May 2025" },
  { id: "ORD-1005", customer: "Kiran Alloys", material: "Copper Wire 4mm", quantity: "1,800 KG", value: "₹6,48,000", status: "Cancelled", date: "24 May 2025" },
];
