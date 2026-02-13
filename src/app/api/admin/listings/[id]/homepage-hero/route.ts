import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json().catch(() => ({}));
        const show = body?.show !== false;

        const existing = await prisma.listing.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        if (show && existing.status !== "PUBLISHED") {
            return NextResponse.json(
                { error: "Only published listings can be shown on homepage hero" },
                { status: 400 }
            );
        }

        const listing = await prisma.$transaction(async (tx) => {
            if (show) {
                await tx.listing.updateMany({
                    where: {
                        showOnHomepageHero: true,
                        id: { not: id },
                    },
                    data: { showOnHomepageHero: false },
                });
            }

            return tx.listing.update({
                where: { id },
                data: { showOnHomepageHero: show },
                include: {
                    translations: {
                        where: { locale: "tr" },
                        take: 1,
                    },
                    media: {
                        where: { isCover: true },
                        take: 1,
                    },
                },
            });
        });

        return NextResponse.json({ listing });
    } catch (error) {
        console.error("Error updating homepage hero listing:", error);
        return NextResponse.json(
            { error: "Failed to update homepage hero listing" },
            { status: 500 }
        );
    }
}
