import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Message from "@/lib/models/Message";
import { User } from "@/lib/models/User";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const senderId = searchParams.get('senderId');
        const receiverId = searchParams.get('receiverId');

        if (!senderId || !receiverId) {
            return NextResponse.json({ success: false, message: "Sender and Receiver IDs are required" }, { status: 400 });
        }

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        return NextResponse.json({ success: true, payload: messages });
    } catch (error) {
        console.error("GET Messages Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { senderId, receiverId, message, attachments } = body;

        if (!senderId || (!receiverId && !body.participants) || !message) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            participants: body.participants || [senderId, receiverId],
            message,
            attachments: attachments || []
        });

        return NextResponse.json({ success: true, payload: newMessage });
    } catch (error) {
        console.error("POST Message Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
