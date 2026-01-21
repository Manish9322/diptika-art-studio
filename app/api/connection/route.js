import connectDB from "../../../utils/db";
import { NextResponse } from "next/server";
await connectDB();
export async function GET() {
    
    return NextResponse.json({ title: "DB Connection", message: "Connected to Database successfully", status: 200 });
}