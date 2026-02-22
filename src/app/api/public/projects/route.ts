import { NextRequest, NextResponse } from "next/server";
import { ListingStatus, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseMultiParam(searchParams: URLSearchParams, key: string) {
    return searchParams
        .getAll(key)
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean);
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get("locale") || "tr";
        const rawRooms = parseMultiParam(searchParams, "rooms");
        const city = searchParams.get("city");
        const district = searchParams.get("district");

        const where: Prisma.ListingWhereInput = {
            isProject: true,
            status: ListingStatus.PUBLISHED,
        };

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

        if (rawRooms.length === 1) {
            where.projectUnits = {
                some: {
                    rooms: rawRooms[0],
                },
            };
        } else if (rawRooms.length > 1) {
            where.projectUnits = {
                some: {
                    rooms: { in: rawRooms },
                },
            };
        }

        const localeFallbacks = Array.from(new Set([locale, "tr"]));

        const projects = await prisma.listing.findMany({
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
                    take: 8,
                },
                projectUnits: {
                    orderBy: { rooms: "asc" },
                    include: {
                        translations: {
                            where: {
                                locale: {
                                    in: localeFallbacks,
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        media: true,
                        customGalleries: true,
                    },
                },
            },
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("Public projects API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
