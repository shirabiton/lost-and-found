import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import UserModel from "@/app/lib/models/user";
import AlertModel from "@/app/lib/models/alert";

//get all alerts
export async function GET() {
  try {
    await connect();

    const data = await AlertModel.find();

    return NextResponse.json(
      { message: "alerts were successfully fetched", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch alerts", error: error },
      { status: 500 }
    );
  }
}

//create new alert
export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();

    // Validate that the user exists in the database
    if (!(await UserModel.exists({ _id: body.userId }))) {
      return NextResponse.json(
        { message: "Invalid userId: user does not exist" },
        { status: 400 }
      );
    }

    const newAlert = await AlertModel.create(body);

    // Update the user to associate them with the new alert
    await UserModel.findByIdAndUpdate(
      body.userId,
      { $push: { alerts: newAlert._id } },
      { new: true }
    );

    return NextResponse.json(
      { message: "alert was created successfully", data: newAlert },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating alert", error: error },
      { status: 500 }
    );
  }
}
