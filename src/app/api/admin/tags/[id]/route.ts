import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// DELETE /api/admin/tags/[id] - Delete a tag
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check if tag exists
        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!tag) {
            return NextResponse.json({ error: "Tag not found" }, { status: 404 });
        }

        // Delete the tag (cascade will remove ListingTag entries)
        await prisma.tag.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting tag:", error);
        return NextResponse.json(
            { error: "Failed to delete tag" },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/tags/[id] - Update a tag
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { name, color } = await req.json();

        // Check if tag exists
        const tag = await prisma.tag.findUnique({
            where: { id },
        });

        if (!tag) {
            return NextResponse.json({ error: "Tag not found" }, { status: 404 });
        }

        // Check for name conflict if name is being changed
        if (name && name.trim() !== tag.name) {
            const existing = await prisma.tag.findUnique({
                where: { name: name.trim() },
            });
            if (existing) {
                return NextResponse.json(
                    { error: "A tag with this name already exists" },
                    { status: 409 }
                );
            }
        }

        const updatedTag = await prisma.tag.update({
            where: { id },
            data: {
                ...(name && { name: name.trim() }),
                ...(color && { color }),
            },
        });

        return NextResponse.json({ tag: updatedTag });
    } catch (error) {
        console.error("Error updating tag:", error);
        return NextResponse.json(
            { error: "Failed to update tag" },
            { status: 500 }
        );
    }
}
