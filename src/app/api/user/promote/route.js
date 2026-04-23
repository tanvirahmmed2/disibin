import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isAdmin } from "@/lib/middleware";

export async function PATCH(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const body = await req.json();
        const { email, user_id, role } = body;
        
        if ((!email && !user_id) || !role) {
            return NextResponse.json({ success: false, message: "Email or User ID, and role are required" }, { status: 400 });
        }

        const validRoles = ["admin", "manager", "support", "developer", "user"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
        }

        let targetUser;
        if (user_id) {
            const res = await dbQuery("SELECT * FROM users WHERE user_id = $1", [user_id]);
            if (res.rows.length === 0) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            targetUser = res.rows[0];
        } else {
            const normalizedEmail = email.trim().toLowerCase();
            const res = await dbQuery("SELECT * FROM users WHERE email = $1", [normalizedEmail]);
            if (res.rows.length === 0) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
            targetUser = res.rows[0];
        }

        // Safety checks
        if (targetUser.role === "admin" && role !== "admin") {
            const countRes = await dbQuery("SELECT COUNT(*) FROM users WHERE role = 'admin'", []);
            if (parseInt(countRes.rows[0].count) <= 1) {
                return NextResponse.json({ success: false, message: "Security Error: Cannot remove the last administrator." }, { status: 403 });
            }
        }

        if (auth.data.id === targetUser.user_id && role !== "admin") {
            return NextResponse.json({ success: false, message: "Permission Denied: You cannot demote yourself from the admin role." }, { status: 403 });
        }

        const updatedRes = await dbQuery("UPDATE users SET role = $1, updated_at = NOW() WHERE user_id = $2 RETURNING *", [role, targetUser.user_id]);

        return NextResponse.json({
            success: true,
            message: `User ${targetUser.email} role updated to ${role}`,
            data: updatedRes.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}