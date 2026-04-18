import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Offer } from "@/lib/models/offer";
import { User } from "@/lib/models/user";
import { createLog } from "@/lib/utils/logger";
import { isEditor } from "@/lib/middleware";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const offer = await Offer.findOne({ slug, status: 'active' });
            if (!offer) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });
            return NextResponse.json({ success: true, message: 'Offer fetched', data: offer });
        }

        const offers = await Offer.find({ status: 'active' }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, message: 'Offers fetched', payload: offers });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const body = await req.json();
        const { title, description, price, discount, features } = body;

        if (!title || !description || price === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const slug = body.slug || generateSlug(title);
        const existing = await Offer.findOne({ slug });
        if (existing) return NextResponse.json({ success: false, message: "Offer slug already exists" }, { status: 400 });

        const newOffer = await Offer.create({
            title,
            slug,
            description,
            price,
            discount: discount || 0,
            features: features || [],
            status: 'active'
        });

        await createLog({
            userId: auth.data._id,
            action: 'create',
            targetType: 'offer',
            targetId: newOffer._id,
            description: `Created new offer: ${newOffer.title}`,
            metadata: { price: newOffer.price, discount: newOffer.discount }
        });

        return NextResponse.json({ success: true, message: 'Offer created successfully', data: newOffer }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) return NextResponse.json({ success: false, message: "Offer ID required" }, { status: 400 });

        const offer = await Offer.findById(id);
        if (!offer) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });

        if (updateData.title) {
            updateData.slug = generateSlug(updateData.title);
        }

        const updatedOffer = await Offer.findByIdAndUpdate(id, updateData, { new: true });

        await createLog({
            userId: auth.data._id,
            action: 'update',
            targetType: 'offer',
            targetId: updatedOffer._id,
            description: `Updated offer: ${updatedOffer.title}`,
            metadata: { updatedFields: Object.keys(updateData) }
        });

        return NextResponse.json({ success: true, message: 'Offer updated successfully', data: updatedOffer });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "Offer ID required" }, { status: 400 });

        const offer = await Offer.findById(id);
        if (!offer) return NextResponse.json({ success: false, message: "Offer not found" }, { status: 404 });

        await Offer.findByIdAndDelete(id);

        await createLog({
            userId: auth.data._id,
            action: 'delete',
            targetType: 'offer',
            targetId: id,
            description: `Deleted offer: ${offer.title}`
        });

        return NextResponse.json({ success: true, message: 'Offer deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}