import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Token not found" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    return NextResponse.json(
      { message: "Token is valid", data: decoded },
      { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid token", error },
      { status: 401 }
    );
  }
}
