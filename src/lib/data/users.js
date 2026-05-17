import { dbQuery } from "../database/pg";

export async function getUserByEmail(email) {
    const res = await dbQuery("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0] || null;
}

export async function getUserByPhone(phone) {
    const res = await dbQuery("SELECT * FROM users WHERE phone = $1", [phone]);
    return res.rows[0] || null;
}

export async function getUserById(id) {
    const res = await dbQuery("SELECT user_id, name, email, phone, role, is_active, is_verified, city, country, address_line1, address_line2, state, postal_code, last_login, created_at, updated_at FROM users WHERE user_id = $1", [id]);
    return res.rows[0] || null;
}

export async function createUser(data) {
    const { name, email, phone, password, role = 'user' } = data;
    const query = `
        INSERT INTO users (name, email, phone, password, role) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING user_id, name, email, role, created_at
    `;
    const res = await dbQuery(query, [name, email, phone, password, role]);
    return res.rows[0];
}

export async function updateUserProfile(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    
    const query = `
        UPDATE users 
        SET ${setClause}, updated_at = now() 
        WHERE user_id = $${keys.length + 1} 
        RETURNING user_id, name, email, phone, role, city, country, address_line1, address_line2, state, postal_code
    `;
    const res = await dbQuery(query, [...values, id]);
    return res.rows[0];
}

export async function updateUserRole(id, role) {
    const query = `UPDATE users SET role = $1, updated_at = now() WHERE user_id = $2 RETURNING user_id, name, email, role`;
    const res = await dbQuery(query, [role, id]);
    return res.rows[0];
}

export async function toggleUserStatus(id, isActive) {
    const query = `UPDATE users SET is_active = $1, updated_at = now() WHERE user_id = $2 RETURNING user_id, name, email, is_active`;
    const res = await dbQuery(query, [isActive, id]);
    return res.rows[0];
}

export async function setUserResetToken(email, token, expiresAt) {
    const query = `
        UPDATE users 
        SET reset_token = $1, token_expires_at = $2 
        WHERE email = $3 
        RETURNING user_id
    `;
    const res = await dbQuery(query, [token, expiresAt, email]);
    return res.rows[0] || null;
}

export async function getUserByResetToken(token) {
    const query = `
        SELECT user_id, email, token_expires_at 
        FROM users 
        WHERE reset_token = $1 AND token_expires_at > now()
    `;
    const res = await dbQuery(query, [token]);
    return res.rows[0] || null;
}

export async function updateUserPassword(id, hashedPassword) {
    const query = `
        UPDATE users 
        SET password = $1, reset_token = NULL, token_expires_at = NULL, updated_at = now() 
        WHERE user_id = $2 
        RETURNING user_id
    `;
    const res = await dbQuery(query, [hashedPassword, id]);
    return res.rows[0] || null;
}

export async function setUserVerificationToken(id, token, expiresAt) {
    const query = `
        UPDATE users 
        SET verification_token = $1, verification_expires_at = $2 
        WHERE user_id = $3 
        RETURNING user_id
    `;
    const res = await dbQuery(query, [token, expiresAt, id]);
    return res.rows[0] || null;
}

export async function getUserByVerificationToken(token) {
    const query = `
        SELECT user_id, email, verification_expires_at 
        FROM users 
        WHERE verification_token = $1 AND verification_expires_at > now()
    `;
    const res = await dbQuery(query, [token]);
    return res.rows[0] || null;
}

export async function verifyUserEmail(id) {
    const query = `
        UPDATE users 
        SET is_verified = TRUE, verification_token = NULL, verification_expires_at = NULL, updated_at = now() 
        WHERE user_id = $1 
        RETURNING user_id, is_verified
    `;
    const res = await dbQuery(query, [id]);
    return res.rows[0] || null;
}

export async function getManagementUsers() {
    const query = `
        SELECT user_id, name, email, phone, role, image 
        FROM users 
        WHERE role IN ('admin', 'manager', 'support', 'developer')
        AND is_active = TRUE
    `;
    const res = await dbQuery(query);
    return res.rows;
}

export async function getAllUsers() {
    const query = `
        SELECT user_id, name, email, phone, role, is_active, is_verified, created_at 
        FROM users 
        ORDER BY created_at DESC
    `;
    const res = await dbQuery(query);
    return res.rows;
}

