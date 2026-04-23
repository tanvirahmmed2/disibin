import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        const tenantId = user.tenantId;
        const stats = {};

        if (user.role === 'admin') {
            // Global Admin View
            const [usersRes, pkgRes, blogRes, projRes, taskRes, ticketRes, tenantRes] = await Promise.all([
                dbQuery("SELECT COUNT(*) FROM users", []),
                dbQuery("SELECT COUNT(*) FROM packages WHERE is_active = true", []),
                dbQuery("SELECT COUNT(*) FROM blogs", []),
                dbQuery("SELECT COUNT(*) FROM projects", []),
                dbQuery("SELECT COUNT(*) FROM tasks WHERE status = 'in_progress'", []),
                dbQuery("SELECT COUNT(*) FROM tickets WHERE status = 'open'", []),
                dbQuery("SELECT COUNT(*) FROM tenants", [])
            ]);

            stats.overview = [
                { title: 'Total Users', value: parseInt(usersRes.rows[0].count), type: 'users' },
                { title: 'Active Packages', value: parseInt(pkgRes.rows[0].count), type: 'packages' },
                { title: 'Total Tenants', value: parseInt(tenantRes.rows[0].count), type: 'tenants' },
                { title: 'Pending Tasks', value: parseInt(taskRes.rows[0].count), type: 'tasks' },
                { title: 'Open Tickets', value: parseInt(ticketRes.rows[0].count), type: 'tickets' }
            ];
        } else if (['manager', 'support', 'developer'].includes(user.role)) {
            // Staff/Management View
            const [taskRes, ticketRes, projectRes, assignedTicketsRes] = await Promise.all([
                dbQuery("SELECT COUNT(*) FROM tasks WHERE status = 'in_progress'", []),
                dbQuery("SELECT COUNT(*) FROM tickets WHERE status = 'open'", []),
                dbQuery("SELECT COUNT(*) FROM projects", []),
                dbQuery("SELECT ticket_id, subject, status, priority, created_at FROM tickets WHERE assigned_to = $1 AND status != 'closed' ORDER BY priority = 'urgent' DESC, created_at DESC LIMIT 5", [user.id])
            ]);
            stats.overview = [
                { title: 'Pending Tasks', value: parseInt(taskRes.rows[0].count), type: 'tasks' },
                { title: 'Open Tickets', value: parseInt(ticketRes.rows[0].count), type: 'tickets' },
                { title: 'Live Projects', value: parseInt(projectRes.rows[0].count), type: 'projects' }
            ];
            stats.assignedTickets = assignedTicketsRes.rows;
        } else {
            // Standard User View
            const [ticketCountRes, subCountRes, recentTicketsRes, recentSubsRes] = await Promise.all([
                dbQuery("SELECT COUNT(*) FROM tickets WHERE user_id = $1", [user.id]),
                dbQuery("SELECT COUNT(*) FROM subscriptions WHERE user_id = $1 AND status = 'active'", [user.id]),
                dbQuery("SELECT ticket_id, subject, status, created_at FROM tickets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3", [user.id]),
                dbQuery(`
                    SELECT s.*, p.name as package_name 
                    FROM subscriptions s 
                    JOIN packages p ON s.package_id = p.package_id 
                    WHERE s.user_id = $1 AND s.status = 'active' 
                    ORDER BY s.created_at DESC LIMIT 3
                `, [user.id])
            ]);
            stats.overview = [
                { title: 'My Tickets', value: parseInt(ticketCountRes.rows[0].count), type: 'tickets' },
                { title: 'Active Subs', value: parseInt(subCountRes.rows[0].count), type: 'subs' }
            ];
            stats.recent = {
                tickets: recentTicketsRes.rows,
                subscriptions: recentSubsRes.rows
            };
        }

        return NextResponse.json({ success: true, data: stats });

    } catch (error) {
        console.error("GET /api/dashboard/stats error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
