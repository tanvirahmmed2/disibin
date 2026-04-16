import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Purchase } from '@/lib/models/purchase';
import { Payment } from '@/lib/models/payment';
import { isManager } from '@/lib/middleware';

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { purchase_id, status } = await req.json();

        // 1. Get current purchase and payment status
        const purchase = await Purchase.findById(purchase_id).populate('paymentId');
        if (!purchase) {
            return NextResponse.json({ success: false, message: 'Purchase record not found' }, { status: 404 });
        }

        const payment = purchase.paymentId;

        if (status === 'completed') {
            // Logic: Only work when payment status is completed
            if (payment.status !== 'completed') {
                return NextResponse.json({ 
                    success: false, 
                    message: 'Cannot set to completed. Payment must be verified first.' 
                }, { status: 400 });
            }
            purchase.status = 'completed';
        } 
        
        else if (status === 'cancelled') {
            purchase.status = 'cancelled';
            if (payment) {
                payment.status = 'failed';
                await payment.save();
            }
        }

        await purchase.save();
        return NextResponse.json({ success: true, message: `Status successfully changed to ${status}` });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}