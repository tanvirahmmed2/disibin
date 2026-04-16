import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import { isManager } from "@/lib/middleware";

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
        }

        const operatorRole = auth.payload.role;
        const { user_id, role } = await req.json();

        if (!user_id || !role) {
            return NextResponse.json({ success: false, message: 'User ID and Role are required' }, { status: 400 });
        }

        // Restriction: Only Admin can promote someone to Admin
        if (role === 'admin' && operatorRole !== 'admin') {
            return NextResponse.json({ success: false, message: 'Only Admin can promote users to Admin role' }, { status: 403 });
        }

        // Restriction: Only Admin can modify an existing Admin's role
        const targetUser = await User.findById(user_id);
        if (!targetUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        if (targetUser.role === 'admin' && operatorRole !== 'admin') {
            return NextResponse.json({ success: false, message: 'Cannot modify Admin users' }, { status: 403 });
        }

        const validRoles = ["admin", "manager", "project_manager", "editor", "support", "staff", "client"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(user_id, { role }, { new: true }).select("-password");

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `User role updated to ${role} successfully`,
            payload: user
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
