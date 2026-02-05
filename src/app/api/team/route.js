import ConnectDB from "@/lib/database/mongo";
import { Team } from "@/lib/models/team";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await ConnectDB();
        const team = await Team.find({}).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            payload: team || []
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await ConnectDB();
        const { name, role, image, imageId, bio } = await req.json();

        if (!name || !role || !image || !imageId || !bio) {
            return NextResponse.json({ 
                success: false, 
                message: "Missing required fields" 
            }, { status: 400 });
        }

        const newMember = await Team.create({
            name,
            role,
            image,
            imageId,
            bio
        });

        return NextResponse.json({
            success: true,
            message: "Team member added",
            payload: newMember
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await ConnectDB();
        const { id, name, role, image, imageId, bio } = await req.json();

        if (!id) {
            return NextResponse.json({ 
                success: false, 
                message: "Member ID required" 
            }, { status: 400 });
        }

        const updatedMember = await Team.findByIdAndUpdate(
            id,
            { name, role, image, imageId, bio },
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return NextResponse.json({ 
                success: false, 
                message: "Member not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Member updated successfully",
            payload: updatedMember
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await ConnectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ 
                success: false, 
                message: "ID is required" 
            }, { status: 400 });
        }

        const deletedMember = await Team.findByIdAndDelete(id);

        if (!deletedMember) {
            return NextResponse.json({ 
                success: false, 
                message: "Member not found" 
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Member removed from team"
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}