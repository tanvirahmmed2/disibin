import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_SECRET } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        const res = await dbQuery("SELECT * FROM users WHERE email = $1", [email]);
        const user = res.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        if (!user.is_active) {
            return NextResponse.json({ success: false, message: "Account is disabled. Contact support." }, { status: 403 });
        }

        if (!user.is_verified) {
            return NextResponse.json({ success: false, message: "Email not verified. Please check your inbox.", isUnverified: true }, { status: 403 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // Fetch user's primary tenant for the token
        const tenantRes = await dbQuery("SELECT tenant_id FROM tenant_users WHERE user_id = $1 LIMIT 1", [user.user_id]);
        const tenantId = tenantRes.rows[0]?.tenant_id;

        const tokenData = {
            id: user.user_id,
            _id: user.user_id, // Backward compatibility
            email: user.email,
            role: user.role,
            tenantId: tenantId
        };

        const token = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1d' });
        
        const cookieStore = await cookies();
        cookieStore.set('disibin', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        return NextResponse.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            data: {
                id: user.user_id,
                _id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                tenantId: tenantId
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
