import ConnectDB from "@/lib/database/mongo";
import Contact from "@/lib/models/contact";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB();
        const messages = await Contact.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            payload: messages || []
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ 
                success: false, 
                message: "All fields are required" 
            }, { status: 400 });
        }

        const newMessage = await Contact.create({
            name,
            email,
            subject,
            message
        });

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            payload: newMessage
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await ConnectDB();
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ 
                success: false, 
                message: "ID and Status required" 
            }, { status: 400 });
        }

        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return NextResponse.json({ 
                success: false, 
                message: "Message not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Status updated to ${status}`,
            payload: updatedContact
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ 
                success: false, 
                message: "ID is required" 
            }, { status: 400 });
        }

        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return NextResponse.json({ 
                success: false, 
                message: "Message not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}