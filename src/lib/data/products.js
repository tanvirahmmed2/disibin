import { dbQuery, transaction } from "../database/pg";
import { addImage } from "./images";
import { createLog } from "./logs";

export async function getProductBySlug(slug) {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name,
               (SELECT COALESCE(json_agg(json_build_object('name', f.name, 'description', f.description, 'value', pf.value)), '[]'::json)
                FROM product_features pf
                JOIN features f ON pf.feature_id = f.feature_id
                WHERE pf.product_id = p.product_id) as features,
               (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                FROM images i
                WHERE i.entity_id = p.product_id AND i.entity_type = 'product') as images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.slug = $1 OR p.product_id::text = $1
    `, [slug]);
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
}

export async function getAllProducts(onlyActive = true) {
    const query = `
        SELECT p.*, c.name as category_name,
               (SELECT COALESCE(json_agg(json_build_object('url', i.url, 'is_primary', i.is_primary, 'id', i.image_id)), '[]'::json)
                FROM images i
                WHERE i.entity_id = p.product_id AND i.entity_type = 'product') as images,
               (SELECT url FROM images WHERE entity_id = p.product_id AND entity_type = 'product' AND is_primary = true LIMIT 1) as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        ${onlyActive ? 'WHERE p.is_active = true' : ''}
        ORDER BY p.created_at DESC
    `;
    const res = await dbQuery(query, []);
    return res.rows;
}

export async function createProduct(data) {
    return await transaction(async (client) => {
        const { name, slug, category_id, description, price, duration_days, is_lifetime, created_by, images, features } = data;
        
        // Insert product
        const productRes = await client.query(`
            INSERT INTO products (name, slug, category_id, description, price, duration_days, is_lifetime, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [name, slug, category_id, description, price, duration_days, is_lifetime, created_by]);
        
        const product = productRes.rows[0];

        // Handle images if provided
        if (images && Array.isArray(images)) {
            for (const img of images) {
                await client.query(`
                    INSERT INTO images (url, public_id, entity_type, entity_id, is_primary)
                    VALUES ($1, $2, 'product', $3, $4)
                `, [img.url, img.public_id, product.product_id, img.is_primary || false]);
            }
        }

        // Handle features if provided
        if (features && Array.isArray(features)) {
            for (const feature of features) {
                // Insert feature definition
                const featureRes = await client.query(`
                    INSERT INTO features (name, description)
                    VALUES ($1, $2)
                    RETURNING feature_id
                `, [feature.name, feature.description || '']);
                
                const featureId = featureRes.rows[0].feature_id;

                // Link to product
                await client.query(`
                    INSERT INTO product_features (product_id, feature_id, value)
                    VALUES ($1, $2, $3)
                `, [product.product_id, featureId, feature.value !== undefined ? feature.value : true]);
            }
        }

        // Log the action
        await createLog({
            user_id: created_by,
            action: 'CREATE',
            entity_type: 'product',
            entity_id: product.product_id,
            details: { name: product.name }
        });

        return product;
    });
}

export async function updateProduct(id, data, userId) {
    const { images, features, ...productData } = data;
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

    // Handle features
    if (features && Array.isArray(features)) {
        await transaction(async (client) => {
            // Since features are now product-specific, delete old ones and recreate
            // First, find existing feature IDs for this product to delete from features table
            const existingFeaturesRes = await client.query("SELECT feature_id FROM product_features WHERE product_id = $1", [id]);
            const existingFeatureIds = existingFeaturesRes.rows.map(r => r.feature_id);

            // Delete associations
            await client.query("DELETE FROM product_features WHERE product_id = $1", [id]);

            // Delete orphaned features
            if (existingFeatureIds.length > 0) {
                await client.query("DELETE FROM features WHERE feature_id = ANY($1)", [existingFeatureIds]);
            }

            for (const feature of features) {
                const featureRes = await client.query(`
                    INSERT INTO features (name, description)
                    VALUES ($1, $2)
                    RETURNING feature_id
                `, [feature.name, feature.description || '']);
                
                const featureId = featureRes.rows[0].feature_id;

                await client.query(`
                    INSERT INTO product_features (product_id, feature_id, value)
                    VALUES ($1, $2, $3)
                `, [id, featureId, feature.value !== undefined ? feature.value : true]);
            }
        });
    }

    // If images are provided in the update, we add them
    if (images && Array.isArray(images)) {
        for (const img of images) {
            await addImage({
                ...img,
                entity_type: 'product',
                entity_id: id
            });
        }
        if (!product) {
            const res = await dbQuery("SELECT * FROM products WHERE product_id = $1", [id]);
            product = res.rows[0];
        }
    }

    if (product && userId) {
        await createLog({
            user_id: userId,
            action: 'UPDATE',
            entity_type: 'product',
            entity_id: id,
            details: data
        });
    }

    return product;
}


export async function deleteProduct(id, userId) {
    const res = await dbQuery("DELETE FROM products WHERE product_id = $1 RETURNING *", [id]);
    const product = res.rows[0];

    if (product && userId) {
        await createLog({
            user_id: userId,
            action: 'DELETE',
            entity_type: 'product',
            entity_id: id,
            details: { name: product.name }
        });
    }
    return product;
}
