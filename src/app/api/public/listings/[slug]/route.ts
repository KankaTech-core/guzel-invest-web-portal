import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";
import {
    getLocalizedFallbackLocales,
    pickLocalizedEntry,
} from "@/lib/public-content-localization";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(req.url);
        const locale = searchParams.get("locale") || "tr";
        const localeFallbacks = getLocalizedFallbackLocales(locale);

        const listing = await prisma.listing.findFirst({
            where: {
                slug,
                status: {
                    in: [ListingStatus.PUBLISHED, ListingStatus.REMOVED],
                },
            },
            include: {
                translations: {
                    where: {
                        locale: {
                            in: localeFallbacks,
                        },
                    },
                },
                media: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        const translation = pickLocalizedEntry(listing.translations, locale);

        return NextResponse.json({
            listing: {
                ...listing,
                translation,
            },
        });
    } catch (error) {
        console.error("Public listing detail API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch listing detail" },
            { status: 500 }
        );
    }
}
