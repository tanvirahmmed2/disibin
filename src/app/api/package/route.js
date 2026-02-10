import cloudinary from "@/lib/database/cloudinary";
import ConnectDB from "@/lib/database/mongo";
import Package from "@/lib/models/package";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        await ConnectDB();
        const packages = await Package.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, payload: packages || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();
        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const price = Number(formData.get("price"));
        const discount = Number(formData.get("discount") || 0);
        const category = formData.get("category");
        const features = formData.get("features");
        const isPopular = formData.get("isPopular") === "true";
        const imageFile = formData.get("image");

        if (!title || !description || !price || !category || !imageFile) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const slug = slugify(title, { strict: true, lower: true });
        const existingPackage = await Package.findOne({ slug });
        if (existingPackage) {
            return NextResponse.json({ success: false, message: "Package title already exists" }, { status: 400 });
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "packages" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const newPackage = await Package.create({
            title,
            slug,
            description,
            price,
            discount,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id,
            features: features ? features.split(',').map(f => f.trim()) : [],
            category,
            isPopular
        });

        return NextResponse.json({ success: true, message: "Package created", payload: newPackage });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await ConnectDB();
        const formData = await req.formData();

        const id = formData.get("id");
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const pkg = await Package.findById(id);
        if (!pkg) return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });

        const title = formData.get("title");
        const description = formData.get("description");
        const price = formData.get("price");
        const discount = formData.get("discount");
        const category = formData.get("category");
        const features = formData.get("features");
        const isPopular = formData.get("isPopular");
        const imageFile = formData.get("image");

        let updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = slugify(title, { strict: true, lower: true });
        }
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);
        if (discount !== null) updateData.discount = Number(discount);
        if (category) updateData.category = category;
        if (isPopular !== null) updateData.isPopular = isPopular === "true";
        if (features) updateData.features = features.split('||').map(f => f.trim());

        if (imageFile && typeof imageFile !== "string") {
            await cloudinary.uploader.destroy(pkg.imageId);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "packages" },
                    (err, result) => { if (err) reject(err); else resolve(result); }
                );
                stream.end(buffer);
            });
            updateData.image = cloudImage.secure_url;
            updateData.imageId = cloudImage.public_id;
        }

        const updatedPackage = await Package.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ success: true, message: "Package updated", payload: updatedPackage });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        const pkg = await Package.findById(id);
        if (!pkg) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

        await cloudinary.uploader.destroy(pkg.imageId);
        await Package.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Package deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}