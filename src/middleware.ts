import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import userStore from "./app/store/userStore";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let isAdmin = false;


  // Exclude specific routes and Next.js static files
  if (pathname.startsWith("/api/") || pathname.startsWith("/reset-password")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // If a token exists, verify its validity
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // If valid and user is on the login page, redirect to home
      if (pathname === "/login") {
        console.log("Valid token, redirecting to /home");
        return NextResponse.redirect(new URL("/home", req.url));
      }

      // Check for admin access
      const decoded = payload as { email: string };
      if (decoded.email === "lostandfound.assistance@gmail.com") {
        isAdmin = true;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      // clear global store

      userStore.getState().clearUser();
      userStore.getState().setAlerts([]);
      // Clear token and redirect to login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  } else {
    // If no token and not on the login page, redirect to login
    // if (pathname !== "/login") {    

      userStore.getState().clearUser();
      userStore.getState().setAlerts([]);

      return NextResponse.redirect(new URL("/login", req.url));
    // }
  }
  if (pathname === "/login" && token) {
    console.log("Token exists, redirecting to /home");
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Restrict access to admin-only pages
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.json(
      { message: "Access Denied - Admin only" },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

// Configuring middleware to specific paths
export const config = {
  matcher: ["/((?!login|_next).*)"], // Exclude "/login" and Next.js static files


};