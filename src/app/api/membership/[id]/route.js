import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Membership } from "@/lib/models/membership";
import cloudinary from "@/lib/database/cloudinary";
import { isEditor } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const membership = await Membership.findById(id);
        
        if (!membership) return NextResponse.json({ success: false, message: 'Membership not found' }, { status: 404 });

        return NextResponse.json({
            success: true,
            message: 'Membership fetched successfully',
            data: membership
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await params;
        const formData = await req.formData();
        
        const title = formData.get('title');
        const description = formData.get('description');
        const price = formData.get('price');
        const discount = formData.get('discount');
        const duration = formData.get('duration');
        const code = formData.get('code');
        const features = formData.get('features');
        const imageFile = formData.get('image');

        const membership = await Membership.findById(id);
        if (!membership) return NextResponse.json({ success: false, message: 'Membership not found' }, { status: 404 });

        const updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = generateSlug(title);
        }
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);
        if (discount !== null) updateData.discount = Number(discount);
        if (duration) updateData.duration = duration;
        if (code) updateData.code = code;
        if (features) updateData.features = JSON.parse(features);

        if (imageFile && typeof imageFile !== 'string') {
            if (membership.imageId) {
                await cloudinary.uploader.destroy(membership.imageId);
            }
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "memberships" },
                    (err, result) => { if (err) reject(err); else resolve(result); }
                );
                stream.end(buffer);
            });
            updateData.image = cloudImage.secure_url;
            updateData.imageId = cloudImage.public_id;
        }

        const updated = await Membership.findByIdAndUpdate(id, updateData, { new: true });

        
        await createLog({
            userId: auth.data._id,
            action: 'update',
            targetType: 'membership',
            targetId: updated._id,
            description: `Updated membership plan: ${updated.title}`,
            metadata: { updatedFields: Object.keys(updateData) }
        });

        return NextResponse.json({
            success: true,
            message: 'Membership updated successfully',
            data: updated
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await params;
        const membership = await Membership.findById(id);
        if (!membership) return NextResponse.json({ success: false, message: 'Membership not found' }, { status: 404 });

        if (membership.imageId) {
            await cloudinary.uploader.destroy(membership.imageId);
        }

        await Membership.findByIdAndDelete(id);

        
        await createLog({
            userId: auth.data._id,
            action: 'delete',
            targetType: 'membership',
            targetId: id,
            description: `Deleted membership plan: ${membership.title}`
        });

        return NextResponse.json({
            success: true,
            message: 'Membership deleted successfully'
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
