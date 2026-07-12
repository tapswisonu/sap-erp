import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "month-plan.json");

export async function GET() {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(fileData);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch month plan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newRecord = await request.json();
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(fileData);
    
    data.push(newRecord);
    
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create month plan" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedRecord = await request.json();
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(fileData);
    
    const index = data.findIndex((item: any) => item.id === updatedRecord.id);
    if (index !== -1) {
      data[index] = updatedRecord;
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
      return NextResponse.json(updatedRecord);
    } else {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update month plan" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(fileData);
    
    const filteredData = data.filter((item: any) => item.id !== id);
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete month plan" }, { status: 500 });
  }
}
