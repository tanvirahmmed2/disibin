import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";
import { isLogin, isManager } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

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
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "blogs",
                    public_id: slug, 
                    use_filename: true,   
                    unique_filename: false 
                },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(buffer);
        });
        const res = await dbQuery(`
            INSERT INTO blogs (title, slug, description, image, image_id, author_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [title, slug, description, cloudImage.secure_url, cloudImage.public_id, auth.data.id]);

        const blog = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'create',
            targetType: 'blog',
            targetId: blog.blog_id,
            description: `Created blog post: ${blog.title}`
        });

        return NextResponse.json({ success: true, message: 'Blog created', data: blog }, { status: 201 });

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
        const blog = blogRes.rows[0];

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
            if (blog.image_id) await cloudinary.uploader.destroy(blog.image_id);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: "blogs",
                    public_id: generateSlug(title), 
                    use_filename: true,   
                    unique_filename: false 
                }, (err, result) => { if (err) reject(err); else resolve(result); });
                stream.end(buffer);
            });
            updateParams.push(cloudImage.secure_url);
            updateFields.push(`image = $${updateParams.length}`);
            updateParams.push(cloudImage.public_id);
            updateFields.push(`image_id = $${updateParams.length}`);
        }

        if (updateFields.length > 0) {
            updateParams.push(id);
            const sql = `UPDATE blogs SET ${updateFields.join(', ')}, updated_at = NOW() WHERE blog_id = $${updateParams.length} RETURNING *`;
            const updatedRes = await dbQuery(sql, updateParams);
            const updatedBlog = updatedRes.rows[0];

            await createLog({
                userId: auth.data.id,
                action: 'update',
                targetType: 'blog',
                targetId: updatedBlog.blog_id,
                description: `Updated blog post: ${updatedBlog.title}`
            });

            return NextResponse.json({ success: true, message: 'Blog updated', data: updatedBlog }, { status: 200 });
        }

        return NextResponse.json({ success: true, message: 'Blog updated', data: blog }, { status: 200 });

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

        const deletedBlog = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'delete',
            targetType: 'blog',
            targetId: deletedBlog.blog_id,
            description: `Deleted blog post: ${deletedBlog.title}`
        });

        return NextResponse.json({ success: true, message: 'Blog deleted' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}