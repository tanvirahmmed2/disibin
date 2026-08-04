import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery, transaction } from "@/lib/database/pg";

// GET all products (Manager only — includes unpublished)
export async function GET() {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const res = await dbQuery(`
            SELECT
                p.id,
                p.name,
                p.slug,
                p.description,
                p.demo_url,
                p.is_featured,
                p.is_published,
                p.created_by,
                p.created_at,
                p.updated_at,
                COALESCE(
                    (SELECT json_agg(
                        json_build_object(
                            'id', pi.id,
                            'title', pi.title,
                            'image', pi.image,
                            'public_id', pi.public_id,
                            'is_primary', pi.is_primary
                        ) ORDER BY pi.is_primary DESC, pi.created_at ASC
                    )
                    FROM product_images pi
                    WHERE pi.product_id = p.id),
                    '[]'::json
                ) AS images,
                COALESCE(
                    (SELECT json_agg(
                        json_build_object('id', f.id, 'name', f.name, 'slug', f.slug, 'value', pf.value)
                        ORDER BY f.name ASC
                    )
                    FROM product_features pf
                    JOIN features f ON pf.feature_id = f.id
                    WHERE pf.product_id = p.id),
                    '[]'::json
                ) AS features
            FROM products p
            ORDER BY p.created_at DESC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create product (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { name, description, demo_url, is_featured, is_published, images, features } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ success: false, message: "Product name is required" }, { status: 400 });
        }

        const product = await transaction(async (client) => {
            // Auto-generate unique slug from name
            const baseSlug = name.trim().toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            let slug = baseSlug || 'product';
            let counter = 1;
            while (true) {
                const existing = await client.query("SELECT id FROM products WHERE slug = $1", [slug]);
                if (existing.rows.length === 0) break;
                slug = `${baseSlug}-${counter++}`;
            }

            // Insert product
            const productRes = await client.query(`
                INSERT INTO products (name, slug, description, demo_url, is_featured, is_published, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `, [
                name.trim(),
                slug,
                description || null,
                demo_url || null,
                is_featured !== undefined ? is_featured : true,
                is_published !== undefined ? is_published : true,
                auth.data.id
            ]);

            const prod = productRes.rows[0];

            // Insert product images
            if (images && Array.isArray(images) && images.length > 0) {
                for (const img of images) {
                    if (!img.image || !img.public_id) continue;
                    await client.query(`
                        INSERT INTO product_images (title, image, public_id, product_id, is_primary)
                        VALUES ($1, $2, $3, $4, $5)
                    `, [
                        img.title || prod.name,
                        img.image,
                        img.public_id,
                        prod.id,
                        img.is_primary || false
                    ]);
                }
            }

            // Insert product features
            if (features && Array.isArray(features) && features.length > 0) {
                for (const feat of features) {
                    if (!feat.name || !feat.name.trim()) continue;

                    const trimmed = feat.name.trim();
                    const existingFeat = await client.query(
                        "SELECT id FROM features WHERE LOWER(name) = LOWER($1)",
                        [trimmed]
                    );

                    let featureId;
                    if (existingFeat.rows.length > 0) {
                        featureId = existingFeat.rows[0].id;
                    } else {
                        const baseSlug = trimmed.toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '');

                        let featureSlug = baseSlug || 'feature';
                        let counter = 1;
                        while (true) {
                            const existingSlug = await client.query("SELECT id FROM features WHERE slug = $1", [featureSlug]);
                            if (existingSlug.rows.length === 0) break;
                            featureSlug = `${baseSlug}-${counter++}`;
                        }

                        const newFeat = await client.query(
                            "INSERT INTO features (name, slug, description) VALUES ($1, $2, $3) RETURNING id",
                            [trimmed, featureSlug, feat.description || null]
                        );
                        featureId = newFeat.rows[0].id;
                    }

                    await client.query(`
                        INSERT INTO product_features (product_id, feature_id, value)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (product_id, feature_id) DO UPDATE SET value = EXCLUDED.value
                    `, [prod.id, featureId, feat.value !== undefined ? feat.value : true]);
                }
            }

            // Log action if activity_logs table exists
            try {
                await client.query(`
                    INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
                    VALUES ($1, $2, $3, $4, $5)
                `, [auth.data.id, 'CREATE', 'product', prod.id, `Created product: ${prod.name}`]);
            } catch (err) {
                // Ignore activity log failure
            }

            return prod;
        });

        return NextResponse.json({
            success: true,
            message: "Product created successfully",
            data: product
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
