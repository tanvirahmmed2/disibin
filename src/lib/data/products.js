import { dbQuery, transaction } from "../database/pg";
import { addImage } from "./images";
import { createLog } from "./logs";

export async function getProductBySlug(slug) {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name,
               (SELECT json_agg(json_build_object('name', f.name, 'description', f.description, 'value', pf.value))
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
        const { name, slug, category_id, description, price, duration_days, is_lifetime, created_by, images } = data;
        
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
    const { images, ...productData } = data;
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

    // If images are provided in the update, we add them (standard behavior)
    // Complex image management (delete, set primary) is usually handled via specific image APIs
    if (images && Array.isArray(images)) {
        for (const img of images) {
            await addImage({
                ...img,
                entity_type: 'product',
                entity_id: id
            });
        }
        // Fetch product again if it wasn't updated just now, to include any changes if needed
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
