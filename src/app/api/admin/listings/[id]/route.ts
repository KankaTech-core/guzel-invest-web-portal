import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/minio";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const normalizeOptionalText = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

const toNullableNumber = (value: unknown): number | null => {
    if (value === undefined || value === null || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

interface MediaUpdateInput {
    id: string;
    order: number;
    isCover: boolean;
}

const normalizeMediaPayload = (value: unknown): MediaUpdateInput[] | null => {
    if (!Array.isArray(value)) return null;

    const normalized: MediaUpdateInput[] = [];

    value.forEach((entry, index) => {
        if (!entry || typeof entry !== "object") return;
        const item = entry as Record<string, unknown>;
        if (typeof item.id !== "string") return;

        const parsedOrder = Number(item.order);
        normalized.push({
            id: item.id,
            order: Number.isFinite(parsedOrder) ? parsedOrder : index,
            isCover: item.isCover === true,
        });
    });

    if (normalized.length > 0 && !normalized.some((item) => item.isCover)) {
        normalized[0].isCover = true;
    }

    return normalized;
};

// PATCH /api/admin/listings/[id] - Update listing
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Admin and Editor can update listings
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();

        // Check if listing exists
        const existing = await prisma.listing.findUnique({
            where: { id },
            include: { translations: true },
        });

        if (!existing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        const requestedCompany = normalizeOptionalText(body.company);
        const company = requestedCompany || existing.company || "Güzel Invest";
        const showOnHomepageHero =
            body.showOnHomepageHero !== undefined
                ? body.showOnHomepageHero === true
                : existing.showOnHomepageHero;

        // Update listing
        await prisma.$transaction(async (tx) => {
            await tx.listingCompanyOption.upsert({
                where: { name: company },
                update: {},
                create: { name: company },
            });

            if (showOnHomepageHero) {
                await tx.listing.updateMany({
                    where: {
                        showOnHomepageHero: true,
                        id: { not: id },
                    },
                    data: { showOnHomepageHero: false },
                });
            }

            return tx.listing.update({
                where: { id },
                data: {
                    sku: existing.sku, // immutable guard
                    status: body.status ?? existing.status,
                    type: body.type ?? existing.type,
                    saleType: body.saleType ?? existing.saleType,
                    company,
                    city: body.city ?? existing.city,
                    district: body.district ?? existing.district,
                    neighborhood: body.neighborhood !== undefined ? body.neighborhood : existing.neighborhood,
                    address: body.address !== undefined ? body.address : existing.address,
                    googleMapsLink: body.googleMapsLink !== undefined ? body.googleMapsLink : existing.googleMapsLink,
                    latitude: body.latitude !== undefined ? toNullableNumber(body.latitude) : existing.latitude,
                    longitude: body.longitude !== undefined ? toNullableNumber(body.longitude) : existing.longitude,
                    price: body.price !== undefined ? body.price.toString() : existing.price,
                    currency: body.currency ?? existing.currency,
                    area: body.area !== undefined ? Number(body.area) : existing.area,
                    rooms: body.rooms !== undefined ? (body.rooms !== null ? body.rooms.toString() : null) : existing.rooms,
                    bedrooms: body.bedrooms !== undefined ? toNullableNumber(body.bedrooms) : existing.bedrooms,
                    bathrooms: body.bathrooms !== undefined ? toNullableNumber(body.bathrooms) : existing.bathrooms,
                    wcCount: body.wcCount !== undefined ? toNullableNumber(body.wcCount) : existing.wcCount,
                    floor: body.floor !== undefined ? toNullableNumber(body.floor) : existing.floor,
                    totalFloors: body.totalFloors !== undefined ? toNullableNumber(body.totalFloors) : existing.totalFloors,
                    buildYear: body.buildYear !== undefined ? toNullableNumber(body.buildYear) : existing.buildYear,
                    heating: body.heating !== undefined ? body.heating : existing.heating,
                    furnished: body.furnished ?? existing.furnished,
                    balcony: body.balcony ?? existing.balcony,
                    garden: body.garden ?? existing.garden,
                    pool: body.pool ?? existing.pool,
                    parking: body.parking ?? existing.parking,
                    elevator: body.elevator ?? existing.elevator,
                    security: body.security ?? existing.security,
                    seaView: body.seaView ?? existing.seaView,
                    // Land-specific
                    parcelNo: body.parcelNo !== undefined ? body.parcelNo : existing.parcelNo,
                    emsal: body.emsal !== undefined ? (body.emsal !== null ? Number(body.emsal) : null) : existing.emsal,
                    zoningStatus: body.zoningStatus !== undefined ? body.zoningStatus : existing.zoningStatus,
                    // Commercial-specific
                    groundFloorArea: body.groundFloorArea !== undefined ? toNullableNumber(body.groundFloorArea) : existing.groundFloorArea,
                    basementArea: body.basementArea !== undefined ? toNullableNumber(body.basementArea) : existing.basementArea,
                    // Farm-specific
                    hasWaterSource: body.hasWaterSource ?? existing.hasWaterSource,
                    hasFruitTrees: body.hasFruitTrees ?? existing.hasFruitTrees,
                    existingStructure: body.existingStructure !== undefined ? body.existingStructure : existing.existingStructure,
                    // Eligibility
                    citizenshipEligible: body.citizenshipEligible ?? existing.citizenshipEligible,
                    residenceEligible: body.residenceEligible ?? existing.residenceEligible,
                    publishToHepsiemlak: body.publishToHepsiemlak ?? existing.publishToHepsiemlak,
                    publishToSahibinden: body.publishToSahibinden ?? existing.publishToSahibinden,
                    showOnHomepageHero,
                    publishedAt:
                        body.status === "PUBLISHED" && existing.status !== "PUBLISHED"
                            ? new Date()
                            : existing.publishedAt,
                },
            });
        });

        // Update tags if provided
        if (body.tags) {
            // Delete existing tag relations
            await prisma.listingTag.deleteMany({
                where: { listingId: id },
            });

            // Create new tag relations
            if (body.tags.length > 0) {
                await prisma.listingTag.createMany({
                    data: body.tags.map((tag: { id: string }) => ({
                        listingId: id,
                        tagId: tag.id,
                    })),
                });
            }
        }

        // Update translations
        if (body.translations) {
            for (const translation of body.translations) {
                if (!translation.title) continue;

                await prisma.listingTranslation.upsert({
                    where: {
                        listingId_locale: {
                            listingId: id,
                            locale: translation.locale,
                        },
                    },
                    update: {
                        title: translation.title,
                        description: translation.description || "",
                        features: translation.features || [],
                    },
                    create: {
                        listingId: id,
                        locale: translation.locale,
                        title: translation.title,
                        description: translation.description || "",
                        features: translation.features || [],
                    },
                });
            }
        }

        const mediaToCleanup: string[] = [];

        // Update media order/cover and remove media that user deleted in the form.
        const normalizedMedia = normalizeMediaPayload(body.media);
        if (normalizedMedia) {
            const existingMedia = await prisma.media.findMany({
                where: { listingId: id },
                select: { id: true, url: true },
            });

            const incomingMediaIds = new Set(normalizedMedia.map((item) => item.id));
            const removedMedia = existingMedia.filter((item) => !incomingMediaIds.has(item.id));

            if (removedMedia.length > 0) {
                await prisma.media.deleteMany({
                    where: {
                        listingId: id,
                        id: { in: removedMedia.map((item) => item.id) },
                    },
                });
                mediaToCleanup.push(...removedMedia.map((item) => item.url));
            }

            await Promise.all(
                normalizedMedia.map((item) =>
                    prisma.media.updateMany({
                        where: { id: item.id, listingId: id },
                        data: {
                            order: item.order,
                            isCover: item.isCover,
                        },
                    })
                )
            );
        }

        if (mediaToCleanup.length > 0) {
            await Promise.all(mediaToCleanup.map((url) => deleteImage(url)));
        }

        // Fetch updated listing with relations
        const updatedListing = await prisma.listing.findUnique({
            where: { id },
            include: {
                translations: true,
                media: {
                    orderBy: { order: "asc" },
                },
                tags: {
                    include: {
                        tag: true
                    }
                },
            },
        });

        return NextResponse.json(updatedListing);
    } catch (error) {
        console.error("Error updating listing:", error);
        return NextResponse.json(
            { error: "Failed to update listing" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/listings/[id] - Delete listing
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Admin can delete listings
        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Check if listing exists
        const existing = await prisma.listing.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        // Delete listing (cascade will delete translations, media, sync logs)
        await prisma.listing.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting listing:", error);
        return NextResponse.json(
            { error: "Failed to delete listing" },
            { status: 500 }
        );
    }
}

// GET /api/admin/listings/[id] - Get single listing
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                translations: true,
                media: {
                    orderBy: { order: "asc" },
                },
                tags: {
                    include: {
                        tag: true
                    }
                },
                syncLogs: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                },
            },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Error fetching listing:", error);
        return NextResponse.json(
            { error: "Failed to fetch listing" },
            { status: 500 }
        );
    }
}
