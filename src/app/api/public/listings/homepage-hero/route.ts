import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get("locale") || "tr";
        const localeFallbacks = Array.from(new Set([locale, "tr"]));

        const includeConfig = {
            translations: {
                where: {
                    locale: {
                        in: localeFallbacks,
                    },
                },
            },
            media: {
                orderBy: [{ isCover: "desc" as const }, { order: "asc" as const }],
                take: 1,
            },
        };

        const listing =
            (await prisma.listing.findFirst({
                where: {
                    status: ListingStatus.PUBLISHED,
                    showOnHomepageHero: true,
                },
                include: includeConfig,
                orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
            })) ||
            (await prisma.listing.findFirst({
                where: {
                    status: ListingStatus.PUBLISHED,
                },
                include: includeConfig,
                orderBy: { createdAt: "desc" },
            }));

        if (!listing) {
            return NextResponse.json({ listing: null });
        }

        const translation =
            listing.translations.find((item) => item.locale === locale) ||
            listing.translations.find((item) => item.locale === "tr") ||
            listing.translations[0] ||
            null;

        return NextResponse.json({
            listing: {
                id: listing.id,
                slug: listing.slug,
                saleType: listing.saleType,
                type: listing.type,
                district: listing.district,
                rooms: listing.rooms,
                area: listing.area,
                seaView: listing.seaView,
                price: listing.price.toString(),
                currency: listing.currency,
                imageUrl: listing.media[0]?.url || null,
                title: translation?.title || "",
            },
        });
    } catch (error) {
        console.error("Public homepage hero listing API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch homepage hero listing" },
            { status: 500 }
        );
    }
}
