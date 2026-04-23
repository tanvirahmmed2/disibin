import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbQuery } from "./database/pg";
import { JWT_SECRET } from "./database/secret";

async function getAuthenticatedContext() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('disibin')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id || decoded._id;
        if (!decoded || !userId) return null;

        const res = await dbQuery("SELECT user_id, name, email, role, is_active FROM users WHERE user_id = $1", [userId]);
        if (res.rows.length === 0) return null;
        const user = res.rows[0];

        if (!user.is_active) return null;

        let tenantId = decoded.tenantId;
        if (!tenantId) {
            const tenantRes = await dbQuery("SELECT tenant_id FROM tenant_users WHERE user_id = $1 LIMIT 1", [userId]);
            tenantId = tenantRes.rows[0]?.tenant_id;
        }

        return {
            id: user.user_id,
            _id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            tenantId: tenantId
        };
    } catch (error) {
        return null;
    }
}

export async function isLogin() {
    const context = await getAuthenticatedContext();
    if (!context) return { success: false, message: 'Please login' };
    return { success: true, data: context };
}

export async function isAdmin() {
    const context = await getAuthenticatedContext();
    if (!context || context.role !== 'admin') {
        return { success: false, message: 'Access denied: Admin only' };
    }
    return { success: true, data: context };
}

export async function isManager() {
    const context = await getAuthenticatedContext();
    if (!context || (context.role !== 'manager' && context.role !== 'admin')) {
        return { success: false, message: 'Access denied: Manager access required' };
    }
    return { success: true, data: context };
}

export async function isSupport() {
    const context = await getAuthenticatedContext();
    if (!context || (context.role !== 'support' && context.role !== 'manager' && context.role !== 'admin')) {
        return { success: false, message: 'Access denied: Support access required' };
    }
    return { success: true, data: context };
}

export async function isDeveloper() {
    const context = await getAuthenticatedContext();
    if (!context || (context.role !== 'developer' && context.role !== 'manager' && context.role !== 'admin')) {
        return { success: false, message: 'Access denied: Developer access required' };
    }
    return { success: true, data: context };
}

export async function isUser() {
    const context = await getAuthenticatedContext();
    if (!context || context.role !== 'user') {
        return { success: false, message: 'Access denied: User access required' };
    }
    return { success: true, data: context };
}


export async function hasRole(allowedRoles) {
    const context = await getAuthenticatedContext();
    if (!context) return { success: false, message: 'Please login' };
    if (!allowedRoles.includes(context.role)) {
        return { success: false, message: 'Access denied' };
    }
    return { success: true, data: context };
}
