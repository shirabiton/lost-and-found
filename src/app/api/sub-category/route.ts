import connect from "@/app/lib/db/mongo";
import CategoryModel from "@/app/lib/models/category";
import SubCategoryModel from "@/app/lib/models/subCategory";
import { NextRequest, NextResponse } from "next/server";


//get all suc categories
export async function GET() {
    try {
        await connect();

        //populate data from nested objects
        const data = await SubCategoryModel.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryId'
                }
            },
            {
                $unwind: { path: '$categoryId', preserveNullAndEmptyArrays: true }
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
                $project: {
                    _id: 1,
                    title: 1,
                    'categoryId.title': 1,
                    lostItems: 1,
                    foundItems: 1
                }
            }
        ]);

        return NextResponse.json(
            { message: "Sub categories were successfully fetched", data: data },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error fetching sub categories", error: error },
            { status: 500 }
        );
    }
}

//create new sub category
export async function POST(request: NextRequest) {
    try {
        await connect();

        const body = await request.json();
        if (!await CategoryModel.exists({ _id: body.categoryId._id })) {
            return NextResponse.json({ message: "Invalid categoryId: Category does not exist" }, { status: 400 });
        }
        const newSubCategory = await SubCategoryModel.create(body);
        // Adds the new subcategory to the selected category's subcategory list
        await CategoryModel.findByIdAndUpdate(
            body.categoryId._id,
            { $push: { "subCategories": newSubCategory._id } },
            { new: true }
        );

        return NextResponse.json(
            { message: "Sub category was created successfully", data: newSubCategory },
            { status: 201 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error creating sub category", error: error },
            { status: 500 }
        );
    }
}