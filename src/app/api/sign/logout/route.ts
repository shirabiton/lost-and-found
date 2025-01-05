import { NextRequest, NextResponse } from "next/server";
import { getUserStore } from "@/app/store/userStore";
import { getVercelUrl } from "@/app/utils/vercelUrl";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request: NextRequest) {
  const vercelUrl = getVercelUrl(request);
  const clearUser = getUserStore().clearUser;

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

  // Set the token in a cookie
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None`
  );

  clearUser();

  return NextResponse.json({ message: "Logged out successfully" }, { headers });
}