import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        // 1. Check if user already exists
        const userExist = await pool.query("SELECT email FROM public.users WHERE email = $1", [email]);
        if (userExist.rowCount > 0) {
            return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into Database
        const query = `
            INSERT INTO public.users (name, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING user_id, name, email;
        `;
        const values = [name, email, hashedPassword];
        const result = await pool.query(query, values);

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            payload: result.rows[0]
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}