import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({
                success: false,
                message: 'slug not found'
            }, { status: 400 });
        }

        const query = "SELECT * FROM packages WHERE slug = $1 LIMIT 1";
        const result = await pool.query(query, [slug]);

        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'No package found with this slug'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'package data found successfully',
            payload: result.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}