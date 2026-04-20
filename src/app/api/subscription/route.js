import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Subscription } from "@/lib/models/subscription";
import { isLogin, isProjectManager } from "@/lib/middleware";
import Membership from "@/lib/models/membership";

export async function GET() {
    try {
        await connectDB();

        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const user = auth.data;

       

        const data = await Subscription.find({userId:user._id})

        return NextResponse.json({
            success: true,
            message: "Subscriptions fetched",
            payload:data
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        await connectDB();

        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const user = auth.data;
        const { membershipId, payMethod, transactionId } = await req.json();

        if (!membershipId || !payMethod || !transactionId) {
            return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
        }

        const membership = await Membership.findById(membershipId);
        if (!membership) {
            return NextResponse.json({ success: false, message: "Membership not found" }, { status: 404 });
        }

        const subTotal = Number(membership.price) || 0;
        const discount = Number(membership.discount) || 0;
        const total = subTotal - discount;

        const subscription = await Subscription.create({
            userId: user._id,
            membershipId,
            status: "pending",
            payStatus: "pending",
            payMethod,
            transactionId,
            subTotal,
            discount,
            total,
            paidAt: new Date()
        });

        return NextResponse.json({
            success: true,
            message: "Subscription created",
            data: subscription
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();

        const auth = await isProjectManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const { id, status, payStatus } = await req.json();

        const subscription = await Subscription.findById(id);
        if (!subscription) {
            return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
        }

        if (status) subscription.status = status;
        if (payStatus) subscription.payStatus = payStatus;

        await subscription.save();

        return NextResponse.json({
            success: true,
            message: "Updated",
            data: subscription
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        await connectDB();

        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const user = auth.data;
        const { id } = await req.json();

        const sub = await Subscription.findOneAndDelete({
            _id: id,
            userId: user._id
        });

        if (!sub) {
            return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Subscription cancelled"
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}