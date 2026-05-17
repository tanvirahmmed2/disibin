import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery, transaction } from "@/lib/database/pg";

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const body = await req.json();
        const { productId, couponCode, paymentMethod, transactionId } = body;

        if (!productId || !paymentMethod || !transactionId) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Fetch product
        const productRes = await dbQuery("SELECT * FROM products WHERE product_id = $1", [productId]);
        const product = productRes.rows[0];
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        let couponId = null;
        let discountAmount = 0;
        let finalAmount = product.price;

        // Handle coupon if provided
        if (couponCode) {
            const couponRes = await dbQuery(
                "SELECT * FROM coupons WHERE code = $1 AND status = 'active'",
                [couponCode]
            );
            const coupon = couponRes.rows[0];

            if (coupon) {
                const now = new Date();
                const isValid = (!coupon.end_date || new Date(coupon.end_date) > now) && 
                                (coupon.usage_limit === 0 || coupon.used_count < coupon.usage_limit);

                if (isValid) {
                    couponId = coupon.coupon_id;
                    if (coupon.is_percentage) {
                        discountAmount = (product.price * coupon.discount) / 100;
                        if (coupon.max_discount && discountAmount > coupon.max_discount) {
                            discountAmount = coupon.max_discount;
                        }
                    } else {
                        discountAmount = coupon.discount;
                    }
                    finalAmount = product.price - discountAmount;
                    if (finalAmount < 0) finalAmount = 0;
                }
            }
        }

        // Create purchase and payment in a transaction
        const result = await transaction(async (client) => {
            // Insert purchase
            const purchaseRes = await client.query(`
                INSERT INTO purchases (
                    user_id, product_id, coupon_id, product_name, product_price,
                    original_amount, discount_amount, final_amount, status
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
                RETURNING *
            `, [
                auth.data.id, productId, couponId, product.name, product.price,
                product.price, discountAmount, finalAmount
            ]);
            const purchase = purchaseRes.rows[0];

            // Insert payment
            await client.query(`
                INSERT INTO payments (
                    purchase_id, user_id, amount, method, provider, transaction_id, status
                )
                VALUES ($1, $2, $3, $4, $5, $6, 'pending')
            `, [
                purchase.purchase_id, auth.data.id, finalAmount, 'MFS', paymentMethod, transactionId
            ]);

            // Update coupon usage if used
            if (couponId) {
                await client.query(
                    "UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = $1",
                    [couponId]
                );
            }

            return purchase;
        });

        return NextResponse.json({
            success: true,
            message: "Purchase request submitted successfully",
            data: result
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
