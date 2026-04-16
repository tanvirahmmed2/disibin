import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Review } from '@/lib/models/review';
import { isLogin, isManager } from '@/lib/middleware';

export async function GET() {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const reviews = await Review.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, message: 'Reviews fetched', payload: reviews });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { rate, comment } = await req.json();
        if (!rate || !comment) return NextResponse.json({ success: false, message: 'Rate and comment are required' }, { status: 400 });

        const review = await Review.create({
            userId: auth.payload._id,
            rate: Number(rate),
            comment,
            isApproved: false
        });

        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully! It will appear after approval.',
            payload: review
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

        const { id, isApproved } = await req.json();
        const review = await Review.findByIdAndUpdate(id, { isApproved }, { new: true });

        if (!review) return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Review status updated', payload: review });
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
        await Review.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}