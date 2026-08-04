import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbQuery } from "@/lib/database/pg";
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";
import { isUserLogin } from "@/lib/auth/user";

export async function POST(req) {
    try {
        // Redirect if already logged in
        const auth = await isUserLogin();
        if (auth.success) {
            return NextResponse.json({ success: false, message: "Already logged in" }, { status: 403 });
        }

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        const res = await dbQuery("SELECT * FROM users WHERE email = $1", [email]);
        const user = res.rows[0];

        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        if (!user.is_active) {
            return NextResponse.json({ success: false, message: "Account is deactivated. Please contact support." }, { status: 403 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Log failed attempt
            await dbQuery(
                `INSERT INTO user_login_logs (user_id, action, description, status) VALUES ($1, $2, $3, $4)`,
                [user.id, 'login', 'Failed login attempt', 'fail']
            ).catch(() => {}); // non-blocking
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        if (!user.is_verified) {
            return NextResponse.json(
                { success: false, message: "Please verify your email address before logging in." },
                { status: 403 }
            );
        }

        // Update last login & log success
        await dbQuery("UPDATE users SET last_login = now() WHERE id = $1", [user.id]);
        await dbQuery(
            `INSERT INTO user_login_logs (user_id, action, description, status) VALUES ($1, $2, $3, $4)`,
            [user.id, 'login', 'Successful login', 'success']
        ).catch(() => {}); // non-blocking

        // Sign JWT — no username in schema, use name
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({ success: true, message: "Login successful" });

        response.cookies.set("disibin-user", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
