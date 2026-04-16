import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import { isLogin, isManager } from "@/lib/middleware";

export async function GET(req) {
    try {
        await connectDB();
        const auth = await isManager();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');
        const isActive = searchParams.get('isActive');

        const query = {};
        if (role) query.role = role;
        if (isActive !== null && isActive !== undefined) query.isActive = isActive === 'true';

        const users = await User.find(query).select("-password").sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            message: 'User data found successfully',
            payload: users
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await connectDB();
        const auth = await isLogin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const body = await req.json();
        const { 
            id, name, phone, city, country, 
            address_line1, address_line2, state, 
            postal_code, 
            role, isActive 
        } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        // Only Admin/Manager can update sensitive info like role or status
        const isManagement = auth.payload.role === 'admin' || auth.payload.role === 'manager';
        
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Safety Block: Last Admin protection
        if (targetUser.role === 'admin' && role && role !== 'admin') {
            if (!isManagement || auth.payload.role !== 'admin') {
                return NextResponse.json({ success: false, message: 'Unauthorized role change' }, { status: 403 });
            }
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return NextResponse.json({
                    success: false,
                    message: "Safety Block: Cannot demote the only remaining admin."
                }, { status: 400 });
            }
        }

        // Construct Update Data
        const updateData = {
            name: name || targetUser.name,
            phone: phone || targetUser.phone,
            city: city !== undefined ? city : targetUser.city,
            country: country !== undefined ? country : targetUser.country,
            address_line1: address_line1 !== undefined ? address_line1 : targetUser.address_line1,
            address_line2: address_line2 !== undefined ? address_line2 : targetUser.address_line2,
            state: state !== undefined ? state : targetUser.state,
            postal_code: postal_code !== undefined ? postal_code : targetUser.postal_code,
        };

        if (isManagement) {
            if (role && (auth.payload.role === 'admin' || (auth.payload.role === 'manager' && role !== 'admin'))) {
                updateData.role = role;
            }
            if (isActive !== undefined) {
                updateData.isActive = isActive;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            payload: updatedUser
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update user', 
            error: error.message 
        }, { status: 500 });
    }
}