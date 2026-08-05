import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

// GET single published product by slug (Public)
export async function GET(req, { params }) {
    try {
        const { slug } = await params;

        const res = await dbQuery(`
            SELECT
                p.id,
                p.name,
                p.slug,
                p.description,
                p.demo_url,
                p.price,
                p.discount,
                p.is_featured,
                p.is_published,
                p.created_at,
                p.updated_at,
                COALESCE(
                    (SELECT json_agg(
                        json_build_object(
                            'id', pi.id,
                            'title', pi.title,
                            'image', pi.image,
                            'public_id', pi.public_id,
                            'is_primary', pi.is_primary,
                            'created_at', pi.created_at
                        ) ORDER BY pi.is_primary DESC, pi.created_at ASC
                    )
                    FROM product_images pi
                    WHERE pi.product_id = p.id),
                    '[]'::json
                ) AS images,
                COALESCE(
                    (SELECT json_agg(
                        json_build_object(
                            'id', f.id,
                            'name', f.name,
                            'slug', f.slug,
                            'description', f.description,
                            'value', pf.value
                        ) ORDER BY f.name ASC
                    )
                    FROM product_features pf
                    JOIN features f ON pf.feature_id = f.id
                    WHERE pf.product_id = p.id),
                    '[]'::json
                ) AS features
            FROM products p
            WHERE p.slug = $1 AND p.is_published = true
            LIMIT 1
        `, [slug]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
