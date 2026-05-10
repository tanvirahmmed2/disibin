import { dbQuery } from "../database/pg";

export async function getPackageBySlug(slug) {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name,
               (SELECT json_agg(json_build_object('name', f.name, 'description', f.description))
                FROM package_features pf
                JOIN features f ON pf.feature_id = f.feature_id
                WHERE pf.package_id = p.package_id) as features
        FROM packages p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.slug = $1 OR p.package_id::text = $1
    `, [slug]);
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
}

export async function getAllPackages() {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name
        FROM packages p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.is_active = true
        ORDER BY p.created_at DESC
    `, []);
    return res.rows;
}
