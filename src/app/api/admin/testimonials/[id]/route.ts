import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
        where: { id },
    });

    if (!testimonial) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ testimonial });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "VIEWER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const body = (await request.json()) as {
        name?: string;
        quote?: string;
        serviceName?: string;
        imageUrl?: string | null;
    };

    const testimonial = await prisma.testimonial.update({
        where: { id },
        data: {
            ...(body.name !== undefined && { name: body.name }),
            ...(body.quote !== undefined && { quote: body.quote }),
            ...(body.serviceName !== undefined && { serviceName: body.serviceName }),
            ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        },
    });

    return NextResponse.json({ testimonial });
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "VIEWER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.testimonial.delete({
        where: { id },
    });

    return NextResponse.json({ success: true });
}
