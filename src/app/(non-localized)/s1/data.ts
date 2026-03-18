import { ListingStatus } from "@/generated/prisma";
import { getTranslations } from "next-intl/server";
import { getDocumentNameFromMedia } from "@/lib/project-document-name";
import { selectProjectDocumentMedia } from "@/lib/project-document-selection";
import {
    getLocalizedFallbackLocales,
    pickLocalizedEntry,
} from "@/lib/public-content-localization";
import { prisma } from "@/lib/prisma";
import { translateFeature } from "@/lib/feature-translation-dictionary";
import { getMediaUrl, getProjectCategoryLabel } from "@/lib/utils";
import {
    S1CustomGalleryData,
    S1DocumentItem,
    S1FaqItem,
    S1FloorPlanItem,
    S1MapData,
    S1OtherProjectItem,
    S1ProjectPageData,
    S1RibbonItem,
    S1SocialFacilityItem,
    S1SummaryData,
} from "./types";

interface GetS1ProjectDataOptions {
    slug?: string | null;
    locale?: string;
}

const DEFAULT_LOCALE = "tr";
const SOCIAL_GALLERY_TITLE = "sosyal imkanlar";

const isNonEmptyString = (value: string | null | undefined): value is string =>
    typeof value === "string" && value.trim().length > 0;

const isPresent = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined;

const toUniqueRooms = (rooms: string[]) =>
    Array.from(new Set(rooms.map((item) => item.trim()).filter(Boolean)));

const toRoomSummary = (rooms: string[]) => toUniqueRooms(rooms).join(" • ");

const hasCoordinates = (lat: number | null, lng: number | null) =>
    lat !== null &&
    lng !== null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

const buildMapData = ({
    latitude,
    longitude,
    googleMapsLink,
    address,
    neighborhood,
    district,
    city,
}: {
    latitude: number | null;
    longitude: number | null;
    googleMapsLink: string | null;
    address: string | null;
    neighborhood: string | null;
    district: string;
    city: string;
}): S1MapData | undefined => {
    const locationLabel = [address, neighborhood, district, city]
        .map((item) => item?.trim())
        .filter(Boolean)
        .join(", ");
    const coordinatesAvailable = hasCoordinates(latitude, longitude);

    const embedSrc = coordinatesAvailable
        ? `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
        : locationLabel
            ? `https://www.google.com/maps?q=${encodeURIComponent(
                locationLabel
            )}&z=15&output=embed`
            : undefined;

    const mapsLink = googleMapsLink?.trim()
        ? googleMapsLink
        : coordinatesAvailable
            ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
            : locationLabel
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    locationLabel
                )}`
                : undefined;

    if (!embedSrc && !mapsLink) {
        return undefined;
    }

    return { embedSrc, mapsLink };
};

export async function getS1ProjectPageData({
    slug,
    locale = DEFAULT_LOCALE,
}: GetS1ProjectDataOptions = {}): Promise<S1ProjectPageData | null> {
    const t = await getTranslations({ locale, namespace: "projectDetail" });
    const defaultLocaleTranslations =
        locale === DEFAULT_LOCALE
            ? t
            : await getTranslations({
                  locale: DEFAULT_LOCALE,
                  namespace: "projectDetail",
              });
    const localeFallbacks = getLocalizedFallbackLocales(locale, DEFAULT_LOCALE);
    const socialGalleryTitleCandidates = new Set(
        [
            SOCIAL_GALLERY_TITLE,
            t("socialFacilities"),
            defaultLocaleTranslations("socialFacilities"),
        ].map((value) => value.toLocaleLowerCase().trim())
    );
    const getStatusLabel = (status: ListingStatus) => {
        if (status === ListingStatus.PUBLISHED) return t("statusPublished");
        if (status === ListingStatus.ARCHIVED) return t("statusArchived");
        if (status === ListingStatus.REMOVED) return t("statusRemoved");
        return t("statusDraft");
    };

    const project = await prisma.listing.findFirst({
        where: {
            isProject: true,
            status: {
                in: [ListingStatus.PUBLISHED, ListingStatus.ARCHIVED],
            },
            ...(slug ? { slug } : {}),
        },
        include: {
            translations: {
                where: {
                    locale: {
                        in: localeFallbacks,
                    },
                },
            },
            media: {
                orderBy: [{ isCover: "desc" }, { order: "asc" }],
            },
            projectFeatures: {
                orderBy: { order: "asc" },
                include: {
                    translations: {
                        where: {
                            locale: {
                                in: localeFallbacks,
                            },
                        },
                    },
                },
            },
            customGalleries: {
                orderBy: { order: "asc" },
                include: {
                    translations: {
                        where: {
                            locale: {
                                in: localeFallbacks,
                            },
                        },
                    },
                    media: {
                        orderBy: { order: "asc" },
                    },
                },
            },
            projectUnits: {
                orderBy: { rooms: "asc" },
                include: {
                    translations: {
                        where: {
                            locale: {
                                in: localeFallbacks,
                            },
                        },
                    },
                    media: {
                        orderBy: { order: "asc" },
                    },
                },
            },
            floorPlans: {
                include: {
                    translations: {
                        where: {
                            locale: {
                                in: localeFallbacks,
                            },
                        },
                    },
                },
            },
            faqs: {
                orderBy: { order: "asc" },
                include: {
                    translations: {
                        where: {
                            locale: {
                                in: localeFallbacks,
                            },
                        },
                    },
                },
            },
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    });

    if (!project) {
        return null;
    }

    const translation = pickLocalizedEntry(project.translations, locale);
    const projectTitle =
        translation?.title?.trim() || project.projectType || t("fallbackProjectTitle");
    const projectDescription =
        translation?.description?.trim() ||
        [project.district, project.city].filter(Boolean).join(", ");
    const projectCategoryLabel =
        getProjectCategoryLabel(project.projectType, locale) || project.projectType;

    const imageMedia = project.media.filter((media) => media.type === "IMAGE");
    const exteriorImages = imageMedia
        .filter((media) => media.category === "EXTERIOR")
        .map((media) => getMediaUrl(media.url))
        .filter(isNonEmptyString);
    const interiorImages = imageMedia
        .filter((media) => media.category === "INTERIOR")
        .map((media) => getMediaUrl(media.url))
        .filter(isNonEmptyString);
    const mapImages = imageMedia
        .filter((media) => media.category === "MAP")
        .map((media, index) => ({
            id: media.id,
            title: t("mapImageAlt", { index: index + 1 }),
            image: getMediaUrl(media.url),
        }))
        .filter((item) => isNonEmptyString(item.image));
    const logoImage = imageMedia
        .filter((media) => media.category === "LOGO")
        .map((media) => getMediaUrl(media.url))
        .find(isNonEmptyString);

    const documentMedia = selectProjectDocumentMedia(project.media);
    const documents: S1DocumentItem[] = documentMedia.map((media, index) => ({
        id: media.id,
        name: getDocumentNameFromMedia({
            url: media.url,
            aiTags: media.aiTags,
            fallback: t("documentFallback", { index: index + 1 }),
        }),
        url: getMediaUrl(media.url),
    }))
        .filter((item) => isNonEmptyString(item.url));

    const videoMedia = project.media.find((media) => media.type === "VIDEO");
    const videoUrl = videoMedia ? getMediaUrl(videoMedia.url) : undefined;
    const heroImage =
        exteriorImages[0] || interiorImages[0] || getMediaUrl(imageMedia[0]?.url);

    // Step 1: Extract raw Turkish labels and dictionary-translate
    const generalRaw = project.projectFeatures
        .filter((feature) => feature.category === "GENERAL")
        .map((feature) => {
            const featureTranslation = pickLocalizedEntry(feature.translations, locale);
            const raw = featureTranslation?.title?.trim() || "";
            return { icon: feature.icon || "Building2", raw };
        })
        .filter((item) => item.raw);

    const socialRaw = project.projectFeatures
        .filter((feature) => feature.category === "SOCIAL")
        .map((feature) => {
            const featureTranslation = pickLocalizedEntry(feature.translations, locale);
            const raw = featureTranslation?.title?.trim() || "";
            return { icon: feature.icon || "Sparkles", raw };
        })
        .filter((item) => item.raw);

    const rawSummaryTags = (translation?.features || [])
        .map((item) => item.trim())
        .filter(Boolean);

    const generalFeatures: S1RibbonItem[] = generalRaw.map((f) => ({
        icon: f.icon,
        label: translateFeature(f.raw, locale),
        value: null,
    }));
    const propertiesRibbon = generalFeatures;

    const summaryTags = rawSummaryTags.map((item) => translateFeature(item, locale));

    const socialFacilities: S1SocialFacilityItem[] = socialRaw.map((f) => ({
        icon: f.icon,
        name: translateFeature(f.raw, locale),
    }));
    const summary: S1SummaryData | undefined =
        projectDescription || summaryTags.length > 0 || project.deliveryDate
            ? {
                title: t("summaryTitle"),
                description: projectDescription,
                tags: summaryTags,
                deliveryDate: project.deliveryDate,
                logoUrl: logoImage,
            }
            : undefined;

    let socialGalleryImages: string[] = [];
    const customGalleries: S1CustomGalleryData[] = [];
    project.customGalleries.forEach((gallery) => {
        const galleryTranslation = pickLocalizedEntry(gallery.translations, locale);
        const galleryTitle = galleryTranslation?.title?.trim() || "";
        const images = gallery.media
            .filter((media) => media.type === "IMAGE")
            .map((media) => getMediaUrl(media.url))
            .filter(isNonEmptyString);

        if (!galleryTitle || images.length === 0) {
            return;
        }

        if (
            socialGalleryTitleCandidates.has(galleryTitle.toLocaleLowerCase().trim())
        ) {
            socialGalleryImages = images;
            return;
        }

        customGalleries.push({
            id: gallery.id,
            title: translateFeature(galleryTitle, locale),
            subtitle: galleryTranslation?.subtitle?.trim()
                ? translateFeature(galleryTranslation.subtitle.trim(), locale)
                : null,
            images,
        });
    });

    const unitGalleries: S1CustomGalleryData[] = project.projectUnits
        .map((unit) => {
            const unitTranslation = pickLocalizedEntry(unit.translations, locale);
            const title = unitTranslation?.title?.trim() || unit.rooms.trim();
            const images = unit.media
                .filter((media) => media.type === "IMAGE")
                .map((media) => getMediaUrl(media.url))
                .filter(isNonEmptyString);

            if (!title || images.length === 0) {
                return null;
            }

            const subtitleParts = [
                unit.rooms?.trim() ? t("unitTypeLabel", { rooms: unit.rooms }) : null,
                unit.area ? `${unit.area} m²` : null,
            ].filter(Boolean) as string[];

            return {
                id: `unit-${unit.id}`,
                title,
                subtitle: subtitleParts.length > 0 ? subtitleParts.join(" • ") : null,
                images,
            };
        })
        .filter(isPresent);

    const allCustomGalleries = [...customGalleries, ...unitGalleries];
    const socialGalleryFallback = [interiorImages[0], exteriorImages[0], heroImage]
        .filter(isNonEmptyString);
    const resolvedSocialImages =
        socialGalleryImages.length > 0 ? socialGalleryImages : socialGalleryFallback;

    const floorPlanItems: S1FloorPlanItem[] = project.floorPlans
        .map((plan) => {
            const floorPlanTranslation = pickLocalizedEntry(plan.translations, locale);
            const rawTitle = floorPlanTranslation?.title?.trim() || plan.area?.trim() || "";
            const title = rawTitle ? translateFeature(rawTitle, locale) : "";
            if (!title || !plan.imageUrl?.trim()) {
                return null;
            }
            return {
                id: plan.id,
                title,
                area: plan.area?.trim() || null,
                image: getMediaUrl(plan.imageUrl),
            };
        })
        .filter(isPresent);

    const rawFaqs = project.faqs
        .map((faq) => {
            const faqTranslation = pickLocalizedEntry(faq.translations, locale);
            const question = faqTranslation?.question?.trim() || "";
            const answer = faqTranslation?.answer?.trim() || "";
            if (!question || !answer) {
                return null;
            }
            return { id: faq.id, question, answer };
        })
        .filter(isPresent);

    const faqs: S1FaqItem[] = rawFaqs;
    const videoTitle: string | undefined = translation?.promoVideoTitle || undefined;

    const otherProjectsRaw = await prisma.listing.findMany({
        where: {
            isProject: true,
            status: {
                in: [ListingStatus.PUBLISHED, ListingStatus.ARCHIVED],
            },
            id: {
                not: project.id,
            },
        },
        include: {
            translations: {
                where: {
                    locale: {
                        in: localeFallbacks,
                    },
                },
            },
            media: {
                orderBy: [{ isCover: "desc" }, { order: "asc" }],
                take: 1,
            },
            projectUnits: {
                select: {
                    rooms: true,
                },
            },
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        take: 3,
    });

    const otherProjects: S1OtherProjectItem[] = otherProjectsRaw
        .map((item) => {
            const itemTranslation = pickLocalizedEntry(item.translations, locale);
            const title =
                itemTranslation?.title?.trim() ||
                item.projectType ||
                t("fallbackProjectTitle");
            const image = getMediaUrl(item.media[0]?.url);
            if (!image) {
                return null;
            }
            return {
                id: item.id,
                slug: item.slug,
                title,
                location: [item.district, item.city].filter(Boolean).join(", "),
                status: getStatusLabel(item.status),
                image,
                roomSummary: toRoomSummary(item.projectUnits.map((unit) => unit.rooms)),
            };
        })
        .filter(isPresent);

    const map = buildMapData({
        latitude: project.latitude,
        longitude: project.longitude,
        googleMapsLink: project.googleMapsLink,
        address: project.address,
        neighborhood: project.neighborhood,
        district: project.district,
        city: project.city,
    });

    return {
        slug: project.slug,
        hero: {
            badge: projectCategoryLabel || t("newProjectBadge"),
            title: projectTitle,
            description: projectDescription,
            backgroundImage: heroImage,
            ctaTitle: t("heroCtaTitle"),
            ctaDescription: t("heroCtaDescription"),
            ctaButtonText: t("heroCtaButtonText"),
            ctaHref: map?.mapsLink,
        },
        propertiesRibbon,
        summary,
        videoUrl,
        videoTitle,
        exteriorVisuals:
            exteriorImages.length > 0
                ? {
                    title: t("exteriorSectionTitle"),
                    images: exteriorImages,
                }
                : undefined,
        socialFacilities:
            socialFacilities.length > 0
                ? {
                    title: t("socialFacilities"),
                    description: t("socialFacilitiesDescription"),
                    image: interiorImages[0] || exteriorImages[0] || heroImage,
                    images: resolvedSocialImages,
                    facilities: socialFacilities,
                }
                : undefined,
        interiorVisuals:
            interiorImages.length > 0
                ? {
                    title: t("interiorSectionTitle"),
                    images: interiorImages,
                }
                : undefined,
        customGalleries: allCustomGalleries,
        floorPlans:
            floorPlanItems.length > 0
                ? {
                    title: t("floorPlansTitle"),
                    description: t("floorPlansDescription"),
                    plans: floorPlanItems,
                }
                : undefined,
        documents,
        mapImages,
        map,
        faqs,
        otherProjects,
    };
}
