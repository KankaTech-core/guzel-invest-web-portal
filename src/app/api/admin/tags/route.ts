import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/admin/tags - List all tags
export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const tags = await prisma.tag.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { listings: true },
                },
            },
        });

        return NextResponse.json({ tags });
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 }
        );
    }
}

// POST /api/admin/tags - Create a new tag
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, color } = await req.json();

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Tag name is required" },
                { status: 400 }
            );
        }

        // Check if tag already exists
        const existing = await prisma.tag.findUnique({
            where: { name: name.trim() },
        });

        if (existing) {
            return NextResponse.json(
                { error: "A tag with this name already exists" },
                { status: 409 }
            );
        }

        const tag = await prisma.tag.create({
            data: {
                name: name.trim(),
                color: color || "#EC6803",
            },
        });

        return NextResponse.json({ tag }, { status: 201 });
    } catch (error) {
        console.error("Error creating tag:", error);
        return NextResponse.json(
            { error: "Failed to create tag" },
            { status: 500 }
        );
    }
}
