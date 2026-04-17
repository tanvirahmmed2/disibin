import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Payment from "@/lib/models/payment";
import Purchase from "@/lib/models/purchase";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { userId, purchaseId, amount, paymentMethod, transactionId } = body;

        // Create payment record
        const payment = await Payment.create({
            userId, purchaseId, amount, paymentMethod, transactionId, status: 'completed', paidAt: new Date()
        });

        // Update purchase record
        await Purchase.findByIdAndUpdate(purchaseId, {
            status: 'completed',
            paymentId: payment._id,
            paymentStatus: 'completed'
        });

        return NextResponse.json({ success: true, message: 'Payment processed successfully', data: payment });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
