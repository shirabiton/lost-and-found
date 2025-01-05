import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/app/lib/db/mongo";
import UserModel from "@/app/lib/models/user";
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

  // Check if token exists in cookies (the user might already be logged in)
  const token = request.cookies.get("token");

  if (token) {
    try {
      // Token already exists, so skip login flow
      return NextResponse.json(
        {
          message: "User already logged in",
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token - ready to create a new user", error: error },
        { status: 401 }
      );
    }
  }

  // continue with login if no token is found
  const { email, password } = await request.json();

  await connect();

  // Check if the user exists in the database
  const user = await UserModel.findOne({ email });

  if (user) {
    if (email === user.email && password === user.password) {
      const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      // Set the token in a cookie
      const headers = new Headers();
      const isProduction = process.env.NODE_ENV === "production";
      headers.append(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; SameSite=${isProduction ? "None" : "Lax"
        }${isProduction ? "; Secure" : ""}`
      );

      return NextResponse.json(
        { message: "Login successful", token, user },
        { headers }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 404 }
    );
  }
}
