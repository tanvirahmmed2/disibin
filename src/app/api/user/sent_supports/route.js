import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Contact } from '@/lib/models/contact';
import { isLogin } from '@/lib/middleware';

export async function GET() {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        
        const contacts = await Contact.find({ email: auth.data.email }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, message: 'Support messages found', data: contacts });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
