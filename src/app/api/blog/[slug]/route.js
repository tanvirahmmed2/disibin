import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
        }

        const res = await dbQuery(`
            SELECT * FROM blogs 
            WHERE slug = $1 OR blog_id::text = $1
        `, [slug]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Blog fetched successfully',
            data: res.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
