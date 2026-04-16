import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import Task from '@/lib/models/task';
import { isManager, isProjectManager, isStaff } from '@/lib/middleware';

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const mode = searchParams.get('mode'); 

        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        const user = auth.payload;

        if (mode === 'conversations') {
            
            const chats = await Task.find({
                type: 'direct',
                participants: user._id
            })
            .populate('participants', 'name email role image')
            .sort({ updatedAt: -1 });
            
            return NextResponse.json({ success: true, payload: chats });
        }

        const isMgmt = ['admin', 'manager', 'project_manager'].includes(user.role);

        
        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;
        
        const tasks = await Task.find(query)
            .populate('createdBy', 'name email role')
            .populate('assignedTo', 'name email role')
            .populate('participants', 'name email role')
            .sort({ updatedAt: -1 });

        return NextResponse.json({ success: true, payload: tasks });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isProjectManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const body = await req.json();
        const { title, description, type, assignedTo, participants, priority, deadline } = body;

        if (!title || !type) {
            return NextResponse.json({ success: false, message: 'Title and type are required' }, { status: 400 });
        }

        const task = await Task.create({
            title,
            description,
            type,
            createdBy: auth.payload._id,
            assignedTo,
            participants: participants || [],
            priority: priority || 'medium',
            deadline,
            status: 'in_progress'
        });

        return NextResponse.json({ success: true, message: 'Task created successfully', payload: task });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isStaff(); 
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status, message, attachments } = await req.json();

        const task = await Task.findById(id);
        if (!task) return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });

        
        if (status) {
            task.status = status;
        }

        
        if (message) {
            task.messages.push({
                senderId: auth.payload._id,
                message,
                attachments: attachments || [],
                type: 'text'
            });
            task.lastMessage = {
                message,
                senderId: auth.payload._id,
                createdAt: new Date()
            };
        }

        await task.save();

        return NextResponse.json({ success: true, message: 'Task updated', payload: task });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
