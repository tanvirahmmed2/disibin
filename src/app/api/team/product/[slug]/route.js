import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery, transaction } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET single product by slug (Manager only)
export async function GET(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

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
            WHERE p.slug = $1
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

// PUT update product (Manager only)
export async function PUT(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { slug } = await params;
        const body = await req.json();
        const { name, description, demo_url, price, discount, is_featured, is_published, images, features } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ success: false, message: "Product name is required" }, { status: 400 });
        }

        // Verify product exists
        const existingRes = await dbQuery("SELECT id, name, slug FROM products WHERE slug = $1", [slug]);
        if (existingRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        const productId = existingRes.rows[0].id;
        const currentName = existingRes.rows[0].name;
        const currentSlug = existingRes.rows[0].slug;

        const updatedProduct = await transaction(async (client) => {
            // Generate updated unique slug if product name changed
            let newSlug = currentSlug;
            const newNameTrimmed = name.trim();
            if (newNameTrimmed.toLowerCase() !== currentName.toLowerCase()) {
                const baseSlug = newNameTrimmed.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');

                newSlug = baseSlug || 'product';
                let counter = 1;
                while (true) {
                    const existing = await client.query(
                        "SELECT id FROM products WHERE slug = $1 AND id != $2",
                        [newSlug, productId]
                    );
                    if (existing.rows.length === 0) break;
                    newSlug = `${baseSlug}-${counter++}`;
                }
            }

            // Update core product fields including slug
            const productRes = await client.query(`
                UPDATE products
                SET name = $1, slug = $2, description = $3, demo_url = $4,
                    price = $5, discount = $6, is_featured = $7, is_published = $8, updated_at = now()
                WHERE id = $9
                RETURNING *
            `, [
                newNameTrimmed,
                newSlug,
                description || null,
                demo_url || null,
                Number(price) || 0,
                Number(discount) || 0,
                is_featured !== undefined ? is_featured : true,
                is_published !== undefined ? is_published : false,
                productId
            ]);

            const prod = productRes.rows[0];

            // Sync images: delete removed, insert new
            if (images && Array.isArray(images)) {
                const incomingIds = images.filter(i => i.id).map(i => i.id);

                // Delete images not in the incoming list
                const existingImages = await client.query(
                    "SELECT id, public_id FROM product_images WHERE product_id = $1",
                    [productId]
                );
                for (const existing of existingImages.rows) {
                    if (!incomingIds.includes(existing.id)) {
                        await client.query("DELETE FROM product_images WHERE id = $1", [existing.id]);
                        if (existing.public_id) {
                            try {
                                await cloudinary.uploader.destroy(existing.public_id);
                            } catch (err) {
                                console.error("Cloudinary delete failed:", err.message);
                            }
                        }
                    }
                }

                // Update is_primary for existing images
                for (const img of images) {
                    if (img.id) {
                        await client.query(
                            "UPDATE product_images SET is_primary = $1, title = $2 WHERE id = $3 AND product_id = $4",
                            [img.is_primary || false, img.title || prod.name, img.id, productId]
                        );
                    } else {
                        // Insert new images
                        if (!img.image || !img.public_id) continue;
                        await client.query(`
                            INSERT INTO product_images (title, image, public_id, product_id, is_primary)
                            VALUES ($1, $2, $3, $4, $5)
                        `, [
                            img.title || prod.name,
                            img.image,
                            img.public_id,
                            productId,
                            img.is_primary || false
                        ]);
                    }
                }
            }

            // Sync features: remove all and re-insert
            if (features && Array.isArray(features)) {
                await client.query("DELETE FROM product_features WHERE product_id = $1", [productId]);

                for (const feat of features) {
                    if (!feat.name || !feat.name.trim()) continue;

                    const trimmed = feat.name.trim();
                    let featureId = feat.id;

                    if (featureId) {
                        const existingFeat = await client.query("SELECT id FROM features WHERE id = $1", [featureId]);
                        if (existingFeat.rows.length === 0) {
                            featureId = null;
                        }
                    }

                    if (!featureId) {
                        const existingByName = await client.query(
                            "SELECT id FROM features WHERE LOWER(name) = LOWER($1)",
                            [trimmed]
                        );
                        if (existingByName.rows.length > 0) {
                            featureId = existingByName.rows[0].id;
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
                    }

                    await client.query(`
                        INSERT INTO product_features (product_id, feature_id, value)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (product_id, feature_id) DO UPDATE SET value = EXCLUDED.value
                    `, [productId, featureId, feat.value !== undefined ? feat.value : true]);
                }
            }

            // Log action
            await client.query(`
                INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `, [auth.data.id, 'UPDATE', 'product', productId, `Updated product: ${prod.name}`]);

            return prod;
        });

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE product by slug (Manager only) — cascades to product_images
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { slug } = await params;

        // Fetch all images to delete from Cloudinary
        const productRes = await dbQuery(`
            SELECT p.id, p.name, pi.public_id
            FROM products p
            LEFT JOIN product_images pi ON pi.product_id = p.id
            WHERE p.slug = $1
        `, [slug]);

        if (productRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const productId = productRes.rows[0].id;
        const productName = productRes.rows[0].name;

        // Delete from Cloudinary before DB deletion
        const publicIds = productRes.rows
            .map(r => r.public_id)
            .filter(Boolean);

        for (const publicId of publicIds) {
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Cloudinary delete failed:", err.message);
            }
        }

        // Delete product (cascades to product_images and product_features)
        await dbQuery("DELETE FROM products WHERE id = $1", [productId]);

        // Log action
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [auth.data.id, 'DELETE', 'product', productId, `Deleted product: ${productName}`]);

        return NextResponse.json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
