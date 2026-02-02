import ConnectDB from "@/lib/database/mongo";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";


export async function POST(req) {
    try {

        await ConnectDB()
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: 'Please provide email and password'
            }, { status: 400 })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'No account found with this email'
            }, { status: 400 })
        }

        if (user.isBanned) {
            return NextResponse.json({
                success: false,
                message: 'User is banned'
            }, { status: 400 })
        }


        const isMatchPassword = await bcrypt.compare( password, user.password)

        if (!isMatchPassword) {
            return NextResponse.json({
                success: false,
                message: 'Incorrect password'
            }, { status: 400 })
        }

        const payload = { id: user._id, email: user.email, role: user.role }

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "7d" }
        );

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
            secure: NODE_ENV,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: 'Failed to login',
            error: error.message
        }, { status: 500 })
    }

}