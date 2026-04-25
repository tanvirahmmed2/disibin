import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isManager } from "@/lib/middleware";
import { createLog } from "@/lib/utils/logger";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (code) {
            const res = await dbQuery(`
                SELECT c.*, p.name, p.description, p.price as original_price, p.image, p.duration_days, p.slug as package_slug 
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

        const res = await dbQuery(`
            SELECT c.*, p.name, p.description, p.price as original_price, p.image, p.duration_days, p.slug as package_slug 
            FROM coupons c 
            LEFT JOIN packages p ON c.package_id = p.package_id 
            WHERE c.status = 'active'
            ORDER BY c.created_at DESC
        `, []);

        const data = res.rows.map(offer => {
            const discountAmount = offer.is_percentage ? (Number(offer.original_price) * Number(offer.discount) / 100) : Number(offer.discount);
            return {
                ...offer,
                price: Number(offer.original_price) - discountAmount
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

        const { package_id, code, discount, is_percentage, start_date, end_date, status, usage_limit, max_discount } = await req.json();
        
        if (!code || discount === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO coupons (package_id, code, discount, is_percentage, start_date, end_date, status, usage_limit, max_discount, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [package_id || null, code.toUpperCase(), Number(discount), is_percentage ?? true, start_date, end_date, status || 'active', usage_limit || 0, max_discount || null, auth.data.id]);

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

        const { id, package_id, code, discount, is_percentage, start_date, end_date, status } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

        const updateFields = [];
        const updateParams = [];

        if (package_id !== undefined) {
            updateParams.push(package_id || null);
            updateFields.push(`package_id = $${updateParams.length}`);
        }
        if (code) {
            updateParams.push(code.toUpperCase());
            updateFields.push(`code = $${updateParams.length}`);
        }
        if (discount !== undefined) {
            updateParams.push(Number(discount));
            updateFields.push(`discount = $${updateParams.length}`);
        }
        if (is_percentage !== undefined) {
            updateParams.push(is_percentage);
            updateFields.push(`is_percentage = $${updateParams.length}`);
        }
        if (start_date) {
            updateParams.push(start_date);
            updateFields.push(`start_date = $${updateParams.length}`);
        }
        if (end_date) {
            updateParams.push(end_date);
            updateFields.push(`end_date = $${updateParams.length}`);
        }
        if (status) {
            updateParams.push(status);
            updateFields.push(`status = $${updateParams.length}`);
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
