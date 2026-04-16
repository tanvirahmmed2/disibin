import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Subscription } from "@/lib/models/subscription";
import { Membership } from "@/lib/models/membership";
import { isLogin, isManager } from "@/lib/middleware";

export async function GET() {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.payload;
        let query = {};

        
        if (user.role === 'client') {
            query.userId = user._id;
        }

        const subscriptions = await Subscription.find(query)
            .populate('membershipId')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            payload: subscriptions
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { membershipId, payMethod, transactionId } = await req.json();

        if (!membershipId || !payMethod || !transactionId) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const membership = await Membership.findById(membershipId);
        if (!membership) {
            return NextResponse.json({ success: false, message: 'Membership plan not found' }, { status: 404 });
        }

        const price = Number(membership.price) || 0;
        const discount = Number(membership.discount) || 0;
        const total = price - discount;

        const subscription = await Subscription.create({
            userId: auth.payload._id,
            membershipId,
            status: 'pending',
            payStatus: 'pending',
            payMethod,
            transactionId,
            subTotal: price,
            discount,
            total,
            paidAt: new Date() 
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription request submitted successfully!',
            payload: subscription
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

        const { id, status, payStatus } = await req.json();

        const subscription = await Subscription.findById(id);
        if (!subscription) return NextResponse.json({ success: false, message: 'Subscription not found' }, { status: 404 });

        if (status) subscription.status = status;
        if (payStatus) subscription.payStatus = payStatus;

        await subscription.save();

        return NextResponse.json({
            success: true,
            message: 'Subscription status updated successfully',
            payload: subscription
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
