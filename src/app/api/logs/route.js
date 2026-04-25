import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/database/pg';
import { isManager } from '@/lib/middleware';

const mapLog = (row) => ({
    ...row,
    id: row.log_id,
    _id: row.log_id,
    userId: {
        _id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        role: row.user_role
    }
});

export async function GET(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json({ success: false, message: auth.message }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const entityType = searchParams.get('entityType') || searchParams.get('targetType');
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;
        const skip = (page - 1) * limit;

        const params = [];
        let whereClauses = [];

        if (action) {
            params.push(action);
            whereClauses.push(`l.action = $${params.length}`);
        }
        if (entityType) {
            params.push(entityType);
            whereClauses.push(`l.entity_type = $${params.length}`);
        }
        if (userId) {
            params.push(userId);
            whereClauses.push(`l.user_id = $${params.length}`);
        }

        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const logsRes = await dbQuery(`
            SELECT l.*, u.name as user_name, u.email as user_email, u.role as user_role
            FROM logs l
            JOIN users u ON l.user_id = u.user_id
            ${whereSql}
            ORDER BY l.created_at DESC
            LIMIT ${limit} OFFSET ${skip}
        `, params);

        const countRes = await dbQuery(`SELECT COUNT(*) FROM logs l ${whereSql}`, params);
        const total = parseInt(countRes.rows[0].count);

        return NextResponse.json({
            success: true,
            message: 'Logs fetched successfully',
            data: logsRes.rows.map(mapLog),
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
