import ConnectDB from "@/lib/database/mongo";
import Package from "@/lib/models/package";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        await ConnectDB()
        const { slug } = await params

        if (!slug) {
            return NextResponse.json({
                success: false,
                message: 'id not found'
            }, { status: 400 })
        }

        const pack = await Package.findOne({ slug })

        if (!pack) {
            return NextResponse.json({
                success: false,
                message: 'No package found with this slug'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: 'package data found successfully',
            payload: pack
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch data',
            error: error.message
        }, { status: 500 })
    }

}


