import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Contact } from '@/lib/models/contact';
import { isManager, isLogin } from '@/lib/middleware';
import { createLog } from '@/lib/utils/logger';

export async function GET() {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const contacts = await Contact.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, message: 'Messages fetched', data: contacts });
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

        
        const auth = await isLogin();
        if (auth.success) {
            await createLog({
                userId: auth.data._id,
                action: 'create',
                targetType: 'support',
                targetId: contact._id,
                description: `Sent a support message: ${subject}`
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.',
            data: contact
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

        
        await createLog({
            userId: auth.data._id,
            action: 'update',
            targetType: 'support',
            targetId: contact._id,
            description: `Updated support message status to ${status}: ${contact.subject}`
        });

        return NextResponse.json({ success: true, message: 'Status updated', data: contact });
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
        const contact = await Contact.findById(id);
        if (contact) {
            await Contact.findByIdAndDelete(id);

            
            await createLog({
                userId: auth.data._id,
                action: 'delete',
                targetType: 'support',
                targetId: id,
                description: `Deleted support message: ${contact.subject}`
            });
        }

        return NextResponse.json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
