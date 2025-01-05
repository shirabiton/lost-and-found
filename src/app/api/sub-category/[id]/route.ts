import connect from "@/app/lib/db/mongo";
import CategoryModel from "@/app/lib/models/category";
import FoundItemModel from "@/app/lib/models/foundItem";
import LostItemModel from "@/app/lib/models/lostItem";
import SubCategoryModel from "@/app/lib/models/subCategory";
import subCategoryModel from "@/app/lib/models/subCategory";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


//get sub category by id
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

        if (!await SubCategoryModel.exists({ _id: id })) {
            return NextResponse.json(
                { message: `Sub category with id ${id} not found` },
                { status: 404 }
            );
        }

        //populate data from nested objects
        const data = await SubCategoryModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(id) },
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryId',
                },
            },
            {
                $unwind: { path: '$categoryId', preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: 'lostitems',
                    localField: 'lostItems',
                    foreignField: '_id',
                    as: 'lostItems',
                },
            },
            {
                $lookup: {
                    from: 'founditems',
                    localField: 'foundItems',
                    foreignField: '_id',
                    as: 'foundItems',
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    categoryId: { _id: '$categoryId._id', title: '$categoryId.title' }, // Ensuring categoryId is an object
                    lostItems: 1,
                    foundItems: 1,
                },
            },
        ]);

        if (!data) {
            return NextResponse.json(
                { message: "Sub category is not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Sub category was successfully fetched", data: data },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error fetching sub category", error: error },
            { status: 500 }
        );
    }
}


//update category by id
export async function PUT(request: NextRequest) {
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

        // Allows updating only the sub category title
        const { title } = await request.json();

        const subCategoryToUpdate = await subCategoryModel.findByIdAndUpdate(id, { "title": title }, { new: true, runValidators: true });

        if (!subCategoryToUpdate) {
            return NextResponse.json({ message: "Sub category is not found" }, { status: 404 });
        }


        return NextResponse.json(
            { message: "Sub category was updated successfully", data: subCategoryToUpdate },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error updating sub category", error: error },
            { status: 500 }
        );
    }
}


//delete sub category by id
export async function DELETE(request: NextRequest) {
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

        const subCategoryToDeleteBefore = await subCategoryModel.findById(id);

        if (subCategoryToDeleteBefore) {
            // Removes sub category ID from the category's subcategory list
            await CategoryModel.findByIdAndUpdate(
                subCategoryToDeleteBefore.categoryId,
                { $pull: { "subCategories": id } },
                { new: true }
            );
        }

        const subCategoryToDelete = await subCategoryModel.findByIdAndDelete(id);
        if (!subCategoryToDelete) {
            return NextResponse.json({ message: "Sub category is not found" }, { status: 404 });
        }

        // Deletes found and lost items of the sub category being deleted
        await FoundItemModel.deleteMany({ categoryId: subCategoryToDelete._id });
        await LostItemModel.deleteMany({ categoryId: subCategoryToDelete._id });

        return NextResponse.json(
            { message: "Sub category was successfully deleted", data: subCategoryToDelete },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error deleting sub category", error: error },
            { status: 500 }
        );
    }
}