// Comprehensive mock data for all Manufacturing ERP Modules

export interface DataRecord {
  poNumber: string;
  customerName: string;
  sectionSize: string;
  copperSize: string;
  type: string;
  quantity: number;
  incoterms: string;
  rate: number;
  poAmount: number;
  inrValue: number;
  port: string;
  orderDate: string;
  deliveryDate: string;
  billetCuttingDate: string;
  rollingDate: string;
  dholsot: string;
  readinessDate: string;
  vizgCutOff: string;
  status: "Completed" | "In-Progress" | "Pending" | "Delayed";
}

export interface CopperRecord {
  customerName: string;
  steelSize: string;
  copperSize: string;
  lme: number;
  copperQty: number;
  copperVendor: string;
  transporter: string;
  bookingStatus: "Confirmed" | "Pending" | "Cancelled";
  deliveryDate: string;
  actualDeliveryStatus: "Delivered" | "In-Transit" | "Delayed";
}

export interface VendorStockRecord {
  customerName: string;
  steelSize: string;
  copperSize: string;
  steelOpenStock: number;
  copperOpenQty: number;
  steelQty: number;
  copperQty: number;
}

export interface SteelRecord {
  customerName: string;
  billetSize: string;
  billetWeight: number;
  billetQty: number;
  steelSize: string;
  steelWeight: number;
  steelQty: number;
  rollingDate: string;
  cuttingDate: string;
  dispatchDate: string;
  actualDispatchDate: string;
  status: "Rolled" | "Cutting" | "Dispatched" | "Scheduled";
}

export interface DispatchRecord {
  date: string;
  vendorName: string;
  to: string;
  type: "Domestic" | "Export";
  sectionSize: string;
  customerName: string;
  noOfBars: number;
  invoiceNumber: string;
  weight: number;
  status: "Delivered" | "In-Transit" | "Pending";
}

export interface NominationRecord {
  customerName: string;
  type: "Domestic" | "Export";
  incoterm: string;
  port: string;
  weight: number;
  poNumber: string;
  barsOrContainer: string;
  qty: number;
  rate: number;
  poAmount: number;
  inrValue: number;
  status: "Approved" | "Pending" | "Rejected";
}

export interface MonthPlanRecord {
  customerName: string;
  type: string;
  incoterm: string;
  port: string;
  weightOrBars: string;
  rate: number;
  poAmount: number;
  inrValue: number;
  monthQty: number;
  monthTo: string;
  monthWeight: number;
}

// 1. DATA PAGE MOCK
export const dataPageMock: DataRecord[] = [
  {
    poNumber: "PO-2026-8801",
    customerName: "Rohan Steel Corp",
    sectionSize: "240mm",
    copperSize: "4.5mm",
    type: "Structural Alloy",
    quantity: 1200,
    incoterms: "FOB",
    rate: 85,
    poAmount: 102000,
    inrValue: 8466000,
    port: "Mundra",
    orderDate: "2026-05-01",
    deliveryDate: "2026-06-15",
    billetCuttingDate: "2026-05-10",
    rollingDate: "2026-05-20",
    dholsot: "Completed",
    readinessDate: "2026-06-01",
    vizgCutOff: "2026-06-08",
    status: "Completed",
  },
  {
    poNumber: "PO-2026-8802",
    customerName: "Apex Infra Developers",
    sectionSize: "180mm",
    copperSize: "3.2mm",
    type: "Heavy Section",
    quantity: 850,
    incoterms: "CIF",
    rate: 92,
    poAmount: 78200,
    inrValue: 6490600,
    port: "Nhava Sheva",
    orderDate: "2026-05-04",
    deliveryDate: "2026-06-20",
    billetCuttingDate: "2026-05-15",
    rollingDate: "2026-05-28",
    dholsot: "In-Progress",
    readinessDate: "2026-06-05",
    vizgCutOff: "2026-06-12",
    status: "In-Progress",
  },
  {
    poNumber: "PO-2026-8803",
    customerName: "Global Metal Connect",
    sectionSize: "310mm",
    copperSize: "6.0mm",
    type: "Precision Roll",
    quantity: 1500,
    incoterms: "EXW",
    rate: 78,
    poAmount: 117000,
    inrValue: 9711000,
    port: "Kandla",
    orderDate: "2026-05-08",
    deliveryDate: "2026-07-01",
    billetCuttingDate: "2026-05-22",
    rollingDate: "2026-06-05",
    dholsot: "Pending",
    readinessDate: "2026-06-18",
    vizgCutOff: "2026-06-25",
    status: "Pending",
  },
  {
    poNumber: "PO-2026-8804",
    customerName: "Zenith Automotives",
    sectionSize: "120mm",
    copperSize: "2.5mm",
    type: "Light Alloy",
    quantity: 600,
    incoterms: "DDP",
    rate: 110,
    poAmount: 66000,
    inrValue: 5478000,
    port: "Chennai",
    orderDate: "2026-05-10",
    deliveryDate: "2026-06-10",
    billetCuttingDate: "2026-05-12",
    rollingDate: "2026-05-18",
    dholsot: "Completed",
    readinessDate: "2026-05-30",
    vizgCutOff: "2026-06-05",
    status: "Delayed",
  },
];

// 2. COPPER DETAILS MOCK
export const copperPageMock: CopperRecord[] = [
  {
    customerName: "Rohan Steel Corp",
    steelSize: "240mm",
    copperSize: "4.5mm",
    lme: 8450,
    copperQty: 4.8,
    copperVendor: "Hindustan Copper",
    transporter: "Gati Logistics",
    bookingStatus: "Confirmed",
    deliveryDate: "2026-05-24",
    actualDeliveryStatus: "In-Transit",
  },
  {
    customerName: "Apex Infra Developers",
    steelSize: "180mm",
    copperSize: "3.2mm",
    lme: 8450,
    copperQty: 2.72,
    copperVendor: "Birla Copper",
    transporter: "VRL Logistics",
    bookingStatus: "Confirmed",
    deliveryDate: "2026-05-20",
    actualDeliveryStatus: "Delivered",
  },
  {
    customerName: "Global Metal Connect",
    steelSize: "310mm",
    copperSize: "6.0mm",
    lme: 8520,
    copperQty: 9.0,
    copperVendor: "Adani Metals",
    transporter: "Safexpress",
    bookingStatus: "Pending",
    deliveryDate: "2026-06-02",
    actualDeliveryStatus: "In-Transit",
  },
  {
    customerName: "Zenith Automotives",
    steelSize: "120mm",
    copperSize: "2.5mm",
    lme: 8390,
    copperQty: 1.5,
    copperVendor: "Hindustan Copper",
    transporter: "BlueDart",
    bookingStatus: "Confirmed",
    deliveryDate: "2026-05-15",
    actualDeliveryStatus: "Delayed",
  },
];

// 3. VENDOR STOCK MOCK
export const vendorStockPageMock: VendorStockRecord[] = [
  {
    customerName: "Rohan Steel Corp",
    steelSize: "240mm",
    copperSize: "4.5mm",
    steelOpenStock: 250,
    copperOpenQty: 15.2,
    steelQty: 1200,
    copperQty: 4.8,
  },
  {
    customerName: "Apex Infra Developers",
    steelSize: "180mm",
    copperSize: "3.2mm",
    steelOpenStock: 180,
    copperOpenQty: 8.5,
    steelQty: 850,
    copperQty: 2.72,
  },
  {
    customerName: "Global Metal Connect",
    steelSize: "310mm",
    copperSize: "6.0mm",
    steelOpenStock: 400,
    copperOpenQty: 22.0,
    steelQty: 1500,
    copperQty: 9.0,
  },
  {
    customerName: "Zenith Automotives",
    steelSize: "120mm",
    copperSize: "2.5mm",
    steelOpenStock: 90,
    copperOpenQty: 4.2,
    steelQty: 600,
    copperQty: 1.5,
  },
];

// 4. STEEL DETAILS MOCK
export const steelPageMock: SteelRecord[] = [
  {
    customerName: "Rohan Steel Corp",
    billetSize: "150x150",
    billetWeight: 2.4,
    billetQty: 50,
    steelSize: "240mm",
    steelWeight: 120,
    steelQty: 1200,
    rollingDate: "2026-05-20",
    cuttingDate: "2026-05-22",
    dispatchDate: "2026-06-02",
    actualDispatchDate: "2026-06-02",
    status: "Dispatched",
  },
  {
    customerName: "Apex Infra Developers",
    billetSize: "130x130",
    billetWeight: 1.8,
    billetQty: 45,
    steelSize: "180mm",
    steelWeight: 81,
    steelQty: 850,
    rollingDate: "2026-05-28",
    cuttingDate: "2026-05-30",
    dispatchDate: "2026-06-08",
    actualDispatchDate: "—",
    status: "Rolled",
  },
  {
    customerName: "Global Metal Connect",
    billetSize: "150x150",
    billetWeight: 3.1,
    billetQty: 60,
    steelSize: "310mm",
    steelWeight: 186,
    steelQty: 1500,
    rollingDate: "2026-06-05",
    cuttingDate: "2026-06-07",
    dispatchDate: "2026-06-15",
    actualDispatchDate: "—",
    status: "Scheduled",
  },
];

// 5. DISPATCH DETAILS MOCK
export const dispatchPageMock: DispatchRecord[] = [
  {
    date: "2026-05-14",
    vendorName: "SteelWorks Inc",
    to: "Delhi Hub",
    type: "Domestic",
    sectionSize: "240mm",
    customerName: "Rohan Steel Corp",
    noOfBars: 450,
    invoiceNumber: "INV-2026-0041",
    weight: 24.5,
    status: "Delivered",
  },
  {
    date: "2026-05-13",
    vendorName: "Birla Metals",
    to: "Port Mundra",
    type: "Export",
    sectionSize: "180mm",
    customerName: "Apex Infra Developers",
    noOfBars: 320,
    invoiceNumber: "INV-2026-0042",
    weight: 18.2,
    status: "In-Transit",
  },
  {
    date: "2026-05-12",
    vendorName: "Hindustan Copper",
    to: "Nhava Sheva",
    type: "Export",
    sectionSize: "310mm",
    customerName: "Global Metal Connect",
    noOfBars: 500,
    invoiceNumber: "INV-2026-0043",
    weight: 32.8,
    status: "Pending",
  },
];

// 6. NOMINATION DETAILS MOCK
export const nominationPageMock: NominationRecord[] = [
  {
    customerName: "Rohan Steel Corp",
    type: "Export",
    incoterm: "FOB",
    port: "Mundra",
    weight: 24.5,
    poNumber: "PO-2026-8801",
    barsOrContainer: "Container A",
    qty: 1200,
    rate: 85,
    poAmount: 102000,
    inrValue: 8466000,
    status: "Approved",
  },
  {
    customerName: "Apex Infra Developers",
    type: "Domestic",
    incoterm: "CIF",
    port: "Nhava Sheva",
    weight: 18.2,
    poNumber: "PO-2026-8802",
    barsOrContainer: "120 Bars",
    qty: 850,
    rate: 92,
    poAmount: 78200,
    inrValue: 6490600,
    status: "Pending",
  },
  {
    customerName: "Global Metal Connect",
    type: "Export",
    incoterm: "EXW",
    port: "Kandla",
    weight: 32.8,
    poNumber: "PO-2026-8803",
    barsOrContainer: "Container B",
    qty: 1500,
    rate: 78,
    poAmount: 117000,
    inrValue: 9711000,
    status: "Approved",
  },
];

// 7. MONTH PLAN MOCK
export const monthPlanPageMock: MonthPlanRecord[] = [
  {
    customerName: "Rohan Steel Corp",
    type: "Export",
    incoterm: "FOB",
    port: "Mundra",
    weightOrBars: "24.5 tons",
    rate: 85,
    poAmount: 102000,
    inrValue: 8466000,
    monthQty: 400,
    monthTo: "Mundra",
    monthWeight: 8.2,
  },
  {
    customerName: "Apex Infra Developers",
    type: "Domestic",
    incoterm: "CIF",
    port: "Nhava Sheva",
    weightOrBars: "18.2 tons",
    rate: 92,
    poAmount: 78200,
    inrValue: 6490600,
    monthQty: 300,
    monthTo: "Nhava Sheva",
    monthWeight: 6.4,
  },
  {
    customerName: "Global Metal Connect",
    type: "Export",
    incoterm: "EXW",
    port: "Kandla",
    weightOrBars: "32.8 tons",
    rate: 78,
    poAmount: 117000,
    inrValue: 9711000,
    monthQty: 500,
    monthTo: "Kandla",
    monthWeight: 10.9,
  },
];
