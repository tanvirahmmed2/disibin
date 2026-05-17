import { NextResponse } from "next/server";
import { hasRole } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

const MANAGEMENT_ROLES = ['admin', 'manager', 'support', 'developer'];

export async function GET(req) {
    try {
        const auth = await hasRole(MANAGEMENT_ROLES);
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const query = `
            SELECT user_id, name, email, phone, role 
            FROM users 
            WHERE role IN ('admin', 'manager', 'support', 'developer')
            AND is_active = TRUE
        `;
        const res = await dbQuery(query);
        const users = res.rows;
        
        // Filter out the current user from the list
        const filteredUsers = users.filter(user => user.user_id !== auth.data.id);

        return NextResponse.json({ success: true, data: filteredUsers });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
