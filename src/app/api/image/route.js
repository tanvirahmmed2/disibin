import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { removeImage, setPrimaryImage } from "@/lib/data/images";

// Update image (Set primary)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { imageId, entityType, entityId } = await req.json();
        if (!imageId || !entityType || !entityId) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const image = await setPrimaryImage(imageId, entityType, entityId);
        return NextResponse.json({ success: true, data: image });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Delete image
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const imageId = searchParams.get('id');

        if (!imageId) {
            return NextResponse.json({ success: false, message: "Image ID is required" }, { status: 400 });
        }

        const deletedImage = await removeImage(imageId);
        return NextResponse.json({ success: true, message: "Image removed", data: deletedImage });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
