import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import ColorModel from "@/app/lib/models/color";

//get color by id
export async function GET(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }

    const color = await ColorModel.findById(id);

    if (!color) {
      return NextResponse.json({ error: "color not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "color were successfully fetched", data: color },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch color", error: error },
      { status: 500 }
    );
  }
}

//update color by id
export async function PUT(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Id parameter is missing" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const updatedColor = await ColorModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedColor) {
      return NextResponse.json({ error: "color not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "color was updated successfully", data: updatedColor },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update color", error: error },
      { status: 500 }
    );
  }
}

// delete color by id
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Id parameter is missing" },
        { status: 400 }
      );
    }
    const deletedColor = await ColorModel.findByIdAndDelete(id);
    if (!deletedColor) {
      return NextResponse.json({ error: "color not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "color was successfully deleted", data: deletedColor },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete color", error: error },
      { status: 500 }
    );
  }
}
