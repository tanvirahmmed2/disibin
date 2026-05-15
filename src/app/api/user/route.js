import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail, getUserByPhone, updateUserProfile } from "@/lib/data/users";
import { isLogin } from "@/lib/middleware";

// Register
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Check if email exists
        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
        }

        // Check if phone exists (if provided)
        if (phone) {
            const existingPhone = await getUserByPhone(phone);
            if (existingPhone) {
                return NextResponse.json({ success: false, message: "Phone number already registered" }, { status: 400 });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await createUser({
            name,
            email,
            phone,
            password: hashedPassword
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            data: user
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Update Profile
export async function PATCH(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const userId = auth.data.id;
        const body = await req.json();

        // Prevent updating sensitive fields via this endpoint
        const { password, role, email, user_id, ...updateData } = body;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        const updatedUser = await updateUserProfile(userId, updateData);

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}