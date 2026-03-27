import { pool } from "@/lib/database/pg";
import { isLogin } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const query = `
            SELECT user_id, name, email, phone, role, address_line1, city, country, is_active, created_at 
            FROM public.users 
            WHERE user_id = $1
        `;
        const result = await pool.query(query, [auth.payload.user_id]);

        return NextResponse.json({
            success: true,
            payload: result.rows[0]
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "User id required" }, { status: 400 });
        }

        const userResult = await pool.query("SELECT role FROM public.users WHERE user_id = $1", [id]);
        if (userResult.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const user = userResult.rows[0];

        if (user.role === 'admin') {
            const adminCountResult = await pool.query("SELECT COUNT(*) FROM public.users WHERE role = 'admin'");
            if (parseInt(adminCountResult.rows[0].count) <= 1) {
                return NextResponse.json({
                    success: false,
                    message: "Safety Block: Cannot delete the only remaining admin account."
                }, { status: 400 });
            }
        }

        await pool.query("DELETE FROM public.users WHERE user_id = $1", [id]);

        return NextResponse.json({
            success: true,
            message: 'User account has been permanently deleted'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to delete user', 
            error: error.message 
        }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { 
            id, name, phone, city, country, 
            address_line1, address_line2, state, 
            postal_code, 
            role, is_active 
        } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const userCheck = await pool.query("SELECT role FROM public.users WHERE user_id = $1", [id]);
        if (userCheck.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const existingUser = userCheck.rows[0];

        /**
         * ROLE PROTECTION LOGIC
         * In a full app, you'd check 'req.user.role' from your auth middleware.
         * For now, we prevent accidental role/status changes unless explicitly intended.
         */
        
        // 2. Safety Block: Last Admin protection
        if (existingUser.role === 'admin' && role && role !== 'admin') {
            const adminCount = await pool.query("SELECT COUNT(*) FROM public.users WHERE role = 'admin'");
            if (parseInt(adminCount.rows[0].count) <= 1) {
                return NextResponse.json({
                    success: false,
                    message: "Safety Block: Cannot demote the only remaining admin."
                }, { status: 400 });
            }
        }

        // 3. Construct Update Query
        // Note: If you want to strictly prevent users from touching 'role', 
        // you would remove role from this query unless the requester is an Admin.
        const query = `
            UPDATE public.users 
            SET 
                name = COALESCE($1, name), 
                phone = COALESCE($2, phone), 
                city = COALESCE($3, city), 
                country = COALESCE($4, country),
                address_line1 = COALESCE($5, address_line1),
                address_line2 = COALESCE($6, address_line2),
                state = COALESCE($7, state),
                postal_code = COALESCE($8, postal_code),
                role = COALESCE($9, role),
                is_active = COALESCE($10, is_active),
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $11
            RETURNING user_id, name, email, role, is_active;
        `;

        const values = [
            name, phone, city, country, 
            address_line1, address_line2, state, 
            postal_code, 
            role,      // This should ideally be controlled by an Admin-only check
            is_active, 
            id
        ];

        const result = await pool.query(query, values);

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            payload: result.rows[0]
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update user', 
            error: error.message 
        }, { status: 500 });
    }
}