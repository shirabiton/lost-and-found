import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import ColorModel from "@/app/lib/models/color";


//get all color
export async function GET() {
  try {
    await connect();

    const colors = await ColorModel.find()

    return NextResponse.json(
      { message: "colors were successfully fetched", data: colors },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch colors", error: error },
      { status: 500 }
    );
  }
}

// create new color
export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    const newColor = await ColorModel.create(body);

    return NextResponse.json(
      { message: "color  was successfully created", data: newColor },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "failes to create color", error: error },
      { status: 500 }
    );
  }
}
