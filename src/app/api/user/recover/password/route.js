import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/database/pg';

export async function PATCH(req) {
    try {
        const { email, otp, new_password } = await req.json();

        const userResult = await pool.query(
            `SELECT user_id FROM users 
             WHERE email = $1 AND reset_password_token = $2 
             AND reset_password_expires > NOW()`,
            [email, otp]
        );

        if (userResult.rowCount === 0) {
            return NextResponse.json({success:true, message: "Invalid or expired OTP" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        await pool.query(
            `UPDATE users 
             SET password = $1, reset_password_token = NULL, reset_password_expires = NULL 
             WHERE email = $2`,
            [hashedPassword, email]
        );

        return NextResponse.json({success:true, message: "Password updated successfully. Please login." });

    } catch (error) {
        console.error(error);
        return NextResponse.json({success:false,  message: error.message }, { status: 500 });
    }
}