import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/utils/brevo";
import { BASE_URL } from "@/lib/database/secret";
import { createUser, getUserByEmail, getUserByPhone, updateUserProfile, setUserVerificationToken, getUserById } from "@/lib/data/users";
import { isLogin } from "@/lib/middleware";

// Register
export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, password } = body;

        if (!name || !email || !password || !phone) {
            return NextResponse.json({ success: false, message: "Missing required fields (Name, Email, Phone, Password)" }, { status: 400 });
        }

        // Check if email exists
        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
        }

        // Check if phone exists
        const existingPhone = await getUserByPhone(phone);
        if (existingPhone) {
            return NextResponse.json({ success: false, message: "Phone number already registered" }, { status: 400 });
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

        // Generate Verification Token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 24 * 3600000); // 24 hours

        await setUserVerificationToken(user.user_id, verificationToken, expiresAt);

        // Send Verification Email
        const verifyLink = `${BASE_URL}/verify-email?token=${verificationToken}`;
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Verify Your Email</h1>
                <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">Welcome to Disibin! Please click the button below to verify your email address and activate your account.</p>
                <a href="${verifyLink}" style="display: inline-block; padding: 16px 32px; background-color: #0ea5e9; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);">Verify Email Address</a>
                <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: "Verify Your Account - Disibin",
            htmlContent
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully. Please check your email to verify your account.",
            data: { id: user.user_id, email: user.email }
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

// Get Profile
export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json(auth, { status: 401 });
        }

        const user = await getUserById(auth.data.id);

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}