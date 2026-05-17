import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware";
import { getPurchases, updatePurchaseStatus } from "@/lib/data/purchases";

export async function GET(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const purchases = await getPurchases();
        return NextResponse.json({ success: true, data: purchases });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { purchaseId, status, reason } = await req.json();

        if (!purchaseId || !status) {
            return NextResponse.json({ success: false, message: "Purchase ID and status are required" }, { status: 400 });
        }

        const updated = await updatePurchaseStatus(purchaseId, status, auth.data.id, reason);
        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
