import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "steel-details.json");

async function getData() {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(fileData);
  } catch (error: any) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
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
    
    const maxIdNum = data.length > 0 ? Math.max(...data.map((o: any) => parseInt(o.id.split('-')[1] || "1000"))) : 1000;
    const newRecord = { ...body, id: `STL-${maxIdNum + 1}` };
    
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
