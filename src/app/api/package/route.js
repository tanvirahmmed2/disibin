import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Package } from "@/lib/models/package";
import cloudinary from "@/lib/database/cloudinary";
import { isEditor } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

export async function GET() {
    try {
        await connectDB();

        const packages = await Package.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            message: "Packages fetched successfully",
            payload: packages
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const auth = await isEditor();
        if (!auth.success) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: 401 }
            );
        }

        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const price = formData.get("price");
        const discount = formData.get("discount");
        const category = formData.get("category");
        const features = formData.get("features");
        const imageFile = formData.get("image");

        if (!title || !description || !price || !code || !category || !imageFile) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const slug = generateSlug(title);

        const existing = await Package.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "Package already exists" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());

        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "packages" },
                (err, result) => (err ? reject(err) : resolve(result))
            );
            stream.end(buffer);
        });

        let parsedFeatures = [];
        if (features) {
            parsedFeatures = features
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean);
        }

        const pkg = await Package.create({
            title,
            slug,
            description,
            price: Number(price),
            discount: discount ? Number(discount) : 0,
            category,
            features: parsedFeatures,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id
        });

        await createLog({
            userId: auth.data._id,
            action: "create",
            targetType: "package",
            targetId: pkg._id,
            description: `Created package: ${pkg.title} (${pkg.code})`,
            metadata: { price: pkg.price, category: pkg.category }
        });

        return NextResponse.json({
            success: true,
            message: "Package created successfully",
            data: pkg
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        await connectDB();

        const auth = await isEditor();
        if (!auth.success) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: 401 }
            );
        }

        const formData = await req.formData();

        const id = formData.get("id");
        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        const pkg = await Package.findById(id);
        if (!pkg) {
            return NextResponse.json(
                { success: false, message: "Package not found" },
                { status: 404 }
            );
        }

        const title = formData.get("title");
        const description = formData.get("description");
        const price = formData.get("price");
        const discount = formData.get("discount");
        const category = formData.get("category");
        const features = formData.get("features");
        const imageFile = formData.get("image");

        const updateData = {};

        if (title) {
            updateData.title = title;
            updateData.slug = generateSlug(title);
        }

        if (description) updateData.description = description;

        if (price !== null && price !== undefined) {
            updateData.price = Number(price);
        }

        if (discount !== null && discount !== undefined) {
            updateData.discount = Number(discount);
        }

        if (category) updateData.category = category;

        if (features) {
            updateData.features = features
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean);
        }

        if (imageFile && imageFile.size > 0) {
            if (pkg.imageId) {
                await cloudinary.uploader.destroy(pkg.imageId);
            }

            const buffer = Buffer.from(await imageFile.arrayBuffer());

            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "packages" },
                    (err, result) => (err ? reject(err) : resolve(result))
                );
                stream.end(buffer);
            });

            updateData.image = cloudImage.secure_url;
            updateData.imageId = cloudImage.public_id;
        }

        const updatedPkg = await Package.findByIdAndUpdate(id, updateData, {
            new: true
        });

        await createLog({
            userId: auth.data._id,
            action: "update",
            targetType: "package",
            targetId: updatedPkg._id,
            description: `Updated package: ${updatedPkg.title}`,
            metadata: { updatedFields: Object.keys(updateData) }
        });

        return NextResponse.json({
            success: true,
            message: "Package updated successfully",
            data: updatedPkg
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();

        const auth = await isEditor();
        if (!auth.success) {
            return NextResponse.json(
                { success: false, message: auth.message },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID is required" },
                { status: 400 }
            );
        }

        const pkg = await Package.findById(id);
        if (!pkg) {
            return NextResponse.json(
                { success: false, message: "Package not found" },
                { status: 404 }
            );
        }

        if (pkg.imageId) {
            await cloudinary.uploader.destroy(pkg.imageId);
        }

        await Package.findByIdAndDelete(id);

        await createLog({
            userId: auth.data._id,
            action: "delete",
            targetType: "package",
            targetId: id,
            description: `Deleted package: ${pkg.title} (${pkg.code})`
        });

        return NextResponse.json({
            success: true,
            message: "Package deleted successfully"
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}