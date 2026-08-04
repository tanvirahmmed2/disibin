import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_SECRET } from "../database/secret";
import { dbQuery } from "../database/pg";


async function getAuthenticatedTeam() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('disibin-team')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        const teamId = decoded.id;
        if (!decoded || !teamId) return null;

        const res = await dbQuery(
            "SELECT id, name, email, role, is_active FROM teams WHERE id = $1",
            [teamId]
        );

        if (res.rows.length > 0) {
            const team = res.rows[0];
            if (!team.is_active) return null;
            return {
                id: team.id,
                name: team.name,
                email: team.email,
                role: team.role,
            };
        }

        return null;
    } catch (error) {
        return null;
    }
}


export async function isTeamLogin() {
    const context = await getAuthenticatedTeam();
    if (!context) return { success: false, message: 'Please login' };
    return { success: true, data: context };
}


export async function isManager() {
    const context = await getAuthenticatedTeam();
    if (!context || context.role !== 'manager') {
        return { success: false, message: 'Access denied: Manager access required' };
    }
    return { success: true, data: context };
}

export async function isSupport() {
    const context = await getAuthenticatedTeam();
    if (!context || context.role !== 'support') {
        return { success: false, message: 'Access denied: Support access required' };
    }
    return { success: true, data: context };
}

export async function isDeveloper() {
    const context = await getAuthenticatedTeam();
    if (!context || context.role !== 'developer') {
        return { success: false, message: 'Access denied: Developer access required' };
    }
    return { success: true, data: context };
}

