import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery, transaction } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET single product
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        
        const res = await dbQuery(`
            SELECT p.*,
                   (SELECT COALESCE(json_agg(json_build_object('name', f.name, 'value', pf.value)), '[]'::json)
                    FROM product_features pf
                    JOIN features f ON pf.feature_id = f.feature_id
                    WHERE pf.product_id = p.product_id) as features,
                   (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                    FROM images i
                    WHERE i.entity_id = p.product_id AND i.entity_type = 'product') as images
            FROM products p
            WHERE p.slug = $1 OR p.product_id::text = $1
        `, [id]);
        
        const product = res.rows[0];
        
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update product (Manager only)
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { images, features, updated_at, created_at, product_id, slug, ...productData } = body;
        
        let product = null;

        if (Object.keys(productData).length > 0) {
            const keys = Object.keys(productData);
            const values = Object.values(productData);
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
            
            const query = `
                UPDATE products 
                SET ${setClause}, updated_at = now() 
                WHERE product_id = $${keys.length + 1} 
                RETURNING *
            `;
            const res = await dbQuery(query, [...values, id]);
            product = res.rows[0];
        }

        // Handle features if provided
        if (features && Array.isArray(features)) {
            await transaction(async (client) => {
                // Delete existing features for this product
                await client.query("DELETE FROM product_features WHERE product_id = $1", [id]);
                
                for (const feature of features) {
                    let featureId;
                    const existingRes = await client.query("SELECT feature_id FROM features WHERE name = $1", [feature.name]);
                    
                    if (existingRes.rows.length > 0) {
                        featureId = existingRes.rows[0].feature_id;
                    } else {
                        const featureRes = await client.query(`
                            INSERT INTO features (name)
                            VALUES ($1)
                            RETURNING feature_id
                        `, [feature.name]);
                        featureId = featureRes.rows[0].feature_id;
                    }
                    
                    await client.query(`
                        INSERT INTO product_features (product_id, feature_id, value)
                        VALUES ($1, $2, $3)
                    `, [id, featureId, feature.value !== undefined ? feature.value : true]);
                }
            });
        }

        // Handle images if provided in update
        if (images && Array.isArray(images)) {
            // Get existing images
            const existingImagesRes = await dbQuery(
                "SELECT * FROM images WHERE entity_type = 'product' AND entity_id = $1",
                [id]
            );
            const existingImages = existingImagesRes.rows;

            const newImageIds = images.map(img => img.id).filter(Boolean);

            // Find images to delete
            const imagesToDelete = existingImages.filter(img => !newImageIds.includes(img.image_id));

            // Delete from DB and Cloudinary
            for (const img of imagesToDelete) {
                await dbQuery("DELETE FROM images WHERE image_id = $1", [img.image_id]);
                if (img.public_id) {
                    try {
                        await cloudinary.uploader.destroy(img.public_id);
                    } catch (error) {
                        console.error("Failed to delete image from Cloudinary:", error);
                    }
                }
            }

            // Insert new images or update existing
            for (const img of images) {
                if (!img.id) { // New image
                    await dbQuery(`
                        INSERT INTO images (url, public_id, entity_type, entity_id, is_primary)
                        VALUES ($1, $2, 'product', $3, $4)
                    `, [img.url, img.public_id, id, img.is_primary || false]);
                } else {
                    // Update is_primary for existing images
                    await dbQuery(`
                        UPDATE images 
                        SET is_primary = $1 
                        WHERE image_id = $2
                    `, [img.is_primary || false, img.id]);
                }
            }
        }

        if (!product) {
            const res = await dbQuery("SELECT * FROM products WHERE product_id = $1", [id]);
            product = res.rows[0];
        }

        // Log action
        await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [auth.data.id, 'UPDATE', 'product', id, JSON.stringify({ name: product.name })]);

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE product (Manager only)
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const { id } = await params;
        
        // Get images to delete from Cloudinary
        const imagesRes = await dbQuery(
            "SELECT * FROM images WHERE entity_type = 'product' AND entity_id = $1",
            [id]
        );
        const images = imagesRes.rows;
        
        // Delete images from Cloudinary and database
        for (const img of images) {
            await dbQuery("DELETE FROM images WHERE image_id = $1", [img.image_id]);
            if (img.public_id) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (error) {
                    console.error("Failed to delete image from Cloudinary:", error);
                }
            }
        }

        const res = await dbQuery("DELETE FROM products WHERE product_id = $1 RETURNING *", [id]);
        const product = res.rows[0];

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Log action
        await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [auth.data.id, 'DELETE', 'product', id, JSON.stringify({ name: product.name })]);

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
