import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, PropertyType, SaleType, ListingStatus } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { replaceProjectMediaAssignments } from "@/lib/project-media-assignments";
import { prisma } from "@/lib/prisma";
import {
    getHomepageProjectRemovalError,
    parseHomepageProjectSlot,
} from "@/lib/homepage-project-carousel";
import {
    normalizeProjectIcon,
    normalizeProjectFeatureCategory,
    normalizeProjectStatus,
    normalizeProjectText,
} from "@/lib/projects";
import { resolveGoogleMapsLink } from "@/lib/google-maps";

interface RouteParams {
    params: Promise<{ id: string }>;
}

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

const UpdateProjectSchema = z.object({
    status: z.string().optional(),
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
    translations: z.array(LocaleTextSchema).optional(),
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

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const project = await prisma.listing.findFirst({
            where: { id, isProject: true },
            include: {
                translations: true,
                media: {
                    orderBy: [{ isCover: "desc" }, { order: "asc" }],
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
                            orderBy: { order: "asc" },
                        },
                    },
                },
                projectUnits: {
                    orderBy: { rooms: "asc" },
                    include: {
                        translations: true,
                        media: {
                            orderBy: { order: "asc" },
                        },
                    },
                },
                floorPlans: {
                    include: { translations: true },
                },
                faqs: {
                    orderBy: { order: "asc" },
                    include: { translations: true },
                },
            },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const existing = await prisma.listing.findFirst({
            where: { id, isProject: true },
            select: {
                id: true,
                status: true,
                city: true,
                district: true,
                homepageProjectSlot: true,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = UpdateProjectSchema.safeParse(body);
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
        const mapLinkProvided = payload.googleMapsLink !== undefined;
        const mapLatitudeProvided = payload.latitude !== undefined;
        const mapLongitudeProvided = payload.longitude !== undefined;
        const rawGoogleMapsLink = mapLinkProvided
            ? normalizeProjectText(payload.googleMapsLink || "")
            : null;
        const resolvedGoogleMaps =
            mapLinkProvided && rawGoogleMapsLink
                ? await resolveGoogleMapsLink(rawGoogleMapsLink)
                : null;
        const nextGoogleMapsLink = mapLinkProvided
            ? resolvedGoogleMaps?.link ?? rawGoogleMapsLink
            : undefined;
        const inferredLatitude = resolvedGoogleMaps?.coordinates?.latitude;
        const inferredLongitude = resolvedGoogleMaps?.coordinates?.longitude;
        const nextLatitude = mapLatitudeProvided
            ? toNumberOrNull(payload.latitude)
            : inferredLatitude;
        const nextLongitude = mapLongitudeProvided
            ? toNumberOrNull(payload.longitude)
            : inferredLongitude;
        const status = normalizeProjectStatus(payload.status, existing.status);
        const safeStatus =
            status === ListingStatus.REMOVED ? existing.status : status;
        const requestedHomepageProjectSlot = parseHomepageProjectSlot(
            payload.homepageProjectSlot
        );

        if (requestedHomepageProjectSlot === "invalid") {
            return NextResponse.json(
                { error: "Homepage project slot must be 1, 2, or 3." },
                { status: 400 }
            );
        }

        const nextHomepageProjectSlot =
            safeStatus !== ListingStatus.PUBLISHED
                ? null
                : payload.homepageProjectSlot !== undefined
                    ? requestedHomepageProjectSlot
                    : existing.homepageProjectSlot;

        if (
            payload.homepageProjectSlot !== undefined &&
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

        const homepageProjectRemovalError = getHomepageProjectRemovalError({
            shouldSelect: nextHomepageProjectSlot !== null,
            selectedCount: await prisma.listing.count({
                where: {
                    isProject: true,
                    status: ListingStatus.PUBLISHED,
                    homepageProjectSlot: { not: null },
                },
            }),
            isAlreadySelected: existing.homepageProjectSlot !== null,
        });

        if (homepageProjectRemovalError) {
            return NextResponse.json(
                { error: homepageProjectRemovalError },
                { status: 409 }
            );
        }

        await prisma.$transaction(async (tx) => {
            if (nextHomepageProjectSlot !== null) {
                await tx.listing.updateMany({
                    where: {
                        isProject: true,
                        homepageProjectSlot: nextHomepageProjectSlot,
                        id: { not: id },
                    },
                    data: {
                        homepageProjectSlot: null,
                        showOnHomepageHero: false,
                    },
                });
            }

            await tx.listing.update({
                where: { id },
                data: {
                    status: safeStatus,
                    type: isPropertyType(payload.type) ? payload.type : undefined,
                    saleType: isSaleType(payload.saleType) ? payload.saleType : undefined,
                    company:
                        payload.company !== undefined
                            ? normalizeProjectText(payload.company) || "Güzel Invest"
                            : undefined,
                    city:
                        payload.city !== undefined
                            ? normalizeProjectText(payload.city) || existing.city
                            : undefined,
                    district:
                        payload.district !== undefined
                            ? normalizeProjectText(payload.district) || existing.district
                            : undefined,
                    neighborhood:
                        payload.neighborhood !== undefined
                            ? normalizeProjectText(payload.neighborhood || "")
                            : undefined,
                    address:
                        payload.address !== undefined
                            ? normalizeProjectText(payload.address || "")
                            : undefined,
                    googleMapsLink: nextGoogleMapsLink,
                    latitude: nextLatitude,
                    longitude: nextLongitude,
                    projectType:
                        payload.projectType !== undefined
                            ? normalizeProjectText(payload.projectType || "")
                            : undefined,
                    deliveryDate:
                        payload.deliveryDate !== undefined
                            ? normalizeProjectText(payload.deliveryDate || "")
                            : undefined,
                    price:
                        payload.price !== undefined
                            ? new Prisma.Decimal(
                                Number.isFinite(payload.price) ? payload.price : 0
                            )
                            : undefined,
                    area:
                        payload.area !== undefined
                            ? Number.isFinite(payload.area)
                                ? Math.max(0, Math.trunc(payload.area))
                                : 0
                            : undefined,
                    hasLastUnitsBanner:
                        payload.hasLastUnitsBanner !== undefined
                            ? payload.hasLastUnitsBanner
                            : undefined,
                    homepageProjectSlot: nextHomepageProjectSlot,
                    showOnHomepageHero: nextHomepageProjectSlot !== null,
                },
            });

            if (payload.promoVideoUrl !== undefined) {
                await tx.media.deleteMany({
                    where: { listingId: id, type: "VIDEO", category: "PROMO" },
                });

                if (payload.promoVideoUrl) {
                    await tx.media.create({
                        data: {
                            listingId: id,
                            type: "VIDEO",
                            category: "PROMO",
                            url: payload.promoVideoUrl.trim(),
                            order: 0,
                            isCover: false,
                        },
                    });
                }
            }

            if (payload.translations) {
                for (const translation of payload.translations) {
                    const locale = translation.locale.trim().toLowerCase();
                    const title = filterTranslationTitle(translation.title);
                    if (!locale || !title) continue;

                    await tx.listingTranslation.upsert({
                        where: {
                            listingId_locale: {
                                listingId: id,
                                locale,
                            },
                        },
                        update: {
                            title,
                            description:
                                normalizeProjectText(translation.description || "") || "",
                            promoVideoTitle: normalizeProjectText(translation.promoVideoTitle || "") || null,
                            features: (translation.features || [])
                                .map((item) => normalizeProjectText(item))
                                .filter((item): item is string => Boolean(item))
                                .slice(0, 40),
                        },
                        create: {
                            listingId: id,
                            locale,
                            title,
                            description:
                                normalizeProjectText(translation.description || "") || "",
                            promoVideoTitle: normalizeProjectText(translation.promoVideoTitle || "") || null,
                            features: (translation.features || [])
                                .map((item) => normalizeProjectText(item))
                                .filter((item): item is string => Boolean(item))
                                .slice(0, 40),
                        },
                    });
                }
            }

            if (payload.projectFeatures) {
                await replaceProjectFeatures(tx, id, payload.projectFeatures);
            }
            if (payload.customGalleries) {
                await replaceCustomGalleries(tx, id, payload.customGalleries);
            }
            if (payload.projectUnits) {
                await replaceProjectUnits(tx, id, payload.projectUnits);
            }
            if (payload.floorPlans) {
                await replaceFloorPlans(tx, id, payload.floorPlans);
            }
            if (payload.faqs) {
                await replaceFaqs(tx, id, payload.faqs);
            }
            await replaceProjectMediaAssignments(tx, id, {
                exteriorMediaIds: payload.exteriorMediaIds,
                interiorMediaIds: payload.interiorMediaIds,
                mapMediaIds: payload.mapMediaIds,
                documentMediaIds: payload.documentMediaIds,
                logoMediaIds: payload.logoMediaIds,
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const existing = await prisma.listing.findFirst({
            where: { id, isProject: true },
            select: {
                id: true,
                homepageProjectSlot: true,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const homepageProjectRemovalError = getHomepageProjectRemovalError({
            shouldSelect: false,
            selectedCount: await prisma.listing.count({
                where: {
                    isProject: true,
                    status: ListingStatus.PUBLISHED,
                    homepageProjectSlot: { not: null },
                },
            }),
            isAlreadySelected: existing.homepageProjectSlot !== null,
        });

        if (homepageProjectRemovalError) {
            return NextResponse.json(
                { error: homepageProjectRemovalError },
                { status: 409 }
            );
        }

        await prisma.listing.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
