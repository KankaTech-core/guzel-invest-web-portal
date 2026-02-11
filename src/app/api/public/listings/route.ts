import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    ListingStatus,
    Prisma,
    PropertyType,
    SaleType,
} from "@/generated/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const locale = searchParams.get("locale") || "tr";
        const type = searchParams.get("type");
        const saleType = searchParams.get("saleType");
        const city = searchParams.get("city");
        const district = searchParams.get("district");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const minArea = searchParams.get("minArea");
        const maxArea = searchParams.get("maxArea");

        const where: Prisma.ListingWhereInput = {
            status: ListingStatus.PUBLISHED,
        };

        if (type && Object.values(PropertyType).includes(type as PropertyType)) {
            where.type = type as PropertyType;
        }
        if (saleType && Object.values(SaleType).includes(saleType as SaleType)) {
            where.saleType = saleType as SaleType;
        }
        if (city) {
            where.city = {
                equals: city,
                mode: "insensitive",
            };
        }
        if (district) {
            where.district = {
                equals: district,
                mode: "insensitive",
            };
        }
        if (minPrice || maxPrice) {
            const priceFilter: Prisma.DecimalFilter = {};
            if (minPrice) priceFilter.gte = new Prisma.Decimal(minPrice);
            if (maxPrice) priceFilter.lte = new Prisma.Decimal(maxPrice);
            where.price = priceFilter;
        }
        if (minArea || maxArea) {
            const areaFilter: Prisma.IntFilter = {};
            if (minArea) areaFilter.gte = parseInt(minArea, 10);
            if (maxArea) areaFilter.lte = parseInt(maxArea, 10);
            where.area = areaFilter;
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
