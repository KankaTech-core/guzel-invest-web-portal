import { NextRequest, NextResponse } from "next/server";
import { ListingStatus, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
    HOMEPAGE_PROJECT_LIMIT,
    HOMEPAGE_PROJECT_SLOTS,
} from "@/lib/homepage-project-carousel";

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
        const homepageParam = searchParams.get("homepage");
        const shouldUseHomepageSelection =
            homepageParam === "1" || homepageParam === "true";
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
                take: 8,
            },
            projectUnits: {
                orderBy: { rooms: "asc" as const },
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
        };

        const fallbackProjectsOrderBy: Prisma.ListingOrderByWithRelationInput[] = [
            { publishedAt: "desc" },
            { createdAt: "desc" },
        ];

        if (shouldUseHomepageSelection) {
            const selectedProjects = await prisma.listing.findMany({
                where: {
                    ...where,
                    homepageProjectSlot: {
                        in: [...HOMEPAGE_PROJECT_SLOTS],
                    },
                },
                include: includeConfig,
                orderBy: [{ homepageProjectSlot: "asc" }],
                take: HOMEPAGE_PROJECT_LIMIT,
            });

            const selectedIds = selectedProjects.map((project) => project.id);
            const missingSlots = HOMEPAGE_PROJECT_SLOTS.filter(
                (slot) =>
                    !selectedProjects.some(
                        (project) => project.homepageProjectSlot === slot
                    )
            );

            const fallbackProjects =
                missingSlots.length > 0
                    ? await prisma.listing.findMany({
                          where: {
                              ...where,
                              ...(selectedIds.length > 0
                                  ? { id: { notIn: selectedIds } }
                                  : {}),
                          },
                          include: includeConfig,
                          orderBy: fallbackProjectsOrderBy,
                          take: missingSlots.length,
                      })
                    : [];

            const projectsBySlot = new Map<
                (typeof HOMEPAGE_PROJECT_SLOTS)[number],
                (typeof selectedProjects)[number]
            >();

            selectedProjects.forEach((project) => {
                if (project.homepageProjectSlot) {
                    projectsBySlot.set(
                        project.homepageProjectSlot as (typeof HOMEPAGE_PROJECT_SLOTS)[number],
                        project
                    );
                }
            });

            fallbackProjects.forEach((project, index) => {
                const slot = missingSlots[index];
                if (slot) {
                    projectsBySlot.set(slot, project);
                }
            });

            return NextResponse.json({
                projects: HOMEPAGE_PROJECT_SLOTS.map((slot) =>
                    projectsBySlot.get(slot)
                ).filter((project): project is NonNullable<typeof project> =>
                    Boolean(project)
                ),
            });
        }

        const projects = await prisma.listing.findMany({
            where,
            include: includeConfig,
            orderBy: fallbackProjectsOrderBy,
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
