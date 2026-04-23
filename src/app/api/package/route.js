import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";
import { isLogin, isManager } from "@/lib/middleware";

const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT p.*, c.name as category_name 
            FROM packages p 
            LEFT JOIN categories c ON p.category_id = c.category_id 
            ORDER BY p.created_at DESC
        `, []);
        return NextResponse.json({
            success: true,
            message: "Packages fetched successfully",
            data: res.rows
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const formData = await req.formData();
        const title = formData.get("title");
        const description = formData.get("description");
        const categoryId = formData.get("categoryId");
        const price = formData.get("price");
        const features = formData.get("features");
        const imageFile = formData.get("image");

        if (!title || !description || !price || !imageFile) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await dbQuery("SELECT package_id FROM packages WHERE slug = $1", [slug]);
        if (existing.rows.length > 0) return NextResponse.json({ success: false, message: "Package already exists" }, { status: 400 });

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "packages" }, (err, result) => (err ? reject(err) : resolve(result)));
            stream.end(buffer);
        });

        const parsedFeatures = features ? features.split(",").map((f) => f.trim()).filter(Boolean) : [];

        const res = await dbQuery(`
            INSERT INTO packages (name, slug, description, category_id, price, duration_days, features, is_active, image, image_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [title, slug, description, categoryId || null, Number(price), 30, parsedFeatures, true, cloudImage.secure_url, cloudImage.public_id]);

        return NextResponse.json({
            success: true,
            message: "Package created successfully",
            data: res.rows[0]
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const formData = await req.formData();
        const id = formData.get("id");
        if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

        const pkgRes = await dbQuery("SELECT * FROM packages WHERE package_id = $1", [id]);
        if (pkgRes.rows.length === 0) return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
        const pkg = pkgRes.rows[0];

        const title = formData.get("title");
        const description = formData.get("description");
        const categoryId = formData.get("categoryId");
        const price = formData.get("price");
        const features = formData.get("features");
        const imageFile = formData.get("image");

        const updateFields = [];
        const updateParams = [];

        if (title) {
            updateParams.push(title);
            updateFields.push(`name = $${updateParams.length}`);
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
        if (price !== null && price !== undefined) {
            updateParams.push(Number(price));
            updateFields.push(`price = $${updateParams.length}`);
        }
        if (features) {
            updateParams.push(features.split(",").map((f) => f.trim()).filter(Boolean));
            updateFields.push(`features = $${updateParams.length}`);
        }
        if (imageFile && typeof imageFile !== 'string') {
            if (pkg.image_id) await cloudinary.uploader.destroy(pkg.image_id);
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "packages" }, (err, result) => (err ? reject(err) : resolve(result)));
                stream.end(buffer);
            });
            updateParams.push(cloudImage.secure_url);
            updateFields.push(`image = $${updateParams.length}`);
            updateParams.push(cloudImage.public_id);
            updateFields.push(`image_id = $${updateParams.length}`);
        }

        if (updateFields.length > 0) {
            updateParams.push(id);
            const sql = `UPDATE packages SET ${updateFields.join(", ")}, updated_at = NOW() WHERE package_id = $${updateParams.length} RETURNING *`;
            const updatedRes = await dbQuery(sql, updateParams);
            return NextResponse.json({ success: true, message: "Package updated successfully", data: updatedRes.rows[0] });
        }

        return NextResponse.json({ success: true, message: "Package updated successfully", data: pkg });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await req.json();
        const res = await dbQuery("DELETE FROM packages WHERE package_id = $1 RETURNING *", [id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
        
        const pkg = res.rows[0];
        if (pkg.image_id) await cloudinary.uploader.destroy(pkg.image_id);

        return NextResponse.json({ success: true, message: "Package deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}