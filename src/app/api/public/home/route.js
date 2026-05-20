import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/database/pg";

export async function GET() {
    try {
        // Fetch actual counts from the database to make it dynamic
        const usersRes = await dbQuery("SELECT COUNT(*) as count FROM users", []);
        const projectsRes = await dbQuery("SELECT COUNT(*) as count FROM projects", []);

        const usersCount = parseInt(usersRes.rows[0].count) || 0;
        const projectsCount = parseInt(projectsRes.rows[0].count) || 0;

        // Base line values based on original UI
        const businesses = 120 + usersCount;
        const projects = 50 + projectsCount;
        const years = 6; // Founded ~6 years ago

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    businesses,
                    projects,
                    years
                }
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
