import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/minio";
import { ListingStatus } from "@/generated/prisma";
import { getHomepageHeroListingRemovalError } from "@/lib/homepage-hero-listings";
import { resolveGoogleMapsLink } from "@/lib/google-maps";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const HOMEPAGE_HERO_REMOVE_BLOCK_CODE = "HOMEPAGE_HERO_REMOVE_BLOCKED";
const HOMEPAGE_HERO_SLOTS = [1, 2, 3] as const;
type HomepageHeroSlot = (typeof HOMEPAGE_HERO_SLOTS)[number];

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

const parseHomepageHeroSlot = (
    value: unknown
): HomepageHeroSlot | null | "invalid" => {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
        return "invalid";
    }

    if (!HOMEPAGE_HERO_SLOTS.includes(parsed as HomepageHeroSlot)) {
        return "invalid";
    }

    return parsed as HomepageHeroSlot;
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

        const mapLinkProvided = body.googleMapsLink !== undefined;
        const mapLatitudeProvided = body.latitude !== undefined;
        const mapLongitudeProvided = body.longitude !== undefined;
        const rawGoogleMapsLink = mapLinkProvided
            ? normalizeOptionalText(body.googleMapsLink)
            : null;
        const resolvedGoogleMaps =
            mapLinkProvided && rawGoogleMapsLink
                ? await resolveGoogleMapsLink(rawGoogleMapsLink)
                : null;
        const nextGoogleMapsLink = mapLinkProvided
            ? resolvedGoogleMaps?.link ?? rawGoogleMapsLink
            : existing.googleMapsLink;
        const inferredLatitude = resolvedGoogleMaps?.coordinates?.latitude ?? null;
        const inferredLongitude = resolvedGoogleMaps?.coordinates?.longitude ?? null;
        const nextLatitude = mapLatitudeProvided
            ? toNullableNumber(body.latitude)
            : inferredLatitude ?? existing.latitude;
        const nextLongitude = mapLongitudeProvided
            ? toNullableNumber(body.longitude)
            : inferredLongitude ?? existing.longitude;

        const requestedCompany = normalizeOptionalText(body.company);
        const company = requestedCompany || existing.company || "Güzel Invest";
        const statusFromBody = body.status as ListingStatus | undefined;

        if (
            statusFromBody !== undefined &&
            !Object.values(ListingStatus).includes(statusFromBody)
        ) {
            return NextResponse.json(
                { error: "Geçersiz ilan durumu gönderildi." },
                { status: 400 }
            );
        }

        const nextStatus = statusFromBody ?? existing.status;

        if (
            nextStatus === ListingStatus.REMOVED &&
            existing.status !== ListingStatus.REMOVED
        ) {
            if (existing.status === ListingStatus.DRAFT) {
                return NextResponse.json(
                    {
                        error:
                            "Taslak ilanlar yayından kaldırılamaz. Taslak ilanlar yalnızca silinebilir.",
                    },
                    { status: 400 }
                );
            }

            if (existing.status !== ListingStatus.PUBLISHED) {
                return NextResponse.json(
                    { error: "Sadece yayındaki ilanlar kaldırılabilir." },
                    { status: 400 }
                );
            }

            if (existing.homepageHeroSlot !== null) {
                return NextResponse.json(
                    {
                        error:
                            "Bu ilan ana sayfada gösteriliyor. Yayından kaldırmadan önce ana sayfa için başka bir ilan seçin.",
                        code: HOMEPAGE_HERO_REMOVE_BLOCK_CODE,
                    },
                    { status: 409 }
                );
            }
        }

        const requestedHomepageHeroSlot =
            body.homepageHeroSlot !== undefined
                ? parseHomepageHeroSlot(body.homepageHeroSlot)
                : body.showOnHomepageHero !== undefined
                    ? body.showOnHomepageHero === true
                        ? 1
                        : null
                    : existing.homepageHeroSlot;

        if (requestedHomepageHeroSlot === "invalid") {
            return NextResponse.json(
                { error: "Ana sayfa slotu sadece 1, 2 veya 3 olabilir." },
                { status: 400 }
            );
        }

        if (
            requestedHomepageHeroSlot !== null &&
            nextStatus !== ListingStatus.PUBLISHED
        ) {
            return NextResponse.json(
                { error: "Ana sayfa için slot seçmek adına ilan yayında olmalıdır." },
                { status: 400 }
            );
        }

        const homepageHeroSlot =
            nextStatus === ListingStatus.PUBLISHED
                ? requestedHomepageHeroSlot
                : null;
        const showOnHomepageHero = homepageHeroSlot !== null;

        const homepageHeroRemovalError = getHomepageHeroListingRemovalError({
            requestedSlot: homepageHeroSlot,
            selectedCount: await prisma.listing.count({
                where: {
                    status: ListingStatus.PUBLISHED,
                    isProject: false,
                    homepageHeroSlot: { not: null },
                },
            }),
            isCurrentlySelected: existing.homepageHeroSlot !== null,
        });

        if (homepageHeroRemovalError) {
            return NextResponse.json(
                { error: homepageHeroRemovalError },
                { status: 409 }
            );
        }

        // Update listing
        await prisma.$transaction(async (tx) => {
            await tx.listingCompanyOption.upsert({
                where: { name: company },
                update: {},
                create: { name: company },
            });

            if (homepageHeroSlot !== null) {
                await tx.listing.updateMany({
                    where: {
                        homepageHeroSlot,
                        id: { not: id },
                    },
                    data: {
                        homepageHeroSlot: null,
                        showOnHomepageHero: false,
                    },
                });
            }

            return tx.listing.update({
                where: { id },
                data: {
                    sku: existing.sku, // immutable guard
                    status: nextStatus,
                    type: body.type ?? existing.type,
                    saleType: body.saleType ?? existing.saleType,
                    company,
                    city: body.city ?? existing.city,
                    district: body.district ?? existing.district,
                    neighborhood: body.neighborhood !== undefined ? body.neighborhood : existing.neighborhood,
                    address: body.address !== undefined ? body.address : existing.address,
                    googleMapsLink: nextGoogleMapsLink,
                    latitude: nextLatitude,
                    longitude: nextLongitude,
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
                    homepageHeroSlot,
                    publishedAt:
                        nextStatus === ListingStatus.PUBLISHED &&
                        existing.status !== ListingStatus.PUBLISHED
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

        const homepageHeroRemovalError = getHomepageHeroListingRemovalError({
            requestedSlot: null,
            selectedCount: await prisma.listing.count({
                where: {
                    status: ListingStatus.PUBLISHED,
                    isProject: false,
                    homepageHeroSlot: { not: null },
                },
            }),
            isCurrentlySelected: existing.homepageHeroSlot !== null,
        });

        if (homepageHeroRemovalError) {
            return NextResponse.json(
                { error: homepageHeroRemovalError },
                { status: 409 }
            );
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
