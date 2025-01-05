import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import LostItemModel from "@/app/lib/models/lostItem";
import SubCategoryModel from "@/app/lib/models/subCategory";
import UserModel from "@/app/lib/models/user";
import TypePublicTransportModel from "@/app/lib/models/typePublicTransport";
import mongoose from "mongoose";


//get lost item by id
export async function GET(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "ID is missing" },
        { status: 400 }
      )
    }

    if (!await LostItemModel.exists({ _id: id })) {
      return NextResponse.json(
        { message: `Lost item with id ${id} not found` },
        { status: 404 }
      );
    }


    //populate data from nested objects
    const data = await LostItemModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId'
        }
      },
      {
        $unwind: { path: '$userId', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategoryId',
          foreignField: '_id',
          as: 'subCategoryId'
        }
      },
      {
        $unwind: { path: '$subCategoryId', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'colors',
          localField: 'colorId',
          foreignField: '_id',
          as: 'colorId'
        }
      },
      {
        $unwind: { path: '$colorId', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup:
        {
          from: 'typepublictransports',
          localField: 'publicTransport.typePublicTransportId',
          foreignField: '_id',
          as: 'publicTransportType'
        }
      },
      {
        $unwind: { path: '$publicTransportType', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$typePublicTransportId', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          subCategoryId: {
            _id: '$subCategoryId._id',
            title: '$subCategoryId.title'
          },
          'colorId': 1,
          'userId._id': 1,
          'userId.fullName': 1,
          'userId.email': 1,
          'userId.password': 1,
          'userId.phone': 1,
          circles: 1,
          publicTransport: {
            _id: '$publicTransport._id',
            city: '$publicTransport.city',
            typePublicTransportId: {
              _id: '$publicTransportType._id',
              title: '$publicTransportType.title'
            },
            line: '$publicTransport.line'
          }
        }
      }
    ]);

    if (!data) {
      return NextResponse.json(
        { error: "Lost item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "lostItem were successfully fetched", data: data },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch lost item", error: error },
      { status: 500 }
    );
  }
}

//update lost item by id
export async function PUT(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "ID is missing" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate that the sub-category cat exists in the database
    if (!await SubCategoryModel.exists({ _id: body.subCategoryId })) {
      return NextResponse.json({ message: "Invalid subCategoryId: sub category does not exist" }, { status: 400 });
    }
    // Validate that the user exists in the database
    if (!await UserModel.exists({ _id: body.userId })) {
      return NextResponse.json({ message: "Invalid userId: user does not exist" }, { status: 400 });
    }
    // Validate that the public transport type exists in the database
    if (body.publicTransport && !await TypePublicTransportModel.exists({ _id: body.publicTransport.typePublicTransportId })) {
      return NextResponse.json({ message: "Invalid userId: user does not exist" }, { status: 400 });
    }

    const lostItemToUpdate = await LostItemModel.findByIdAndUpdate(id, body, { new: true });

    if (!lostItemToUpdate) {
      return NextResponse.json(
        { message: "Lost item is not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Lost item was updated successfully", data: lostItemToUpdate },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error updating lost item", error: error },
      { status: 500 }
    );
  }
}

//delete lost item by id
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "ID is missing" },
        { status: 400 }
      );
    }
    const lostItemToDeleteBefore = await LostItemModel.findById(id)

    if (lostItemToDeleteBefore) {
      // Remove the lost item ID from the associated sub-category's lostItems array
      await SubCategoryModel.findByIdAndUpdate(
        lostItemToDeleteBefore.subCategoryId,
        { $pull: { "lostItems": id } },
        { new: true }
      );
      // Remove the lost item ID from the associated user's lostItems array
      await UserModel.findByIdAndUpdate(
        lostItemToDeleteBefore.userId,
        { $pull: { "lostItems": id } },
        { new: true }
      );
    }

    const lostItemToDelete = await LostItemModel.findByIdAndDelete(id);
    if (!lostItemToDelete) {
      return NextResponse.json(
        { message: "Lost item is not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Lost item was successfully deleted", data: lostItemToDelete },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting lost item", error: error, },
      { status: 500 }
    );
  }
}
