import ConnectDB from "@/lib/database/mongo";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        await ConnectDB()
        const { id, phone } = await req.json()
        if (!id || !phone) {
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
        const save = await User.findByIdAndUpdate(id, { phone }, { new: true })
        if (!save) {
            return NextResponse.json({
                success: false,
                message: 'Faile to update phone'
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true,
            message: "Successfully updated phone"
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed'
        }, { status: 500 })
    }
}