import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin, isSupport, isManager } from '@/lib/middleware';
import { createLog } from '@/lib/utils/logger';

export async function GET(req) {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const res = await dbQuery("SELECT * FROM support ORDER BY created_at DESC", []);
        
        return NextResponse.json({
            success: true,
            message: 'Support messages fetched successfully',
            data: res.rows
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { name, email, subject, message } = await req.json();
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const res = await dbQuery(`
            INSERT INTO support (name, email, subject, message)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [name, email, subject, message]);

        const supportMsg = res.rows[0];

        await createLog({
            userId: null, // Public contact form
            action: 'create',
            targetType: 'support_contact',
            targetId: supportMsg.support_id,
            description: `New support contact from ${name} (${email}): ${subject}`
        });

        return NextResponse.json({ success: true, message: 'Message sent successfully', data: supportMsg });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id, status } = await req.json();
        if (!id || !status) return NextResponse.json({ success: false, message: "ID and status required" }, { status: 400 });

        const res = await dbQuery(`
            UPDATE support 
            SET status = $1
            WHERE support_id = $2
            RETURNING *
        `, [status, id]);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });

        const updatedMsg = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'update',
            targetType: 'support_contact',
            targetId: updatedMsg.support_id,
            description: `Updated support message status to ${status} for message ID ${id}`
        });

        return NextResponse.json({ success: true, message: 'Status updated', data: updatedMsg });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 403 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

        const res = await dbQuery("DELETE FROM support WHERE support_id = $1 RETURNING *", [id]);

        if (res.rows.length === 0) return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });

        const deletedMsg = res.rows[0];

        await createLog({
            userId: auth.data.id,
            action: 'delete',
            targetType: 'support_contact',
            targetId: deletedMsg.support_id,
            description: `Deleted support message ID ${id} from ${deletedMsg.name}`
        });

        return NextResponse.json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
