import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";

// GET team members (Public)
export async function GET() {
    try {
        const res = await dbQuery("SELECT * FROM teams ORDER BY created_at ASC");
        return NextResponse.json({ success: true, data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST add member (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const formData = await req.formData();
        const name = formData.get('name');
        const post = formData.get('post');
        const email = formData.get('email');
        const bio = formData.get('bio');
        const imageFile = formData.get('image'); // Can be File object or empty/null

        if (!name || !post || !email || !imageFile) {
            return NextResponse.json({ success: false, message: "Name, Post, Email, and Avatar Image are required" }, { status: 400 });
        }

        // Image upload directly to Cloudinary if provided as file
        let imageUrl = null;
        let imagePublicId = null;

        if (imageFile && typeof imageFile !== 'string') {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "disibin_team",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        // Normalize optional parameters: empty string or null -> DB NULL
        const normalizedEmail = email === "" || email === null ? null : email;
        const normalizedBio = bio === "" || bio === null ? null : bio;

        const query = `
            INSERT INTO teams (name, post, email, image, image_id, bio)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const res = await dbQuery(query, [name, post, normalizedEmail, imageUrl, imagePublicId, normalizedBio]);

        return NextResponse.json({
            success: true,
            message: "Team member added successfully",
            data: res.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update member (Manager only)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const formData = await req.formData();
        const memberId = formData.get('memberId');
        const name = formData.get('name');
        const post = formData.get('post');
        const email = formData.get('email');
        const bio = formData.get('bio');
        const imageFile = formData.get('image'); // Can be File object, string (URL), or null
        const imageId = formData.get('image_id'); // Existing image public ID if string

        if (!memberId) {
            return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
        }

        if (!name || !post || !email) {
            return NextResponse.json({ success: false, message: "Name, Post, and Email are required" }, { status: 400 });
        }

        // 1. Get current member to compare image_id later
        const currentMemberRes = await dbQuery("SELECT * FROM teams WHERE member_id = $1", [memberId]);
        const currentMember = currentMemberRes.rows[0];
        if (!currentMember) {
            return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });
        }

        // 2. Prepare update data dictionary
        const updateData = {};
        if (name !== null) updateData.name = name;
        if (post !== null) updateData.post = post;
        
        updateData.email = email === "" || email === null ? null : email;
        updateData.bio = bio === "" || bio === null ? null : bio;

        // Image logical flow
        let finalImage = null;
        let finalImageId = null;

        if (imageFile && typeof imageFile !== 'string') {
            // New avatar file was uploaded
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "disibin_team",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            finalImage = uploadResult.secure_url;
            finalImageId = uploadResult.public_id;
        } else if (typeof imageFile === 'string') {
            // Keep existing avatar URL
            finalImage = imageFile;
            finalImageId = imageId;
        } else {
            // Avatar cleared
            finalImage = null;
            finalImageId = null;
        }

        if (!finalImage) {
            return NextResponse.json({ success: false, message: "Avatar Image is required" }, { status: 400 });
        }

        updateData.image = finalImage;
        updateData.image_id = finalImageId;

        const keys = Object.keys(updateData);
        if (keys.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }
        for (const key of keys) {
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                return NextResponse.json({ success: false, message: "Invalid field name" }, { status: 400 });
            }
        }
        const values = Object.values(updateData);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        
        const query = `UPDATE teams SET ${setClause} WHERE member_id = $${keys.length + 1} RETURNING *`;
        const res = await dbQuery(query, [...values, memberId]);
        const updatedMember = res.rows[0];

        // 3. Delete old image from Cloudinary if image_id was replaced/removed
        if (currentMember.image_id && currentMember.image_id !== updatedMember.image_id) {
            try {
                await cloudinary.uploader.destroy(currentMember.image_id);
            } catch (error) {
                console.error("Failed to delete old image from Cloudinary:", error);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Team member updated successfully",
            data: updatedMember
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE member (Manager only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('id');

        if (!memberId) {
            return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM teams WHERE member_id = $1 RETURNING *", [memberId]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });

        const member = res.rows[0];
        
        // Delete image from Cloudinary
        if (member.image_id) {
            try {
                await cloudinary.uploader.destroy(member.image_id);
            } catch (error) {
                console.error("Failed to delete member image from Cloudinary:", error);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Team member removed",
            data: member
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
