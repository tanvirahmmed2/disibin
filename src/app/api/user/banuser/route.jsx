import ConnectDB from "@/lib/database/mongo";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await ConnectDB()

        const { id } = await req.json()

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Id not found'
            }, { status: 400 })
        }

        const user = await User.findById(id)
        if (!user) {
            return NextResponse.json({
                success: false,
                message: ' User not found'
            }, { status: 400 })
        }
        if (user.role === 'manager') {
            return NextResponse.json({
                success: false,
                message: "User can't be banned"
            }, { status: 400 })
        }
        if (user.isBanned) {
            user.isBanned = false
            await user.save()
            return NextResponse.json({
                success: true,
                message: 'User is unbanned successfully'
            }, { status: 200 })
        }

        user.isBanned = true

        await user.save()

        return NextResponse.json({
            success: true,
            message: 'User is banned successfully'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to ban user',
            error: error.message
        }, { status: 500 })

    }

}