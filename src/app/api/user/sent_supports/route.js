import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isLogin } from '@/lib/middleware';

export async function GET() {
    try {
        const auth = await isLogin();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const res = await dbQuery("SELECT * FROM contacts WHERE email = $1 ORDER BY created_at DESC", [auth.data.email]);

        return NextResponse.json({ 
            success: true, 
            message: 'Support messages found', 
            data: res.rows.map(row => ({ ...row, id: row.contact_id, _id: row.contact_id })) 
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
