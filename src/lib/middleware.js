import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_SECRET } from "./database/secret";
import { pool } from "./database/pg";

async function getAuthenticatedUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('user_token')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const query = `
            SELECT 
                user_id, name, email, phone, role, 
                address_line1, city, country, is_active, 
                email_verified, created_at 
            FROM public.users 
            WHERE user_id = $1 LIMIT 1
        `;
        
        const result = await pool.query(query, [decoded.id]);

        if (result.rowCount === 0) return null;

        const user = result.rows[0];
        
        if (!user.is_active) return null;

        return user;
    } catch (error) {
        return null;
    }
}

export async function isLogin() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    return { success: true, payload: user };
}



export async function isManager() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    
    if (user.role !== 'manager' && user.role !== 'admin') {
        return { success: false, message: 'Access denied: Managers only' };
    }
    return { success: true, payload: user };
}

export async function isSales() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    
    if (user.role !== 'sales' && user.role !== 'admin') {
        return { success: false, message: 'Access denied: Sales only' };
    }
    return { success: true, payload: user };
}

export async function isSupport() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    
    if (user.role !== 'support' && user.role !== 'admin') {
        return { success: false, message: 'Access denied: Support only' };
    }
    return { success: true, payload: user };
}