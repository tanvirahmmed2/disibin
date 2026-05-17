import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { createCoupon, getAllCoupons, getCouponByCode, updateCoupon, deleteCoupon } from "@/lib/data/coupons";

// GET  — public validate (?code=XXX)  OR  manager list all
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (code) {
            const coupon = await getCouponByCode(code);
            if (!coupon) {
                return NextResponse.json({ success: false, message: "Invalid or inactive coupon" }, { status: 404 });
            }

            const now = new Date();
            if (coupon.end_date && new Date(coupon.end_date) < now) {
                return NextResponse.json({ success: false, message: "Coupon has expired" }, { status: 400 });
            }
            if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
                return NextResponse.json({ success: false, message: "Coupon usage limit reached" }, { status: 400 });
            }

            return NextResponse.json({ success: true, data: coupon });
        }

        // List all — Manager only
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const coupons = await getAllCoupons();
        return NextResponse.json({ success: true, data: coupons });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create coupon — Manager only
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { code, discount } = body;

        if (!code || discount === undefined || discount === null || discount === '') {
            return NextResponse.json(
                { success: false, message: "Missing required fields: code and discount" },
                { status: 400 }
            );
        }

        const coupon = await createCoupon({ ...body, userId: auth.data.id });
        return NextResponse.json(
            { success: true, message: "Coupon created successfully", data: coupon },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === '23505') {
            return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update coupon — Manager only
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { couponId, ...updateData } = body;

        if (!couponId) {
            return NextResponse.json({ success: false, message: "Coupon ID is required" }, { status: 400 });
        }

        const coupon = await updateCoupon(couponId, updateData, auth.data.id);
        if (!coupon) return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Coupon updated successfully", data: coupon });

    } catch (error) {
        if (error.code === '23505') {
            return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE coupon — Manager only
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const couponId = searchParams.get('id');

        if (!couponId) {
            return NextResponse.json({ success: false, message: "Coupon ID is required" }, { status: 400 });
        }

        const deleted = await deleteCoupon(couponId, auth.data.id);
        if (!deleted) return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Coupon deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
