import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";

export const dynamic = "force-dynamic";
const HOMEPAGE_HERO_SLOTS = [1, 2, 3] as const;
type HomepageHeroSlot = (typeof HOMEPAGE_HERO_SLOTS)[number];

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
                take: 3,
            },
        };

        const selectedListings = await prisma.listing.findMany({
            where: {
                status: ListingStatus.PUBLISHED,
                isProject: false,
                homepageHeroSlot: {
                    in: [...HOMEPAGE_HERO_SLOTS],
                },
            },
            include: includeConfig,
            orderBy: [{ homepageHeroSlot: "asc" }],
            take: 3,
        });

        const selectedIds = selectedListings.map((listing) => listing.id);
        const missingSlots = HOMEPAGE_HERO_SLOTS.filter(
            (slot) =>
                !selectedListings.some(
                    (listing) => listing.homepageHeroSlot === slot
                )
        );

        const fallbackListings =
            missingSlots.length > 0
                ? await prisma.listing.findMany({
                    where: {
                        status: ListingStatus.PUBLISHED,
                        isProject: false,
                        ...(selectedIds.length > 0
                            ? { id: { notIn: selectedIds } }
                            : {}),
                    },
                    include: includeConfig,
                    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
                    take: missingSlots.length,
                })
                : [];

        const listingsBySlot = new Map<
            HomepageHeroSlot,
            (typeof selectedListings)[number]
        >();

        selectedListings.forEach((listing) => {
            if (listing.homepageHeroSlot) {
                listingsBySlot.set(
                    listing.homepageHeroSlot as HomepageHeroSlot,
                    listing
                );
            }
        });

        fallbackListings.forEach((listing, index) => {
            const slot = missingSlots[index];
            if (slot) {
                listingsBySlot.set(slot, listing);
            }
        });

        const listings = HOMEPAGE_HERO_SLOTS.map((slot) => {
            const listing = listingsBySlot.get(slot);
            if (!listing) return null;

            const translation =
                listing.translations.find((item) => item.locale === locale) ||
                listing.translations.find((item) => item.locale === "tr") ||
                listing.translations[0] ||
                null;

            return {
                id: listing.id,
                slug: listing.slug,
                slot,
                saleType: listing.saleType,
                type: listing.type,
                district: listing.district,
                rooms: listing.rooms,
                area: listing.area,
                seaView: listing.seaView,
                price: listing.price.toString(),
                currency: listing.currency,
                images: listing.media.map((m) => m.url),
                title: translation?.title || "",
            };
        }).filter((listing): listing is NonNullable<typeof listing> => Boolean(listing));

        if (listings.length === 0) {
            return NextResponse.json({ listings: [] });
        }

        return NextResponse.json({
            listings,
        });
    } catch (error) {
        console.error("Public homepage hero listing API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch homepage hero listing" },
            { status: 500 }
        );
    }
}
