import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const HOMEPAGE_HERO_SLOTS = [1, 2, 3] as const;
type HomepageHeroSlot = (typeof HOMEPAGE_HERO_SLOTS)[number];

const parseHomepageHeroSlot = (
    value: unknown
): HomepageHeroSlot | null | "invalid" => {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
        return "invalid";
    }

    if (!HOMEPAGE_HERO_SLOTS.includes(parsed as HomepageHeroSlot)) {
        return "invalid";
    }

    return parsed as HomepageHeroSlot;
};

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
        const requestedSlot =
            body?.slot !== undefined
                ? parseHomepageHeroSlot(body.slot)
                : body?.show === false
                    ? null
                    : parseHomepageHeroSlot(1);

        if (requestedSlot === "invalid") {
            return NextResponse.json(
                { error: "Homepage slot must be 1, 2, or 3." },
                { status: 400 }
            );
        }

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

        if (requestedSlot !== null && existing.status !== "PUBLISHED") {
            return NextResponse.json(
                { error: "Only published listings can be shown on homepage hero" },
                { status: 400 }
            );
        }

        const listing = await prisma.$transaction(async (tx) => {
            if (requestedSlot !== null) {
                await tx.listing.updateMany({
                    where: {
                        homepageHeroSlot: requestedSlot,
                        id: { not: id },
                    },
                    data: {
                        homepageHeroSlot: null,
                        showOnHomepageHero: false,
                    },
                });
            }

            return tx.listing.update({
                where: { id },
                data: {
                    homepageHeroSlot: requestedSlot,
                    showOnHomepageHero: requestedSlot !== null,
                },
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
