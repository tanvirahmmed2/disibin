import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";
import { isLogin, isManager } from "@/lib/middleware";

const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export async function GET() {
    try {
        const res = await dbQuery("SELECT * FROM blogs ORDER BY created_at DESC", []);
        return NextResponse.json({
            success: true,
            message: 'Blogs fetched successfully',
            data: res.rows
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const imageFile = formData.get('image');

        if (!title || !description || !imageFile) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await dbQuery("SELECT blog_id FROM blogs WHERE slug = $1", [slug]);
        if (existing.rows.length > 0) return NextResponse.json({ success: false, message: 'Blog title already exists' }, { status: 400 });

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "blogs" }, (err, result) => { if (err) reject(err); else resolve(result); });
            stream.end(buffer);
        });

        const res = await dbQuery(`
            INSERT INTO blogs (title, slug, description, image_url, author_id, is_published)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [title, slug, description, cloudImage.secure_url, auth.data.id, true]);

        return NextResponse.json({ success: true, message: 'Blog created', data: res.rows[0] }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const formData = await req.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const description = formData.get('description');
        const imageFile = formData.get('image');

        const blogRes = await dbQuery("SELECT * FROM blogs WHERE blog_id = $1", [id]);
        if (blogRes.rows.length === 0) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });

        const updateFields = [];
        const updateParams = [];

        if (title) {
            updateParams.push(title);
            updateFields.push(`title = $${updateParams.length}`);
            updateParams.push(generateSlug(title));
            updateFields.push(`slug = $${updateParams.length}`);
        }
        if (description) {
            updateParams.push(description);
            updateFields.push(`description = $${updateParams.length}`);
        }
        if (imageFile && typeof imageFile !== 'string') {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "blogs" }, (err, result) => { if (err) reject(err); else resolve(result); });
                stream.end(buffer);
            });
            updateParams.push(cloudImage.secure_url);
            updateFields.push(`image_url = $${updateParams.length}`);
        }

        if (updateFields.length > 0) {
            updateParams.push(id);
            const sql = `UPDATE blogs SET ${updateFields.join(', ')}, updated_at = NOW() WHERE blog_id = $${updateParams.length} RETURNING *`;
            const updatedRes = await dbQuery(sql, updateParams);
            return NextResponse.json({ success: true, message: 'Blog updated', data: updatedRes.rows[0] }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: 'Blog updated', data: blogRes.rows[0] }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await req.json();
        const res = await dbQuery("DELETE FROM blogs WHERE blog_id = $1 RETURNING *", [id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Blog deleted' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}