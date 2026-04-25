import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isAdmin } from "@/lib/middleware";

export async function PATCH(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { email, role } = await req.json();

        const allowedRoles = ['admin', 'manager', 'support', 'developer', 'user'];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
        }

        const res = await dbQuery("UPDATE users SET role = $1, updated_at = NOW() WHERE email = $2 RETURNING *", [role, email]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Log action
        await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, entity_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [auth.data.id, 'update', 'user', res.rows[0].user_id, `Changed role for ${email} to ${role}`]);

        return NextResponse.json({
            success: true,
            message: `Role updated for ${email}`,
            data: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
