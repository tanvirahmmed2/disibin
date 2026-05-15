import { NextResponse } from "next/server";
import { isManager, hasRole } from "@/lib/middleware";
import { createTeamMember, getTeamMembers, updateTeamMember, deleteTeamMember } from "@/lib/data/teams";

// GET team members (Public)
export async function GET() {
    try {
        const members = await getTeamMembers();
        return NextResponse.json({ success: true, data: members });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST add member (Manager only)
export async function POST(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { name, post } = body;

        if (!name || !post) {
            return NextResponse.json({ success: false, message: "Name and Post (Title) are required" }, { status: 400 });
        }

        const member = await createTeamMember(body);
        return NextResponse.json({
            success: true,
            message: "Team member added successfully",
            data: member
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH update member (Manager only)
export async function PATCH(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const body = await req.json();
        const { memberId, ...updateData } = body;

        if (!memberId) {
            return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
        }

        const member = await updateTeamMember(memberId, updateData);
        if (!member) return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });

        return NextResponse.json({
            success: true,
            message: "Team member updated successfully",
            data: member
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE member (Manager only)
export async function DELETE(req) {
    try {
        const auth = await isManager();
        if (!auth.success) return NextResponse.json(auth, { status: 403 });

        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('id');

        if (!memberId) {
            return NextResponse.json({ success: false, message: "Member ID is required" }, { status: 400 });
        }

        const deletedMember = await deleteTeamMember(memberId);
        if (!deletedMember) return NextResponse.json({ success: false, message: "Member not found" }, { status: 404 });

        return NextResponse.json({
            success: true,
            message: "Team member removed",
            data: deletedMember
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
