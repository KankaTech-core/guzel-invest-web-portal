import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateListingSlug } from "@/lib/utils";
import { PropertyType, ListingStatus } from "@/generated/prisma";

// POST /api/admin/listings - Create new listing
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
            if (!body[field]) {
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

        // Create listing with translations
        const listing = await prisma.listing.create({
            data: {
                slug,
                status: body.status || "DRAFT",
                type: body.type,
                saleType: body.saleType,
                city: body.city,
                district: body.district,
                neighborhood: body.neighborhood || null,
                address: body.address || null,
                latitude: body.latitude || null,
                longitude: body.longitude || null,
                price: body.price,
                currency: body.currency || "EUR",
                area: body.area,
                rooms: body.rooms || null,
                bedrooms: body.bedrooms || null,
                bathrooms: body.bathrooms || null,
                floor: body.floor || null,
                totalFloors: body.totalFloors || null,
                buildYear: body.buildYear || null,
                heating: body.heating || null,
                furnished: body.furnished || false,
                balcony: body.balcony || false,
                garden: body.garden || false,
                pool: body.pool || false,
                parking: body.parking || false,
                elevator: body.elevator || false,
                security: body.security || false,
                seaView: body.seaView || false,
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
            },
            include: {
                translations: true,
            },
        });

        return NextResponse.json(listing, { status: 201 });
    } catch (error) {
        console.error("Error creating listing:", error);
        return NextResponse.json(
            { error: "Failed to create listing" },
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
