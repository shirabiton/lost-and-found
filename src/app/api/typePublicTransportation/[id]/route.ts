import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import TypePublicTransportModel from "@/app/lib/models/typePublicTransport";


//get publicTransportation by id
export async function GET(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();


    if (!id) {
      return NextResponse.json(
        { message: "ID is missing" },
        { status: 400 }
      )
    }

    const publicTransportation = await TypePublicTransportModel.findById(id);

    if (!publicTransportation) {
      return NextResponse.json(
        { error: "publicTransportation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "publicTransportation were successfully fetched", data: publicTransportation },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch publicTransportation", error: error },
      { status: 200 }
    );

  }
}

//update publicTransportation by id
export async function PUT(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Id parameter is missing" },
        { status: 400 }
      );
    }
    const updatedPublicTransportation = await TypePublicTransportModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedPublicTransportation) {
      return NextResponse.json(
        { error: "public transportation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transportation was successfully update", data: updatedPublicTransportation },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update public transportation", error: error },
      { status: 500 }
    );
  }
}

//delete publicTransportation by id
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

    const deletedPublicTransportation = await TypePublicTransportModel.deleteOne();
    if (!deletedPublicTransportation) {
      return NextResponse.json(
        { error: "Public Transportation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Transportation was successfully delete", data: deletedPublicTransportation },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching sub transportation", error: error },
      { status: 500 }
    );
  }
}
