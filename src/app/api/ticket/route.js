import { NextResponse } from 'next/server';
import connectDB from '@/lib/database/db';
import { Ticket } from '@/lib/models/ticket';
import { isLogin, isSupport, isProjectManager } from '@/lib/middleware';
import { createLog } from '@/lib/utils/logger';

export async function GET(req) {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const user = auth.data;
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');

        let query = {};

        
        if (user.role === 'client') {
            query.senderId = user._id;
        } else if (user.role === 'support' || user.role === 'admin' || user.role === 'manager') {
            
        } else if (user.role === 'project_manager') {
            query.category = 'project'; 
        }

        if (category) query.category = category;
        if (status) query.status = status;

        const tickets = await Ticket.find(query)
            .populate('senderId', 'name email image')
            .populate('assignedId', 'name email role')
            .populate('projectId', 'title slug')
            .sort({ lastMessageAt: -1 });

        return NextResponse.json({ success: true, message: 'Tickets fetched', data: tickets });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { subject, message, category, projectId, priority } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ success: false, message: 'Subject and message are required' }, { status: 400 });
        }

        const ticket = await Ticket.create({
            senderId: auth.data._id,
            subject,
            message,
            category: category || 'general',
            projectId,
            priority: priority || 'medium',
            status: 'open',
            messages: [{
                senderId: auth.data._id,
                message,
                type: 'text'
            }]
        });

        
        await createLog({
            userId: auth.data._id,
            action: 'create',
            targetType: 'ticket',
            targetId: ticket._id,
            description: `Opened a new ticket: ${ticket.subject}`,
            metadata: { category: ticket.category, priority: ticket.priority }
        });

        return NextResponse.json({ success: true, message: 'Ticket created', data: ticket });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { id, status, assignedId, priority, message, attachment } = await req.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });

        
        if (['admin', 'manager', 'support', 'project_manager'].includes(auth.data.role)) {
            if (status) ticket.status = status;
            if (assignedId) ticket.assignedId = assignedId;
            if (priority) ticket.priority = priority;
        } else {
            
            if (status && (status === 'closed' || status === 'resolved')) {
                ticket.status = status;
            }
        }

        
        if (message) {
            ticket.messages.push({
                senderId: auth.data._id,
                message,
                attachments: attachment ? [attachment] : [],
                type: 'text'
            });
            ticket.lastMessageAt = new Date();
        }

        await ticket.save();

        
        await createLog({
            userId: auth.data._id,
            action: 'update',
            targetType: 'ticket',
            targetId: ticket._id,
            description: status ? `Updated ticket status to ${status}: ${ticket.subject}` : `Replied to ticket: ${ticket.subject}`
        });

        return NextResponse.json({ success: true, message: 'Ticket updated', data: ticket });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
