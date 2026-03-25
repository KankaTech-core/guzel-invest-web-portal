import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
        orderBy: { order: "asc" },
    });

    return NextResponse.json({ testimonials });
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "VIEWER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
        name?: string;
        quote?: string;
        serviceName?: string;
        imageUrl?: string;
        videoUrl?: string;
    };

    // Get the max order to put new testimonial at the end
    const maxOrder = await prisma.testimonial.aggregate({
        _max: { order: true },
    });

    const testimonial = await prisma.testimonial.create({
        data: {
            name: body.name || null,
            quote: body.quote || null,
            serviceName: body.serviceName || null,
            imageUrl: body.imageUrl || null,
            videoUrl: body.videoUrl || null,
            order: (maxOrder._max.order ?? -1) + 1,
        },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
}
