import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbQuery } from "@/lib/database/pg";
import { JWT_SECRET, NODE_ENV } from "@/lib/database/secret";
import { isTeamLogin } from "@/lib/auth/team";

export async function POST(req) {
    try {
        // Redirect if already logged in
        const auth = await isTeamLogin();
        if (auth.success) {
            return NextResponse.json({ success: false, message: "Already logged in" }, { status: 403 });
        }

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        // Query the TEAMS table (not users)
        const res = await dbQuery("SELECT * FROM teams WHERE email = $1", [email]);
        const team = res.rows[0];

        if (!team) {
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        if (!team.is_active) {
            return NextResponse.json(
                { success: false, message: "Account is deactivated. Please contact your manager." },
                { status: 403 }
            );
        }

        const isMatch = await bcrypt.compare(password, team.password);
        if (!isMatch) {
            // Log failed attempt
            await dbQuery(
                `INSERT INTO team_login_logs (team_id, action, description, status) VALUES ($1, $2, $3, $4)`,
                [team.id, 'login', 'Failed login attempt', 'fail']
            ).catch(() => {}); // non-blocking
            return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
        }

        if (!team.is_verified) {
            return NextResponse.json(
                { success: false, message: "Please verify your email address before logging in." },
                { status: 403 }
            );
        }

        // Update last login & log success
        await dbQuery("UPDATE teams SET last_login = now() WHERE id = $1", [team.id]);
        await dbQuery(
            `INSERT INTO team_login_logs (team_id, action, description, status) VALUES ($1, $2, $3, $4)`,
            [team.id, 'login', 'Successful login', 'success']
        ).catch(() => {}); // non-blocking

        // Sign JWT — uses team-specific fields
        const token = jwt.sign(
            { id: team.id, email: team.email, name: team.name, role: team.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json({ success: true, message: "Login successful" });

        response.cookies.set("disibin-team", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
        });

        return response;

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
