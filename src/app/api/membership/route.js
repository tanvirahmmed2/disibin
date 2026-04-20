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

export async function GET() {
    try {
        await connectDB();
        const memberships = await Membership.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: memberships
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const auth = await isEditor();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const formData = await req.formData();

        const title = formData.get('title');
        const code = formData.get('code');
        const description = formData.get('description');
        const price = formData.get('price');
        const discount = formData.get('discount');
        const duration = formData.get('duration');
        const features = formData.get('features');
        const imageFile = formData.get('image');

        if (!title || !description || !price || !code || !imageFile || !duration) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const slug = generateSlug(title);

        const exists = await Membership.findOne({ slug });
        if (exists) {
            return NextResponse.json({ success: false, message: 'Membership already exists' }, { status: 400 });
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());

        const uploaded = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "memberships" },
                (err, result) => err ? reject(err) : resolve(result)
            );
            stream.end(buffer);
        });

        const membership = await Membership.create({
            title,
            slug,
            code,
            description,
            price: Number(price),
            discount: Number(discount) || 0,
            duration,
            features: features ? JSON.parse(features) : [],
            image: uploaded.secure_url,
            imageId: uploaded.public_id
        });

        await createLog({
            userId: auth.data._id,
            action: 'create',
            targetType: 'membership',
            targetId: membership._id,
            description: `Created membership: ${membership.title}`
        });

        return NextResponse.json({
            success: true,
            data: membership
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectDB();

        const auth = await isEditor();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const formData = await req.formData();
        const id = formData.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
        }

        const membership = await Membership.findById(id);
        if (!membership) {
            return NextResponse.json({ success: false, message: 'Membership not found' }, { status: 404 });
        }

        const title = formData.get('title');
        const imageFile = formData.get('image');

        if (title) {
            membership.title = title;
            membership.slug = generateSlug(title);
        }

        if (formData.get('code')) membership.code = formData.get('code');
        if (formData.get('description')) membership.description = formData.get('description');
        if (formData.get('price')) membership.price = Number(formData.get('price'));
        if (formData.get('discount')) membership.discount = Number(formData.get('discount'));
        if (formData.get('duration')) membership.duration = formData.get('duration');

        if (formData.get('features')) {
            try {
                membership.features = JSON.parse(formData.get('features'));
            } catch {
                return NextResponse.json({ success: false, message: 'Invalid features format' }, { status: 400 });
            }
        }

        if (imageFile && imageFile.size > 0) {

            await cloudinary.uploader.destroy(membership.imageId);

            const buffer = Buffer.from(await imageFile.arrayBuffer());

            const uploaded = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "memberships" },
                    (err, result) => err ? reject(err) : resolve(result)
                );
                stream.end(buffer);
            });

            membership.image = uploaded.secure_url;
            membership.imageId = uploaded.public_id;
        }

        await membership.save();

        await createLog({
            userId: auth.data._id,
            action: 'update',
            targetType: 'membership',
            targetId: membership._id,
            description: `Updated membership: ${membership.title}`
        });

        return NextResponse.json({
            success: true,
            data: membership
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const auth = await isEditor();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
        }

        const membership = await Membership.findById(id);
        if (!membership) {
            return NextResponse.json({ success: false, message: 'Membership not found' }, { status: 404 });
        }

        await cloudinary.uploader.destroy(membership.imageId);

        await Membership.findByIdAndDelete(id);

        await createLog({
            userId: auth.data._id,
            action: 'delete',
            targetType: 'membership',
            targetId: id,
            description: `Deleted membership: ${membership.title}`
        });

        return NextResponse.json({
            success: true,
            message: 'Membership deleted successfully'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}