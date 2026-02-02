import ConnectDB from "@/lib/database/mongo";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'


export async function POST(req) {
    try {
        await ConnectDB()
        const { id, password } = await req.json()
        if (!id || !password) {
            return NextResponse.json({
                success: false,
                message: 'Data not recieved'
            }, { status: 400 })
        }
        const user = await User.findById(id)

        if (!user) {
            return NextResponse.json({
                success: false, message: 'User not found'
            }, { status: 400 })
        }

        const hashedPass= await bcrypt.hash(password, 10)
        const save = await User.findByIdAndUpdate(id, { password:hashedPass }, { new: true })
        if (!save) {
            return NextResponse.json({
                success: false,
                message: 'Faile to update password'
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true,
            message: "Successfully updated password"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed'
        }, { status: 500 })

    }

}