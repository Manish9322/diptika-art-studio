import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // In a JWT-based system, logout is handled client-side by removing the token
    // This endpoint can be used for any server-side cleanup if needed in the future
    
    return NextResponse.json({
      success: true,
      message: "Logout successful"
    }, { status: 200 });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
