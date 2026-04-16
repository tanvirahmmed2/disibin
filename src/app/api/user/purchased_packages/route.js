import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Purchase } from '@/lib/models/purchase';
import { isLogin } from '@/lib/middleware';

export async function GET() {
    try {
        await connectDB();
        const auth = await isLogin();
        
        if (!auth.success) {
            return NextResponse.json({
                success: false, 
                message: 'Unauthorized access'
            }, { status: 401 });
        }

        const user_id = auth.payload._id;

        const purchases = await Purchase.find({ userId: user_id })
            .populate({
                path: 'items.packageId',
                select: 'title slug image category features description'
            })
            .populate('paymentId')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: 'Purchase history retrieved',
            payload: purchases
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error', 
            error: error.message 
        }, { status: 500 });
    }
}