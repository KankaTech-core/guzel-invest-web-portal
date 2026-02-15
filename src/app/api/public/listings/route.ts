import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    isCategoryFieldVisibleForTypes,
    normalizeZoningStatus,
} from "@/lib/listing-type-rules";
import {
    ListingStatus,
    Prisma,
    PropertyType,
    SaleType,
} from "@/generated/prisma";

export const dynamic = "force-dynamic";

type SortOption = "newest" | "priceAsc" | "priceDesc" | "areaDesc";

function parseMultiParam(searchParams: URLSearchParams, key: string) {
    return searchParams
        .getAll(key)
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean);
}

function parseNumberParam(value: string | null) {
    if (value === null || value.trim() === "") return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBooleanParam(value: string | null) {
    if (value === null || value.trim() === "") return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") {
        return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no") {
        return false;
    }
    return undefined;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const locale = searchParams.get("locale") || "tr";

        const rawTypes = parseMultiParam(searchParams, "type");
        const rawSaleTypes = parseMultiParam(searchParams, "saleType");
        const rawRooms = parseMultiParam(searchParams, "rooms");

        const city = searchParams.get("city");
        const district = searchParams.get("district");
        const neighborhood = searchParams.get("neighborhood");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const minArea = searchParams.get("minArea");
        const maxArea = searchParams.get("maxArea");
        const zoningStatus = normalizeZoningStatus(searchParams.get("zoningStatus"));
        const parcelNo = searchParams.get("parcelNo");
        const minEmsal = parseNumberParam(searchParams.get("minEmsal"));
        const maxEmsal = parseNumberParam(searchParams.get("maxEmsal"));
        const minGroundFloorArea = parseNumberParam(
            searchParams.get("minGroundFloorArea")
        );
        const maxGroundFloorArea = parseNumberParam(
            searchParams.get("maxGroundFloorArea")
        );
        const minBasementArea = parseNumberParam(searchParams.get("minBasementArea"));
        const maxBasementArea = parseNumberParam(searchParams.get("maxBasementArea"));
        const hasWaterSource = parseBooleanParam(searchParams.get("hasWaterSource"));
        const hasFruitTrees = parseBooleanParam(searchParams.get("hasFruitTrees"));
        const sort = searchParams.get("sort") as SortOption | null;

        const types = rawTypes.filter((value): value is PropertyType =>
            Object.values(PropertyType).includes(value as PropertyType)
        );

        const saleTypes = rawSaleTypes.filter((value): value is SaleType =>
            Object.values(SaleType).includes(value as SaleType)
        );

        const where: Prisma.ListingWhereInput = {
            status: ListingStatus.PUBLISHED,
        };

        if (types.length === 1) {
            where.type = types[0];
        } else if (types.length > 1) {
            where.type = { in: types };
        }

        if (saleTypes.length === 1) {
            where.saleType = saleTypes[0];
        } else if (saleTypes.length > 1) {
            where.saleType = { in: saleTypes };
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

        if (neighborhood) {
            where.neighborhood = {
                equals: neighborhood,
                mode: "insensitive",
            };
        }

        const canUseRoomFilters = isCategoryFieldVisibleForTypes("rooms", types);
        const canUseLandFilters = isCategoryFieldVisibleForTypes(
            "zoningStatus",
            types
        );
        const canUseCommercialFilters = isCategoryFieldVisibleForTypes(
            "groundFloorArea",
            types
        );
        const canUseFarmFilters = isCategoryFieldVisibleForTypes(
            "hasWaterSource",
            types
        );

        if (canUseRoomFilters && rawRooms.length === 1) {
            where.rooms = rawRooms[0];
        } else if (canUseRoomFilters && rawRooms.length > 1) {
            where.rooms = { in: rawRooms };
        }

        if (canUseLandFilters && zoningStatus) {
            where.zoningStatus = {
                equals: zoningStatus,
                mode: "insensitive",
            };
        }

        if (canUseLandFilters && parcelNo?.trim()) {
            where.parcelNo = {
                contains: parcelNo.trim(),
                mode: "insensitive",
            };
        }

        if (canUseLandFilters && (minEmsal !== undefined || maxEmsal !== undefined)) {
            const emsalFilter: Prisma.FloatNullableFilter<"Listing"> = {};
            if (minEmsal !== undefined) emsalFilter.gte = minEmsal;
            if (maxEmsal !== undefined) emsalFilter.lte = maxEmsal;
            where.emsal = emsalFilter;
        }

        if (
            canUseCommercialFilters &&
            (minGroundFloorArea !== undefined || maxGroundFloorArea !== undefined)
        ) {
            const groundFloorAreaFilter: Prisma.IntNullableFilter<"Listing"> = {};
            if (minGroundFloorArea !== undefined) {
                groundFloorAreaFilter.gte = Math.trunc(minGroundFloorArea);
            }
            if (maxGroundFloorArea !== undefined) {
                groundFloorAreaFilter.lte = Math.trunc(maxGroundFloorArea);
            }
            where.groundFloorArea = groundFloorAreaFilter;
        }

        if (
            canUseCommercialFilters &&
            (minBasementArea !== undefined || maxBasementArea !== undefined)
        ) {
            const basementAreaFilter: Prisma.IntNullableFilter<"Listing"> = {};
            if (minBasementArea !== undefined) {
                basementAreaFilter.gte = Math.trunc(minBasementArea);
            }
            if (maxBasementArea !== undefined) {
                basementAreaFilter.lte = Math.trunc(maxBasementArea);
            }
            where.basementArea = basementAreaFilter;
        }

        if (canUseFarmFilters && hasWaterSource !== undefined) {
            where.hasWaterSource = hasWaterSource;
        }

        if (canUseFarmFilters && hasFruitTrees !== undefined) {
            where.hasFruitTrees = hasFruitTrees;
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

        const localeFallbacks = Array.from(new Set([locale, "tr"]));

        const orderBy: Prisma.ListingOrderByWithRelationInput =
            sort === "priceAsc"
                ? { price: "asc" }
                : sort === "priceDesc"
                    ? { price: "desc" }
                    : sort === "areaDesc"
                        ? { area: "desc" }
                        : { createdAt: "desc" };

        const listings = await prisma.listing.findMany({
            where,
            include: {
                translations: {
                    where: {
                        locale: {
                            in: localeFallbacks,
                        },
                    },
                },
                media: {
                    orderBy: [{ isCover: "desc" }, { order: "asc" }],
                    take: 4,
                },
                tags: {
                    include: {
                        tag: {
                            select: {
                                name: true,
                                color: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        media: true,
                    },
                },
            },
            orderBy,
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
