import { NextResponse } from "next/server";
import { isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// DELETE a single product image (Manager only)
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { id } = await params;

        const imageRes = await dbQuery(
            "SELECT id, public_id, product_id FROM product_images WHERE id = $1",
            [id]
        );

        if (imageRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
        }

        const image = imageRes.rows[0];

        // Delete from DB
        await dbQuery("DELETE FROM product_images WHERE id = $1", [id]);

        // Delete from Cloudinary
        if (image.public_id) {
            try {
                await cloudinary.uploader.destroy(image.public_id);
            } catch (err) {
                console.error("Cloudinary delete failed:", err.message);
            }
        }

        return NextResponse.json({ success: true, message: "Image deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
