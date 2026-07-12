import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const filePath = path.join(process.cwd(), "data", "users.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(fileContents);

    const match = users.find(
      (u: any) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (match) {
      return NextResponse.json({ success: true, user: match });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid User ID or Password." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
