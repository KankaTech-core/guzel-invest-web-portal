import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PropertyType, ListingStatus } from "@/generated/prisma";

// POST /api/admin/export - Create export and generate CSV
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only Admin and Editor can export
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const filters = body.filters || {};

        // Build query filters
        const where: {
            status?: ListingStatus;
            type?: PropertyType;
            createdAt?: { gte?: Date; lte?: Date };
        } = {};

        if (filters.status) {
            where.status = filters.status as ListingStatus;
        }
        if (filters.type) {
            where.type = filters.type as PropertyType;
        }
        if (filters.startDate || filters.endDate) {
            where.createdAt = {};
            if (filters.startDate) {
                where.createdAt.gte = new Date(filters.startDate);
            }
            if (filters.endDate) {
                where.createdAt.lte = new Date(filters.endDate);
            }
        }

        // Fetch listings
        const listings = await prisma.listing.findMany({
            where,
            include: {
                translations: {
                    where: { locale: "tr" },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Generate CSV content
        const headers = [
            "ID",
            "SKU",
            "Slug",
            "Başlık",
            "Durum",
            "Tür",
            "Satış Tipi",
            "Firma",
            "Hepsiemlak",
            "Sahibinden",
            "Şehir",
            "İlçe",
            "Fiyat",
            "Para Birimi",
            "Alan (m²)",
            "Oda",
            "Yatak Odası",
            "Banyo",
            "WC",
            "Kat",
            "Yapım Yılı",
            "Eşyalı",
            "Balkon",
            "Bahçe",
            "Havuz",
            "Otopark",
            "Asansör",
            "Güvenlik",
            "Deniz Manzarası",
            "Oluşturulma Tarihi",
        ];

        const rows = listings.map((listing) => {
            const title = listing.translations[0]?.title || "";
            const statusLabel =
                listing.status === "PUBLISHED"
                    ? "Yayında"
                    : listing.status === "DRAFT"
                        ? "Taslak"
                        : listing.status === "REMOVED"
                            ? "Kaldırıldı"
                            : "Arşiv";
            const typeLabels: Record<string, string> = {
                APARTMENT: "Daire",
                VILLA: "Villa",
                PENTHOUSE: "Penthouse",
                LAND: "Arsa",
                COMMERCIAL: "Ticari",
                OFFICE: "Ofis",
                SHOP: "Dükkan",
                FARM: "Çiftlik",
            };
            const saleTypeLabels: Record<string, string> = {
                SALE: "Satılık",
                RENT: "Kiralık",
            };

            return [
                listing.id,
                listing.sku || "",
                listing.slug,
                `"${title.replace(/"/g, '""')}"`,
                statusLabel,
                typeLabels[listing.type] || listing.type,
                saleTypeLabels[listing.saleType] || listing.saleType,
                listing.company || "",
                listing.publishToHepsiemlak ? "Evet" : "Hayır",
                listing.publishToSahibinden ? "Evet" : "Hayır",
                listing.city,
                listing.district,
                listing.price.toString(),
                listing.currency,
                listing.area.toString(),
                listing.rooms?.toString() || "",
                listing.bedrooms?.toString() || "",
                listing.bathrooms?.toString() || "",
                listing.wcCount?.toString() || "",
                listing.floor?.toString() || "",
                listing.buildYear?.toString() || "",
                listing.furnished ? "Evet" : "Hayır",
                listing.balcony ? "Evet" : "Hayır",
                listing.garden ? "Evet" : "Hayır",
                listing.pool ? "Evet" : "Hayır",
                listing.parking ? "Evet" : "Hayır",
                listing.elevator ? "Evet" : "Hayır",
                listing.security ? "Evet" : "Hayır",
                listing.seaView ? "Evet" : "Hayır",
                listing.createdAt.toISOString().split("T")[0],
            ];
        });

        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join(
            "\n"
        );

        // Add BOM for Excel compatibility with Turkish characters
        const bom = "\uFEFF";
        const csvWithBom = bom + csvContent;

        // Create export job record
        const exportJob = await prisma.exportJob.create({
            data: {
                type: "csv",
                status: "COMPLETED",
                filters: filters,
                rowCount: listings.length,
                createdById: session.userId,
                completedAt: new Date(),
            },
        });

        // Return CSV as download
        return new NextResponse(csvWithBom, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="ilanlar-${exportJob.id}.csv"`,
            },
        });
    } catch (error) {
        console.error("Error exporting listings:", error);
        return NextResponse.json(
            { error: "Failed to export listings" },
            { status: 500 }
        );
    }
}

// GET /api/admin/export - List export jobs
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const exportJobs = await prisma.exportJob.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                createdBy: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(exportJobs);
    } catch (error) {
        console.error("Error fetching export jobs:", error);
        return NextResponse.json(
            { error: "Failed to fetch export jobs" },
            { status: 500 }
        );
    }
}
