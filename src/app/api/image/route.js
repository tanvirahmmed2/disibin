import { NextResponse } from "next/server";
import cloudinary from "@/lib/database/cloudinary";

// POST upload image to Cloudinary
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("image");

        if (!file || typeof file === "string") {
            return NextResponse.json({ success: false, message: "No image file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "disibin",
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            success: true,
            data: {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            }
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE image from Cloudinary by public_id
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const publicId = searchParams.get("public_id");

        if (!publicId) {
            return NextResponse.json({ success: false, message: "public_id is required" }, { status: 400 });
        }

        await cloudinary.uploader.destroy(publicId);

        return NextResponse.json({ success: true, message: "Image deleted from Cloudinary" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
