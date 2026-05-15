import { dbQuery } from "../database/pg";
import { createLog } from "./logs";

export async function createCoupon(data) {
    const { code, discount_type, discount_value, min_purchase_amount, max_discount_amount, valid_from, valid_until, usage_limit } = data;
    const query = `
        INSERT INTO coupons (code, discount_type, discount_value, min_purchase_amount, max_discount_amount, valid_from, valid_until, usage_limit)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const res = await dbQuery(query, [code, discount_type, discount_value, min_purchase_amount, max_discount_amount, valid_from, valid_until, usage_limit]);
    const coupon = res.rows[0];

    if (coupon && data.userId) {
        await createLog({
            user_id: data.userId,
            action: 'CREATE',
            entity_type: 'coupon',
            entity_id: coupon.coupon_id,
            details: { code: coupon.code }
        });
    }

    return coupon;
}

export async function getAllCoupons() {
    const res = await dbQuery("SELECT * FROM coupons ORDER BY created_at DESC");
    return res.rows;
}

export async function getCouponByCode(code) {
    const res = await dbQuery("SELECT * FROM coupons WHERE code = $1 AND is_active = TRUE", [code]);
    return res.rows[0] || null;
}

export async function updateCoupon(id, data, userId) {
    const keys = Object.keys(data);
    const values = Object.values(data);
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
            details: data
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

export async function incrementUsage(id) {
    await dbQuery("UPDATE coupons SET usage_count = usage_count + 1 WHERE coupon_id = $1", [id]);
}
