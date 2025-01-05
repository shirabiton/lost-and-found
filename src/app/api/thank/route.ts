import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/lib/db/mongo";
import ThankModel from "@/app/lib/models/thank";

//get all thanks
export async function GET() {
    try {
        await connect();
        const data = await ThankModel.find();

        return NextResponse.json(
            { message: "Thanks were successfully fetched", data: data },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch thanks", error: error },
            { status: 500 }
        );
    }
}

//create new thank
export async function POST(req: NextRequest) {
    try {
        await connect();

        const body = await req.json();

        const newThank = await ThankModel.create(body);

        return NextResponse.json(
            { message: "Thank was created successfully", data: newThank },
            { status: 201 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error creating thank", error: error },
            { status: 500 }
        );
    }
}
