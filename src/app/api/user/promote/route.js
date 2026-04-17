import { isAdmin } from "@/lib/middleware";

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 403 });
        }

        const { user_id, email, role } = await req.json();

        if ((!user_id && !email) || !role) {
            return NextResponse.json({ success: false, message: 'User (ID/Email) and Role are required' }, { status: 400 });
        }

        const query = user_id ? { _id: user_id } : { email };
        const targetUser = await User.findOne(query);

        if (!targetUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        const validRoles = ["admin", "manager", "project_manager", "editor", "support", "staff", "client"];
        if (!validRoles.includes(role)) {
            return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
        }

        
        if (targetUser.role === 'admin' && role !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return NextResponse.json({ success: false, message: 'Critical Error: Cannot remove the last administrator.' }, { status: 403 });
            }
        }

        targetUser.role = role;
        await targetUser.save();

        return NextResponse.json({
            success: true,
            message: `User ${targetUser.email} role updated to ${role} successfully`,
            payload: targetUser
        }, { status: 200 });

        return NextResponse.json({
            success: true,
            message: `User role updated to ${role} successfully`,
            payload: user
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
