import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Original seed file included in the repo
const seedFilePath = path.join(process.cwd(), "data", "dispatch-details.json");

// Writable file path in Vercel's /tmp directory
const tmpFilePath = path.join(os.tmpdir(), "dispatch-details.json");

async function getData() {
  try {
    // 1. Try to read from /tmp first (contains any user modifications)
    const fileData = await fs.readFile(tmpFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // 2. If no /tmp file exists, read from the initial seed data
      try {
        const seedData = await fs.readFile(seedFilePath, "utf8");
        const parsedData = JSON.parse(seedData);
        // Copy seed data to /tmp for future writes
        await fs.writeFile(tmpFilePath, JSON.stringify(parsedData, null, 2), "utf8");
        return parsedData;
      } catch (seedError: any) {
        if (seedError.code === "ENOENT") return [];
        throw seedError;
      }
    }
    throw error;
  }
}

async function saveData(data: any) {
  // Always write to /tmp since process.cwd() is read-only on Vercel
  await fs.writeFile(tmpFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await getData();
    
    let newRecord = { ...body };
    if (!newRecord.id) {
      const maxIdNum = data.length > 0 ? Math.max(...data.map((o: any) => parseInt((o.id || "").split('-')[1] || "1000"))) : 1000;
      newRecord.id = `DISP-${maxIdNum + 1}`;
    }
    
    data.push(newRecord);
    await saveData(data);
    
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = await getData();
    
    const index = data.findIndex((item: any) => item.id === body.id);
    if (index === -1) return NextResponse.json({ error: "Record not found" }, { status: 404 });
    
    data[index] = { ...data[index], ...body };
    await saveData(data);
    
    return NextResponse.json(data[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    
    const data = await getData();
    const filteredData = data.filter((item: any) => item.id !== id);
    if (filteredData.length === data.length) return NextResponse.json({ error: "Record not found" }, { status: 404 });
    
    await saveData(filteredData);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete data" }, { status: 500 });
  }
}
