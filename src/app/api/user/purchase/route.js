import { NextResponse } from "next/server";
import { dbQuery, transaction } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const body = await req.json();
        const { packageId, amount, tenantName, subdomain } = body;

        if (!packageId || !amount || !tenantName) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const userId = auth.data.id;

        const result = await transaction(async (client) => {
            // 1. Create Tenant
            const tenantRes = await client.query(`
                INSERT INTO tenants (name, subdomain, status)
                VALUES ($1, $2, 'active')
                RETURNING *
            `, [tenantName, subdomain || tenantName.toLowerCase().replace(/ /g, '-')]);
            const tenant = tenantRes.rows[0];

            // 2. Create Tenant User (Owner)
            await client.query(`
                INSERT INTO tenant_users (tenant_id, user_id, role)
                VALUES ($1, $2, 'owner')
            `, [tenant.tenant_id, userId]);

            // 3. Create Purchase
            const purchaseRes = await client.query(`
                INSERT INTO purchases (user_id, package_id, amount, status)
                VALUES ($1, $2, $3, 'completed')
                RETURNING *
            `, [userId, packageId, amount]);
            const purchase = purchaseRes.rows[0];

            // 4. Create Subscription
            const subRes = await client.query(`
                INSERT INTO subscriptions (user_id, package_id, status, current_period_start)
                VALUES ($1, $2, 'active', NOW())
                RETURNING *
            `, [userId, packageId]);
            const subscription = subRes.rows[0];

            // 5. Create Default Website
            const websiteRes = await client.query(`
                INSERT INTO websites (tenant_id, name, url, status)
                VALUES ($1, $2, $3, 'active')
                RETURNING *
            `, [tenant.tenant_id, `${tenantName} Website`, `${subdomain || tenant.subdomain}.disibin.com`]);
            const website = websiteRes.rows[0];

            return {
                tenant,
                purchase,
                subscription,
                website
            };
        });

        // Log sensitive action
        await dbQuery(`
            INSERT INTO logs (user_id, action, target_type, target_id, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [userId, 'create', 'tenant', result.tenant.tenant_id, `Purchased package and created tenant: ${tenantName}`]);

        return NextResponse.json({
            success: true,
            message: "Purchase and tenant creation successful!",
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error('Purchase Flow Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
