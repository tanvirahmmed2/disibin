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
            message: 'Memberships fetched successfully',
            data: memberships
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

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
        const existing = await Membership.findOne({ slug });
        if (existing) return NextResponse.json({ success: false, message: 'Plan with this title already exists' }, { status: 400 });

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "memberships" },
                (err, result) => { if (err) reject(err); else resolve(result); }
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
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id
        });

        
        await createLog({
            userId: auth.data._id,
            action: 'create',
            targetType: 'membership',
            targetId: membership._id,
            description: `Created new membership plan: ${membership.title}`,
            metadata: { price: membership.price, duration: membership.duration }
        });

        return NextResponse.json({
            success: true,
            message: 'Membership plan created successfully',
            data: membership
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
