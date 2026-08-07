import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

// GET all product showcase images (Public)
export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT 
                pi.id, 
                pi.title, 
                pi.image, 
                pi.public_id, 
                pi.is_primary, 
                pi.created_at,
                p.id AS product_id,
                p.name AS product_name,
                p.slug AS product_slug,
                p.demo_url
            FROM product_images pi
            JOIN products p ON pi.product_id = p.id
            WHERE p.is_published = true
            ORDER BY pi.is_primary DESC, pi.created_at DESC
        `).catch(() => ({ rows: [] }));

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
