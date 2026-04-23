import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";
import { isLogin, isManager } from "@/lib/middleware";

const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export async function GET() {
    try {
        const res = await dbQuery("SELECT * FROM projects ORDER BY created_at DESC", []);
        return NextResponse.json({
            success: true,
            message: 'Projects fetched successfully',
            data: res.rows
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const categoryId = formData.get('categoryId');
        const preview = formData.get('preview'); 
        const imageFile = formData.get('image');

        if (!title || !description || !imageFile) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await dbQuery("SELECT project_id FROM projects WHERE slug = $1", [slug]);
        if (existing.rows.length > 0) return NextResponse.json({ success: false, message: 'Project slug already exists' }, { status: 400 });

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "projects" }, (err, result) => { if (err) reject(err); else resolve(result); });
            stream.end(buffer);
        });

        const res = await dbQuery(`
            INSERT INTO projects (title, slug, description, category_id, image, image_id, live_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [title, slug, description, categoryId || null, cloudImage.secure_url, cloudImage.public_id, preview]);

        return NextResponse.json({ success: true, message: 'Project created', data: res.rows[0] });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const description = formData.get('description');
        const categoryId = formData.get('categoryId');
        const preview = formData.get('preview');
        const imageFile = formData.get('image');

        const projectRes = await dbQuery("SELECT * FROM projects WHERE project_id = $1", [id]);
        if (projectRes.rows.length === 0) return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        const project = projectRes.rows[0];

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
        if (categoryId) {
            updateParams.push(categoryId);
            updateFields.push(`category_id = $${updateParams.length}`);
        }
        if (preview) {
            updateParams.push(preview);
            updateFields.push(`live_url = $${updateParams.length}`);
        }

        if (imageFile && typeof imageFile !== 'string') {
            if (project.image_id) await cloudinary.uploader.destroy(project.image_id);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "projects" }, (err, result) => { if (err) reject(err); else resolve(result); });
                stream.end(buffer);
            });
            updateParams.push(cloudImage.secure_url);
            updateFields.push(`image = $${updateParams.length}`);
            updateParams.push(cloudImage.public_id);
            updateFields.push(`image_id = $${updateParams.length}`);
        }

        if (updateFields.length > 0) {
            updateParams.push(id);
            const sql = `UPDATE projects SET ${updateFields.join(', ')}, updated_at = NOW() WHERE project_id = $${updateParams.length} RETURNING *`;
            const updatedRes = await dbQuery(sql, updateParams);
            return NextResponse.json({ success: true, message: 'Project updated', data: updatedRes.rows[0] });
        }

        return NextResponse.json({ success: true, message: 'Project updated', data: project });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        const res = await dbQuery("DELETE FROM projects WHERE project_id = $1 RETURNING *", [id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: 'Project not found' }, { status: 404 });
        
        const project = res.rows[0];
        if (project.image_id) await cloudinary.uploader.destroy(project.image_id);

        return NextResponse.json({ success: true, message: 'Project deleted' });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}