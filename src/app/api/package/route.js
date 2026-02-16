import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
    try {
        const query = "SELECT * FROM public.packages ORDER BY created_at DESC";
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
        const price = Number(formData.get("price"));
        const discount = Number(formData.get("discount") || 0);
        const category = formData.get("category");
        const features = formData.get("features");
        const isPopular = formData.get("isPopular") === "true";
        const imageFile = formData.get("image");

        if (!title || !description || !price || !category || !imageFile) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const slug = slugify(title, { strict: true, lower: true });
        
        const checkResult = await pool.query("SELECT slug FROM public.packages WHERE slug = $1", [slug]);
        if (checkResult.rowCount > 0) {
            return NextResponse.json({ success: false, message: "Package title already exists" }, { status: 400 });
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "packages" },
                (err, result) => { if (err) reject(err); else resolve(result); }
            );
            stream.end(buffer);
        });

        const query = `
            INSERT INTO public.packages 
            (title, slug, description, price, discount, image, image_id, features, category, is_popular)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;

        const values = [
            title,
            slug,
            description,
            price,
            discount,
            cloudImage.secure_url,
            cloudImage.public_id,
            features ? features.split(',').map(f => f.trim()) : [],
            category,
            isPopular
        ];

        const result = await pool.query(query, values);
        return NextResponse.json({ success: true, message: "Package created", payload: result.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const formData = await req.formData();
        const id = formData.get("id");

        if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

        const findResult = await pool.query("SELECT * FROM public.packages WHERE package_id = $1", [id]);
        if (findResult.rowCount === 0) return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });

        const pkg = findResult.rows[0];

        const title = formData.get("title");
        const description = formData.get("description");
        const price = formData.get("price");
        const discount = formData.get("discount");
        const category = formData.get("category");
        const features = formData.get("features");
        const isPopular = formData.get("isPopular");
        const imageFile = formData.get("image");

        let updateData = { ...pkg };
        
        if (title) {
            updateData.title = title;
            updateData.slug = slugify(title, { strict: true, lower: true });
        }
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);
        if (discount !== null) updateData.discount = Number(discount);
        if (category) updateData.category = category;
        if (isPopular !== null) updateData.is_popular = isPopular === "true";
        if (features) updateData.features = features.split(',').map(f => f.trim());

        if (imageFile && typeof imageFile !== "string") {
            await cloudinary.uploader.destroy(pkg.image_id);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "packages" },
                    (err, result) => { if (err) reject(err); else resolve(result); }
                );
                stream.end(buffer);
            });
            updateData.image = cloudImage.secure_url;
            updateData.image_id = cloudImage.public_id;
        }

        const updateQuery = `
            UPDATE public.packages 
            SET title = $1, slug = $2, description = $3, price = $4, discount = $5, 
                image = $6, image_id = $7, features = $8, category = $9, 
                is_popular = $10, updated_at = CURRENT_TIMESTAMP
            WHERE package_id = $11
            RETURNING *;
        `;

        const updateValues = [
            updateData.title, updateData.slug, updateData.description, updateData.price,
            updateData.discount, updateData.image, updateData.image_id, updateData.features,
            updateData.category, updateData.is_popular, id
        ];

        const result = await pool.query(updateQuery, updateValues);
        return NextResponse.json({ success: true, message: "Package updated", payload: result.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        const findResult = await pool.query("SELECT image_id FROM public.packages WHERE package_id = $1", [id]);
        if (findResult.rowCount === 0) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

        const imageId = findResult.rows[0].image_id;
        if (imageId) {
            await cloudinary.uploader.destroy(imageId);
        }

        await pool.query("DELETE FROM public.packages WHERE package_id = $1", [id]);
        return NextResponse.json({ success: true, message: "Package deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}