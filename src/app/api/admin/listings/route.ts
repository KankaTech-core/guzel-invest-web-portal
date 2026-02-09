import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildListingSku, generateListingSlug } from "@/lib/utils";
import { PropertyType, ListingStatus } from "@/generated/prisma";

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

            return tx.listing.create({
                data: {
                    slug,
                    sku,
                    status: body.status || "DRAFT",
                    type: body.type,
                    saleType: body.saleType,
                    company,
                    city: body.city,
                    district: body.district,
                    neighborhood: body.neighborhood || null,
                    address: body.address || null,
                    googleMapsLink: body.googleMapsLink || null,
                    latitude: toNullableNumber(body.latitude),
                    longitude: toNullableNumber(body.longitude),
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

        const where: {
            status?: ListingStatus;
            type?: PropertyType;
        } = {};
        if (status) where.status = status as ListingStatus;
        if (type) where.type = type as PropertyType;

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
