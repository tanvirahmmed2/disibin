import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbQuery } from "../database/pg";
import { JWT_SECRET } from "../database/secret";

async function getAuthenticatedUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('disibin-user')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;
        if (!decoded || !userId) return null;

        const res = await dbQuery(
            "SELECT id, name, email, is_active FROM users WHERE id = $1",
            [userId]
        );

        if (res.rows.length > 0) {
            const user = res.rows[0];
            if (!user.is_active) return null;
            return {
                id: user.id,
                name: user.name,
                email: user.email,
            };
        }

        return null;
    } catch (error) {
        return null;
    }
}


export async function isUserLogin() {
    const context = await getAuthenticatedUser();
    if (!context) return { success: false, message: 'Please login' };
    return { success: true, data: context };
}
