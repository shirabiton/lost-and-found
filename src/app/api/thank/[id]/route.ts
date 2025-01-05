import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import ThankModel from "@/app/lib/models/thank";

//get thank by id
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

        //populate data from nested objects
        const data = await ThankModel.findById(id);

        if (!data) {
            return NextResponse.json(
                { error: "Thank not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Thank was successfully fetched", data: data },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch thank", error: error },
            { status: 500 }
        );
    }
}

//update thank by id
export async function PUT(request: NextRequest) {
    try {
        await connect();

        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: "ID is missing" }, { status: 400 });
        }

        const body = await request.json();

        const thankToUpdate = await ThankModel.findByIdAndUpdate(id, body, { new: true });

        if (!thankToUpdate) {
            return NextResponse.json(
                { message: "Thank is not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "Thank was updated successfully", data: thankToUpdate },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Error updating thank", error: error },
            { status: 500 }
        );
    }
}

//delete thank by id
export async function DELETE(request: NextRequest) {
    try {
        await connect();

        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();

        if (!id) {
            return NextResponse.json({ message: "ID is missing" }, { status: 400 });
        }

        const thankToDelete = await ThankModel.findByIdAndDelete(id);

        if (!thankToDelete) {
            return NextResponse.json(
                { message: "Thank is not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Thank was successfully deleted", data: thankToDelete },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting thank", error: error },
            { status: 500 }
        );
    }
}
