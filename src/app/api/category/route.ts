import connect from "@/app/lib/db/mongo";
import CategoryModel from "@/app/lib/models/category";
import { NextRequest, NextResponse } from "next/server";

//get all category
export async function GET() {
  try {
    await connect();

    //populate data from nested objects
    const data = await CategoryModel.aggregate([
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategories',
          foreignField: '_id',
          as: 'subCategories'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          subCategories: {
            $map: {
              input: {
                $sortArray: {
                  input: "$subCategories",
                  sortBy: { title: 1 }
                }
              },
              as: "subCategory",
              in: {
                _id: "$$subCategory._id",
                title: "$$subCategory.title"
              }
            }
          }
        }
      },
      {
        $sort: { title: 1 }
      }
    ]);

    return NextResponse.json(
      { message: "Categories were successfully fetched", data: data },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching categories", error: error },
      { status: 500 }
    );
  }
}

//create new category
export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const newCategory = await CategoryModel.create({ title: body.title });

    return NextResponse.json(
      { message: "Category was created successfully", data: newCategory },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error creating category", error: error },
      { status: 500 }
    );
  }
}