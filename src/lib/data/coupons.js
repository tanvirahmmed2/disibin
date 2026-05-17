import { dbQuery } from "../database/pg";
import { createLog } from "./logs";

export async function createCoupon(data) {
    const {
        code, discount, is_percentage, max_discount,
        usage_limit, start_date, end_date, status, product_id, userId
    } = data;

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
        userId || null
    ]);
    const coupon = res.rows[0];

    if (coupon && userId) {
        await createLog({
            user_id: userId,
            action: 'CREATE',
            entity_type: 'coupon',
            entity_id: coupon.coupon_id,
            details: { code: coupon.code }
        });
    }

    return coupon;
}

export async function getAllCoupons() {
    const query = `
        SELECT c.*, p.name AS product_name
        FROM coupons c
        LEFT JOIN products p ON c.product_id = p.product_id
        ORDER BY c.created_at DESC
    `;
    const res = await dbQuery(query);
    return res.rows;
}

export async function getCouponByCode(code) {
    const res = await dbQuery(
        "SELECT * FROM coupons WHERE code = $1 AND status = 'active'",
        [code]
    );
    return res.rows[0] || null;
}

export async function updateCoupon(id, data, userId) {
    const allowedFields = [
        'code', 'discount', 'is_percentage', 'max_discount',
        'usage_limit', 'start_date', 'end_date', 'status', 'product_id'
    ];
    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([k]) => allowedFields.includes(k))
    );
    const keys = Object.keys(filteredData);
    const values = Object.values(filteredData);
    if (keys.length === 0) return null;

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const query = `UPDATE coupons SET ${setClause} WHERE coupon_id = $${keys.length + 1} RETURNING *`;
    const res = await dbQuery(query, [...values, id]);
    const coupon = res.rows[0];

    if (coupon && userId) {
        await createLog({
            user_id: userId,
            action: 'UPDATE',
            entity_type: 'coupon',
            entity_id: id,
            details: filteredData
        });
    }

    return coupon;
}

export async function deleteCoupon(id, userId) {
    const res = await dbQuery("DELETE FROM coupons WHERE coupon_id = $1 RETURNING *", [id]);
    const coupon = res.rows[0];

    if (coupon && userId) {
        await createLog({
            user_id: userId,
            action: 'DELETE',
            entity_type: 'coupon',
            entity_id: id,
            details: { code: coupon.code }
        });
    }
    return coupon;
}

export async function incrementUsedCount(id) {
    await dbQuery(
        "UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = $1",
        [id]
    );
}
