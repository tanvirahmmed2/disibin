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

        const { purchaseId, status } = await req.json();

        
        const purchase = await Purchase.findById(purchaseId).populate('paymentId');
        if (!purchase) {
            return NextResponse.json({ success: false, message: 'Purchase record not found' }, { status: 404 });
        }

        const payment = purchase.paymentId;

        if (status === 'completed') {
            
            if (payment && payment.status !== 'completed') {
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
        return NextResponse.json({ success: true, message: `Status successfully changed to ${status}`, data: purchase });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
