import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import Offer from "@/lib/models/offer";
import { isEditor } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const body = await req.json();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const updatedOffer = await Offer.findByIdAndUpdate(id, body, { new: true });
        if (!updatedOffer) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });

        // Activity Logging
        await createLog({
            userId: auth.payload._id,
            action: 'update',
            targetType: 'offer',
            targetId: updatedOffer._id,
            description: `Updated offer details: ${updatedOffer.title}`,
            metadata: { updatedFields: Object.keys(body) }
        });

        return NextResponse.json({ success: true, payload: updatedOffer });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const deletedOffer = await Offer.findByIdAndDelete(id);
        if (!deletedOffer) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });

        // Activity Logging
        await createLog({
            userId: auth.payload._id,
            action: 'delete',
            targetType: 'offer',
            targetId: id,
            description: `Deleted offer: ${deletedOffer.title}`
        });

        return NextResponse.json({ success: true, message: "Offer deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
