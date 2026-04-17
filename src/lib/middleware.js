import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "./database/db";
import { JWT_SECRET } from "./database/secret";
import { User } from "./models/user";

async function getAuthenticatedUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('disibin')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded || !decoded._id) return null;

        await connectDB();
        const user = await User.findById(decoded._id).select("-password").lean();
        
        if (!user || !user.isActive) return null;

        return user;
    } catch (error) {
        return null;
    }
}


export async function isLogin() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    return { success: true, data: user };
}


export async function isAdmin() {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'admin') {
        return { success: false, message: 'Access denied: Admin only' };
    }
    return { success: true, data: user };
}

export async function isManager() {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'manager' && user.role !== 'admin') {
        return { success: false, message: 'Access denied: Manager access required' };
    }
    return { success: true, data: user };
}

export async function isProjectManager() {
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== 'project_manager' && user.role !== 'manager' && user.role !== 'admin')) {
        return { success: false, message: 'Access denied: Project Manager access required' };
    }
    return { success: true, data: user };
}

export async function isEditor() {
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== 'editor' && user.role !== 'manager' && user.role !== 'admin')) {
        return { success: false, message: 'Access denied: Editor access required' };
    }
    return { success: true, data: user };
}

export async function isSupport() {
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== 'support' && user.role !== 'manager' && user.role !== 'admin')) {
        return { success: false, message: 'Access denied: Support access required' };
    }
    return { success: true, data: user };
}

export async function isStaff() {
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== 'staff' && user.role !== 'manager' && user.role !== 'admin')) {
        return { success: false, message: 'Access denied: Staff access required' };
    }
    return { success: true, data: user };
}

export async function isClient() {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== 'client') {
        return { success: false, message: 'Access denied: Client only' };
    }
    return { success: true, data: user };
}


export async function hasRole(allowedRoles) {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    if (!allowedRoles.includes(user.role)) {
        return { success: false, message: 'Access denied' };
    }
    return { success: true, data: user };
}
