import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_SECRET } from "./database/secret";
import User from "./models/user";
import ConnectDB from "./database/mongo";


async function getAuthenticatedUser() {
    try {
        await ConnectDB();
        const cookieStore = await cookies(); 
        const token = cookieStore.get('user_token')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password").lean(); 
        return user || null;
    } catch (error) {
        return null;
    }
}


export async function isLogin() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    return { success: true, payload: user };
}

export async function isAdmin() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    
    if (user.role !== 'admin') {
        return { success: false, message: 'Access denied: Admins only' };
    }
    return { success: true, payload: user };
}

