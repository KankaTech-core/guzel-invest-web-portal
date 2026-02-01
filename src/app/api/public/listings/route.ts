import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const locale = searchParams.get("locale") || "tr";
        const type = searchParams.get("type");
        const saleType = searchParams.get("saleType");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");

        const where: any = {
            status: ListingStatus.PUBLISHED,
        };

        if (type) where.type = type;
        if (saleType) where.saleType = saleType;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        const listings = await prisma.listing.findMany({
            where,
            include: {
                translations: {
                    where: { locale },
                },
                media: {
                    orderBy: { order: "asc" },
                    take: 1,
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ listings });
    } catch (error) {
        console.error("Public listings API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch listings" },
            { status: 500 }
        );
    }
}
