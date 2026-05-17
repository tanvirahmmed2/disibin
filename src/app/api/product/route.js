import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery, transaction } from "@/lib/database/pg";

// GET all products (Public)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const includeInactive = searchParams.get('all') === 'true';
        
        // Only managers/admins can see inactive products if they ask
        let onlyActive = true;
        if (includeInactive) {
            const auth = await isManager();
            if (auth.success) onlyActive = false;
        }

        const query = `
            SELECT p.*,
                   (SELECT COALESCE(json_agg(json_build_object('name', f.name, 'value', pf.value)), '[]'::json)
                    FROM product_features pf
                    JOIN features f ON pf.feature_id = f.feature_id
                    WHERE pf.product_id = p.product_id) as features,
                   (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                    FROM images i
                    WHERE i.entity_id = p.product_id AND i.entity_type = 'product') as images,
                   (SELECT url FROM images WHERE entity_id = p.product_id AND entity_type = 'product' AND is_primary = true LIMIT 1) as primary_image
            FROM products p
            ${onlyActive ? 'WHERE p.is_active = true' : ''}
            ORDER BY p.created_at DESC
        `;
        const res = await dbQuery(query, []);
        const products = res.rows;

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create product (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const body = await req.json();
        const { name, price, description, duration_days, is_lifetime, demo_url, images, features } = body;

        if (!name || price === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields (name, price)" }, { status: 400 });
        }

        const product = await transaction(async (client) => {
            // Automatically generate slug
            const baseSlug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            let slug = baseSlug;
            let counter = 1;
            
            while (true) {
                const existingRes = await client.query("SELECT product_id FROM products WHERE slug = $1", [slug]);
                if (existingRes.rows.length === 0) break;
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            
            // Insert product
            const productRes = await client.query(`
                INSERT INTO products (name, slug, description, price, duration_days, is_lifetime, demo_url, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `, [name, slug, description, price, duration_days, is_lifetime, demo_url, auth.data.id]);
            
            const prod = productRes.rows[0];

            // Handle images if provided
            if (images && Array.isArray(images)) {
                for (const img of images) {
                    await client.query(`
                        INSERT INTO images (url, public_id, entity_type, entity_id, is_primary)
                        VALUES ($1, $2, 'product', $3, $4)
                    `, [img.url, img.public_id, prod.product_id, img.is_primary || false]);
                }
            }

            // Handle features if provided
            if (features && Array.isArray(features)) {
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
                    `, [prod.product_id, featureId, feature.value !== undefined ? feature.value : true]);
                }
            }

            // Create log
            await client.query(`
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `, [auth.data.id, 'CREATE', 'product', prod.product_id, JSON.stringify({ name: prod.name })]);

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
