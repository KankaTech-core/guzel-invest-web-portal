import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    ListingStatus,
    PropertyType,
    type Prisma,
} from "@/generated/prisma";
import {
    encodeCsvWithBom,
    serializeMediaColumns,
    buildPublicMediaUrl,
} from "@/lib/admin-csv-transfer";

const EXPORT_ENTITIES = ["listings", "projects", "articles"] as const;
type ExportEntity = (typeof EXPORT_ENTITIES)[number];

type FilterMap = Record<string, string>;

const normalizeExportEntity = (value: unknown): ExportEntity => {
    const normalized = typeof value === "string" ? value.toLowerCase() : "";
    return EXPORT_ENTITIES.includes(normalized as ExportEntity)
        ? (normalized as ExportEntity)
        : "listings";
};

const normalizeFilters = (value: unknown): FilterMap => {
    if (!value || typeof value !== "object") return {};

    const input = value as Record<string, unknown>;
    const output: FilterMap = {};

    Object.entries(input).forEach(([key, raw]) => {
        if (typeof raw !== "string") return;
        const trimmed = raw.trim();
        if (!trimmed) return;
        output[key] = trimmed;
    });

    return output;
};

const isListingStatus = (value: string): value is ListingStatus =>
    Object.values(ListingStatus).includes(value as ListingStatus);

const isPropertyType = (value: string): value is PropertyType =>
    Object.values(PropertyType).includes(value as PropertyType);

const buildDateRangeFilter = (filters: FilterMap): Prisma.DateTimeFilter | undefined => {
    const { startDate, endDate } = filters;
    if (!startDate && !endDate) return undefined;

    const createdAt: Prisma.DateTimeFilter = {};

    if (startDate) {
        const parsed = new Date(startDate);
        if (!Number.isNaN(parsed.getTime())) {
            createdAt.gte = parsed;
        }
    }

    if (endDate) {
        const parsed = new Date(endDate);
        if (!Number.isNaN(parsed.getTime())) {
            parsed.setHours(23, 59, 59, 999);
            createdAt.lte = parsed;
        }
    }

    return Object.keys(createdAt).length > 0 ? createdAt : undefined;
};

const toCsvBoolean = (value: boolean): string => (value ? "true" : "false");

const buildListingsCsv = async (filters: FilterMap, isProject: boolean) => {
    const where: Prisma.ListingWhereInput = {
        isProject,
    };

    if (filters.status && isListingStatus(filters.status)) {
        where.status = filters.status;
    }

    if (filters.type && isPropertyType(filters.type)) {
        where.type = filters.type;
    }

    const createdAt = buildDateRangeFilter(filters);
    if (createdAt) {
        where.createdAt = createdAt;
    }

    const listings = await prisma.listing.findMany({
        where,
        include: {
            translations: true,
            media: {
                orderBy: [{ isCover: "desc" }, { order: "asc" }],
            },
            tags: {
                include: {
                    tag: true,
                },
            },
            projectFeatures: {
                orderBy: { order: "asc" },
                include: { translations: true },
            },
            customGalleries: {
                orderBy: { order: "asc" },
                include: {
                    translations: true,
                    media: {
                        orderBy: [{ isCover: "desc" }, { order: "asc" }],
                    },
                },
            },
            projectUnits: {
                include: {
                    translations: true,
                    media: {
                        orderBy: [{ isCover: "desc" }, { order: "asc" }],
                    },
                },
                orderBy: [{ rooms: "asc" }],
            },
            floorPlans: {
                include: {
                    translations: true,
                },
            },
            faqs: {
                include: {
                    translations: true,
                },
                orderBy: { order: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    const headers = [
        "entity",
        "id",
        "sku",
        "slug",
        "status",
        "type",
        "sale_type",
        "company",
        "city",
        "district",
        "neighborhood",
        "address",
        "google_maps_link",
        "latitude",
        "longitude",
        "price",
        "currency",
        "area",
        "rooms",
        "bedrooms",
        "bathrooms",
        "wc_count",
        "floor",
        "total_floors",
        "build_year",
        "furnished",
        "balcony",
        "garden",
        "pool",
        "parking",
        "elevator",
        "security",
        "sea_view",
        "citizenship_eligible",
        "residence_eligible",
        "publish_to_hepsiemlak",
        "publish_to_sahibinden",
        "homepage_hero_slot",
        "homepage_project_slot",
        "project_type",
        "delivery_date",
        "title_tr",
        "description_tr",
        "features_tr_json",
        "translations_json",
        "tags_json",
        "media_urls",
        "media_payload_json",
        "project_features_json",
        "custom_galleries_json",
        "project_units_json",
        "floor_plans_json",
        "faqs_json",
        "created_at",
        "updated_at",
    ];

    const rows = listings.map((listing) => {
        const trTranslation =
            listing.translations.find((translation) => translation.locale === "tr") ||
            listing.translations[0];
        const mediaColumns = serializeMediaColumns(listing.media);

        const customGalleriesJson = isProject
            ? JSON.stringify(
                  listing.customGalleries.map((gallery) => ({
                      order: gallery.order,
                      translations: gallery.translations,
                      mediaUrls: gallery.media.map((item) => buildPublicMediaUrl(item.url)),
                  }))
              )
            : "[]";

        const projectUnitsJson = isProject
            ? JSON.stringify(
                  listing.projectUnits.map((unit) => ({
                      rooms: unit.rooms,
                      area: unit.area,
                      price: unit.price?.toString() ?? null,
                      translations: unit.translations,
                      mediaUrls: unit.media.map((item) => buildPublicMediaUrl(item.url)),
                  }))
              )
            : "[]";

        return [
            isProject ? "project" : "listing",
            listing.id,
            listing.sku || "",
            listing.slug,
            listing.status,
            listing.type,
            listing.saleType,
            listing.company,
            listing.city,
            listing.district,
            listing.neighborhood || "",
            listing.address || "",
            listing.googleMapsLink || "",
            listing.latitude ?? "",
            listing.longitude ?? "",
            listing.price.toString(),
            listing.currency,
            listing.area,
            listing.rooms || "",
            listing.bedrooms ?? "",
            listing.bathrooms ?? "",
            listing.wcCount ?? "",
            listing.floor ?? "",
            listing.totalFloors ?? "",
            listing.buildYear ?? "",
            toCsvBoolean(listing.furnished),
            toCsvBoolean(listing.balcony),
            toCsvBoolean(listing.garden),
            toCsvBoolean(listing.pool),
            toCsvBoolean(listing.parking),
            toCsvBoolean(listing.elevator),
            toCsvBoolean(listing.security),
            toCsvBoolean(listing.seaView),
            toCsvBoolean(listing.citizenshipEligible),
            toCsvBoolean(listing.residenceEligible),
            toCsvBoolean(listing.publishToHepsiemlak),
            toCsvBoolean(listing.publishToSahibinden),
            listing.homepageHeroSlot ?? "",
            listing.homepageProjectSlot ?? "",
            listing.projectType || "",
            listing.deliveryDate || "",
            trTranslation?.title || "",
            trTranslation?.description || "",
            JSON.stringify(trTranslation?.features || []),
            JSON.stringify(listing.translations),
            JSON.stringify(listing.tags.map((item) => item.tag.name)),
            mediaColumns.mediaUrls,
            mediaColumns.mediaPayloadJson,
            isProject ? JSON.stringify(listing.projectFeatures) : "[]",
            customGalleriesJson,
            projectUnitsJson,
            isProject ? JSON.stringify(listing.floorPlans) : "[]",
            isProject ? JSON.stringify(listing.faqs) : "[]",
            listing.createdAt.toISOString(),
            listing.updatedAt.toISOString(),
        ];
    });

    return {
        headers,
        rows,
        rowCount: rows.length,
        fileNamePrefix: isProject ? "projeler" : "ilanlar",
    };
};

const buildArticlesCsv = async (filters: FilterMap) => {
    const where: Prisma.ArticleWhereInput = {};

    const createdAt = buildDateRangeFilter(filters);
    if (createdAt) {
        where.createdAt = createdAt;
    }

    if (filters.status) {
        const normalizedStatus = filters.status.toUpperCase();
        if (["DRAFT", "PUBLISHED", "ARCHIVED", "REMOVED"].includes(normalizedStatus)) {
            where.status = normalizedStatus as Prisma.ArticleWhereInput["status"];
        }
    }

    if (filters.category) {
        where.category = filters.category;
    }

    const articles = await prisma.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    const headers = [
        "entity",
        "id",
        "slug",
        "status",
        "title",
        "excerpt",
        "content_html",
        "category",
        "tags_json",
        "cover_image_url",
        "cover_thumbnail_url",
        "published_at",
        "created_at",
        "updated_at",
    ];

    const rows = articles.map((article) => [
        "article",
        article.id,
        article.slug,
        article.status,
        article.title,
        article.excerpt || "",
        article.content,
        article.category || "",
        JSON.stringify(article.tags || []),
        article.coverImageUrl ? buildPublicMediaUrl(article.coverImageUrl) : "",
        article.coverThumbnailUrl ? buildPublicMediaUrl(article.coverThumbnailUrl) : "",
        article.publishedAt?.toISOString() || "",
        article.createdAt.toISOString(),
        article.updatedAt.toISOString(),
    ]);

    return {
        headers,
        rows,
        rowCount: rows.length,
        fileNamePrefix: "makaleler",
    };
};

const buildExportPayload = async (entity: ExportEntity, filters: FilterMap) => {
    if (entity === "projects") {
        return buildListingsCsv(filters, true);
    }

    if (entity === "articles") {
        return buildArticlesCsv(filters);
    }

    return buildListingsCsv(filters, false);
};

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
        const entity = normalizeExportEntity(body?.entity);
        const filters = normalizeFilters(body?.filters);

        const payload = await buildExportPayload(entity, filters);
        const csvWithBom = encodeCsvWithBom(payload.headers, payload.rows);

        // Create export job record
        const exportJob = await prisma.exportJob.create({
            data: {
                type: `csv:${entity}`,
                status: "COMPLETED",
                filters,
                fileName: `${payload.fileNamePrefix}.csv`,
                rowCount: payload.rowCount,
                createdById: session.userId,
                completedAt: new Date(),
            },
        });

        const fileName = `${payload.fileNamePrefix}-${exportJob.id}.csv`;

        // Return CSV as download
        return new NextResponse(csvWithBom, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error("Error exporting CSV:", error);
        return NextResponse.json(
            { error: "Failed to export CSV" },
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
            take: 40,
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
