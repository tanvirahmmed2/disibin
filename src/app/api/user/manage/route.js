import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware";
import { toggleUserStatus, updateUserRole } from "@/lib/data/users";

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

        let updatedUser = null;

        if (role) {
            const validRoles = ['admin', 'manager', 'support', 'developer', 'user'];
            if (!validRoles.includes(role)) {
                return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 });
            }
            updatedUser = await updateUserRole(targetUserId, role);
        }

        // Toggle Status if provided
        if (isActive !== undefined) {
            updatedUser = await toggleUserStatus(targetUserId, isActive);
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
