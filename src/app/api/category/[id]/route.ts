import connect from "@/app/lib/db/mongo";
import CategoryModel from "@/app/lib/models/category";
import SubCategoryModel from "@/app/lib/models/subCategory";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

//get category by id
export async function GET(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }

    if (!await CategoryModel.exists({ _id: id })) {
      return NextResponse.json(
        { message: `Category with id ${id} not found` },
        { status: 404 }
      );
    }

    //populate data from nested objects
    const data = await CategoryModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategories",
          foreignField: "_id",
          as: "subCategories",
        },
      },
      {
        $project: {
          subCategories: { _id: 1, title: 1 },
        },
      },
    ]);

    if (!data) {
      return NextResponse.json(
        { message: "Category is not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category was successfully fetched", data: data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching category", error: error },
      { status: 500 }
    );
  }
}


//update category by id
export async function PUT(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }

    const { title } = await request.json();
    const categoryToUpdate = await CategoryModel.findByIdAndUpdate(
      id,
      { title: title },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: "Category was updated successfully", data: categoryToUpdate },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating category", error: error },
      { status: 500 }
    );
  }
}

//delete category by id
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ message: "ID is missing" }, { status: 400 });
    }

    const categoryToDelete = await CategoryModel.findByIdAndDelete(id);

    if (!categoryToDelete) {
      return NextResponse.json(
        { message: "Category is not found" },
        { status: 404 }
      );
    }
    // Deletes subcategories of the category being deleted
    if (categoryToDelete.subCategories.length > 0) {
      for (const subCategory of categoryToDelete.subCategories) {
        await SubCategoryModel.findByIdAndDelete(subCategory._id);
      }
    }

    return NextResponse.json(
      { message: "Category was successfully deleted", data: categoryToDelete },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting category", error: error },
      { status: 500 }
    );
  }
}
