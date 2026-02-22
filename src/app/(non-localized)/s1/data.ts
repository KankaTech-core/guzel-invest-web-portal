import { ListingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getMediaUrl } from "@/lib/utils";
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

const isNonEmptyString = (value: string | null | undefined): value is string =>
    typeof value === "string" && value.trim().length > 0;

const isPresent = <T>(value: T | null | undefined): value is T =>
    value !== null && value !== undefined;

const toRoomSummary = (rooms: string[]) => {
    const unique = Array.from(new Set(rooms.map((item) => item.trim()).filter(Boolean)));
    return unique.join(" • ");
};

const getStatusLabel = (status: ListingStatus) => {
    if (status === ListingStatus.PUBLISHED) return "SATIŞTA";
    if (status === ListingStatus.ARCHIVED) return "ARŞİV";
    if (status === ListingStatus.REMOVED) return "KALDIRILDI";
    return "TASLAK";
};

const getDocumentName = (url: string, fallback = "Belge") => {
    const rawName = url.split("/").pop();
    if (!rawName) return fallback;
    try {
        return decodeURIComponent(rawName);
    } catch {
        return rawName;
    }
};

const hasCoordinates = (lat: number | null, lng: number | null) =>
    lat !== null &&
    lng !== null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

const pickLocalized = <T extends { locale: string }>(
    items: T[],
    locale: string
): T | null => {
    if (!items.length) return null;
    return (
        items.find((item) => item.locale === locale) ||
        items.find((item) => item.locale === DEFAULT_LOCALE) ||
        items[0]
    );
};

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
    const localeFallbacks = Array.from(new Set([locale, DEFAULT_LOCALE]));

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

    const translation = pickLocalized(project.translations, locale);
    const projectTitle = translation?.title?.trim() || project.projectType || "Proje";
    const projectDescription =
        translation?.description?.trim() ||
        [project.district, project.city].filter(Boolean).join(", ");

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
            title: `Harita ${index + 1}`,
            image: getMediaUrl(media.url),
        }))
        .filter((item) => isNonEmptyString(item.image));

    const documentMedia = project.media.filter(
        (media) => media.type === "DOCUMENT" || media.category === "DOCUMENT"
    );
    const documents: S1DocumentItem[] = documentMedia.map((media, index) => ({
        id: media.id,
        name: getDocumentName(media.url, `Belge ${index + 1}`),
        url: getMediaUrl(media.url),
    }))
        .filter((item) => isNonEmptyString(item.url));

    const videoMedia = project.media.find((media) => media.type === "VIDEO");
    const videoUrl = videoMedia ? getMediaUrl(videoMedia.url) : undefined;
    const heroImage =
        exteriorImages[0] || interiorImages[0] || getMediaUrl(imageMedia[0]?.url);

    const generalFeatures: S1RibbonItem[] = project.projectFeatures
        .filter((feature) => feature.category === "GENERAL")
        .map((feature) => {
            const featureTranslation = pickLocalized(feature.translations, locale);
            return {
                icon: feature.icon || "Building2",
                label: featureTranslation?.title?.trim() || "",
                value: null,
            };
        })
        .filter((item) => item.label);

    const roomSummary = toRoomSummary(project.projectUnits.map((unit) => unit.rooms));
    const locationSummary = [project.district, project.city].filter(Boolean).join(", ");
    const metaRibbon: S1RibbonItem[] = [
        roomSummary
            ? {
                  icon: "BedDouble",
                  label: "Daire Tipleri",
                  value: roomSummary,
              }
            : null,
        project.projectType
            ? {
                  icon: "Building2",
                  label: "Proje Tipi",
                  value: project.projectType,
              }
            : null,
        locationSummary
            ? {
                  icon: "MapPin",
                  label: "Konum",
                  value: locationSummary,
              }
            : null,
    ].filter(isPresent);

    const propertiesRibbon = [...generalFeatures, ...metaRibbon].slice(0, 8);

    const summaryTags = (translation?.features || [])
        .map((item) => item.trim())
        .filter(Boolean);
    const summary: S1SummaryData | undefined =
        projectDescription || summaryTags.length > 0 || project.deliveryDate
            ? {
                  title: "Proje Özeti",
                  description: projectDescription,
                  tags: summaryTags,
                  deliveryDate: project.deliveryDate,
              }
            : undefined;

    const socialFacilities: S1SocialFacilityItem[] = project.projectFeatures
        .filter((feature) => feature.category === "SOCIAL")
        .map((feature) => {
            const featureTranslation = pickLocalized(feature.translations, locale);
            return {
                icon: feature.icon || "Sparkles",
                name: featureTranslation?.title?.trim() || "",
            };
        })
        .filter((item) => item.name);

    const customGalleries: S1CustomGalleryData[] = project.customGalleries
        .map((gallery) => {
            const galleryTranslation = pickLocalized(gallery.translations, locale);
            const images = gallery.media
                .filter((media) => media.type === "IMAGE")
                .map((media) => getMediaUrl(media.url))
                .filter(isNonEmptyString);

            if (!galleryTranslation?.title?.trim() || images.length === 0) {
                return null;
            }

            return {
                id: gallery.id,
                title: galleryTranslation.title.trim(),
                subtitle: galleryTranslation.subtitle?.trim() || null,
                images,
            };
        })
        .filter(isPresent);

    const unitGalleries: S1CustomGalleryData[] = project.projectUnits
        .map((unit) => {
            const unitTranslation = pickLocalized(unit.translations, locale);
            const title = unitTranslation?.title?.trim() || unit.rooms.trim();
            const images = unit.media
                .filter((media) => media.type === "IMAGE")
                .map((media) => getMediaUrl(media.url))
                .filter(isNonEmptyString);

            if (!title || images.length === 0) {
                return null;
            }

            const subtitleParts = [
                unit.rooms?.trim() ? `${unit.rooms} Daire Tipi` : null,
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

    const floorPlanItems: S1FloorPlanItem[] = project.floorPlans
        .map((plan) => {
            const floorPlanTranslation = pickLocalized(plan.translations, locale);
            const title = floorPlanTranslation?.title?.trim() || plan.area?.trim() || "";
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

    const faqs: S1FaqItem[] = project.faqs
        .map((faq) => {
            const faqTranslation = pickLocalized(faq.translations, locale);
            const question = faqTranslation?.question?.trim() || "";
            const answer = faqTranslation?.answer?.trim() || "";
            if (!question || !answer) {
                return null;
            }
            return {
                id: faq.id,
                question,
                answer,
            };
        })
        .filter(isPresent);

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
            const itemTranslation = pickLocalized(item.translations, locale);
            const title = itemTranslation?.title?.trim() || item.projectType || "Proje";
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
            badge: project.projectType || "Yeni Proje",
            title: projectTitle,
            description: projectDescription,
            backgroundImage: heroImage,
            ctaTitle: "Özel Sunum Talebi",
            ctaDescription:
                "Proje hakkında detaylı bilgi ve özel ödeme planları için uzman ekibimizle iletişime geçin.",
            ctaButtonText: "Hemen İletişime Geç",
            ctaHref: map?.mapsLink,
        },
        propertiesRibbon,
        summary,
        videoUrl,
        exteriorVisuals:
            exteriorImages.length > 0
                ? {
                      title: "Projenin Vaziyet Planı ve Dış Görselleri",
                      images: exteriorImages,
                  }
                : undefined,
        socialFacilities:
            socialFacilities.length > 0
                ? {
                      title: "Sosyal İmkanlar",
                      description: "Projeye ait sosyal yaşam alanları ve olanaklar.",
                      image: interiorImages[0] || exteriorImages[0] || heroImage,
                      facilities: socialFacilities,
                  }
                : undefined,
        interiorVisuals:
            interiorImages.length > 0
                ? {
                      title: "Projenin İç Görselleri",
                      images: interiorImages,
                  }
                : undefined,
        customGalleries: allCustomGalleries,
        floorPlans:
            floorPlanItems.length > 0
                ? {
                      title: "Kat Planları",
                      description:
                          "Farklı ihtiyaçlara göre tasarlanmış plan tiplerini inceleyin.",
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
