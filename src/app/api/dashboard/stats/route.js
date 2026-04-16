import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import User from '@/lib/models/user';
import Blog from '@/lib/models/blog';
import { Package } from '@/lib/models/package';
import Project from '@/lib/models/project';
import Task from '@/lib/models/task';
import { Ticket } from '@/lib/models/ticket';
import { isLogin, isManager, isAdmin } from '@/lib/middleware';

export async function GET(req) {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.payload;
        const stats = {};

        if (user.role === 'admin' || user.role === 'manager') {
            // High-level Business Overview
            const [totalUsers, activePackages, totalBlogs, totalProjects, pendingTasks, openTickets] = await Promise.all([
                User.countDocuments(),
                Package.countDocuments({ isActive: true }),
                Blog.countDocuments(),
                Project.countDocuments(),
                Task.countDocuments({ status: 'in_progress' }),
                Ticket.countDocuments({ status: 'open' })
            ]);

            stats.overview = [
                { title: 'Total Users', value: totalUsers, type: 'users' },
                { title: 'Active Packages', value: activePackages, type: 'packages' },
                { title: 'Total Blogs', value: totalBlogs, type: 'blogs' },
                { title: 'Total Projects', value: totalProjects, type: 'projects' },
                { title: 'Pending Tasks', value: pendingTasks, type: 'tasks' },
                { title: 'Open Tickets', value: openTickets, type: 'tickets' }
            ];
        } else if (user.role === 'editor') {
            const [totalBlogs, activePackages, totalProjects] = await Promise.all([
                Blog.countDocuments(),
                Package.countDocuments({ isActive: true }),
                Project.countDocuments()
            ]);
            stats.overview = [
                { title: 'Published Blogs', value: totalBlogs, type: 'blogs' },
                { title: 'Active Packages', value: activePackages, type: 'packages' },
                { title: 'Live Projects', value: totalProjects, type: 'projects' }
            ];
        } else if (user.role === 'staff' || user.role === 'project_manager' || user.role === 'support') {
            const query = user.role === 'staff' ? { assignedTo: user._id } : {};
            const [myTasks, myTickets] = await Promise.all([
                Task.countDocuments({ ...query, status: 'in_progress' }),
                Ticket.countDocuments({ ...query, status: 'open' })
            ]);
            stats.overview = [
                { title: 'Assigned Tasks', value: myTasks, type: 'tasks' },
                { title: 'Open Tickets', value: myTickets, type: 'tickets' }
            ];
        } else {
            // Client View
            const [myTickets, myPackages] = await Promise.all([
                Ticket.countDocuments({ senderId: user._id }),
                // Assuming purchases link to packages, this would need specific logic
                // For now, simplified count
                0 
            ]);
            stats.overview = [
                { title: 'My Tickets', value: myTickets, type: 'tickets' },
                { title: 'Purchased Packages', value: myPackages, type: 'packages' }
            ];
        }

        return NextResponse.json({ success: true, payload: stats });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
