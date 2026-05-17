import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware";
import { dbQuery } from "@/lib/database/pg";

export async function GET(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        // Fetch some basic stats
        const usersCount = await dbQuery("SELECT COUNT(*) FROM users");
        const salesSum = await dbQuery("SELECT SUM(amount) FROM payments WHERE status = 'success'");
        const pendingPurchases = await dbQuery("SELECT COUNT(*) FROM purchases WHERE status = 'pending'");
        const openTickets = await dbQuery("SELECT COUNT(*) FROM tickets WHERE status = 'open'");

        return NextResponse.json({
            success: true,
            data: {
                totalUsers: parseInt(usersCount.rows[0].count) || 0,
                totalSales: parseFloat(salesSum.rows[0].sum) || 0,
                pendingPurchases: parseInt(pendingPurchases.rows[0].count) || 0,
                openTickets: parseInt(openTickets.rows[0].count) || 0,
                // Mock data for charts
                monthlySales: [
                    { month: 'Jan', amount: 4000 },
                    { month: 'Feb', amount: 3000 },
                    { month: 'Mar', amount: 2000 },
                    { month: 'Apr', amount: 2780 },
                    { month: 'May', amount: 1890 },
                    { month: 'Jun', amount: 2390 },
                    { month: 'Jul', amount: 3490 },
                ]
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
