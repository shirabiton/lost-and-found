import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import UserModel from "@/app/lib/models/user";

//get all users
export async function GET() {
  try {
    await connect();

    //populate data from nested objects
    const data = await UserModel.aggregate([
      {
        $lookup: {
          from: "lostitems",
          localField: "lostItems",
          foreignField: "_id",
          as: "lostItems",
        },
      },
      {
        $lookup: {
          from: "founditems",
          localField: "foundItems",
          foreignField: "_id",
          as: "foundItems",
        },
      },
      {
        $lookup: {
          from: "founditems",
          localField: "blockedItems",
          foreignField: "_id",
          as: "blockedItems",
        },
      },
      {
        $lookup: {
          from: "alerts",
          localField: "alerts",
          foreignField: "_id",
          as: "alerts",
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          password: 1,
          phone: 1,
          lostItems: 1,
          foundItems: 1,
          blockedItems: 1,
          alerts: 1,
          chatRooms: 1
        },
      },
    ]);

    return NextResponse.json(
      { message: "Sub users were successfully fetched", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error },
      { status: 500 }
    );
  }
}

//create new user
export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    const newUser = await UserModel.create(body);

    return NextResponse.json(
      { message: "users were successfully fetched", data: newUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create users", error: error },
      { status: 500 }
    );
  }
}
