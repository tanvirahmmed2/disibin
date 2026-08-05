import { NextResponse } from "next/server";
import { isTeamLogin, isManager } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET — List all board members
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const res = await dbQuery(`
            SELECT id, name, post, email, image, image_id, bio, created_at
            FROM boards
            ORDER BY created_at DESC
        `);

        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — Create board member
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        let name = "", post = "", email = "", bio = "", image = "", image_id = "";

        const contentType = req.headers.get("content-type") || "";

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            name = formData.get("name") || "";
            post = formData.get("post") || "";
            email = formData.get("email") || "";
            bio = formData.get("bio") || "";
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
            } else if (typeof imageFile === "string" && imageFile.trim()) {
                image = imageFile.trim();
            }
        } else {
            const body = await req.json();
            name = body.name || "";
            post = body.post || "";
            email = body.email || "";
            bio = body.bio || "";
            image = body.image || "";
            image_id = body.image_id || "";
        }

        if (!name.trim() || !post.trim()) {
            return NextResponse.json({ success: false, message: "Name and Post Title are required" }, { status: 400 });
        }

        // Check unique email if provided
        if (email.trim()) {
            const check = await dbQuery("SELECT id FROM boards WHERE LOWER(email) = LOWER($1)", [email.trim()]);
            if (check.rows.length > 0) {
                return NextResponse.json({ success: false, message: "A board member with this email already exists" }, { status: 400 });
            }
        }

        const query = `
            INSERT INTO boards (name, post, email, image, image_id, bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const res = await dbQuery(query, [
            name.trim(),
            post.trim(),
            email.trim() ? email.trim().toLowerCase() : null,
            image.trim() || null,
            image_id.trim() || null,
            bio.trim() || null
        ]);

        const member = res.rows[0];

        // Record activity log
        await dbQuery(`
            INSERT INTO activity_logs (team_id, action, entity_type, entity_id, description)
            VALUES ($1, 'BOARD_CREATE', 'board', $2, $3)
        `, [auth.data.id, member.id, `Added board member "${member.name}" (${member.post})`]).catch(() => {});

        return NextResponse.json({ success: true, message: "Board member created successfully", data: member }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Update board member
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { id, name, post, email, image, image_id, bio } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Board member ID is required" }, { status: 400 });
        }

        const res = await dbQuery(`
            UPDATE boards
            SET name = COALESCE(NULLIF($1, ''), name),
                post = COALESCE(NULLIF($2, ''), post),
                email = $3,
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

// DELETE — Remove board member
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Board member ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM boards WHERE id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Board member not found" }, { status: 404 });
        }

        const deleted = res.rows[0];

        if (deleted.image_id) {
            await cloudinary.uploader.destroy(deleted.image_id).catch(() => {});
        }

        return NextResponse.json({ success: true, message: "Board member deleted successfully", data: deleted });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
