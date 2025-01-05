import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "cities.json");
    const d = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(d);

    return NextResponse.json(
      { message: "cities were successfully fetched", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { massage: "Error fetching cities: ", error: error },
      { status: 500 }
    );
  }
}
