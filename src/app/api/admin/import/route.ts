import { NextRequest, NextResponse } from "next/server";
import {
    ArticleStatus,
    ListingStatus,
    MediaType,
    PropertyType,
    SaleType,
    type Prisma,
} from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import {
    mapCsvRows,
    normalizeStoredMediaPath,
    parseBooleanCell,
    parseCsv,
    parseJsonCell,
    parseMediaColumns,
    parseNumberCell,
    type CsvMediaRecord,
} from "@/lib/admin-csv-transfer";
import {
    getArticleSlugBase,
    normalizeArticleCategory,
    normalizeArticleSlug,
    normalizeArticleTags,
    resolveArticleExcerpt,
    sanitizeArticleContent,
    toArticleStatusOrDefault,
} from "@/lib/articles";
import { replaceProjectMediaAssignments } from "@/lib/project-media-assignments";
import {
    normalizeProjectFeatureCategory,
    normalizeProjectIcon,
    normalizeProjectStatus,
    normalizeProjectText,
} from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import { buildListingSku, generateListingSlug, slugify } from "@/lib/utils";

export const runtime = "nodejs";

const IMPORT_ENTITIES = ["listings", "projects", "articles"] as const;
type ImportEntity = (typeof IMPORT_ENTITIES)[number];

type ImportOutcome = "created" | "updated";

interface ImportResultSummary {
    created: number;
    updated: number;
    failed: number;
    errors: Array<{ row: number; message: string }>;
}

interface ImportTranslation {
    locale: string;
    title: string;
    description: string;
    features: string[];
}

const isPropertyType = (value: string): value is PropertyType =>
    Object.values(PropertyType).includes(value as PropertyType);

const isSaleType = (value: string): value is SaleType =>
    Object.values(SaleType).includes(value as SaleType);

const normalizeImportEntity = (value: unknown): ImportEntity | null => {
    if (typeof value !== "string") return null;
    const normalized = value.toLowerCase().trim();
    if (IMPORT_ENTITIES.includes(normalized as ImportEntity)) {
        return normalized as ImportEntity;
    }

    if (normalized === "listing") return "listings";
    if (normalized === "project") return "projects";
    if (normalized === "article") return "articles";

    return null;
};

const parseImportEntity = (
    explicitEntity: unknown,
    rows: Array<Record<string, string>>
): ImportEntity => {
    const explicit = normalizeImportEntity(explicitEntity);
    if (explicit) return explicit;

    const firstRowEntity = rows[0]?.entity;
    const inferred = normalizeImportEntity(firstRowEntity);
    return inferred || "listings";
};

const toNullableString = (value: string | null | undefined): string | null => {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
};

const toNullableNumber = (value: string | null | undefined): number | null => {
    const parsed = parseNumberCell(value, Number.NaN);
    return Number.isFinite(parsed) ? parsed : null;
};

const toInteger = (value: string | null | undefined, fallback = 0): number => {
    const parsed = parseNumberCell(value, fallback);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.trunc(parsed);
};

const normalizeListingStatus = (
    value: string | null | undefined,
    fallback: ListingStatus
): ListingStatus => {
    const normalized = (value || "").trim().toUpperCase();
    if (Object.values(ListingStatus).includes(normalized as ListingStatus)) {
        return normalized as ListingStatus;
    }
    return fallback;
};

const normalizePropertyType = (
    value: string | null | undefined,
    fallback: PropertyType
): PropertyType => {
    const normalized = (value || "").trim().toUpperCase();
    return isPropertyType(normalized) ? normalized : fallback;
};

const normalizeSaleType = (
    value: string | null | undefined,
    fallback: SaleType
): SaleType => {
    const normalized = (value || "").trim().toUpperCase();
    return isSaleType(normalized) ? normalized : fallback;
};

const toStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];

    const unique = new Set<string>();

    value.forEach((item) => {
        if (typeof item !== "string") return;
        const trimmed = item.trim();
        if (!trimmed) return;
        unique.add(trimmed);
    });

    return Array.from(unique);
};

const parseTranslations = (row: Record<string, string>): ImportTranslation[] => {
    const fromJson = parseJsonCell<
        Array<{
            locale?: string;
            title?: string;
            description?: string;
            features?: string[];
        }>
    >(row.translations_json, []);

    const normalizedFromJson = fromJson
        .map((item) => {
            const locale = (item.locale || "").trim().toLowerCase();
            const title = (item.title || "").trim();
            if (!locale || !title) return null;

            return {
                locale,
                title,
                description: (item.description || "").trim(),
                features: toStringArray(item.features),
            } as ImportTranslation;
        })
        .filter((item): item is ImportTranslation => Boolean(item));

    if (normalizedFromJson.length > 0) {
        return normalizedFromJson;
    }

    const trTitle = (row.title_tr || row.title || "").trim();
    if (!trTitle) return [];

    return [
        {
            locale: "tr",
            title: trTitle,
            description: (row.description_tr || row.excerpt || "").trim(),
            features: toStringArray(parseJsonCell<unknown[]>(row.features_tr_json, [])),
        },
    ];
};

const ensureUniqueListingSlug = async (
    tx: Prisma.TransactionClient,
    baseSlug: string,
    existingId?: string
): Promise<string> => {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
        const existing = await tx.listing.findFirst({
            where: {
                slug,
                ...(existingId
                    ? {
                          id: {
                              not: existingId,
                          },
                      }
                    : {}),
            },
            select: { id: true },
        });

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
};

const ensureUniqueArticleSlug = async (
    tx: Prisma.TransactionClient,
    baseSlug: string,
    existingId?: string
): Promise<string> => {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
        const existing = await tx.article.findFirst({
            where: {
                slug,
                ...(existingId
                    ? {
                          id: {
                              not: existingId,
                          },
                      }
                    : {}),
            },
            select: { id: true },
        });

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
};

const resolveMediaType = (media: CsvMediaRecord): MediaType => {
    const normalizedType = (media.type || "").trim().toUpperCase();
    if (Object.values(MediaType).includes(normalizedType as MediaType)) {
        return normalizedType as MediaType;
    }

    const category = (media.category || "").trim().toUpperCase();
    return category === "DOCUMENT" ? MediaType.DOCUMENT : MediaType.IMAGE;
};

const replaceMediaRecords = async (
    tx: Prisma.TransactionClient,
    listingId: string,
    mediaItems: CsvMediaRecord[]
): Promise<Map<string, string>> => {
    await tx.media.deleteMany({ where: { listingId } });

    const mediaIdByPath = new Map<string, string>();

    for (const [index, item] of mediaItems.entries()) {
        const created = await tx.media.create({
            data: {
                listingId,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                order: Number.isFinite(item.order) ? item.order : index,
                isCover: item.isCover,
                category: item.category,
                type: resolveMediaType(item),
                aiTags: [],
            },
            select: { id: true, url: true },
        });

        mediaIdByPath.set(created.url, created.id);
    }

    return mediaIdByPath;
};

const replaceListingTags = async (
    tx: Prisma.TransactionClient,
    listingId: string,
    names: string[]
) => {
    await tx.listingTag.deleteMany({ where: { listingId } });

    const uniqueNames = Array.from(
        new Set(
            names
                .map((name) => name.trim())
                .filter(Boolean)
        )
    );

    if (uniqueNames.length === 0) return;

    const tagIds: string[] = [];

    for (const name of uniqueNames) {
        const tag = await tx.tag.upsert({
            where: { name },
            update: {},
            create: { name },
            select: { id: true },
        });
        tagIds.push(tag.id);
    }

    await tx.listingTag.createMany({
        data: tagIds.map((tagId) => ({ listingId, tagId })),
        skipDuplicates: true,
    });
};

const upsertListingTranslations = async (
    tx: Prisma.TransactionClient,
    listingId: string,
    translations: ImportTranslation[]
) => {
    for (const translation of translations) {
        if (!translation.title) continue;

        await tx.listingTranslation.upsert({
            where: {
                listingId_locale: {
                    listingId,
                    locale: translation.locale,
                },
            },
            update: {
                title: translation.title,
                description: translation.description,
                features: translation.features,
            },
            create: {
                listingId,
                locale: translation.locale,
                title: translation.title,
                description: translation.description,
                features: translation.features,
            },
        });
    }
};

const findExistingListing = async (
    tx: Prisma.TransactionClient,
    row: Record<string, string>,
    isProject: boolean
) => {
    if (row.id) {
        const byId = await tx.listing.findFirst({
            where: { id: row.id, isProject },
        });
        if (byId) return byId;
    }

    if (row.sku) {
        const bySku = await tx.listing.findFirst({
            where: { sku: row.sku, isProject },
        });
        if (bySku) return bySku;
    }

    if (row.slug) {
        const bySlug = await tx.listing.findFirst({
            where: { slug: row.slug, isProject },
        });
        if (bySlug) return bySlug;
    }

    return null;
};

const parseListingTagNames = (row: Record<string, string>) => {
    const tagsFromJson = toStringArray(parseJsonCell<unknown[]>(row.tags_json, []));
    return tagsFromJson;
};

const parseCsvMedia = (row: Record<string, string>) =>
    parseMediaColumns(row.media_urls, row.media_payload_json);

const parseProjectFeatures = (row: Record<string, string>) =>
    parseJsonCell<
        Array<{
            icon?: string;
            category?: string;
            order?: number;
            translations?: Array<{ locale?: string; title?: string }>;
        }>
    >(row.project_features_json, []);

const parseProjectCustomGalleries = (row: Record<string, string>) =>
    parseJsonCell<
        Array<{
            order?: number;
            translations?: Array<{
                locale?: string;
                title?: string;
                subtitle?: string | null;
            }>;
            mediaUrls?: string[];
        }>
    >(row.custom_galleries_json, []);

const parseProjectUnits = (row: Record<string, string>) =>
    parseJsonCell<
        Array<{
            rooms?: string;
            area?: number | null;
            price?: string | number | null;
            translations?: Array<{ locale?: string; title?: string | null }>;
            mediaUrls?: string[];
        }>
    >(row.project_units_json, []);

const parseProjectFloorPlans = (row: Record<string, string>) =>
    parseJsonCell<
        Array<{
            imageUrl?: string;
            area?: string | null;
            translations?: Array<{ locale?: string; title?: string }>;
        }>
    >(row.floor_plans_json, []);

const parseProjectFaqs = (row: Record<string, string>) =>
    parseJsonCell<
        Array<{
            order?: number;
            translations?: Array<{
                locale?: string;
                question?: string;
                answer?: string;
            }>;
        }>
    >(row.faqs_json, []);

const assignProjectMediaCategories = async (
    tx: Prisma.TransactionClient,
    listingId: string,
    mediaItems: CsvMediaRecord[],
    mediaIdByPath: Map<string, string>
) => {
    const assignments = {
        exteriorMediaIds: [] as string[],
        interiorMediaIds: [] as string[],
        mapMediaIds: [] as string[],
        documentMediaIds: [] as string[],
        logoMediaIds: [] as string[],
    };

    mediaItems.forEach((media) => {
        const mediaId = mediaIdByPath.get(media.url);
        if (!mediaId) return;

        const category = (media.category || "").trim().toUpperCase();

        if (category === "EXTERIOR") assignments.exteriorMediaIds.push(mediaId);
        if (category === "INTERIOR") assignments.interiorMediaIds.push(mediaId);
        if (category === "MAP") assignments.mapMediaIds.push(mediaId);
        if (category === "DOCUMENT") assignments.documentMediaIds.push(mediaId);
        if (category === "LOGO") assignments.logoMediaIds.push(mediaId);
    });

    await replaceProjectMediaAssignments(tx, listingId, assignments);
};

const replaceProjectDetails = async (
    tx: Prisma.TransactionClient,
    listingId: string,
    row: Record<string, string>,
    mediaIdByPath: Map<string, string>
) => {
    const projectFeatures = parseProjectFeatures(row);
    const customGalleries = parseProjectCustomGalleries(row);
    const projectUnits = parseProjectUnits(row);
    const floorPlans = parseProjectFloorPlans(row);
    const faqs = parseProjectFaqs(row);

    await tx.projectFeatureTranslation.deleteMany({
        where: { feature: { listingId } },
    });
    await tx.projectFeature.deleteMany({ where: { listingId } });

    for (const [index, feature] of projectFeatures.entries()) {
        const icon = normalizeProjectIcon(feature.icon);
        const translations = (feature.translations || [])
            .map((translation) => {
                const locale = (translation.locale || "").trim().toLowerCase();
                const title = normalizeProjectText(translation.title || "");
                if (!locale || !title) return null;
                return { locale, title };
            })
            .filter((item): item is { locale: string; title: string } => Boolean(item));

        if (translations.length === 0) continue;

        const createdFeature = await tx.projectFeature.create({
            data: {
                listingId,
                icon,
                category: normalizeProjectFeatureCategory(feature.category),
                order:
                    typeof feature.order === "number" && Number.isFinite(feature.order)
                        ? feature.order
                        : index,
            },
            select: { id: true },
        });

        await tx.projectFeatureTranslation.createMany({
            data: translations.map((translation) => ({
                featureId: createdFeature.id,
                locale: translation.locale,
                title: translation.title,
            })),
        });
    }

    await tx.media.updateMany({
        where: {
            listingId,
            customGalleryId: { not: null },
        },
        data: { customGalleryId: null },
    });

    await tx.customGalleryTranslation.deleteMany({
        where: { gallery: { listingId } },
    });
    await tx.customGallery.deleteMany({ where: { listingId } });

    for (const [index, gallery] of customGalleries.entries()) {
        const translations = (gallery.translations || [])
            .map((translation) => {
                const locale = (translation.locale || "").trim().toLowerCase();
                const title = normalizeProjectText(translation.title || "");
                if (!locale || !title) return null;

                return {
                    locale,
                    title,
                    subtitle: normalizeProjectText(translation.subtitle || ""),
                };
            })
            .filter(
                (
                    item
                ): item is { locale: string; title: string; subtitle: string | null } =>
                    Boolean(item)
            );

        if (translations.length === 0) continue;

        const createdGallery = await tx.customGallery.create({
            data: {
                listingId,
                order:
                    typeof gallery.order === "number" && Number.isFinite(gallery.order)
                        ? gallery.order
                        : index,
            },
            select: { id: true },
        });

        await tx.customGalleryTranslation.createMany({
            data: translations.map((translation) => ({
                galleryId: createdGallery.id,
                locale: translation.locale,
                title: translation.title,
                subtitle: translation.subtitle,
            })),
        });

        const mediaIds = (gallery.mediaUrls || [])
            .map((url) => normalizeStoredMediaPath(url))
            .map((path) => mediaIdByPath.get(path))
            .filter((id): id is string => Boolean(id));

        if (mediaIds.length > 0) {
            await tx.media.updateMany({
                where: {
                    listingId,
                    id: { in: mediaIds },
                },
                data: {
                    customGalleryId: createdGallery.id,
                    projectUnitId: null,
                },
            });
        }
    }

    await tx.media.updateMany({
        where: {
            listingId,
            projectUnitId: { not: null },
        },
        data: { projectUnitId: null },
    });

    await tx.projectUnitTranslation.deleteMany({
        where: { unit: { listingId } },
    });
    await tx.projectUnit.deleteMany({ where: { listingId } });

    for (const unit of projectUnits) {
        const rooms = normalizeProjectText(unit.rooms || "");
        if (!rooms) continue;

        const area =
            typeof unit.area === "number" && Number.isFinite(unit.area)
                ? Math.trunc(unit.area)
                : null;
        const parsedPrice =
            typeof unit.price === "number"
                ? unit.price
                : typeof unit.price === "string"
                  ? parseNumberCell(unit.price, Number.NaN)
                  : Number.NaN;

        const createdUnit = await tx.projectUnit.create({
            data: {
                listingId,
                rooms,
                area,
                price: Number.isFinite(parsedPrice) ? parsedPrice : null,
            },
            select: { id: true },
        });

        const translations = (unit.translations || [])
            .map((translation) => ({
                locale: (translation.locale || "").trim().toLowerCase(),
                title: normalizeProjectText(translation.title || ""),
            }))
            .filter((translation) => Boolean(translation.locale));

        if (translations.length > 0) {
            await tx.projectUnitTranslation.createMany({
                data: translations.map((translation) => ({
                    unitId: createdUnit.id,
                    locale: translation.locale,
                    title: translation.title,
                })),
            });
        }

        const mediaIds = (unit.mediaUrls || [])
            .map((url) => normalizeStoredMediaPath(url))
            .map((path) => mediaIdByPath.get(path))
            .filter((id): id is string => Boolean(id));

        if (mediaIds.length > 0) {
            await tx.media.updateMany({
                where: {
                    listingId,
                    id: { in: mediaIds },
                },
                data: {
                    projectUnitId: createdUnit.id,
                    customGalleryId: null,
                },
            });
        }
    }

    await tx.floorPlanTranslation.deleteMany({
        where: { floorPlan: { listingId } },
    });
    await tx.floorPlan.deleteMany({ where: { listingId } });

    for (const floorPlan of floorPlans) {
        const imageUrl = normalizeStoredMediaPath(floorPlan.imageUrl || "");
        if (!imageUrl) continue;

        const createdFloorPlan = await tx.floorPlan.create({
            data: {
                listingId,
                imageUrl,
                area: normalizeProjectText(floorPlan.area || ""),
            },
            select: { id: true },
        });

        const translations = (floorPlan.translations || [])
            .map((translation) => {
                const locale = (translation.locale || "").trim().toLowerCase();
                const title = normalizeProjectText(translation.title || "");
                if (!locale || !title) return null;
                return { locale, title };
            })
            .filter((item): item is { locale: string; title: string } => Boolean(item));

        if (translations.length > 0) {
            await tx.floorPlanTranslation.createMany({
                data: translations.map((translation) => ({
                    floorPlanId: createdFloorPlan.id,
                    locale: translation.locale,
                    title: translation.title,
                })),
            });
        }
    }

    await tx.listingFAQTranslation.deleteMany({
        where: { faq: { listingId } },
    });
    await tx.listingFAQ.deleteMany({ where: { listingId } });

    for (const [index, faq] of faqs.entries()) {
        const translations = (faq.translations || [])
            .map((translation) => {
                const locale = (translation.locale || "").trim().toLowerCase();
                const question = normalizeProjectText(translation.question || "");
                const answer = normalizeProjectText(translation.answer || "");
                if (!locale || !question || !answer) return null;

                return {
                    locale,
                    question,
                    answer,
                };
            })
            .filter(
                (
                    item
                ): item is { locale: string; question: string; answer: string } =>
                    Boolean(item)
            );

        if (translations.length === 0) continue;

        const createdFaq = await tx.listingFAQ.create({
            data: {
                listingId,
                order:
                    typeof faq.order === "number" && Number.isFinite(faq.order)
                        ? faq.order
                        : index,
            },
            select: { id: true },
        });

        await tx.listingFAQTranslation.createMany({
            data: translations.map((translation) => ({
                faqId: createdFaq.id,
                locale: translation.locale,
                question: translation.question,
                answer: translation.answer,
            })),
        });
    }
};

const importListingLikeRow = async (
    row: Record<string, string>,
    createdById: string,
    isProject: boolean
): Promise<ImportOutcome> => {
    return prisma.$transaction(async (tx) => {
        const existing = await findExistingListing(tx, row, isProject);

        const status = isProject
            ? normalizeProjectStatus(row.status, existing?.status ?? ListingStatus.DRAFT)
            : normalizeListingStatus(row.status, existing?.status ?? ListingStatus.DRAFT);
        const safeStatus = isProject && status === ListingStatus.REMOVED ? ListingStatus.DRAFT : status;

        const type = normalizePropertyType(row.type, existing?.type ?? PropertyType.APARTMENT);
        const saleType = normalizeSaleType(row.sale_type, existing?.saleType ?? SaleType.SALE);
        const city = (row.city || existing?.city || "Antalya").trim() || "Antalya";
        const district = (row.district || existing?.district || "Alanya").trim() || "Alanya";
        const translations = parseTranslations(row);
        const trTranslation = translations.find((translation) => translation.locale === "tr") || translations[0];

        const fallbackTitle = trTranslation?.title || (isProject ? "proje" : "ilan");
        const slugBase =
            normalizeProjectText(row.slug || "") ||
            (row.slug || "").trim() ||
            (isProject
                ? slugify(`${fallbackTitle}-${city}-proje`)
                : slugify(`${type}-${fallbackTitle}-${city}`));
        const normalizedBaseSlug = slugBase || generateListingSlug(fallbackTitle, city, type);

        const slug = await ensureUniqueListingSlug(
            tx,
            normalizedBaseSlug,
            existing?.id
        );

        let sku = toNullableString(row.sku);
        if (!sku) {
            sku = existing?.sku || null;
        }

        if (!sku) {
            const serial = await tx.listingSerial.create({ data: {} });
            sku = buildListingSku(city, serial.id);
        }

        const company = (row.company || existing?.company || "Güzel Invest").trim() || "Güzel Invest";
        const mediaItems = parseCsvMedia(row);

        const listingData: Prisma.ListingUncheckedCreateInput | Prisma.ListingUncheckedUpdateInput = {
            slug,
            sku,
            status: safeStatus,
            type,
            saleType,
            company,
            city,
            district,
            neighborhood:
                row.neighborhood !== undefined
                    ? toNullableString(row.neighborhood)
                    : existing?.neighborhood ?? null,
            address:
                row.address !== undefined
                    ? toNullableString(row.address)
                    : existing?.address ?? null,
            googleMapsLink:
                row.google_maps_link !== undefined
                    ? toNullableString(row.google_maps_link)
                    : existing?.googleMapsLink ?? null,
            latitude:
                row.latitude !== undefined
                    ? toNullableNumber(row.latitude)
                    : existing?.latitude ?? null,
            longitude:
                row.longitude !== undefined
                    ? toNullableNumber(row.longitude)
                    : existing?.longitude ?? null,
            price: parseNumberCell(row.price, Number(existing?.price ?? 0)),
            currency: (row.currency || existing?.currency || "EUR").trim() || "EUR",
            area: toInteger(row.area, existing?.area ?? 0),
            rooms:
                row.rooms !== undefined ? toNullableString(row.rooms) : existing?.rooms ?? null,
            bedrooms:
                row.bedrooms !== undefined
                    ? toNullableNumber(row.bedrooms)
                    : existing?.bedrooms ?? null,
            bathrooms:
                row.bathrooms !== undefined
                    ? toNullableNumber(row.bathrooms)
                    : existing?.bathrooms ?? null,
            wcCount:
                row.wc_count !== undefined
                    ? toNullableNumber(row.wc_count)
                    : existing?.wcCount ?? null,
            floor:
                row.floor !== undefined ? toNullableNumber(row.floor) : existing?.floor ?? null,
            totalFloors:
                row.total_floors !== undefined
                    ? toNullableNumber(row.total_floors)
                    : existing?.totalFloors ?? null,
            buildYear:
                row.build_year !== undefined
                    ? toNullableNumber(row.build_year)
                    : existing?.buildYear ?? null,
            furnished:
                row.furnished !== undefined
                    ? parseBooleanCell(row.furnished, existing?.furnished ?? false)
                    : existing?.furnished ?? false,
            balcony:
                row.balcony !== undefined
                    ? parseBooleanCell(row.balcony, existing?.balcony ?? false)
                    : existing?.balcony ?? false,
            garden:
                row.garden !== undefined
                    ? parseBooleanCell(row.garden, existing?.garden ?? false)
                    : existing?.garden ?? false,
            pool:
                row.pool !== undefined
                    ? parseBooleanCell(row.pool, existing?.pool ?? false)
                    : existing?.pool ?? false,
            parking:
                row.parking !== undefined
                    ? parseBooleanCell(row.parking, existing?.parking ?? false)
                    : existing?.parking ?? false,
            elevator:
                row.elevator !== undefined
                    ? parseBooleanCell(row.elevator, existing?.elevator ?? false)
                    : existing?.elevator ?? false,
            security:
                row.security !== undefined
                    ? parseBooleanCell(row.security, existing?.security ?? false)
                    : existing?.security ?? false,
            seaView:
                row.sea_view !== undefined
                    ? parseBooleanCell(row.sea_view, existing?.seaView ?? false)
                    : existing?.seaView ?? false,
            citizenshipEligible:
                row.citizenship_eligible !== undefined
                    ? parseBooleanCell(
                          row.citizenship_eligible,
                          existing?.citizenshipEligible ?? false
                      )
                    : existing?.citizenshipEligible ?? false,
            residenceEligible:
                row.residence_eligible !== undefined
                    ? parseBooleanCell(
                          row.residence_eligible,
                          existing?.residenceEligible ?? false
                      )
                    : existing?.residenceEligible ?? false,
            publishToHepsiemlak:
                row.publish_to_hepsiemlak !== undefined
                    ? parseBooleanCell(
                          row.publish_to_hepsiemlak,
                          existing?.publishToHepsiemlak ?? false
                      )
                    : existing?.publishToHepsiemlak ?? false,
            publishToSahibinden:
                row.publish_to_sahibinden !== undefined
                    ? parseBooleanCell(
                          row.publish_to_sahibinden,
                          existing?.publishToSahibinden ?? false
                      )
                    : existing?.publishToSahibinden ?? false,
            homepageHeroSlot:
                row.homepage_hero_slot !== undefined
                    ? toNullableNumber(row.homepage_hero_slot)
                    : existing?.homepageHeroSlot ?? null,
            homepageProjectSlot:
                row.homepage_project_slot !== undefined
                    ? toNullableNumber(row.homepage_project_slot)
                    : existing?.homepageProjectSlot ?? null,
            showOnHomepageHero:
                row.homepage_hero_slot !== undefined
                    ? Boolean(toNullableNumber(row.homepage_hero_slot))
                    : existing?.showOnHomepageHero ?? false,
            publishedAt:
                safeStatus === ListingStatus.PUBLISHED
                    ? existing?.publishedAt || new Date()
                    : existing?.publishedAt ?? null,
            isProject,
            projectType:
                row.project_type !== undefined
                    ? toNullableString(row.project_type)
                    : existing?.projectType ?? null,
            deliveryDate:
                row.delivery_date !== undefined
                    ? toNullableString(row.delivery_date)
                    : existing?.deliveryDate ?? null,
        };

        const listing = existing
            ? await tx.listing.update({
                  where: { id: existing.id },
                  data: listingData as Prisma.ListingUncheckedUpdateInput,
                  select: { id: true },
              })
            : await tx.listing.create({
                  data: {
                      ...(listingData as Prisma.ListingUncheckedCreateInput),
                      createdById,
                  },
                  select: { id: true },
              });

        await upsertListingTranslations(tx, listing.id, translations);
        await replaceListingTags(tx, listing.id, parseListingTagNames(row));

        const mediaIdByPath = await replaceMediaRecords(tx, listing.id, mediaItems);

        if (isProject) {
            await replaceProjectDetails(tx, listing.id, row, mediaIdByPath);
            await assignProjectMediaCategories(tx, listing.id, mediaItems, mediaIdByPath);
        }

        return existing ? "updated" : "created";
    });
};

const importArticleRow = async (
    row: Record<string, string>,
    createdById: string
): Promise<ImportOutcome> => {
    return prisma.$transaction(async (tx) => {
        let existing = null as Awaited<ReturnType<typeof tx.article.findUnique>>;

        if (row.id) {
            existing = await tx.article.findUnique({
                where: { id: row.id },
            });
        }

        if (!existing && row.slug) {
            existing = await tx.article.findUnique({
                where: { slug: row.slug },
            });
        }

        const title = (row.title || "").trim().slice(0, 180);
        if (!title) {
            throw new Error("Makale satırında başlık zorunlu.");
        }

        const baseSlug = normalizeArticleSlug(row.slug) || getArticleSlugBase(title);
        const slug = await ensureUniqueArticleSlug(tx, baseSlug, existing?.id);

        const status = toArticleStatusOrDefault(
            row.status,
            existing?.status || ArticleStatus.DRAFT
        ) as ArticleStatus;

        const sanitizedContent = sanitizeArticleContent(row.content_html || "<p></p>");
        const coverImage = normalizeStoredMediaPath(row.cover_image_url || "");
        const coverThumbnail = normalizeStoredMediaPath(row.cover_thumbnail_url || "");
        const tags = normalizeArticleTags(parseJsonCell<unknown[]>(row.tags_json, []), {
            maxTags: 20,
            maxTagLength: 40,
        });

        const payload: Prisma.ArticleUncheckedCreateInput | Prisma.ArticleUncheckedUpdateInput = {
            slug,
            status,
            title,
            excerpt: resolveArticleExcerpt(row.excerpt, sanitizedContent, 200),
            content: sanitizedContent,
            category: normalizeArticleCategory(row.category)?.slice(0, 80) || null,
            tags,
            coverImageUrl: coverImage || null,
            coverThumbnailUrl: coverThumbnail || null,
            publishedAt:
                status === ArticleStatus.PUBLISHED
                    ? existing?.publishedAt || new Date()
                    : existing?.publishedAt ?? null,
        };

        if (existing) {
            await tx.article.update({
                where: { id: existing.id },
                data: payload as Prisma.ArticleUncheckedUpdateInput,
            });
            return "updated";
        }

        await tx.article.create({
            data: {
                ...(payload as Prisma.ArticleUncheckedCreateInput),
                createdById,
            },
        });
        return "created";
    });
};

const runImport = async (
    entity: ImportEntity,
    rows: Array<Record<string, string>>,
    createdById: string
): Promise<ImportResultSummary> => {
    const summary: ImportResultSummary = {
        created: 0,
        updated: 0,
        failed: 0,
        errors: [],
    };

    for (const [index, row] of rows.entries()) {
        try {
            const outcome =
                entity === "articles"
                    ? await importArticleRow(row, createdById)
                    : await importListingLikeRow(
                          row,
                          createdById,
                          entity === "projects"
                      );

            if (outcome === "created") {
                summary.created += 1;
            } else {
                summary.updated += 1;
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            summary.failed += 1;
            summary.errors.push({ row: index + 2, message });
        }
    }

    return summary;
};

export async function POST(request: NextRequest) {
    let importJobId: string | null = null;

    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await request.formData();
        const fileCandidate = formData.get("file");

        if (!(fileCandidate instanceof File)) {
            return NextResponse.json(
                { error: "CSV dosyası zorunlu." },
                { status: 400 }
            );
        }

        const csvText = await fileCandidate.text();
        const rows = mapCsvRows(parseCsv(csvText));

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "CSV içinde işlenecek satır bulunamadı." },
                { status: 400 }
            );
        }

        const entity = parseImportEntity(formData.get("entity"), rows);

        const importJob = await prisma.exportJob.create({
            data: {
                type: `import:${entity}`,
                status: "PROCESSING",
                rowCount: rows.length,
                createdById: session.userId,
                filters: {
                    sourceFile: fileCandidate.name,
                },
            },
            select: { id: true },
        });
        importJobId = importJob.id;

        const summary = await runImport(entity, rows, session.userId);

        await prisma.exportJob.update({
            where: { id: importJob.id },
            data: {
                status: summary.failed > 0 ? "FAILED" : "COMPLETED",
                error:
                    summary.failed > 0
                        ? `${summary.failed} satır işlenemedi`
                        : null,
                completedAt: new Date(),
            },
        });

        return NextResponse.json({
            entity,
            total: rows.length,
            ...summary,
        });
    } catch (error) {
        if (importJobId) {
            await prisma.exportJob
                .update({
                    where: { id: importJobId },
                    data: {
                        status: "FAILED",
                        completedAt: new Date(),
                        error: error instanceof Error ? error.message : "Import failed",
                    },
                })
                .catch(() => {
                    // noop
                });
        }

        console.error("Error importing CSV:", error);
        return NextResponse.json(
            { error: "Failed to import CSV" },
            { status: 500 }
        );
    }
}
