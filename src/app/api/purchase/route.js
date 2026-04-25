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
        const { items, paymentMethod, couponCode, subscriptionId } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ success: false, message: "No items provided" }, { status: 400 });
        }

        // ── 1. Validate items against DB (never trust client prices) ──────────
        let calculatedTotal = 0;
        const validItems = [];

        for (const item of items) {
            const pkgRes = await dbQuery(
                "SELECT * FROM packages WHERE package_id = $1 AND is_active = true",
                [item.packageId]
            );
            if (pkgRes.rows.length === 0) continue;

            const pkg = pkgRes.rows[0];
            const qty = (item.quantity && item.quantity > 0) ? item.quantity : 1;

            calculatedTotal += Number(pkg.price) * qty;
            validItems.push({ ...pkg, quantity: qty });
        }

        if (validItems.length === 0) {
            return NextResponse.json({ success: false, message: "No valid active packages found" }, { status: 400 });
        }

        // ── 2. Validate coupon from DB ────────────────────────────────────────
        let discount = 0;
        let appliedCoupon = null;
        if (couponCode) {
            const couponRes = await dbQuery(
                "SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) AND status = 'active'",
                [couponCode]
            );
            if (couponRes.rows.length > 0) {
                const coupon = couponRes.rows[0];
                const now = new Date();
                const afterStart = !coupon.start_date || new Date(coupon.start_date) <= now;
                const beforeEnd  = !coupon.end_date   || new Date(coupon.end_date)   >= now;
                
                if (afterStart && beforeEnd) {
                    appliedCoupon = coupon;
                    
                    if (coupon.package_id) {
                        // Package-specific discount: apply only to matching packages
                        const matchingItems = validItems.filter(i => i.package_id === coupon.package_id);
                        const packageSubtotal = matchingItems.reduce((acc, i) => acc + (Number(i.price) * i.quantity), 0);
                        
                        discount = coupon.is_percentage
                            ? packageSubtotal * (Number(coupon.discount) / 100)
                            : Number(coupon.discount);
                        discount = Math.min(discount, packageSubtotal);
                    } else {
                        // Generic discount: apply to whole cart
                        discount = coupon.is_percentage
                            ? calculatedTotal * (Number(coupon.discount) / 100)
                            : Number(coupon.discount);
                        discount = Math.min(discount, calculatedTotal);
                    }
                }
            }
        }

        const finalAmount = Math.max(0, calculatedTotal - discount);

        // ── 3. For renewals: look up existing subscription + its tenant ───────
        let renewalTenantId = null;
        if (subscriptionId) {
            const subRes = await dbQuery(
                "SELECT tenant_id FROM subscriptions WHERE subscription_id = $1 AND user_id = $2",
                [subscriptionId, user.id]
            );
            if (subRes.rows.length === 0) {
                return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 });
            }
            renewalTenantId = subRes.rows[0].tenant_id;
        }

        // ── 4. Process each item ──────────────────────────────────────────────
        const purchases = [];

        for (const item of validItems) {
            const itemOriginalCost = Number(item.price) * item.quantity;
            
            let itemDiscount = 0;
            if (appliedCoupon) {
                if (!appliedCoupon.package_id) {
                    // Generic coupon: distribute proportionally
                    itemDiscount = calculatedTotal > 0 ? (itemOriginalCost / calculatedTotal) * discount : 0;
                } else if (appliedCoupon.package_id === item.package_id) {
                    // Package-specific: apply to this item
                    itemDiscount = appliedCoupon.is_percentage 
                        ? itemOriginalCost * (Number(appliedCoupon.discount) / 100)
                        : Number(appliedCoupon.discount);
                    // Handle case where fixed discount might be > item cost (though calculatedTotal handles it)
                    itemDiscount = Math.min(itemDiscount, itemOriginalCost);
                }
            }
            
            const itemFinalCost = Math.max(0, itemOriginalCost - itemDiscount);
            const durationDays     = item.duration_days * item.quantity;

            let tenantId = renewalTenantId;

            if (!subscriptionId) {
                // NEW PURCHASE: create a tenant first
                const tenantName = `${(user.email || '').split('@')[0]}-${item.slug || item.package_id}-${Date.now()}`;
                const tenantRes  = await dbQuery(
                    "INSERT INTO tenants (name, status) VALUES ($1, 'active') RETURNING *",
                    [tenantName]
                );
                tenantId = tenantRes.rows[0].tenant_id;
            }

            // Create purchase record — linked to tenant via tenant_id
            const purchaseRes = await dbQuery(`
                INSERT INTO purchases (user_id, package_id, original_amount, discount_amount, final_amount, status, tenant_id, coupon_id)
                VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7)
                RETURNING *
            `, [
                user.id, 
                item.package_id, 
                itemOriginalCost, 
                itemDiscount, 
                itemFinalCost, 
                tenantId, 
                (appliedCoupon && (appliedCoupon.package_id === item.package_id || !appliedCoupon.package_id)) ? appliedCoupon.coupon_id : null
            ]);

            const purchase = purchaseRes.rows[0];
            purchases.push(purchase);

            if (!subscriptionId) {
                // NEW PURCHASE: create a tenant first (if not already created for this item)
                // Actually, the previous code created tenant before purchase. Let's keep that logic but fix the order for linking.
                
                // Link subscription to this purchase
                await dbQuery(`
                    INSERT INTO subscriptions (user_id, tenant_id, package_id, purchase_id, current_period_end, status)
                    VALUES ($1, $2, $3, $4, NOW() + ($5 || ' days')::INTERVAL, 'active')
                `, [user.id, tenantId, item.package_id, purchase.purchase_id, String(durationDays)]);
            } else {
                // RENEWAL: extend the existing subscription period and link latest purchase
                await dbQuery(`
                    UPDATE subscriptions
                    SET current_period_end = current_period_end + ($1 || ' days')::INTERVAL,
                        purchase_id = $2,
                        updated_at = NOW()
                    WHERE subscription_id = $3 AND user_id = $4
                `, [String(durationDays), purchase.purchase_id, subscriptionId, user.id]);
            }

            // Create payment record — also linked to tenant
            await dbQuery(`
                INSERT INTO payments (purchase_id, user_id, amount, method, status, tenant_id)
                VALUES ($1, $2, $3, $4, 'pending', $5)
            `, [purchase.purchase_id, user.id, itemFinalCost, paymentMethod || 'manual', tenantId]);
        }

        // ── 5. Clear wishlist ─────────────────────────────────────────────────
        await dbQuery("DELETE FROM wishlists WHERE user_id = $1", [user.id]);

        // ── 6. Notify managers ────────────────────────────────────────────────
        const managersRes = await dbQuery(
            "SELECT user_id FROM users WHERE role IN ('admin', 'manager')"
        );
        for (const mgr of managersRes.rows) {
            await dbQuery(`
                INSERT INTO notifications (user_id, title, message, link)
                VALUES ($1, $2, $3, $4)
            `, [
                mgr.user_id,
                subscriptionId ? 'Subscription Renewed' : 'New Purchase Order',
                `${user.name || user.email} ${subscriptionId ? 'renewed a subscription' : `placed an order for ${validItems.length} item(s)`}. Total: BDT ${finalAmount.toFixed(2)}${appliedCoupon ? ` (Coupon: ${appliedCoupon.code})` : ''}.`,
                '/dashboard/manager/purchases'
            ]);
        }

        // ── 7. Activity log ───────────────────────────────────────────────────
        await dbQuery(`
            INSERT INTO logs (user_id, action, entity_type, description)
            VALUES ($1, 'create', 'purchase', $2)
        `, [user.id, `${subscriptionId ? 'Renewal' : 'Checkout'}: ${validItems.length} item(s), BDT ${finalAmount.toFixed(2)}`]);

        return NextResponse.json({
            success: true,
            message: subscriptionId ? 'Subscription renewed successfully!' : 'Order placed successfully!',
            data: { purchases, total: finalAmount }
        });

    } catch (error) {
        console.error('Purchase error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status } = await req.json();
        if (!id || !status) return NextResponse.json({ success: false, message: "ID and status required" }, { status: 400 });

        const user = auth.data;
        if (user.role !== 'admin' && user.role !== 'manager') {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        const res = await dbQuery(
            "UPDATE purchases SET status = $1, updated_at = NOW() WHERE purchase_id = $2 RETURNING *",
            [status, id]
        );

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Purchase updated', data: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
