import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildListingSku, generateListingSlug } from "@/lib/utils";
import { PropertyType, ListingStatus } from "@/generated/prisma";
import { buildAdminListingsWhere } from "@/lib/admin-listings";
import { resolveGoogleMapsLink } from "@/lib/google-maps";

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

const toBoolean = (value: unknown): boolean => value === true;
const HOMEPAGE_HERO_SLOTS = [1, 2, 3] as const;
type HomepageHeroSlot = (typeof HOMEPAGE_HERO_SLOTS)[number];

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

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Admin and Editor can create listings
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const rawGoogleMapsLink = normalizeOptionalText(body.googleMapsLink);
        const resolvedGoogleMaps = rawGoogleMapsLink
            ? await resolveGoogleMapsLink(rawGoogleMapsLink)
            : null;
        const latitude =
            toNullableNumber(body.latitude) ??
            resolvedGoogleMaps?.coordinates?.latitude ??
            null;
        const longitude =
            toNullableNumber(body.longitude) ??
            resolvedGoogleMaps?.coordinates?.longitude ??
            null;
        const googleMapsLink = resolvedGoogleMaps?.link ?? rawGoogleMapsLink;

        // Validate required fields
        const requiredFields = ["type", "saleType", "city", "district", "price", "area"];
        for (const field of requiredFields) {
            if (body[field] === undefined || body[field] === null || body[field] === "") {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Get Turkish translation for slug generation
        const trTranslation = body.translations?.find(
            (t: { locale: string; title: string }) => t.locale === "tr"
        );
        const title = trTranslation?.title || "ilan";

        // Generate unique slug
        const slug = generateListingSlug(title, body.city, body.type);
        const company = normalizeOptionalText(body.company) || "Güzel Invest";
        const nextStatus = (body.status || "DRAFT") as ListingStatus;
        const requestedHomepageHeroSlot =
            body.homepageHeroSlot !== undefined
                ? parseHomepageHeroSlot(body.homepageHeroSlot)
                : toBoolean(body.showOnHomepageHero)
                    ? 1
                    : null;

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

        console.log("Creating listing with body:", JSON.stringify(body, null, 2));

        // Create listing with translations
        const listing = await prisma.$transaction(async (tx) => {
            const serial = await tx.listingSerial.create({ data: {} });
            const sku = buildListingSku(body.city, serial.id);

            await tx.listingCompanyOption.upsert({
                where: { name: company },
                update: {},
                create: { name: company },
            });

            if (requestedHomepageHeroSlot !== null) {
                await tx.listing.updateMany({
                    where: { homepageHeroSlot: requestedHomepageHeroSlot },
                    data: {
                        homepageHeroSlot: null,
                        showOnHomepageHero: false,
                    },
                });
            }

            return tx.listing.create({
                data: {
                    slug,
                    sku,
                    status: nextStatus,
                    type: body.type,
                    saleType: body.saleType,
                    company,
                    city: body.city,
                    district: body.district,
                    neighborhood: body.neighborhood || null,
                    address: body.address || null,
                    googleMapsLink,
                    latitude,
                    longitude,
                    price: body.price.toString(), // Convert to string for Decimal field
                    currency: body.currency || "EUR",
                    area: Number(body.area),
                    rooms: body.rooms !== null && body.rooms !== undefined ? body.rooms.toString() : null,
                    bedrooms: toNullableNumber(body.bedrooms),
                    bathrooms: toNullableNumber(body.bathrooms),
                    wcCount: toNullableNumber(body.wcCount),
                    floor: toNullableNumber(body.floor),
                    totalFloors: toNullableNumber(body.totalFloors),
                    buildYear: toNullableNumber(body.buildYear),
                    heating: body.heating || null,
                    furnished: toBoolean(body.furnished),
                    balcony: toBoolean(body.balcony),
                    garden: toBoolean(body.garden),
                    pool: toBoolean(body.pool),
                    parking: toBoolean(body.parking),
                    elevator: toBoolean(body.elevator),
                    security: toBoolean(body.security),
                    seaView: toBoolean(body.seaView),
                    // Land-specific
                    parcelNo: body.parcelNo || null,
                    emsal: body.emsal !== null && body.emsal !== undefined ? Number(body.emsal) : null,
                    zoningStatus: body.zoningStatus || null,
                    // Commercial-specific
                    groundFloorArea: toNullableNumber(body.groundFloorArea),
                    basementArea: toNullableNumber(body.basementArea),
                    // Farm-specific
                    hasWaterSource: toBoolean(body.hasWaterSource),
                    hasFruitTrees: toBoolean(body.hasFruitTrees),
                    existingStructure: body.existingStructure || null,
                    // Eligibility
                    citizenshipEligible: toBoolean(body.citizenshipEligible),
                    residenceEligible: toBoolean(body.residenceEligible),
                    publishToHepsiemlak: toBoolean(body.publishToHepsiemlak),
                    publishToSahibinden: toBoolean(body.publishToSahibinden),
                    showOnHomepageHero: requestedHomepageHeroSlot !== null,
                    homepageHeroSlot: requestedHomepageHeroSlot,
                    createdById: session.userId,
                    translations: {
                        create: (body.translations || [])
                            .filter((t: { title: string }) => t.title)
                            .map((t: { locale: string; title: string; description: string; features?: string[] }) => ({
                                locale: t.locale,
                                title: t.title,
                                description: t.description || "",
                                features: t.features || [],
                            })),
                    },
                    tags: body.tags && body.tags.length > 0 ? {
                        create: body.tags.map((tag: { id: string }) => ({
                            tagId: tag.id
                        }))
                    } : undefined,
                },
                include: {
                    translations: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                },
            });
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating listing:", error);
        const details = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to create listing", details },
            { status: 500 }
        );
    }
}

// GET /api/admin/listings - List all listings
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const type = searchParams.get("type");

        const where = buildAdminListingsWhere({
            status: status ? (status as ListingStatus) : undefined,
            type: type ? (type as PropertyType) : undefined,
        });

        const listings = await prisma.listing.findMany({
            where,
            include: {
                translations: {
                    where: { locale: "tr" },
                },
                media: {
                    take: 1,
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(listings);
    } catch (error) {
        console.error("Error fetching listings:", error);
        return NextResponse.json(
            { error: "Failed to fetch listings" },
            { status: 500 }
        );
    }
}
