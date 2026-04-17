import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import { Blog } from "@/lib/models/blog";
import cloudinary from "@/lib/database/cloudinary";
import { isEditor } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

export async function GET() {
    try {
        await connectDB();
        const blogs = await Blog.find().sort({ createdAt: -1 });
        return NextResponse.json({
            success: true,
            message: 'Blogs fetched successfully',
            payload: blogs
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const formData = await req.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const rawTags = formData.get('tags');           
        const imageFile = formData.get('image');

        if (!title || !description || !imageFile) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await Blog.findOne({ slug });
        if (existing) return NextResponse.json({ success: false, message: 'Blog title already exists' }, { status: 400 });

        const tags = rawTags 
            ? rawTags.split(',').map(tag => tag.trim()).filter(tag => tag !== "") 
            : [];

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blogs" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const blog = await Blog.create({
            title,
            slug,
            description,
            tags,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id,
            isPublished: true
        });

        await createLog({
            userId: auth.data._id,
            action: 'create',
            targetType: 'blog',
            targetId: blog._id,
            description: `Published new blog: ${blog.title}`,
            metadata: { tags: blog.tags }
        });

        return NextResponse.json({ success: true, message: 'Blog created', data: blog }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const formData = await req.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const description = formData.get('description');
        const rawTags = formData.get('tags');
        const imageFile = formData.get('image');

        const blog = await Blog.findById(id);
        if (!blog) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });

        const updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = generateSlug(title);
        }
        if (description) updateData.description = description;
        
        if (rawTags !== null) {
            updateData.tags = rawTags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
        }

        if (imageFile && typeof imageFile !== 'string') {
            if (blog.imageId) await cloudinary.uploader.destroy(blog.imageId);
            
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "blogs" },
                    (err, result) => { if (err) reject(err); else resolve(result); }
                );
                stream.end(buffer);
            });
            updateData.image = cloudImage.secure_url;
            updateData.imageId = cloudImage.public_id;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        await createLog({
            userId: auth.data._id,
            action: 'update',
            targetType: 'blog',
            targetId: updatedBlog._id,
            description: `Updated blog: ${updatedBlog.title}`,
            metadata: { updatedFields: Object.keys(updateData) }
        });

        return NextResponse.json({ success: true, message: 'Blog updated', data: updatedBlog }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const auth = await isEditor();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await req.json();
        const blog = await Blog.findById(id);
        if (!blog) return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 });

        if (blog.imageId) await cloudinary.uploader.destroy(blog.imageId);

        await Blog.findByIdAndDelete(id);

        await createLog({
            userId: auth.data._id,
            action: 'delete',
            targetType: 'blog',
            targetId: id,
            description: `Deleted blog: ${blog.title}`
        });

        return NextResponse.json({ success: true, message: 'Blog deleted' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}