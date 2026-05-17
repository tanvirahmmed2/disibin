import { dbQuery } from "../database/pg";

export async function getAllCategories() {
    const res = await dbQuery("SELECT * FROM categories ORDER BY name ASC", []);
    return res.rows;
}

export async function getCategoryById(id) {
    const res = await dbQuery("SELECT * FROM categories WHERE category_id = $1", [id]);
    return res.rows[0];
}

export async function createCategory(data) {
    const { name, slug } = data;
    const res = await dbQuery(
        "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *",
        [name, slug]
    );
    return res.rows[0];
}
