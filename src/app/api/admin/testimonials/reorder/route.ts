import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "VIEWER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
        orderedIds: string[];
    };

    if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
        return NextResponse.json({ error: "orderedIds is required" }, { status: 400 });
    }

    // Update each testimonial's order in a transaction
    await prisma.$transaction(
        body.orderedIds.map((id, index) =>
            prisma.testimonial.update({
                where: { id },
                data: { order: index },
            })
        )
    );

    return NextResponse.json({ success: true });
}
