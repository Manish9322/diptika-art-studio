import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { NextResponse } from "next/server";

/**
 * Middleware to verify admin JWT token
 * @param {Request} request - The incoming request object
 * @returns {Object|NextResponse} - Returns decoded token data or error response
 */
export const verifyAdminToken = (request) => {
  try {
    // Get token from authorization header
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        error: true,
        response: NextResponse.json(
          { success: false, message: "No token provided. Access denied." },
          { status: 401 }
        )
      };
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user is admin
    if (decoded.role !== "admin") {
      return {
        error: true,
        response: NextResponse.json(
          { success: false, message: "Insufficient permissions. Admin access required." },
          { status: 403 }
        )
      };
    }

    return {
      error: false,
      data: decoded
    };

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return {
        error: true,
        response: NextResponse.json(
          { success: false, message: "Invalid token" },
          { status: 401 }
        )
      };
    }
    
    if (error.name === "TokenExpiredError") {
      return {
        error: true,
        response: NextResponse.json(
          { success: false, message: "Token expired. Please login again." },
          { status: 401 }
        )
      };
    }

    return {
      error: true,
      response: NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: 500 }
      )
    };
  }
};
