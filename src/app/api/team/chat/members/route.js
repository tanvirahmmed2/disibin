import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";
import { isTeamLogin } from "@/lib/auth/team";

// GET — List active team members (excluding current team user)
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json(auth, { status: 401 });

        const currentTeamId = auth.data.id;

        const res = await dbQuery(
            `SELECT id, name, email, role 
             FROM teams 
             WHERE is_active = true AND id != $1 
             ORDER BY name ASC`,
            [currentTeamId]
        );

        return NextResponse.json({ success: true, data: res.rows });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
