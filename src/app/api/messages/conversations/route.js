import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { User } from "@/lib/models/user";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const currentUserId = searchParams.get('currentUserId');

        
        const users = await User.find({
            role: { $in: ["admin", "manager", "support", "project_manager", "editor", "staff"] },
            _id: { $ne: currentUserId }
        }).select("name email role isActive");

        return NextResponse.json({ success: true, message: 'Conversations fetched', data: users });
    } catch (error) {
        console.error("GET Conversations Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
