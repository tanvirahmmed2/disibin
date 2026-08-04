import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET all features with usage count (Manager only)
export async function GET() {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const res = await dbQuery(`
            SELECT
                f.id,
                f.name,
                f.slug,
                f.description,
                COUNT(pf.id)::int AS product_count,
                COALESCE(
                    (SELECT json_agg(
                        json_build_object('id', p.id, 'name', p.name, 'slug', p.slug)
                        ORDER BY p.name ASC
                    )
                    FROM product_features pf2
                    JOIN products p ON p.id = pf2.product_id
                    WHERE pf2.feature_id = f.id),
                    '[]'::json
                ) AS products
            FROM features f
            LEFT JOIN product_features pf ON pf.feature_id = f.id
            GROUP BY f.id, f.name, f.slug, f.description
            ORDER BY f.name ASC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create new feature (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { name, description } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json({ success: false, message: "Feature name is required" }, { status: 400 });
        }

        const nameTrimmed = name.trim();

        // Check for duplicate name
        const dupCheck = await dbQuery(
            "SELECT id FROM features WHERE LOWER(name) = LOWER($1)",
            [nameTrimmed]
        );
        if (dupCheck.rows.length > 0) {
            return NextResponse.json({ success: false, message: "A feature with this name already exists" }, { status: 409 });
        }

        // Generate unique slug
        const baseSlug = nameTrimmed.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        let slug = baseSlug || 'feature';
        let counter = 1;
        while (true) {
            const existingSlug = await dbQuery("SELECT id FROM features WHERE slug = $1", [slug]);
            if (existingSlug.rows.length === 0) break;
            slug = `${baseSlug}-${counter++}`;
        }

        const res = await dbQuery(
            "INSERT INTO features (name, slug, description) VALUES ($1, $2, $3) RETURNING *",
            [nameTrimmed, slug, description?.trim() || null]
        );

        return NextResponse.json({
            success: true,
            message: "Feature created successfully",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
