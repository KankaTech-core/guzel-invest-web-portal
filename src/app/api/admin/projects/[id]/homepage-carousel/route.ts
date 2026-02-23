import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    findFirstAvailableHomepageProjectSlot,
    getHomepageProjectSelectionError,
} from "@/lib/homepage-project-carousel";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const parseShow = (value: unknown): boolean | "invalid" => {
    if (typeof value === "boolean") {
        return value;
    }
    return "invalid";
};

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json().catch(() => ({}));
        const shouldSelect = parseShow(body?.show);

        if (shouldSelect === "invalid") {
            return NextResponse.json(
                { error: "show must be a boolean." },
                { status: 400 }
            );
        }

        const existing = await prisma.listing.findFirst({
            where: { id, isProject: true },
            select: {
                id: true,
                status: true,
                showOnHomepageHero: true,
                homepageProjectSlot: true,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const selectedCount = await prisma.listing.count({
            where: {
                isProject: true,
                homepageProjectSlot: { not: null },
                status: "PUBLISHED",
            },
        });

        const selectionError = getHomepageProjectSelectionError({
            shouldSelect,
            isPublished: existing.status === "PUBLISHED",
            selectedCount,
            isAlreadySelected: existing.homepageProjectSlot !== null,
        });

        if (selectionError) {
            return NextResponse.json(
                { error: selectionError },
                {
                    status:
                        shouldSelect && existing.status === "PUBLISHED"
                            ? 409
                            : 400,
                }
            );
        }

        if (shouldSelect && existing.homepageProjectSlot === null) {
            const selectedProjects = await prisma.listing.findMany({
                where: {
                    isProject: true,
                    status: "PUBLISHED",
                    homepageProjectSlot: { not: null },
                },
                select: {
                    homepageProjectSlot: true,
                },
                orderBy: { homepageProjectSlot: "asc" },
            });

            const firstAvailableSlot = findFirstAvailableHomepageProjectSlot(
                selectedProjects
                    .map((item) => item.homepageProjectSlot)
                    .filter((slot): slot is number => typeof slot === "number")
            );

            if (firstAvailableSlot === null) {
                return NextResponse.json(
                    { error: "En fazla 3 proje ana sayfa carousel'inde gösterilebilir." },
                    { status: 409 }
                );
            }
        }

        const project = await prisma.$transaction(async (tx) => {
            if (!shouldSelect) {
                return tx.listing.update({
                    where: { id },
                    data: {
                        showOnHomepageHero: false,
                        homepageProjectSlot: null,
                    },
                    select: {
                        id: true,
                        showOnHomepageHero: true,
                        homepageProjectSlot: true,
                    },
                });
            }

            if (existing.homepageProjectSlot !== null) {
                return tx.listing.update({
                    where: { id },
                    data: {
                        showOnHomepageHero: true,
                    },
                    select: {
                        id: true,
                        showOnHomepageHero: true,
                        homepageProjectSlot: true,
                    },
                });
            }

            const selectedProjects = await tx.listing.findMany({
                where: {
                    isProject: true,
                    status: "PUBLISHED",
                    homepageProjectSlot: { not: null },
                },
                select: {
                    homepageProjectSlot: true,
                },
                orderBy: { homepageProjectSlot: "asc" },
            });

            const firstAvailableSlot = findFirstAvailableHomepageProjectSlot(
                selectedProjects
                    .map((item) => item.homepageProjectSlot)
                    .filter((slot): slot is number => typeof slot === "number")
            );

            if (firstAvailableSlot === null) {
                return tx.listing.update({
                    where: { id },
                    data: {
                        showOnHomepageHero: false,
                        homepageProjectSlot: null,
                    },
                    select: {
                        id: true,
                        showOnHomepageHero: true,
                        homepageProjectSlot: true,
                    },
                });
            }

            await tx.listing.updateMany({
                where: {
                    isProject: true,
                    homepageProjectSlot: firstAvailableSlot,
                },
                data: {
                    showOnHomepageHero: false,
                    homepageProjectSlot: null,
                },
            });

            return tx.listing.update({
                where: { id },
                data: {
                    showOnHomepageHero: true,
                    homepageProjectSlot: firstAvailableSlot,
                },
                select: {
                    id: true,
                    showOnHomepageHero: true,
                    homepageProjectSlot: true,
                },
            });
        });

        return NextResponse.json({ project });
    } catch (error) {
        console.error("Error updating project homepage carousel selection:", error);
        return NextResponse.json(
            { error: "Failed to update homepage carousel selection" },
            { status: 500 }
        );
    }
}
