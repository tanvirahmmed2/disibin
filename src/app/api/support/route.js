import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Contact } from '@/lib/models/contact';
import { isManager } from '@/lib/middleware';

export async function GET() {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const contacts = await Contact.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, message: 'Messages fetched', payload: contacts });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, phone, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const contact = await Contact.create({
            name, email, phone, subject, message, status: 'open'
        });

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.',
            payload: contact
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status } = await req.json();
        const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });

        if (!contact) return NextResponse.json({ success: false, message: 'Message not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Status updated', payload: contact });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await req.json();
        await Contact.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}