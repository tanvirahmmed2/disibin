import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

        let query = "SELECT * FROM public.supports";
        let values = [];

        if (search) {
            query += " WHERE name ILIKE $1 OR email ILIKE $1 OR subject ILIKE $1";
            values.push(`%${search}%`);
        }

        query += " ORDER BY created_at DESC";

        const result = await pool.query(query, values);

        return NextResponse.json({
            success: true,
            payload: result.rows || []
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}



export async function POST(req) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ 
                success: false, 
                message: "All fields are required" 
            }, { status: 400 });
        }

        const query = `
            INSERT INTO public.supports (name, email, subject, message, status)
            VALUES ($1, $2, $3, $4, 'unread')
            RETURNING *;
        `;
        const values = [name, email, subject, message];
        const result = await pool.query(query, values);

        return NextResponse.json({
            success: true,
            message: "Message sent successfully",
            payload: result.rows[0]
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ 
                success: false, 
                message: "ID and Status required" 
            }, { status: 400 });
        }

        const query = `
            UPDATE public.supports 
            SET status = $1 
            WHERE support_id = $2 
            RETURNING *;
        `;
        const result = await pool.query(query, [status, id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Message not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: `Status updated to ${status}`,
            payload: result.rows[0]
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ 
                success: false, 
                message: "ID is required" 
            }, { status: 400 });
        }

        const query = "DELETE FROM public.supports WHERE support_id = $1 RETURNING *;";
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "Message not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}