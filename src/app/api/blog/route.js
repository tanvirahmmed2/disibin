import cloudinary from "@/lib/database/cloudinary";
import ConnectDB from "@/lib/database/mongo";
import Blog from "@/lib/models/blog";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        await ConnectDB();
        const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, payload: blogs || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();
        const formData = await req.formData();
        
        const title = formData.get("title");
        const description = formData.get("description");
        const preview = formData.get("preview");
        const tags = formData.get("tags");
        const isFeatured = formData.get("isFeatured") === "true";
        const imageFile = formData.get("image");

        if (!title || !description  || !imageFile) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const slug = slugify(title, { strict: true, lower: true });
        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 400 });
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "blogs" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const newBlog = await Blog.create({
            title,
            slug,
            description,
            image: cloudImage.secure_url,
            imageId: cloudImage.public_id,
            preview,
            tags: tags ? tags.split(',').map(t => t.trim()) : [],
            isFeatured
        });

        return NextResponse.json({ success: true, message: "Blog created", payload: newBlog });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await ConnectDB();
        const formData = await req.formData();
        
        const id = formData.get("id");
        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const blog = await Blog.findById(id);
        if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

        const title = formData.get("title");
        const description = formData.get("description");
        const preview = formData.get("preview");
        const tags = formData.get("tags");
        const isFeatured = formData.get("isFeatured");
        const imageFile = formData.get("image");

        let updateData = {};
        if (title) {
            updateData.title = title;
            updateData.slug = slugify(title, { strict: true, lower: true });
        }
        if (description) updateData.description = description;
        if (preview) updateData.preview = preview;
        if (isFeatured !== null) updateData.isFeatured = isFeatured === "true";
        if (tags) updateData.tags = tags.split(',').map(t => t.trim());

        if (imageFile && typeof imageFile !== "string") {
            await cloudinary.uploader.destroy(blog.imageId);
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
        return NextResponse.json({ success: true, message: "Blog updated", payload: updatedBlog });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        const blog = await Blog.findById(id);
        if (!blog) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

        await cloudinary.uploader.destroy(blog.imageId);
        await Blog.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}