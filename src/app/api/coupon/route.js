import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";
import cloudinary from "@/lib/database/cloudinary";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (code) {
            const res = await dbQuery(`
                SELECT c.*, p.name, p.description, p.price as original_price, 
                       COALESCE(c.image, p.image) as image, 
                       p.duration_days, p.slug as slug,
                       (SELECT json_agg(f.name) 
                        FROM package_features pf 
                        JOIN features f ON pf.feature_id = f.feature_id 
                        WHERE pf.package_id = p.package_id) as features
                FROM coupons c 
                LEFT JOIN packages p ON c.package_id = p.package_id 
                WHERE UPPER(c.code) = UPPER($1) AND c.status = 'active'
            `, [code]);

            if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });

            const offer = res.rows[0];
            
            // Only calculate price if it's a package-specific coupon
            if (offer.package_id) {
                const discountAmount = offer.is_percentage ? (Number(offer.original_price) * Number(offer.discount) / 100) : Number(offer.discount);
                offer.price = Number(offer.original_price) - discountAmount;
            } else {
                offer.price = null;
            }

            return NextResponse.json({ success: true, message: 'Coupon fetched', data: offer });
        }

        const offersOnly = searchParams.get('offersOnly') === 'true';
        let whereClause = "WHERE c.status = 'active'";
        if (offersOnly) {
            whereClause += " AND c.package_id IS NOT NULL";
        }

        const res = await dbQuery(`
            SELECT c.*, p.name, p.description, p.price as original_price, 
                   COALESCE(c.image, p.image) as image, 
                   p.duration_days, p.slug as slug,
                   (SELECT json_agg(f.name) 
                    FROM package_features pf 
                    JOIN features f ON pf.feature_id = f.feature_id 
                    WHERE pf.package_id = p.package_id) as features
            FROM coupons c 
            LEFT JOIN packages p ON c.package_id = p.package_id 
            ${whereClause}
            ORDER BY c.created_at DESC
        `, []);

        const data = res.rows.map(offer => {
            let price = null;
            if (offer.package_id) {
                const discountAmount = offer.is_percentage ? (Number(offer.original_price) * Number(offer.discount) / 100) : Number(offer.discount);
                price = Number(offer.original_price) - discountAmount;
            }
            return {
                ...offer,
                price
            };
        });

        return NextResponse.json({
            success: true,
            message: 'Offers (Coupons) fetched successfully',
            data: data
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const package_id = formData.get("package_id");
        const code = formData.get("code");
        const discount = formData.get("discount");
        const is_percentage = formData.get("is_percentage") === "true";
        const start_date = formData.get("start_date");
        const end_date = formData.get("end_date");
        const status = formData.get("status") || "active";
        const usage_limit = formData.get("usage_limit") || 0;
        const max_discount = formData.get("max_discount");
        const imageFile = formData.get("image");
        
        if (!code || discount === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        let imageUrl = null;
        let imageId = null;

        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "coupons" }, (err, result) => (err ? reject(err) : resolve(result)));
                stream.end(buffer);
            });
            imageUrl = cloudImage.secure_url;
            imageId = cloudImage.public_id;
        }

        const res = await dbQuery(`
            INSERT INTO coupons (package_id, code, discount, is_percentage, start_date, end_date, status, usage_limit, max_discount, image, image_id, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [package_id || null, code.toUpperCase(), Number(discount), is_percentage, start_date || null, end_date || null, status, Number(usage_limit), max_discount || null, imageUrl, imageId, auth.data.id]);

        const coupon = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'create',
            targetType: 'coupon',
            targetId: coupon.coupon_id,
            description: `Created coupon: ${coupon.code}`
        });

        return NextResponse.json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const formData = await req.formData();
        const id = formData.get("id");
        if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

        const updateFields = [];
        const updateParams = [];

        const fields = ["package_id", "code", "discount", "is_percentage", "start_date", "end_date", "status", "usage_limit", "max_discount"];
        
        for (const field of fields) {
            const value = formData.get(field);
            if (value !== null) {
                let finalValue = value;
                if (field === "discount" || field === "usage_limit" || field === "max_discount") finalValue = Number(value);
                if (field === "is_percentage") finalValue = value === "true";
                if (field === "code") finalValue = value.toUpperCase();
                
                updateParams.push(finalValue);
                updateFields.push(`${field} = $${updateParams.length}`);
            }
        }

        const imageFile = formData.get("image");
        if (imageFile && typeof imageFile !== "string") {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const cloudImage = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: "coupons" }, (err, result) => (err ? reject(err) : resolve(result)));
                stream.end(buffer);
            });
            
            updateParams.push(cloudImage.secure_url);
            updateFields.push(`image = $${updateParams.length}`);
            updateParams.push(cloudImage.public_id);
            updateFields.push(`image_id = $${updateParams.length}`);
        }

        if (updateFields.length > 0) {
            updateParams.push(id);
            const sql = `UPDATE coupons SET ${updateFields.join(', ')} WHERE coupon_id = $${updateParams.length} RETURNING *`;
            const updatedRes = await dbQuery(sql, updateParams);
            const updatedCoupon = updatedRes.rows[0];

            await createLog({
                userId: auth.data.id,
                action: 'update',
                targetType: 'coupon',
                targetId: updatedCoupon.coupon_id,
                description: `Updated coupon: ${updatedCoupon.code}`
            });

            return NextResponse.json({ success: true, message: 'Coupon updated successfully', data: updatedCoupon });
        }

        return NextResponse.json({ success: true, message: 'No changes made' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        const res = await dbQuery("DELETE FROM coupons WHERE coupon_id = $1 RETURNING *", [id]);
        
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });

        const deletedCoupon = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'delete',
            targetType: 'coupon',
            targetId: deletedCoupon.coupon_id,
            description: `Deleted coupon: ${deletedCoupon.code}`
        });

        return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
