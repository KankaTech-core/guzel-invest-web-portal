import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const HOMEPAGE_HERO_REMOVE_BLOCK_CODE = "HOMEPAGE_HERO_REMOVE_BLOCKED";

// PATCH /api/admin/listings/[id]/status - Update listing status only
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Admin and Editor can update listings
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const status = body?.status as ListingStatus | undefined;

        if (!status || !Object.values(ListingStatus).includes(status)) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const existing = await prisma.listing.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                publishedAt: true,
                showOnHomepageHero: true,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        if (status === ListingStatus.REMOVED && existing.status !== ListingStatus.REMOVED) {
            if (existing.status === ListingStatus.DRAFT) {
                return NextResponse.json(
                    { error: "Taslak ilanlar yayından kaldırılamaz. Taslak ilanlar yalnızca silinebilir." },
                    { status: 400 }
                );
            }

            if (existing.status !== ListingStatus.PUBLISHED) {
                return NextResponse.json(
                    { error: "Sadece yayındaki ilanlar kaldırılabilir." },
                    { status: 400 }
                );
            }

            if (existing.showOnHomepageHero) {
                return NextResponse.json(
                    {
                        error:
                            "Bu ilan ana sayfada gösteriliyor. Yayından kaldırmadan önce ana sayfa için başka bir ilan seçin.",
                        code: HOMEPAGE_HERO_REMOVE_BLOCK_CODE,
                    },
                    { status: 409 }
                );
            }
        }

        const listing = await prisma.listing.update({
            where: { id },
            data: {
                status,
                showOnHomepageHero:
                    status === ListingStatus.PUBLISHED
                        ? existing.showOnHomepageHero
                        : false,
                publishedAt:
                    status === ListingStatus.PUBLISHED &&
                    existing.status !== ListingStatus.PUBLISHED
                        ? new Date()
                        : existing.publishedAt,
            },
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Error updating listing status:", error);
        return NextResponse.json(
            { error: "Failed to update listing status" },
            { status: 500 }
        );
    }
}
