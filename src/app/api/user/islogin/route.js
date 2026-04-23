import { NextResponse } from "next/server";
import { isLogin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

export async function GET() {
    try {
        const auth = await isLogin();
        
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const userRes = await dbQuery("SELECT * FROM users WHERE user_id = $1", [auth.data.id]);
        if (userRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        const user = userRes.rows[0];
        const { password, ...userData } = user;
        
        // Ensure tenant_id is included
        userData.tenant_id = auth.data.tenantId;

        return NextResponse.json({
            success: true,
            message: 'User is authenticated',
            data: userData
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
