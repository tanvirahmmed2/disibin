import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: 'Please provide email and password'
            }, { status: 400 });
        }

        const query = "SELECT * FROM public.users WHERE email = $1 LIMIT 1";
        const result = await pool.query(query, [email]);

        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'No account found with this email'
            }, { status: 400 });
        }

        const user = result.rows[0];

        if (user.is_active === false) {
            return NextResponse.json({
                success: false,
                message: 'User is banned'
            }, { status: 400 });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return NextResponse.json({
                success: false,
                message: 'Incorrect password'
            }, { status: 400 });
        }

        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        delete user.password;

        const response = NextResponse.json(
            {
                success: true,
                message: "Successfully logged in",
                payload: user,
            },
            { status: 200 }
        );

        response.cookies.set("user_token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "strict"
        });

        return response;

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to login',
            error: error.message
        }, { status: 500 });
    }
}