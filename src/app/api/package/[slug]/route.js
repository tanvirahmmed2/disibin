import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

const mapPackage = (row) => ({
    ...row,
    id: row.package_id,
    _id: row.package_id,
    title: row.name,
    features: row.features || []
});

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'slug not found' }, { status: 400 });
        }

        const res = await dbQuery(`
            SELECT p.*, c.name as category_name 
            FROM packages p 
            LEFT JOIN categories c ON p.category_id = c.category_id 
            WHERE p.slug = $1
        `, [slug]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'No package found with this slug' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'package data found successfully',
            data: mapPackage(res.rows[0])
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
