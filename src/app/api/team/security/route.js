import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

async function verifyTeamToken(token) {
    if (!token) {
        return { success: false, message: "Verification token is required", status: 400 };
    }

    const res = await dbQuery(
        `SELECT id, email, verification_expires_at FROM teams WHERE verification_token = $1 AND verification_expires_at > now()`,
        [token]
    );
    const team = res.rows[0];

    if (!team) {
        return { success: false, message: "Invalid or expired verification token", status: 400 };
    }

    await dbQuery(
        `UPDATE teams SET is_verified = TRUE, verification_token = NULL, verification_expires_at = NULL, updated_at = now() WHERE id = $1`,
        [team.id]
    );

    return {
        success: true,
        message: "Email verified successfully. You can now login.",
        status: 200
    };
}

// POST — Verify with token in body
export async function POST(req) {
    try {
        const body = await req.json().catch(() => ({}));
        const { token } = body;
        const result = await verifyTeamToken(token);
        return NextResponse.json({ success: result.success, message: result.message }, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// GET — Verify with token in query string (?token=...)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        const result = await verifyTeamToken(token);
        return NextResponse.json({ success: result.success, message: result.message }, { status: result.status });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
