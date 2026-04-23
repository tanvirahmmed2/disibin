import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

const mapOffer = (row) => ({
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
            return NextResponse.json(
                { success: false, message: 'Slug is required' }, 
                { status: 400 }
            );
        }

        const res = await dbQuery("SELECT * FROM packages WHERE slug = $1 AND is_active = true", [slug]);

        if (res.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No offer found with this slug' }, 
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Offer data found successfully',
            payload: mapOffer(res.rows[0])
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message }, 
            { status: 500 }
        );
    }
}