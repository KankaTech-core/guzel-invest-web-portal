import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

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

        // Update listing
        const listing = await prisma.listing.update({
            where: { id },
            data: {
                status: body.status,
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
                furnished: body.furnished ?? false,
                balcony: body.balcony ?? false,
                garden: body.garden ?? false,
                pool: body.pool ?? false,
                parking: body.parking ?? false,
                elevator: body.elevator ?? false,
                security: body.security ?? false,
                seaView: body.seaView ?? false,
                publishedAt:
                    body.status === "PUBLISHED" && existing.status !== "PUBLISHED"
                        ? new Date()
                        : existing.publishedAt,
            },
        });

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

        // Fetch updated listing with relations
        const updatedListing = await prisma.listing.findUnique({
            where: { id },
            include: {
                translations: true,
                media: {
                    orderBy: { order: "asc" },
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
