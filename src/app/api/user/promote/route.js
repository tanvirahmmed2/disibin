import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import { isAdmin } from "@/lib/middleware";

export async function PATCH(req) {
    try {
        await connectDB();

        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: 403 }
            );
        }

        const { email, role } = await req.json();

        if (!email || !role) {
            return NextResponse.json(
                { success: false, message: "Email and role are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const validRoles = [
            "admin",
            "manager",
            "project_manager",
            "editor",
            "support",
            "staff",
            "client"
        ];

        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { success: false, message: "Invalid role" },
                { status: 400 }
            );
        }

        const targetUser = await User.findOne({ email: normalizedEmail });

        if (!targetUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (targetUser.role === "admin" && role !== "admin") {
            const adminCount = await User.countDocuments({ role: "admin" });

            if (adminCount <= 1) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Critical Error: Cannot remove the last administrator."
                    },
                    { status: 403 }
                );
            }
        }

        if (
            auth.data._id.toString() === targetUser._id.toString() &&
            role !== "admin"
        ) {
            return NextResponse.json(
                { success: false, message: "You cannot change your own admin role" },
                { status: 403 }
            );
        }

        targetUser.role = role;
        await targetUser.save();

        return NextResponse.json(
            {
                success: true,
                message: `User ${targetUser.email} role updated to ${role}`,
                data: targetUser
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}