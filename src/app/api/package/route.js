import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import cloudinary from "@/lib/database/cloudinary";
import { isLogin, isManager } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

export async function GET() {
    try {
        const res = await dbQuery(`
            SELECT p.*, c.name as category_name,
                   (SELECT json_agg(json_build_object('name', f.name, 'description', f.description, 'value', pf.value)) 
                    FROM package_features pf 
                    JOIN features f ON pf.feature_id = f.feature_id 
                    WHERE pf.package_id = p.package_id) as features
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
        const features = formData.get("features"); // Comma separated string
        const imageFile = formData.get("image");

        if (!title || !description || !price || !imageFile) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const slug = generateSlug(title);
        const existing = await dbQuery("SELECT package_id FROM packages WHERE slug = $1", [slug]);
        if (existing.rows.length > 0) return NextResponse.json({ success: false, message: "Package already exists" }, { status: 400 });

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                    folder: "packages",
                    public_id: slug, 
                    use_filename: true,   
                    unique_filename: false 
                }, (err, result) => (err ? reject(err) : resolve(result)));
            stream.end(buffer);
        });

        const durationDays = formData.get("durationDays") || 30;

        const res = await dbQuery(`
            INSERT INTO packages (name, slug, description, category_id, price, duration_days, image, image_id, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [title, slug, description, categoryId || null, Number(price), Number(durationDays), cloudImage.secure_url, cloudImage.public_id, auth.data.id]);

        const newPackage = res.rows[0];

        // Handle Features
        if (features) {
            const featureList = features.split(",").map(f => f.trim()).filter(Boolean);
            for (const featureName of featureList) {
                // Find or create feature
                let featRes = await dbQuery("SELECT feature_id FROM features WHERE name = $1", [featureName]);
                let featureId;
                if (featRes.rows.length === 0) {
                    const newFeat = await dbQuery("INSERT INTO features (name) VALUES ($1) RETURNING feature_id", [featureName]);
                    featureId = newFeat.rows[0].feature_id;
                } else {
                    featureId = featRes.rows[0].feature_id;
                }
                // Link to package
                await dbQuery("INSERT INTO package_features (package_id, feature_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [newPackage.package_id, featureId]);
            }
        }

        await createLog({
            userId: auth.data.id,
            action: 'create',
            targetType: 'package',
            targetId: newPackage.package_id,
            description: `Created package: ${newPackage.name}`
        });

        return NextResponse.json({
            success: true,
            message: "Package created successfully",
            data: newPackage
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
        if (formData.get("durationDays")) {
            updateParams.push(Number(formData.get("durationDays")));
            updateFields.push(`duration_days = $${updateParams.length}`);
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
            await dbQuery(sql, updateParams);
        }

        // Handle Features Update
        if (features !== null && features !== undefined) {
            // Remove old links
            await dbQuery("DELETE FROM package_features WHERE package_id = $1", [id]);
            const featureList = features.split(",").map(f => f.trim()).filter(Boolean);
            for (const featureName of featureList) {
                let featRes = await dbQuery("SELECT feature_id FROM features WHERE name = $1", [featureName]);
                let featureId;
                if (featRes.rows.length === 0) {
                    const newFeat = await dbQuery("INSERT INTO features (name) VALUES ($1) RETURNING feature_id", [featureName]);
                    featureId = newFeat.rows[0].feature_id;
                } else {
                    featureId = featRes.rows[0].feature_id;
                }
                await dbQuery("INSERT INTO package_features (package_id, feature_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [id, featureId]);
            }
        }

        const finalPkg = await dbQuery(`
            SELECT p.*, c.name as category_name,
                   (SELECT json_agg(json_build_object('name', f.name, 'description', f.description, 'value', pf.value)) 
                    FROM package_features pf 
                    JOIN features f ON pf.feature_id = f.feature_id 
                    WHERE pf.package_id = p.package_id) as features
            FROM packages p 
            LEFT JOIN categories c ON p.category_id = c.category_id 
            WHERE p.package_id = $1
        `, [id]);

        const updatedPackage = finalPkg.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'update',
            targetType: 'package',
            targetId: updatedPackage.package_id,
            description: `Updated package: ${updatedPackage.name}`
        });

        return NextResponse.json({ success: true, message: "Package updated successfully", data: updatedPackage });
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
        
        const deletedPackage = res.rows[0];
        if (deletedPackage.image_id) await cloudinary.uploader.destroy(deletedPackage.image_id);

        await createLog({
            userId: auth.data.id,
            action: 'delete',
            targetType: 'package',
            targetId: deletedPackage.package_id,
            description: `Deleted package: ${deletedPackage.name}`
        });

        return NextResponse.json({ success: true, message: "Package deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}