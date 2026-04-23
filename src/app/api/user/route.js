import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isLogin, isManager, isSupport } from "@/lib/middleware";
import bcrypt from "bcryptjs";

export async function GET(req) {
    try {
        const auth = await isSupport();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');
        const isActive = searchParams.get('isActive');

        let sql = "SELECT user_id, name, email, phone, role, is_active FROM users WHERE 1=1";
        const params = [];


        if (role) {
            params.push(role);
            sql += ` AND role = $${params.length}`;
        }

        if (isActive !== null && isActive !== undefined) {
            params.push(isActive === 'true');
            sql += ` AND is_active = $${params.length}`;
        }

        sql += " ORDER BY created_at DESC";

        const res = await dbQuery(sql, params);

        return NextResponse.json({
            success: true,
            message: 'User data found successfully',
            data: res.rows
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const body = await req.json();
        const { 
            id, name, phone, city, country, 
            addressLine1, address_line1,
            addressLine2, address_line2,
            state, 
            postalCode, postal_code,
            role, isActive, is_active,
            password
        } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const isManagement = auth.data.role === 'admin' || auth.data.role === 'manager';
        
        // Ensure user can only update their own profile unless they are management
        if (!isManagement && String(auth.data.id) !== String(id)) {
            return NextResponse.json({ success: false, message: 'Unauthorized profile update' }, { status: 403 });
        }

        const targetRes = await dbQuery("SELECT * FROM users WHERE user_id = $1", [id]);

        if (targetRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const updateFields = [];
        const updateParams = [id];

        const addField = (field, value) => {
            if (value !== undefined && value !== null) {
                updateParams.push(value);
                updateFields.push(`${field} = $${updateParams.length}`);
            }
        };

        addField('name', name);
        addField('phone', phone);
        addField('city', city);
        addField('country', country);
        addField('address_line1', addressLine1 || address_line1);
        addField('address_line2', addressLine2 || address_line2);
        addField('state', state);
        addField('postal_code', postalCode || postal_code);

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            addField('password', hashedPassword);
        }

        if (isManagement) {
            if (role && (auth.data.role === 'admin' || (auth.data.role === 'manager' && role !== 'admin'))) {
                addField('role', role);
            }
            if (isActive !== undefined || is_active !== undefined) {
                addField('is_active', isActive !== undefined ? isActive : is_active);
            }
        }

        if (updateFields.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        const sql = `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE user_id = $1 RETURNING *`;
        const updatedRes = await dbQuery(sql, updateParams);
        const updatedUser = updatedRes.rows[0];

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update user', 
            error: error.message 
        }, { status: 500 });
    }
}
