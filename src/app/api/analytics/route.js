import { NextResponse } from "next/server";
import { isManager } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        // Fetch some basic stats
        const usersCount = await dbQuery("SELECT COUNT(*) FROM users");
        const activeProjects = await dbQuery("SELECT COUNT(*) FROM internal_projects WHERE status = 'active'");
        const pendingTasks = await dbQuery("SELECT COUNT(*) FROM internal_tasks WHERE status != 'completed'");
        const openTickets = await dbQuery("SELECT COUNT(*) FROM tickets WHERE status = 'open'");

        return NextResponse.json({
            success: true,
            data: {
                totalUsers: parseInt(usersCount.rows[0].count) || 0,
                activeProjects: parseInt(activeProjects.rows[0].count) || 0,
                pendingTasks: parseInt(pendingTasks.rows[0].count) || 0,
                openTickets: parseInt(openTickets.rows[0].count) || 0
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
