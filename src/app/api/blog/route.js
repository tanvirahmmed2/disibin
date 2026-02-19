import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        const query = "SELECT * FROM public.blogs ORDER BY created_at DESC";
        const result = await pool.query(query);
        return NextResponse.json({ success: true, payload: result.rows || [] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        
        const title = formData.get("title");
        const description = formData.get("description");
        const preview = formData.get("preview");
        const tags = formData.get("tags");
        const isFeatured = formData.get("isFeatured") === "true";
        const imageFile = formData.get("image");

        if (!title || !description || !imageFile) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const slug = slugify(title, { strict: true, lower: true });
        
        const checkResult = await pool.query("SELECT slug FROM public.blogs WHERE slug = $1", [slug]);
        if (checkResult.rowCount > 0) {
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

        const query = `
            INSERT INTO public.blogs (title, slug, description, image, image_id, preview, tags, is_featured)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            title,
            slug,
            description,
            cloudImage.secure_url,
            cloudImage.public_id,
            preview,
            tags ? tags.split(',').map(t => t.trim()) : [],
            isFeatured
        ];

        const result = await pool.query(query, values);
        return NextResponse.json({ success: true, message: "Blog created", payload: result.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const formData = await req.formData();
        const id = formData.get("id");

        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const findResult = await pool.query("SELECT * FROM public.blogs WHERE id = $1", [id]);
        if (findResult.rowCount === 0) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

        const blog = findResult.rows[0];

        const title = formData.get("title");
        const description = formData.get("description");
        const preview = formData.get("preview");
        const tags = formData.get("tags");
        const isFeatured = formData.get("isFeatured");
        const imageFile = formData.get("image");

        let updateData = { ...blog };
        
        if (title) {
            updateData.title = title;
            updateData.slug = slugify(title, { strict: true, lower: true });
        }
        if (description) updateData.description = description;
        if (preview) updateData.preview = preview;
        if (isFeatured !== null) updateData.is_featured = isFeatured === "true";
        if (tags) updateData.tags = tags.split(',').map(t => t.trim());

        if (imageFile && typeof imageFile !== "string") {
            await cloudinary.uploader.destroy(blog.image_id);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "blogs" },
                    (err, result) => { if (err) reject(err); else resolve(result); }
                );
                stream.end(buffer);
            });
            updateData.image = cloudImage.secure_url;
            updateData.image_id = cloudImage.public_id;
        }

        const query = `
            UPDATE public.blogs 
            SET title = $1, slug = $2, description = $3, image = $4, image_id = $5, 
                preview = $6, tags = $7, is_featured = $8 
            WHERE id = $9
            RETURNING *;
        `;

        const values = [
            updateData.title, updateData.slug, updateData.description, updateData.image,
            updateData.image_id, updateData.preview, updateData.tags, updateData.is_featured, id
        ];

        const result = await pool.query(query, values);
        return NextResponse.json({ success: true, message: "Blog updated", payload: result.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const findResult = await pool.query("SELECT * FROM public.blogs WHERE blog_id = $1", [id]);
        if (findResult.rowCount === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

        await cloudinary.uploader.destroy(findResult.rows[0].image_id);
        await pool.query("DELETE FROM public.blogs WHERE blog_id = $1", [id]);

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}