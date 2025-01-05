import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import UserModel from "@/app/lib/models/user";
import FoundItemModel from "@/app/lib/models/foundItem";
import LostItemModel from "@/app/lib/models/lostItem";
import mongoose from "mongoose";
import AlertModel from "@/app/lib/models/alert";


//get user by id
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

    if (!await UserModel.exists({ _id: id })) {

      return NextResponse.json(
        { message: `user with id ${id} not found` },
        { status: 404 }
      );
    }

    //populate data from nested objects
    const data = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'lostitems',
          localField: 'lostItems',
          foreignField: '_id',
          as: 'lostItems'
        }
      },
      {
        $lookup: {
          from: 'founditems',
          localField: 'foundItems',
          foreignField: '_id',
          as: 'foundItems'
        }
      },
      {
        $lookup: {
          from: 'founditems',
          localField: 'blockedItems',
          foreignField: '_id',
          as: 'blockedItems'
        }
      },
      {
        $lookup: {
          from: 'alerts',
          localField: 'alerts',
          foreignField: '_id',
          as: 'alerts'
        }
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
        }
      }
    ]);
    if (!data) {
      return NextResponse.json(
        { error: "user not found" }, {
        status: 404
      }
      );
    }

    return NextResponse.json(
      { message: "user were successfully fetched", data: data },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user", error: error },
      { status: 500 }
    );
  }
}

//update user by id
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

    const updatedUser = await UserModel.findByIdAndUpdate(id, body, { new: true });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "user not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "user  was successfully update", data: updatedUser },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user", error: error },
      { status: 500 }
    );
  }
}

//delete user by id
export async function DELETE(request: NextRequest) {
  try {


    console.log("in api delete before connect");

    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Id parameter is missing" },
        { status: 400 }
      );
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json(
        { error: "user not found" },
        { status: 404 }
      );
    }

    // Deletes found items of the user being deleted
    if (deletedUser.foundItems && deletedUser.foundItems.length > 0) {
      for (const foundItem of deletedUser.foundItems) {
        await FoundItemModel.findByIdAndDelete(foundItem._id);
      }
    }

    // Deletes lost items of the user being deleted
    if (deletedUser.lostItems && deletedUser.lostItems.length > 0) {
      for (const lostItem of deletedUser.lostItems) {
        await LostItemModel.findByIdAndDelete(lostItem._id);
      }
    }

    // Deletes alerts of the user being deleted
    if (deletedUser.alerts && deletedUser.alerts.length > 0) {
      for (const alert of deletedUser.alerts) {
        await AlertModel.findByIdAndDelete(alert._id);
      }
    }

    return NextResponse.json(
      { message: "User was successfully delete", data: deletedUser },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error },
      { status: 500 }
    );
  }
}
