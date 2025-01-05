import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/app/lib/models/user";
import connect from "@/app/lib/db/mongo";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const email = await request.json();


    // Query the database for the user
    const user = await UserModel.findOne(email);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return the user data 
    return NextResponse.json(
      { message: "use was successfully find by email", data: user },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error finding user", error: error },
      { status: 500 }
    );
  }
}