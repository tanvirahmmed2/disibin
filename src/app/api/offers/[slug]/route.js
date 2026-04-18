import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Offer } from "@/lib/models/offer";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { success: false, message: 'Slug is required' }, 
                { status: 400 }
            );
        }

        const offer = await Offer.findOne({ slug });

        if (!offer) {
            return NextResponse.json(
                { success: false, message: 'No offer found with this slug' }, 
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Offer data found successfully',
            payload: offer 
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message }, 
            { status: 500 }
        );
    }
}