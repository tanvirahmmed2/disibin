import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req, { params }) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id } = await params;

        const res = await dbQuery("SELECT * FROM purchases WHERE purchase_id = $1 AND user_id = $2", [id, auth.data.id]);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Purchase not found" }, { status: 404 });

        const purchase = res.rows[0];
        
        return NextResponse.json({ 
            success: true, 
            message: 'Purchase record found', 
            data: { ...purchase, id: purchase.purchase_id, _id: purchase.purchase_id } 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
