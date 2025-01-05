import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongo";
import UserModel from "@/app/lib/models/user";
import axios from "axios";
import { getVercelUrl } from "@/app/utils/vercelUrl";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request: NextRequest) {

  const vercelUrl = getVercelUrl(request);

  // Add CORS headers
  const origin = request.headers.get("origin");
  const allowedOrigins = [baseUrl, vercelUrl];
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json(
      { message: "Origin not allowed" },
      { status: 403 }
    );
  }

  // Handle preflight requests for CORS
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  try {
    const { fullName, email, password, phone } = await request.json();
    console.log("in sign up ");
    console.log("Payload being sent:", {
      fullName,
      email,
      password,
      phone,
    });

    await connect();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const response = await axios.post(`${baseUrl}/api/user`, {
      fullName,
      email,
      password,
      phone,
    });
    const user = await response.data;

    const token = jwt.sign({ email, password }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const headers = new Headers();
    const isProduction = process.env.NODE_ENV === "production";

    headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=${isProduction ? "None" : "Lax"
      }${isProduction ? "; Secure" : ""}`
    );

    return NextResponse.json(
      { message: "Signup successful", token, user },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
}
