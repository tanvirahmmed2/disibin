import { dbQuery } from "../database/pg";

export async function getBlogBySlug(slug) {
    const res = await dbQuery(`
        SELECT * FROM blogs 
        WHERE slug = $1 OR blog_id::text = $1
    `, [slug]);
    
    if (res.rows.length === 0) return null;
    return res.rows[0];
}

export async function getAllBlogs() {
    const res = await dbQuery('SELECT * FROM blogs ORDER BY created_at DESC', []);
    return res.rows;
}
