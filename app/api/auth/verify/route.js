import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../config/config";

export async function GET(request) {
  try {
    // Get token from authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Return decoded user info
    return NextResponse.json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          email: decoded.email,
          role: decoded.role
        }
      }
    }, { status: 200 });

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    
    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 401 }
      );
    }

    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
