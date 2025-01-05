import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { job_id, result } = await request.json();
  console.log("Received result for job", job_id, ":", result);

  // Process the result (e.g., store it, notify the user)
  return NextResponse.json({ message: "Result received successfully" });
}
