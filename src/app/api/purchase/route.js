import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/database/db';
import { Purchase } from '@/lib/models/purchase';
import { Payment } from '@/lib/models/payment';
import { isLogin, isManager } from '@/lib/middleware';

export async function POST(req) {
    let session;
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: 'Please login' }, { status: 401 });
        }

        const body = await req.json();
        const { items, payment_method } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Wishlist is empty' }, { status: 400 });
        }

        let subTotal = 0;
        let totalDiscount = 0;
        const purchaseItems = items.map(item => {
            const price = Number(item.price) || 0;
            const discount = Number(item.discount) || 0;
            const total = price - discount;
            subTotal += price;
            totalDiscount += discount;
            return {
                packageId: item.package_id,
                price,
                discount,
                total
            };
        });

        const payableAmount = subTotal - totalDiscount;

        session = await mongoose.startSession();
        session.startTransaction();

        // 1. Create Payment record
        const payment = await Payment.create([{
            total: payableAmount,
            subTotal,
            discount: totalDiscount,
            method: payment_method,
            transactionId: "PENDING_" + Date.now(),
            status: 'pending',
            paidAt: new Date(),
            purchaseId: new mongoose.Types.ObjectId() // Temporary ID
        }], { session });

        // 2. Create Purchase record
        const purchase = await Purchase.create([{
            userId: auth.payload._id,
            items: purchaseItems,
            total: payableAmount,
            subTotal,
            discount: totalDiscount,
            paymentId: payment[0]._id,
            status: 'pending'
        }], { session });

        // 3. Update Payment with real Purchase ID
        await Payment.findByIdAndUpdate(payment[0]._id, { purchaseId: purchase[0]._id }, { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({
            success: true,
            message: 'Order placed successfully!',
            purchase_id: purchase[0]._id
        }, { status: 201 });

    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const purchases = await Purchase.find()
            .populate('userId', 'name email')
            .populate('paymentId')
            .populate('items.packageId', 'title')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, payload: purchases });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    let session;
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { purchase_id, status, transaction_id } = await req.json();

        session = await mongoose.startSession();
        session.startTransaction();

        const purchase = await Purchase.findById(purchase_id);
        if (!purchase) throw new Error('Purchase not found');

        // Update Purchase status
        purchase.status = status || 'completed';
        await purchase.save({ session });

        // Update associated Payment
        await Payment.findByIdAndUpdate(purchase.paymentId, {
            status: status === 'completed' ? 'completed' : 'pending',
            transactionId: transaction_id || undefined,
            paidAt: new Date()
        }, { session });

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ success: true, message: 'Status updated' });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    let session;
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { id } = await req.json();

        session = await mongoose.startSession();
        session.startTransaction();

        const purchase = await Purchase.findById(id);
        if (purchase) {
            await Payment.findByIdAndDelete(purchase.paymentId, { session });
            await Purchase.findByIdAndDelete(id, { session });
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json({ success: true, message: 'Purchase deleted' });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}