import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
        }

        const res = await dbQuery(`
            SELECT p.*, c.name as category_name 
            FROM packages p 
            LEFT JOIN categories c ON p.category_id = c.category_id 
            WHERE p.slug = $1 OR p.package_id::text = $1
        `, [slug]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'Package not found' }, { status: 404 });
        }

        const pkg = res.rows[0];

        // Fetch features
        const featuresRes = await dbQuery(`
            SELECT f.name, f.description, pf.value
            FROM features f
            JOIN package_features pf ON f.feature_id = pf.feature_id
            WHERE pf.package_id = $1 AND pf.value = TRUE
        `, [pkg.package_id]);

        pkg.features = featuresRes.rows;

        return NextResponse.json({
            success: true,
            message: 'Package fetched successfully',
            data: pkg
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
