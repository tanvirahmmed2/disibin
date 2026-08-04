import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";

// GET single feature by id (Manager only)
export async function GET(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;

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
            WHERE f.id = $1
            GROUP BY f.id, f.name, f.slug, f.description
        `, [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Feature not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT update feature (Manager only)
export async function PUT(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;
        const { name, description } = await req.json();

        if (!name || !name.trim()) {
            return NextResponse.json({ success: false, message: "Feature name is required" }, { status: 400 });
        }

        const nameTrimmed = name.trim();

        // Check for duplicate name (excluding current feature)
        const dupCheck = await dbQuery(
            "SELECT id FROM features WHERE LOWER(name) = LOWER($1) AND id != $2",
            [nameTrimmed, id]
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
            const existingSlug = await dbQuery("SELECT id FROM features WHERE slug = $1 AND id != $2", [slug, id]);
            if (existingSlug.rows.length === 0) break;
            slug = `${baseSlug}-${counter++}`;
        }

        const res = await dbQuery(
            "UPDATE features SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *",
            [nameTrimmed, slug, description?.trim() || null, id]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Feature not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Feature updated successfully",
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE feature (Manager only)
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;

        const res = await dbQuery(
            "DELETE FROM features WHERE id = $1 RETURNING *",
            [id]
        );

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Feature not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Feature "${res.rows[0].name}" deleted successfully`
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
