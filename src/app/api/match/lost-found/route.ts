import connect from "@/app/lib/db/mongo";
import { Circle } from "@/app/types/props/circle";
import { NextRequest, NextResponse } from "next/server";
import { FoundItem } from "@/app/types/props/foundItem";
import FoundItemModel from "@/app/lib/models/foundItem";
import { checkIfPointInsideCircle } from "@/app/utils/geolocationUtils";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const lostItemCheckMatch = await request.json();

    const foundItems = await FoundItemModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: { path: "$userId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategoryId",
        },
      },
      { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "categories",
          localField: "subCategoryId.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "colors",
          localField: "colorId",
          foreignField: "_id",
          as: "colorId",
        },
      },
      { $unwind: { path: "$colorId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "typepublictransports",
          localField: "publicTransport.typePublicTransportId",
          foreignField: "_id",
          as: "publicTransportType",
        },
      },
      {
        $unwind: {
          path: "$publicTransportType",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          subCategoryId: {
            _id: "$subCategoryId._id",
            title: "$subCategoryId.title",
            categoryId: {
              _id: "$category._id",
              title: "$category.title",
            },
          },
          colorId: { _id: "$colorId._id", groupId: "$colorId.groupId" },
          "userId._id": 1,
          "userId.fullName": 1,
          "userId.email": 1,
          "userId.password": 1,
          "userId.phone": 1,
          postion: 1,
          image: 1,
          descripition: 1,
          questions: 1,
          publicTransport: {
            city: "$publicTransport.city",
            typePublicTransportId: {
              _id: "$publicTransportType._id",
              title: "$publicTransportType.title",
            },
            line: "$publicTransport.line",
          },
        },
      },
    ]);

    const lostItem = lostItemCheckMatch.lostItem;

    // Filter the found items based on the found item properties and geographic matching
    const filteredFoundItems = foundItems.filter((foundItem: FoundItem) => {
      // Color Matching
      const colorMatches =
        lostItem.colorId?.groupId &&
        foundItem.colorId?.groupId &&
        String(lostItem.colorId.groupId) === String(foundItem.colorId.groupId);

      let matchesQuery = false;

      // Subcategory Logic if other
      if (lostItemCheckMatch.categoryId === "6756e2418b5ba2d221f44afb") {
        //split the sub category 
        const lostSubCategoryTitles = lostItem.subCategoryId?.title
          ? lostItem.subCategoryId.title
            .split(",")
            .map((title: string) => title.trim())
          : [];
        const foundSubCategoryTitles = foundItem.subCategoryId?.title
          ? foundItem.subCategoryId.title
            .split(",")
            .map((title) => title.trim())
          : [];

        //check if the at least word match
        matchesQuery =
          colorMatches &&
          lostSubCategoryTitles.some((lostWord: string) =>
            foundSubCategoryTitles.includes(lostWord)
          );
        // Subcategory Logic if not other
      } else {
        const subCategoryMatches =
          lostItem.subCategoryId?._id &&
          foundItem.subCategoryId?._id &&
          String(lostItem.subCategoryId._id) ===
          String(foundItem.subCategoryId._id);
        matchesQuery = colorMatches && subCategoryMatches;
      }

      // Location/Public Transport Filtering
      if (matchesQuery) {
        //filter by the position
        if (lostItem.circles && Array.isArray(lostItem.circles)) {
          return lostItem.circles.some((circle: Circle) =>
            checkIfPointInsideCircle(circle, foundItem.postion)
          );
          //filter by public transport
        } else if (lostItem.publicTransport && foundItem.publicTransport) {
          const pt = foundItem.publicTransport;
          return (
            pt.typePublicTransportId?._id &&
            String(pt.typePublicTransportId._id) ===
            String(lostItem.publicTransport.typePublicTransportId?._id) &&
            pt.city === lostItem.publicTransport.city &&
            pt.line === lostItem.publicTransport.line
          );
        }
      }
    });

    return NextResponse.json(
      {
        message: "The filter was successfully applied",
        data: filteredFoundItems,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error filtering lost items", error: error.message },
      { status: 500 }
    );
  }
}
