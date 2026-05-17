import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const query = `
            SELECT user_id, name, email, phone, role, is_active, is_verified, created_at 
            FROM users 
            ORDER BY created_at DESC
        `;
        const res = await dbQuery(query);
        const users = res.rows;

        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 403 });
        }

        const { targetUserId, role, isActive } = await req.json();

        if (!targetUserId) {
            return NextResponse.json({ success: false, message: "targetUserId is required" }, { status: 400 });
        }

        // Fetch current user data to check role
        const res = await dbQuery("SELECT role, is_active FROM users WHERE user_id = $1", [targetUserId]);
        const targetUser = res.rows[0];

        if (!targetUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isTargetAdmin = targetUser.role === 'admin' && targetUser.is_active;

        // Check if we are removing admin status
        const removingAdminRole = isTargetAdmin && role && role !== 'admin';
        const deactivatingAdmin = isTargetAdmin && isActive === false;

        if (removingAdminRole || deactivatingAdmin) {
            const countRes = await dbQuery("SELECT COUNT(*) FROM users WHERE role = 'admin' AND is_active = TRUE");
            const adminCount = parseInt(countRes.rows[0].count) || 0;

            if (adminCount <= 1) {
                return NextResponse.json({ 
                    success: false, 
                    message: "Action denied: Cannot remove or deactivate the last administrator." 
                }, { status: 400 });
            }
        }

        let updatedUser = null;

        if (role) {
            const validRoles = ['admin', 'manager', 'support', 'developer', 'user'];
            if (!validRoles.includes(role)) {
                return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
            }
            
            const query = `UPDATE users SET role = $1, updated_at = now() WHERE user_id = $2 RETURNING user_id, name, email, role`;
            const updateRes = await dbQuery(query, [role, targetUserId]);
            updatedUser = updateRes.rows[0];
        }

        // Toggle Status if provided
        if (isActive !== undefined) {
            const query = `UPDATE users SET is_active = $1, updated_at = now() WHERE user_id = $2 RETURNING user_id, name, email, is_active`;
            const updateRes = await dbQuery(query, [isActive, targetUserId]);
            updatedUser = updateRes.rows[0];
        }

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: "No changes requested or user not found" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "User management action successful",
            data: updatedUser
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
