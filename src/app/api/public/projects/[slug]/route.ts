import { NextRequest, NextResponse } from "next/server";
import { ListingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get("locale") || "tr";
        const localeFallbacks = Array.from(new Set([locale, "tr"]));

        const project = await prisma.listing.findFirst({
            where: {
                slug,
                isProject: true,
                status: {
                    in: [ListingStatus.PUBLISHED, ListingStatus.ARCHIVED],
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
                    orderBy: [{ isCover: "desc" }, { order: "asc" }],
                },
                projectFeatures: {
                    orderBy: { order: "asc" },
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
                customGalleries: {
                    orderBy: { order: "asc" },
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
                        media: {
                            orderBy: { order: "asc" },
                        },
                    },
                },
                floorPlans: {
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
                faqs: {
                    orderBy: { order: "asc" },
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
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error("Public project detail API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}
