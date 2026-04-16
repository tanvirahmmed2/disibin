import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Package } from "@/lib/models/package";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'slug not found' }, { status: 400 });
        }

        const pkg = await Package.findOne({ slug });

        if (!pkg) {
            return NextResponse.json({ success: false, message: 'No package found with this slug' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'package data found successfully',
            payload: pkg
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}