import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Review } from '@/lib/models/review';

export async function GET() {
    try {
        await connectDB();
        const reviews = await Review.find({ isApproved: true })
            .populate('userId', 'name image')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, message: 'Approved reviews fetched', data: reviews });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
