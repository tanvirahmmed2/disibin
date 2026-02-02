import ConnectDB from "@/lib/database/mongo"
import { cookies } from "next/headers"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@/lib/database/secret"
import User from "@/lib/models/user"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        await ConnectDB()
        const token = (await cookies()).get('user_token')?.value
        if (!token) {
            return NextResponse.json({ success: false, message: 'Please login' }, { status: 400 })
        }
        const decoded =  jwt.verify(token, JWT_SECRET)
        if (!decoded) {
            return NextResponse.json({ success: false, message: 'Failed jwt verification' }, { status: 400 })
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 })
        }
        return NextResponse.json({ success: true, message: 'Successfully verified user', payload: user }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Failed to authenticate user', error: error.message }, { status: 500 })

    }

}