import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Log } from '@/lib/models/log';
import { isManager, isProjectManager, isAdmin } from '@/lib/middleware';

export async function GET(req) {
    try {
        await connectDB();
        
        // Authorization check (only Admin, Manager, or PM can view logs)
        const managerAuth = await isManager();
        const pmAuth = await isProjectManager();
        const adminAuth = await isAdmin();
        
        if (!managerAuth.success && !pmAuth.success && !adminAuth.success) {
            return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const targetType = searchParams.get('targetType');
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const skip = (page - 1) * limit;

        const query = {};
        if (action) query.action = action;
        if (targetType) query.targetType = targetType;
        if (userId) query.userId = userId;

        const logs = await Log.find(query)
            .populate('userId', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Log.countDocuments(query);

        return NextResponse.json({
            success: true,
            message: 'Logs fetched successfully',
            data: logs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
