import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(req.url);
        const locale = searchParams.get("locale") || "tr";

        const listing = await prisma.listing.findUnique({
            where: {
                slug,
                status: ListingStatus.PUBLISHED,
            },
            include: {
                translations: {
                    where: { locale },
                },
                media: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        return NextResponse.json({ listing });
    } catch (error) {
        console.error("Public listing detail API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch listing detail" },
            { status: 500 }
        );
    }
}
