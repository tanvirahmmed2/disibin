import { dbQuery } from "../database/pg";

export async function getProjectBySlug(slug) {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name 
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.slug = $1 OR p.project_id::text = $1
    `, [slug]);
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
}

export async function getAllProjects() {
    const res = await dbQuery(`
        SELECT p.*, c.name as category_name 
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.created_at DESC
    `, []);
    return res.rows;
}
