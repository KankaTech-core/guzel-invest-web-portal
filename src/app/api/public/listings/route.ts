import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    isCategoryFieldVisibleForTypes,
    normalizeZoningStatus,
} from "@/lib/listing-type-rules";
import { buildPortfolioTypeCounts } from "@/lib/portfolio-type-counts";
import { buildListingsRoomScope } from "@/lib/public-listings";
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
        const onlyProjects = parseBooleanParam(searchParams.get("onlyProjects"));
        const includePriceHistogram =
            parseBooleanParam(searchParams.get("includePriceHistogram")) === true;
        const includeTypeCounts =
            parseBooleanParam(searchParams.get("includeTypeCounts")) === true;
        const sort = searchParams.get("sort") as SortOption | null;

        const page = parseNumberParam(searchParams.get("page")) || 1;
        const limit = parseNumberParam(searchParams.get("limit")) || 8;
        const skip = (page - 1) * limit;
        const take = limit;

        const types = rawTypes.filter((value): value is PropertyType =>
            Object.values(PropertyType).includes(value as PropertyType)
        );

        const saleTypes = rawSaleTypes.filter((value): value is SaleType =>
            Object.values(SaleType).includes(value as SaleType)
        );

        const baseWhere: Prisma.ListingWhereInput = {
            status: ListingStatus.PUBLISHED,
        };

        if (types.length === 1) {
            baseWhere.type = types[0];
        } else if (types.length > 1) {
            baseWhere.type = { in: types };
        }

        if (saleTypes.length === 1) {
            baseWhere.saleType = saleTypes[0];
        } else if (saleTypes.length > 1) {
            baseWhere.saleType = { in: saleTypes };
        }

        if (city) {
            baseWhere.city = {
                equals: city,
                mode: "insensitive",
            };
        }

        if (district) {
            baseWhere.district = {
                equals: district,
                mode: "insensitive",
            };
        }

        if (neighborhood) {
            baseWhere.neighborhood = {
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

        const roomScope = buildListingsRoomScope({
            canUseRoomFilters,
            rooms: rawRooms,
        });

        if (roomScope) {
            const existingAnd = baseWhere.AND;
            if (existingAnd) {
                baseWhere.AND = Array.isArray(existingAnd)
                    ? [...existingAnd, roomScope]
                    : [existingAnd, roomScope];
            } else {
                baseWhere.AND = [roomScope];
            }
        }

        if (canUseLandFilters && zoningStatus) {
            baseWhere.zoningStatus = {
                equals: zoningStatus,
                mode: "insensitive",
            };
        }

        if (canUseLandFilters && parcelNo?.trim()) {
            baseWhere.parcelNo = {
                contains: parcelNo.trim(),
                mode: "insensitive",
            };
        }

        if (canUseLandFilters && (minEmsal !== undefined || maxEmsal !== undefined)) {
            const emsalFilter: Prisma.FloatNullableFilter<"Listing"> = {};
            if (minEmsal !== undefined) emsalFilter.gte = minEmsal;
            if (maxEmsal !== undefined) emsalFilter.lte = maxEmsal;
            baseWhere.emsal = emsalFilter;
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
            baseWhere.groundFloorArea = groundFloorAreaFilter;
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
            baseWhere.basementArea = basementAreaFilter;
        }

        if (canUseFarmFilters && hasWaterSource !== undefined) {
            baseWhere.hasWaterSource = hasWaterSource;
        }

        if (canUseFarmFilters && hasFruitTrees !== undefined) {
            baseWhere.hasFruitTrees = hasFruitTrees;
        }

        if (onlyProjects) {
            baseWhere.isProject = true;
        }

        if (minArea || maxArea) {
            const areaFilter: Prisma.IntFilter = {};
            if (minArea) areaFilter.gte = parseInt(minArea, 10);
            if (maxArea) areaFilter.lte = parseInt(maxArea, 10);
            baseWhere.area = areaFilter;
        }

        const where: Prisma.ListingWhereInput = {
            ...baseWhere,
        };

        if (minPrice || maxPrice) {
            const priceFilter: Prisma.DecimalFilter = {};
            if (minPrice) priceFilter.gte = new Prisma.Decimal(minPrice);
            if (maxPrice) priceFilter.lte = new Prisma.Decimal(maxPrice);
            where.price = priceFilter;
        }

        const typeCountsWhere: Prisma.ListingWhereInput = { ...where };
        delete typeCountsWhere.type;

        const localeFallbacks = Array.from(new Set([locale, "tr"]));

        const orderBy: Prisma.ListingOrderByWithRelationInput =
            sort === "priceAsc"
                ? { price: "asc" }
                : sort === "priceDesc"
                    ? { price: "desc" }
                    : sort === "areaDesc"
                        ? { area: "desc" }
                        : { createdAt: "desc" };

        const [totalCount, listings, priceHistogramRows, typeCountRows] =
            await Promise.all([
            prisma.listing.count({ where }),
            prisma.listing.findMany({
                where,
                skip,
                take,
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
                        take: 16,
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
                    projectUnits: {
                        orderBy: { rooms: "asc" },
                        select: {
                            rooms: true,
                            detailType: true,
                            translations: {
                                where: {
                                    locale: {
                                        in: localeFallbacks,
                                    },
                                },
                                select: {
                                    locale: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    projectFeatures: {
                        where: {
                            category: "GENERAL",
                        },
                        orderBy: { order: "asc" },
                        select: {
                            icon: true,
                            translations: {
                                where: {
                                    locale: {
                                        in: localeFallbacks,
                                    },
                                },
                                select: {
                                    locale: true,
                                    title: true,
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
            }),
            includePriceHistogram
                ? prisma.listing.findMany({
                    where: baseWhere,
                    select: {
                        price: true,
                    },
                })
                : Promise.resolve([] as Array<{ price: Prisma.Decimal }>),
            includeTypeCounts
                ? prisma.listing.groupBy({
                    by: ["type"],
                    where: typeCountsWhere,
                    _count: {
                        _all: true,
                    },
                })
                : Promise.resolve(
                    [] as Array<{ type: PropertyType; _count: { _all: number } }>
                ),
            ]);

        const priceHistogramValues = includePriceHistogram
            ? priceHistogramRows
                .map((row) => Number(row.price))
                .filter((value) => Number.isFinite(value))
            : undefined;
        const typeCounts = includeTypeCounts
            ? buildPortfolioTypeCounts(typeCountRows)
            : undefined;

        return NextResponse.json({
            listings,
            totalCount,
            ...(typeCounts
                ? { typeCounts }
                : {}),
            ...(priceHistogramValues
                ? { priceHistogramValues }
                : {}),
        });
    } catch (error) {
        console.error("Public listings API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch listings" },
            { status: 500 }
        );
    }
}
