import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const query = `
            SELECT 
                user_id, name, email, phone, role, 
                address_line1, city, country, is_active, 
                email_verified, created_at 
            FROM public.users 
            WHERE role = 'admin' 
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query);

        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false,
                message: "No admin data found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched admin data',
            payload: result.rows
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch user data', 
            error: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, email, password, phone, role, city, country } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ 
                success: false, 
                message: 'Name, email, and password are required' 
            }, { status: 400 });
        }

        const checkEmail = await pool.query("SELECT email FROM public.users WHERE email = $1", [email]);
        if (checkEmail.rowCount > 0) {
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const insertQuery = `
            INSERT INTO public.users 
            (name, email, password, phone, role, city, country)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING user_id, name, email, role, created_at;
        `;
        
        const values = [
            name, 
            email, 
            hashedPass, 
            phone || null, 
            role || 'user', 
            city || null, 
            country || null
        ];

        const result = await pool.query(insertQuery, values);

        return NextResponse.json({
            success: true,
            message: 'Successfully created user',
            payload: result.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to create user', 
            error: error.message 
        }, { status: 500 });
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