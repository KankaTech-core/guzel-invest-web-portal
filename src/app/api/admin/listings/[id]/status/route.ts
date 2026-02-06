import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH /api/admin/listings/[id]/status - Update listing status only
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
        const status = body?.status as ListingStatus | undefined;

        if (!status || !Object.values(ListingStatus).includes(status)) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const existing = await prisma.listing.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        const listing = await prisma.listing.update({
            where: { id },
            data: {
                status,
                publishedAt:
                    status === "PUBLISHED" && existing.status !== "PUBLISHED"
                        ? new Date()
                        : existing.publishedAt,
            },
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Error updating listing status:", error);
        return NextResponse.json(
            { error: "Failed to update listing status" },
            { status: 500 }
        );
    }
}
