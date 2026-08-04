import { isTeamLogin } from "@/lib/auth/team";
import { dbQuery } from "@/lib/database/pg";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// GET — Get authenticated team member's full profile
export async function GET() {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        
        const res = await dbQuery(
            `SELECT id, name, email, phone, role, is_active, is_verified, is_2fa_active,
                    city, country, address_line1, address_line2, state, postal_code, 
                    pending_email, last_login, created_at, updated_at 
             FROM teams WHERE id = $1`,
            [auth.data.id]
        );
        const team = res.rows[0];

        if (!team) {
            return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: team });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — Update own team profile fields
export async function PATCH(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

        const teamId = auth.data.id;
        const body = await req.json();

        // Strip out protected fields
        const { password, role, email, id, is_active, is_verified, pending_email, email_change_code, email_change_expires_at, ...updateData } = body;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        const keys = Object.keys(updateData);
        for (const key of keys) {
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                return NextResponse.json({ success: false, message: "Invalid field name" }, { status: 400 });
            }
        }

        const values = Object.values(updateData);
        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

        const res = await dbQuery(
            `UPDATE teams SET ${setClause}, updated_at = now() WHERE id = $${keys.length + 1} RETURNING id, name, email, phone, role, city, country, address_line1, address_line2, state, postal_code`,
            [...values, teamId]
        );
        const updatedTeam = res.rows[0];

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedTeam
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — Delete own team account (requires password & guards last active manager)
export async function DELETE(req) {
    try {
        const auth = await isTeamLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

        const teamId = auth.data.id;
        const body = await req.json().catch(() => ({}));
        const { password } = body;

        if (!password) {
            return NextResponse.json({ success: false, message: "Password is required to confirm account deletion" }, { status: 400 });
        }

        const teamRes = await dbQuery("SELECT password, role, is_active FROM teams WHERE id = $1", [teamId]);
        if (teamRes.rows.length === 0) {
            return NextResponse.json({ success: false, message: "Team member not found" }, { status: 404 });
        }

        const current = teamRes.rows[0];

        const isMatch = await bcrypt.compare(password, current.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 400 });
        }

        // Guard: cannot delete the last active manager
        if (current.role === 'manager' && current.is_active) {
            const activeManagersRes = await dbQuery(
                "SELECT COUNT(*) AS cnt FROM teams WHERE role = 'manager' AND is_active = TRUE"
            );
            const activeManagerCount = parseInt(activeManagersRes.rows[0].cnt, 10);
            if (activeManagerCount <= 1) {
                return NextResponse.json(
                    { success: false, message: "Cannot remove the last active manager. Promote another manager first." },
                    { status: 400 }
                );
            }
        }

        // Delete team account
        await dbQuery("DELETE FROM teams WHERE id = $1", [teamId]);

        // Clear team cookie
        const cookieStore = await cookies();
        cookieStore.delete('disibin-team');

        return NextResponse.json({ success: true, message: "Team account deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
