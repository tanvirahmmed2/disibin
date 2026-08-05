import { NextResponse } from "next/server";
import { isTeamLogin, isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET — Fetch board member by ID
export async function GET(req, { params }) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const resolvedParams = await params;
        const id = resolvedParams.id;

        const res = await dbQuery("SELECT * FROM boards WHERE id = $1", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Board member not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Update board member details by ID
export async function PATCH(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const resolvedParams = await params;
        const id = resolvedParams.id;

        let name, post, email, bio, image, image_id;

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            name = formData.get("name");
            post = formData.get("post");
            email = formData.get("email");
            bio = formData.get("bio");
            const imageFile = formData.get("image");

            if (imageFile && typeof imageFile === "object" && imageFile.arrayBuffer) {
                const bytes = await imageFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "boards" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(buffer);
                });
                image = uploadResult.secure_url;
                image_id = uploadResult.public_id;
            }
        } else {
            const body = await req.json();
            name = body.name;
            post = body.post;
            email = body.email;
            bio = body.bio;
            image = body.image;
            image_id = body.image_id;
        }

        const res = await dbQuery(`
            UPDATE boards
            SET name = COALESCE(NULLIF($1, ''), name),
                post = COALESCE(NULLIF($2, ''), post),
                email = COALESCE($3, email),
                image = COALESCE($4, image),
                image_id = COALESCE($5, image_id),
                bio = COALESCE($6, bio)
            WHERE id = $7
            RETURNING *
        `, [
            name?.trim(),
            post?.trim(),
            email !== undefined ? (email?.trim() ? email.trim().toLowerCase() : null) : null,
            image !== undefined ? (image?.trim() || null) : null,
            image_id !== undefined ? (image_id?.trim() || null) : null,
            bio !== undefined ? (bio?.trim() || null) : null,
            id
        ]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Board member not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Board member updated", data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Remove board member by ID
export async function DELETE(req, { params }) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const resolvedParams = await params;
        const id = resolvedParams.id;

        const res = await dbQuery("DELETE FROM boards WHERE id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Board member not found" }, { status: 404 });
        }

        const deleted = res.rows[0];
        if (deleted.image_id) {
            await cloudinary.uploader.destroy(deleted.image_id).catch(() => {});
        }

        return NextResponse.json({ success: true, message: "Board member deleted", data: deleted });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
