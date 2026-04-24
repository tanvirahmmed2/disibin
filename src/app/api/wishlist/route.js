import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const res = await dbQuery(`
            SELECT w.*, p.name as title, p.price, p.image, p.slug 
            FROM wishlists w 
            JOIN packages p ON w.package_id = p.package_id 
            WHERE w.user_id = $1 
            ORDER BY w.created_at DESC
        `, [user.id]);

        return NextResponse.json({ success: true, message: 'Wishlist fetched', data: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { packageId, quantity } = await req.json();
        if (!packageId) return NextResponse.json({ success: false, message: "Package ID required" }, { status: 400 });
        
        const qty = quantity && quantity > 0 ? quantity : 1;

        const existing = await dbQuery("SELECT wishlist_id, quantity FROM wishlists WHERE user_id = $1 AND package_id = $2", [user.id, packageId]);
        
        if (existing.rows.length > 0) {
            const res = await dbQuery("UPDATE wishlists SET quantity = quantity + $1 WHERE wishlist_id = $2 RETURNING *", [qty, existing.rows[0].wishlist_id]);
            return NextResponse.json({ success: true, message: 'Wishlist quantity updated', data: res.rows[0] });
        } else {
            const res = await dbQuery("INSERT INTO wishlists (user_id, package_id, quantity) VALUES ($1, $2, $3) RETURNING *", [user.id, packageId, qty]);
            return NextResponse.json({ success: true, message: 'Item added to wishlist', data: res.rows[0] });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.data;

        const { id, packageId, clearAll } = await req.json();

        if (clearAll) {
            await dbQuery("DELETE FROM wishlists WHERE user_id = $1", [user.id]);
            return NextResponse.json({ success: true, message: "Wishlist cleared successfully" });
        }

        let sql;
        let params;
        if (id) {
            sql = "DELETE FROM wishlists WHERE wishlist_id = $1 AND user_id = $2 RETURNING *";
            params = [id, user.id];
        } else if (packageId) {
            sql = "DELETE FROM wishlists WHERE package_id = $1 AND user_id = $2 RETURNING *";
            params = [packageId, user.id];
        } else {
            return NextResponse.json({ success: false, message: "ID or Package ID required" }, { status: 400 });
        }

        const res = await dbQuery(sql, params);
        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Item removed from wishlist" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}