import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, PropertyType, SaleType, ListingStatus } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { replaceProjectMediaAssignments } from "@/lib/project-media-assignments";
import { prisma } from "@/lib/prisma";
import { parseHomepageProjectSlot } from "@/lib/homepage-project-carousel";
import {
    getProjectSlugBase,
    normalizeProjectIcon,
    normalizeProjectFeatureCategory,
    normalizeProjectStatus,
    normalizeProjectText,
} from "@/lib/projects";
import { slugify } from "@/lib/utils";
import { resolveGoogleMapsLink } from "@/lib/google-maps";

const LocaleTextSchema = z.object({
    locale: z.string().min(2),
    title: z.string().optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    promoVideoTitle: z.string().optional(),
});

const ProjectFeatureSchema = z.object({
    icon: z.string().optional(),
    category: z.string().optional(),
    order: z.number().int().optional(),
    translations: z.array(
        z.object({
            locale: z.string().min(2),
            title: z.string().optional(),
        })
    ),
});

const CustomGallerySchema = z.object({
    order: z.number().int().optional(),
    mediaIds: z.array(z.string()).optional(),
    translations: z.array(
        z.object({
            locale: z.string().min(2),
            title: z.string().optional(),
            subtitle: z.string().nullable().optional(),
        })
    ),
});

const ProjectUnitSchema = z.object({
    rooms: z.string().optional(),
    area: z.number().nullable().optional(),
    price: z.number().nullable().optional(),
    mediaIds: z.array(z.string()).optional(),
    translations: z.array(
        z.object({
            locale: z.string().min(2),
            title: z.string().nullable().optional(),
        })
    ),
});

const FloorPlanSchema = z.object({
    imageUrl: z.string().optional(),
    area: z.string().nullable().optional(),
    translations: z.array(
        z.object({
            locale: z.string().min(2),
            title: z.string().optional(),
        })
    ),
});

const FaqSchema = z.object({
    order: z.number().int().optional(),
    translations: z.array(
        z.object({
            locale: z.string().min(2),
            question: z.string().optional(),
            answer: z.string().optional(),
        })
    ),
});

const CreateProjectSchema = z.object({
    status: z.string().optional(),
    slug: z.string().optional(),
    type: z.string().optional(),
    saleType: z.string().optional(),
    company: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    neighborhood: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    googleMapsLink: z.string().nullable().optional(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    projectType: z.string().nullable().optional(),
    deliveryDate: z.string().nullable().optional(),
    price: z.number().optional(),
    area: z.number().optional(),
    translations: z.array(LocaleTextSchema).default([]),
    projectFeatures: z.array(ProjectFeatureSchema).optional(),
    customGalleries: z.array(CustomGallerySchema).optional(),
    projectUnits: z.array(ProjectUnitSchema).optional(),
    floorPlans: z.array(FloorPlanSchema).optional(),
    faqs: z.array(FaqSchema).optional(),
    exteriorMediaIds: z.array(z.string()).optional(),
    interiorMediaIds: z.array(z.string()).optional(),
    mapMediaIds: z.array(z.string()).optional(),
    documentMediaIds: z.array(z.string()).optional(),
    logoMediaIds: z.array(z.string()).optional(),
    homepageProjectSlot: z.number().int().nullable().optional(),
    hasLastUnitsBanner: z.boolean().optional(),
    promoVideoUrl: z.string().nullable().optional(),
});

const isPropertyType = (value: unknown): value is PropertyType =>
    Object.values(PropertyType).includes(value as PropertyType);

const isSaleType = (value: unknown): value is SaleType =>
    Object.values(SaleType).includes(value as SaleType);

const ensureUniqueSlug = async (baseSlug: string): Promise<string> => {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
        const existing = await prisma.listing.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!existing) {
            return slug;
        }
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }
};

const toNumberOrNull = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    return null;
};

const filterTranslationTitle = (value: string | undefined | null) => {
    const normalized = normalizeProjectText(value);
    return normalized ? normalized.slice(0, 400) : null;
};

async function replaceProjectFeatures(
    tx: Prisma.TransactionClient,
    listingId: string,
    features: z.infer<typeof ProjectFeatureSchema>[]
) {
    await tx.projectFeatureTranslation.deleteMany({
        where: {
            feature: { listingId },
        },
    });
    await tx.projectFeature.deleteMany({ where: { listingId } });

    for (const [index, item] of features.entries()) {
        const icon = normalizeProjectIcon(item.icon);
        const translations = (item.translations || [])
            .map((translation) => ({
                locale: translation.locale.trim().toLowerCase(),
                title: filterTranslationTitle(translation.title),
            }))
            .filter((translation) => translation.locale && translation.title);

        if (translations.length === 0) continue;

        const feature = await tx.projectFeature.create({
            data: {
                listingId,
                icon,
                category: normalizeProjectFeatureCategory(item.category),
                order: item.order ?? index,
            },
        });

        if (translations.length > 0) {
            await tx.projectFeatureTranslation.createMany({
                data: translations.map((translation) => ({
                    featureId: feature.id,
                    locale: translation.locale,
                    title: translation.title!,
                })),
            });
        }
    }
}

async function replaceCustomGalleries(
    tx: Prisma.TransactionClient,
    listingId: string,
    galleries: z.infer<typeof CustomGallerySchema>[]
) {
    await tx.media.updateMany({
        where: {
            listingId,
            customGalleryId: { not: null },
        },
        data: { customGalleryId: null },
    });

    await tx.customGalleryTranslation.deleteMany({
        where: {
            gallery: { listingId },
        },
    });
    await tx.customGallery.deleteMany({ where: { listingId } });

    for (const [index, item] of galleries.entries()) {
        const translations = (item.translations || [])
            .map((translation) => ({
                locale: translation.locale.trim().toLowerCase(),
                title: filterTranslationTitle(translation.title),
                subtitle: normalizeProjectText(translation.subtitle || "")?.slice(0, 400),
            }))
            .filter((translation) => translation.locale && translation.title);

        if (translations.length === 0) continue;

        const gallery = await tx.customGallery.create({
            data: {
                listingId,
                order: item.order ?? index,
            },
        });

        await tx.customGalleryTranslation.createMany({
            data: translations.map((translation) => ({
                galleryId: gallery.id,
                locale: translation.locale,
                title: translation.title!,
                subtitle: translation.subtitle ?? null,
            })),
        });

        const mediaIds = (item.mediaIds || []).filter(Boolean);
        if (mediaIds.length > 0) {
            await tx.media.updateMany({
                where: {
                    listingId,
                    id: { in: mediaIds },
                },
                data: {
                    customGalleryId: gallery.id,
                    projectUnitId: null,
                },
            });
        }
    }
}

async function replaceProjectUnits(
    tx: Prisma.TransactionClient,
    listingId: string,
    units: z.infer<typeof ProjectUnitSchema>[]
) {
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

    for (const item of units) {
        const rooms = normalizeProjectText(item.rooms);
        if (!rooms) continue;

        const unit = await tx.projectUnit.create({
            data: {
                listingId,
                rooms,
                area: toNumberOrNull(item.area) ?? null,
                price:
                    typeof item.price === "number" && Number.isFinite(item.price)
                        ? new Prisma.Decimal(item.price)
                        : null,
            },
        });

        const translations = (item.translations || [])
            .map((translation) => ({
                locale: translation.locale.trim().toLowerCase(),
                title: normalizeProjectText(translation.title || "")?.slice(0, 300),
            }))
            .filter((translation) => translation.locale);

        if (translations.length > 0) {
            await tx.projectUnitTranslation.createMany({
                data: translations.map((translation) => ({
                    unitId: unit.id,
                    locale: translation.locale,
                    title: translation.title ?? null,
                })),
            });
        }

        const mediaIds = (item.mediaIds || []).filter(Boolean);
        if (mediaIds.length > 0) {
            await tx.media.updateMany({
                where: {
                    listingId,
                    id: { in: mediaIds },
                },
                data: {
                    projectUnitId: unit.id,
                    customGalleryId: null,
                },
            });
        }
    }
}

async function replaceFloorPlans(
    tx: Prisma.TransactionClient,
    listingId: string,
    plans: z.infer<typeof FloorPlanSchema>[]
) {
    await tx.floorPlanTranslation.deleteMany({
        where: { floorPlan: { listingId } },
    });
    await tx.floorPlan.deleteMany({ where: { listingId } });

    for (const item of plans) {
        const imageUrl = normalizeProjectText(item.imageUrl);
        if (!imageUrl) continue;

        const plan = await tx.floorPlan.create({
            data: {
                listingId,
                imageUrl,
                area: normalizeProjectText(item.area || ""),
            },
        });

        const translations = (item.translations || [])
            .map((translation) => ({
                locale: translation.locale.trim().toLowerCase(),
                title: filterTranslationTitle(translation.title),
            }))
            .filter((translation) => translation.locale && translation.title);

        if (translations.length > 0) {
            await tx.floorPlanTranslation.createMany({
                data: translations.map((translation) => ({
                    floorPlanId: plan.id,
                    locale: translation.locale,
                    title: translation.title!,
                })),
            });
        }
    }
}

async function replaceFaqs(
    tx: Prisma.TransactionClient,
    listingId: string,
    faqs: z.infer<typeof FaqSchema>[]
) {
    await tx.listingFAQTranslation.deleteMany({
        where: { faq: { listingId } },
    });
    await tx.listingFAQ.deleteMany({ where: { listingId } });

    for (const [index, item] of faqs.entries()) {
        const translations = (item.translations || [])
            .map((translation) => ({
                locale: translation.locale.trim().toLowerCase(),
                question: normalizeProjectText(translation.question || "")?.slice(0, 400),
                answer: normalizeProjectText(translation.answer || "")?.slice(0, 3000),
            }))
            .filter(
                (translation) =>
                    translation.locale && translation.question && translation.answer
            );

        if (translations.length === 0) continue;

        const faq = await tx.listingFAQ.create({
            data: {
                listingId,
                order: item.order ?? index,
            },
        });

        await tx.listingFAQTranslation.createMany({
            data: translations.map((translation) => ({
                faqId: faq.id,
                locale: translation.locale,
                question: translation.question!,
                answer: translation.answer!,
            })),
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const parsed = CreateProjectSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid project payload",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const payload = parsed.data;
        const trTranslation = payload.translations.find((item) => item.locale === "tr");
        const projectTitle = normalizeProjectText(trTranslation?.title);

        if (!projectTitle) {
            return NextResponse.json(
                { error: "Türkçe proje başlığı zorunludur." },
                { status: 400 }
            );
        }

        const city = normalizeProjectText(payload.city);
        const district = normalizeProjectText(payload.district);
        if (!city || !district) {
            return NextResponse.json(
                { error: "Şehir ve ilçe zorunludur." },
                { status: 400 }
            );
        }

        const baseSlug =
            normalizeProjectText(payload.slug) &&
                slugify(normalizeProjectText(payload.slug)!)
                ? slugify(normalizeProjectText(payload.slug)!)
                : getProjectSlugBase(projectTitle, city);
        const slug = await ensureUniqueSlug(baseSlug);

        const status = normalizeProjectStatus(payload.status, ListingStatus.DRAFT);
        const safeStatus =
            status === ListingStatus.REMOVED ? ListingStatus.DRAFT : status;
        const requestedHomepageProjectSlot = parseHomepageProjectSlot(
            payload.homepageProjectSlot
        );

        if (requestedHomepageProjectSlot === "invalid") {
            return NextResponse.json(
                { error: "Homepage project slot must be 1, 2, or 3." },
                { status: 400 }
            );
        }

        if (
            requestedHomepageProjectSlot !== null &&
            safeStatus !== ListingStatus.PUBLISHED
        ) {
            return NextResponse.json(
                {
                    error: "Ana sayfada göstermek için proje yayında olmalıdır.",
                },
                { status: 400 }
            );
        }
        const propertyType = isPropertyType(payload.type)
            ? payload.type
            : PropertyType.APARTMENT;
        const saleType = isSaleType(payload.saleType)
            ? payload.saleType
            : SaleType.SALE;
        const rawGoogleMapsLink = normalizeProjectText(payload.googleMapsLink || "");
        const resolvedGoogleMaps = rawGoogleMapsLink
            ? await resolveGoogleMapsLink(rawGoogleMapsLink)
            : null;
        const latitude =
            toNumberOrNull(payload.latitude) ??
            resolvedGoogleMaps?.coordinates?.latitude ??
            null;
        const longitude =
            toNumberOrNull(payload.longitude) ??
            resolvedGoogleMaps?.coordinates?.longitude ??
            null;
        const googleMapsLink = resolvedGoogleMaps?.link ?? rawGoogleMapsLink;

        const listing = await prisma.$transaction(async (tx) => {
            if (requestedHomepageProjectSlot !== null) {
                await tx.listing.updateMany({
                    where: {
                        isProject: true,
                        homepageProjectSlot: requestedHomepageProjectSlot,
                    },
                    data: {
                        homepageProjectSlot: null,
                        showOnHomepageHero: false,
                    },
                });
            }

            const created = await tx.listing.create({
                data: {
                    slug,
                    status: safeStatus,
                    type: propertyType,
                    saleType,
                    company:
                        normalizeProjectText(payload.company)?.slice(0, 120) ||
                        "Güzel Invest",
                    city,
                    district,
                    neighborhood: normalizeProjectText(payload.neighborhood || ""),
                    address: normalizeProjectText(payload.address || ""),
                    googleMapsLink,
                    latitude,
                    longitude,
                    price: new Prisma.Decimal(
                        typeof payload.price === "number" && Number.isFinite(payload.price)
                            ? payload.price
                            : 0
                    ),
                    currency: "EUR",
                    area:
                        typeof payload.area === "number" && Number.isFinite(payload.area)
                            ? Math.max(0, Math.trunc(payload.area))
                            : 0,
                    isProject: true,
                    hasLastUnitsBanner: payload.hasLastUnitsBanner ?? false,
                    showOnHomepageHero: requestedHomepageProjectSlot !== null,
                    homepageProjectSlot: requestedHomepageProjectSlot,
                    projectType: normalizeProjectText(payload.projectType || ""),
                    deliveryDate: normalizeProjectText(payload.deliveryDate || ""),
                    createdById: session.userId,
                },
            });

            if (payload.promoVideoUrl) {
                await tx.media.create({
                    data: {
                        listingId: created.id,
                        type: "VIDEO",
                        category: "PROMO",
                        url: payload.promoVideoUrl.trim(),
                        order: 0,
                        isCover: false,
                    },
                });
            }

            for (const translation of payload.translations) {
                const locale = translation.locale.trim().toLowerCase();
                const title = filterTranslationTitle(translation.title);
                if (!locale || !title) continue;

                await tx.listingTranslation.create({
                    data: {
                        listingId: created.id,
                        locale,
                        title,
                        description: normalizeProjectText(translation.description || "") || "",
                        promoVideoTitle: normalizeProjectText(translation.promoVideoTitle || "") || null,
                        features: (translation.features || [])
                            .map((item) => normalizeProjectText(item))
                            .filter((item): item is string => Boolean(item))
                            .slice(0, 40),
                    },
                });
            }

            await replaceProjectFeatures(
                tx,
                created.id,
                payload.projectFeatures || []
            );
            await replaceCustomGalleries(
                tx,
                created.id,
                payload.customGalleries || []
            );
            await replaceProjectUnits(tx, created.id, payload.projectUnits || []);
            await replaceFloorPlans(tx, created.id, payload.floorPlans || []);
            await replaceFaqs(tx, created.id, payload.faqs || []);
            await replaceProjectMediaAssignments(tx, created.id, {
                exteriorMediaIds: payload.exteriorMediaIds,
                interiorMediaIds: payload.interiorMediaIds,
                mapMediaIds: payload.mapMediaIds,
                documentMediaIds: payload.documentMediaIds,
                logoMediaIds: payload.logoMediaIds,
            });

            return created;
        });

        return NextResponse.json({ id: listing.id }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const where: Prisma.ListingWhereInput = {
            isProject: true,
        };

        if (
            status &&
            Object.values(ListingStatus).includes(status as ListingStatus)
        ) {
            where.status = status as ListingStatus;
        }

        const projects = await prisma.listing.findMany({
            where,
            include: {
                translations: {
                    where: { locale: "tr" },
                    take: 1,
                },
                _count: {
                    select: {
                        projectUnits: true,
                        customGalleries: true,
                        floorPlans: true,
                    },
                },
            },
            orderBy: [{ updatedAt: "desc" }],
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
