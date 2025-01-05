import { getVercelUrl } from "@/app/utils/vercelUrl";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const railwayUrl = process.env.NEXT_PUBLIC_RAILWAY_URL;

export async function POST(request: NextRequest) {
  try {
    const vercelUrl = getVercelUrl(request);
    console.log(vercelUrl);

    const { text } = await request.json(); // Parse the body content from the request
    const response = await axios.post(`${railwayUrl}/analyze`, {
      text,
      vercelUrl,
    });
    return NextResponse.json(response.data); // Send the response data back
  } catch  {
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 }
    );
  }
}

