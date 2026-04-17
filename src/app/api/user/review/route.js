import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Review } from '@/lib/models/review';
import { isLogin } from '@/lib/middleware';

export async function GET() {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const reviews = await Review.find({ userId: auth.data._id }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, message: 'Review found', data: reviews });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
