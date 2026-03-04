import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { order: "asc" },
        select: {
            id: true,
            name: true,
            quote: true,
            serviceName: true,
            imageUrl: true,
            videoUrl: true,
        },
    });

    return NextResponse.json({ testimonials });
}
