import { dbQuery } from "../database/pg";

export async function createTeamMember(data) {
    const { name, post, email, image, image_id, bio } = data;
    const query = `
        INSERT INTO teams (name, post, email, image, image_id, bio)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const res = await dbQuery(query, [name, post, email, image, image_id, bio]);
    return res.rows[0];
}

export async function getTeamMembers() {
    const res = await dbQuery("SELECT * FROM teams ORDER BY created_at ASC");
    return res.rows;
}

export async function updateTeamMember(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    
    const query = `UPDATE teams SET ${setClause} WHERE member_id = $${keys.length + 1} RETURNING *`;
    const res = await dbQuery(query, [...values, id]);
    return res.rows[0];
}

export async function deleteTeamMember(id) {
    const res = await dbQuery("DELETE FROM teams WHERE member_id = $1 RETURNING *", [id]);
    return res.rows[0];
}
