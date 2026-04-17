import { NextResponse } from "next/server";
import connectDB from "@/lib/database/db";
import User from "@/lib/models/user";
import { isLogin, isManager, isProjectManager } from "@/lib/middleware";

export async function GET(req) {
    try {
        await connectDB();
        const auth = await isProjectManager();
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
            data: users
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
            addressLine1, addressLine2, state, 
            postalCode, 
            role, isActive 
        } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        
        const isManagement = auth.data.role === 'admin' || auth.data.role === 'manager';
        
        const targetUser = await User.findById(id);
        if (!targetUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        
        if (targetUser.role === 'admin' && role && role !== 'admin') {
            if (!isManagement || auth.data.role !== 'admin') {
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

        
        const updateData = {
            name: name || targetUser.name,
            phone: phone || targetUser.phone,
            city: city !== undefined ? city : targetUser.city,
            country: country !== undefined ? country : targetUser.country,
            addressLine1: addressLine1 !== undefined ? addressLine1 : targetUser.addressLine1,
            addressLine2: addressLine2 !== undefined ? addressLine2 : targetUser.addressLine2,
            state: state !== undefined ? state : targetUser.state,
            postalCode: postalCode !== undefined ? postalCode : targetUser.postalCode,
        };

        if (isManagement) {
            if (role && (auth.data.role === 'admin' || (auth.data.role === 'manager' && role !== 'admin'))) {
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
            data: updatedUser
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to update user', 
            error: error.message 
        }, { status: 500 });
    }
}
