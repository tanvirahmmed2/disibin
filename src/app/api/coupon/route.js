import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

// GET  — public validate (?code=XXX)  OR  manager list all
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (code) {
            const res = await dbQuery(
                "SELECT * FROM coupons WHERE code = $1 AND status = 'active'",
                [code]
            );
            const coupon = res.rows[0] || null;

            if (!coupon) {
                return NextResponse.json({ success: false, message: "Invalid or inactive coupon" }, { status: 404 });
            }

            const now = new Date();
            if (coupon.end_date && new Date(coupon.end_date) < now) {
                return NextResponse.json({ success: false, message: "Coupon has expired" }, { status: 400 });
            }
            if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
                return NextResponse.json({ success: false, message: "Coupon usage limit reached" }, { status: 400 });
            }

            return NextResponse.json({ success: true, data: coupon });
        }

        // List all
        const auth = await isManager();
        if (!auth.success) {
            // For public users, only show ACTIVE coupons that have not expired
            const query = `
                SELECT c.*, p.name AS product_name
                FROM coupons c
                LEFT JOIN products p ON c.product_id = p.product_id
                WHERE c.status = 'active'
                AND (c.end_date IS NULL OR c.end_date > now())
                ORDER BY c.created_at DESC
            `;
            const listRes = await dbQuery(query);
            return NextResponse.json({ success: true, data: listRes.rows });
        }

        // For managers, show all
        const query = `
            SELECT c.*, p.name AS product_name
            FROM coupons c
            LEFT JOIN products p ON c.product_id = p.product_id
            ORDER BY c.created_at DESC
        `;
        const listRes = await dbQuery(query);
        
        return NextResponse.json({ success: true, data: listRes.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create coupon — Manager only
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const {
            code, discount, is_percentage, max_discount,
            usage_limit, start_date, end_date, status, product_id
        } = body;

        if (!code || discount === undefined || discount === null || discount === '') {
            return NextResponse.json(
                { success: false, message: "Missing required fields: code and discount" },
                { status: 400 }
            );
        }

        const query = `
            INSERT INTO coupons (
                code, discount, is_percentage, max_discount,
                usage_limit, start_date, end_date, status, product_id, created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const res = await dbQuery(query, [
            code,
            discount,
            is_percentage ?? true,
            max_discount || null,
            usage_limit || 0,
            start_date || null,
            end_date || null,
            status || 'active',
            product_id || null,
            auth.data.id || null
        ]);
        const coupon = res.rows[0];

        if (coupon && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'CREATE', 'coupon', coupon.coupon_id, JSON.stringify({ code: coupon.code })]);
        }

        return NextResponse.json(
            { success: true, message: "Coupon created successfully", data: coupon },
            { status: 201 }
        );

    } catch (error) {
        if (error.code === '23505') {
            return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update coupon — Manager only
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { couponId, ...updateData } = body;

        if (!couponId) {
            return NextResponse.json({ success: false, message: "Coupon ID is required" }, { status: 400 });
        }

        const allowedFields = [
            'code', 'discount', 'is_percentage', 'max_discount',
            'usage_limit', 'start_date', 'end_date', 'status', 'product_id'
        ];
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([k]) => allowedFields.includes(k))
        );
        const keys = Object.keys(filteredData);
        const values = Object.values(filteredData);
        
        if (keys.length === 0) {
            return NextResponse.json({ success: false, message: "No valid fields to update" }, { status: 400 });
        }

        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        const query = `UPDATE coupons SET ${setClause} WHERE coupon_id = $${keys.length + 1} RETURNING *`;
        const res = await dbQuery(query, [...values, couponId]);
        const coupon = res.rows[0];

        if (coupon && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'UPDATE', 'coupon', couponId, JSON.stringify(filteredData)]);
        }

        if (!coupon) return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Coupon updated successfully", data: coupon });

    } catch (error) {
        if (error.code === '23505') {
            return NextResponse.json({ success: false, message: "Coupon code already exists" }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE coupon — Manager only
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const couponId = searchParams.get('id');

        if (!couponId) {
            return NextResponse.json({ success: false, message: "Coupon ID is required" }, { status: 400 });
        }

        const res = await dbQuery("DELETE FROM coupons WHERE coupon_id = $1 RETURNING *", [couponId]);
        const coupon = res.rows[0];

        if (coupon && auth.data.id) {
            const logQuery = `
                INSERT INTO logs (user_id, action, entity_type, entity_id, description)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await dbQuery(logQuery, [auth.data.id, 'DELETE', 'coupon', couponId, JSON.stringify({ code: coupon.code })]);
        }

        if (!coupon) return NextResponse.json({ success: false, message: "Coupon not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Coupon deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
