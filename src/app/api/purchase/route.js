import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        const { searchParams } = new URL(req.url);
        const personal = searchParams.get('personal');

        let sql;
        let params = [];
        if ((user.role === 'admin' || user.role === 'manager') && personal !== 'true') {
            sql = `
                SELECT p.*, pkg.name as package_name, pkg.slug as package_slug,
                       u.name as user_name, u.email as user_email
                FROM purchases p
                LEFT JOIN packages pkg ON p.package_id = pkg.package_id
                JOIN users u ON p.user_id = u.user_id
                ORDER BY p.created_at DESC
            `;
        } else {
            sql = `
                SELECT p.*, pkg.name as package_name, pkg.slug as package_slug 
                FROM purchases p
                LEFT JOIN packages pkg ON p.package_id = pkg.package_id
                WHERE p.user_id = $1 
                ORDER BY p.created_at DESC
            `;
            params = [user.id];
        }
        const res = await dbQuery(sql, params);
        return NextResponse.json({ 
            success: true, 
            message: 'Purchases fetched', 
            data: res.rows 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const body = await req.json();
        const { items, paymentMethod, couponCode } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "No items provided" }, { status: 400 });
        }

        // Validate items and calculate total securely
        let calculatedTotal = 0;
        let validItems = [];

        for (const item of items) {
            const pkgRes = await dbQuery("SELECT * FROM packages WHERE package_id = $1", [item.packageId]);
            if (pkgRes.rows.length === 0) continue;
            
            const pkg = pkgRes.rows[0];
            const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
            
            calculatedTotal += Number(pkg.price) * qty;
            validItems.push({ ...pkg, quantity: qty });
        }

        if (validItems.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid packages" }, { status: 400 });
        }

        // Apply coupon if valid
        let discount = 0;
        if (couponCode) {
            const couponRes = await dbQuery("SELECT * FROM coupons WHERE code = $1 AND status = 'active'", [couponCode.toUpperCase()]);
            if (couponRes.rows.length > 0) {
                const coupon = couponRes.rows[0];
                if (coupon.is_percentage) {
                    discount = calculatedTotal * (Number(coupon.discount) / 100);
                } else {
                    discount = Number(coupon.discount);
                }
            }
        }

        const finalAmount = Math.max(0, calculatedTotal - discount);

        // CREATE PURCHASE RECORDS
        const purchases = [];
        for (const item of validItems) {
            const itemOriginalCost = Number(item.price) * item.quantity;
            const itemDiscount = (itemOriginalCost / calculatedTotal) * discount;
            const itemFinalCost = Math.max(0, itemOriginalCost - itemDiscount);

            const purchaseRes = await dbQuery(`
                INSERT INTO purchases (user_id, package_id, amount, quantity, status, payment_method)
                VALUES ($1, $2, $3, $4, 'pending', $5)
                RETURNING *
            `, [user.id, item.package_id, itemFinalCost, item.quantity, paymentMethod || 'manual']);
            
            const purchase = purchaseRes.rows[0];
            purchases.push(purchase);

            const durationDays = item.duration_days * item.quantity;

            if (body.subscriptionId) {
                // RENEW EXISTING SUBSCRIPTION
                await dbQuery(`
                    UPDATE subscriptions 
                    SET current_period_end = current_period_end + INTERVAL '${durationDays} days',
                        purchase_id = $1,
                        updated_at = NOW()
                    WHERE subscription_id = $2 AND user_id = $3
                `, [purchase.purchase_id, body.subscriptionId, user.id]);
            } else {
                // NEW PURCHASE
                const tenantRes = await dbQuery(`
                    INSERT INTO tenants (name, status) VALUES ($1, 'active') RETURNING *
                `, [`Pending Website #${purchase.purchase_id}`]);
                const tenant = tenantRes.rows[0];

                await dbQuery(`
                    INSERT INTO subscriptions (user_id, tenant_id, purchase_id, package_id, current_period_end, status)
                    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '${durationDays} days', 'active')
                `, [user.id, tenant.tenant_id, purchase.purchase_id, item.package_id]);
            }

            // Create Payment Record
            await dbQuery(`
                INSERT INTO payments (purchase_id, user_id, amount, method, status)
                VALUES ($1, $2, $3, $4, 'pending')
            `, [purchase.purchase_id, user.id, itemFinalCost, paymentMethod || 'manual']);
        }

        // Notify Managers
        const managersRes = await dbQuery("SELECT user_id FROM users WHERE role IN ('admin', 'manager')");
        for (const manager of managersRes.rows) {
            await dbQuery(`
                INSERT INTO notifications (user_id, title, message, link)
                VALUES ($1, $2, $3, $4)
            `, [manager.user_id, 'New Purchase', `User ${user.email} made a new purchase.`, '/dashboard/manager/purchases']);
        }

        // Log sensitive action
        await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, description)
            VALUES ($1, $2, $3, $4)
        `, [user.id, 'create', 'purchase', `Completed checkout for ${validItems.length} items.`]);

        return NextResponse.json({ 
            success: true, 
            message: 'Purchase created successfully', 
            data: purchases 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
