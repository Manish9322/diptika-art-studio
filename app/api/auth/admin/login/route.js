import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ADMIN_ID, ADMIN_PASSWORD, JWT_SECRET, JWT_EXPIRES_IN } from "../../../../../config/config";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify credentials against environment variables
    if (email !== ADMIN_ID || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: ADMIN_ID,
        role: "admin",
        loginTime: new Date().toISOString()
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN || "4d" }
    );

    // Return success response with token
    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          email: ADMIN_ID,
          role: "admin"
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
