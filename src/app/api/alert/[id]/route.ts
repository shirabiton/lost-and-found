import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import UserModel from "@/app/lib/models/user";
import AlertModel from "@/app/lib/models/alert";

//get alert by id
export async function GET(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }

    const data = await AlertModel.findById(id);

    if (!data) {
      return NextResponse.json({ error: "alert not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "alert were successfully fetched", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch alert", error: error },
      { status: 500 }
    );
  }
}

//update alert item by id
export async function PUT(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }
    const body = await request.json();

    // Validate that the user exists in the database
    if (body.userId && !(await UserModel.exists({ _id: body.userId }))) {
      return NextResponse.json(
        { message: "Invalid userId: user does not exist" },
        { status: 400 }
      );
    }

    const alertToUpdate = await AlertModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!alertToUpdate) {
      return NextResponse.json(
        { message: "alert is not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "alert was updated successfully", data: alertToUpdate },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating alert item", error: error },
      { status: 500 }
    );
  }
}

//delete alert by id
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }

    const alertToDeleteBefore = await AlertModel.findById(id);

    if (alertToDeleteBefore) {
      // Remove the found item ID from the associated user's foundItems array
      await UserModel.findByIdAndUpdate(
        alertToDeleteBefore.userId,
        { $pull: { alerts: id } },
        { new: true }
      );
    }

    const alertToDelete = await AlertModel.findByIdAndDelete(id);
    if (!alertToDelete) {
      return NextResponse.json(
        { message: "alert is not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "alert was successfully deleted", data: alertToDelete },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting alert", error: error },
      { status: 500 }
    );
  }
}
