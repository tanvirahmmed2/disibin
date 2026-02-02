import ConnectDB from "@/lib/database/mongo";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import User from "@/lib/models/user";


export async function POST(req) {
    try {
        await ConnectDB()

        const { name, email, password, role } = await req.json()
        if (!name || !email || !password ) {
            return NextResponse.json({
                success: false,
                message: 'Please fill all information'
            }, { status: 400 })
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await User({ name, email, password: hashedPass, role })

        await newUser.save()

        return NextResponse.json({
            success: true,
            message: 'Successfully created user',
            payload: newUser
        }, { status: 200 })



    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        }, { status: 500 })
    }

}


export async function DELETE(req) {
    try {
        await ConnectDB()

        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "User id not found"
            }, { status: 400 })
        }

        
        const user = await User.findById(id)
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 400 })
        }

        const users= await User.find({role: 'admin'})

        if(users.length===1 && user.role ==='admin'){
            return NextResponse.json({
                success:false,
                message:"This account can't be removed"
            },{status:400})
        }


        await User.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: 'Account has been deleted'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        }, { status: 500 })

    }

}

export async function GET() {
    try {
        await ConnectDB()

        const users = await User.find({ role: 'admin' })
        if (!users || users.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No admin data found"
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true,
            message: 'Successfully fetched admin data',
            payload: users
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch user data'
        }, { status: 500 })

    }

}