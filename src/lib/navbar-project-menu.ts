import { getProjectCategoryLabel } from "@/lib/utils";

export type PublicProjectTranslation = {
    locale?: string;
    title?: string | null;
    description?: string | null;
};

export type PublicProjectMedia = {
    url?: string | null;
    type?: string | null;
    category?: string | null;
    isCover?: boolean | null;
};

export type PublicProjectFeatureTranslation = {
    locale: string;
    title: string;
};

export type PublicProjectFeature = {
    category?: string | null;
    icon: string | null;
    order?: number | null;
    translations: PublicProjectFeatureTranslation[];
};

export type PublicProjectUnitTranslation = {
    locale: string;
    title?: string | null;
};

export type PublicProjectUnit = {
    rooms: string;
    detailType?: string | null;
    translations?: PublicProjectUnitTranslation[];
};

export type PublicProjectMenuSource = {
    slug?: string | null;
    projectType?: string | null;
    city?: string | null;
    district?: string | null;
    updatedAt?: string | null;
    translations?: PublicProjectTranslation[] | null;
    media?: PublicProjectMedia[] | null;
    projectFeatures?: PublicProjectFeature[] | null;
    projectUnits?: PublicProjectUnit[] | null;
};

export type NavbarProjectFeature = {
    icon: string;
    label: string;
};

export type NavbarProjectMenuItem = {
    title: string;
    image: string;
    href: string;
    imageVersion: string;
    description?: string;
    location?: string;
    projectCategory?: string | null;
    promoText?: string | null;
    paymentDetails?: string | null;
    features?: NavbarProjectFeature[];
};

export function getNavbarProjectMenuColumnCount(projectCount: number): 1 | 2 | 3 {
    if (projectCount <= 1) return 1;
    if (projectCount === 2) return 2;
    return 3;
}

export function mapPublicProjectsToMenuItems(
    projects: PublicProjectMenuSource[],
    locale: string
): NavbarProjectMenuItem[] {
    const items = projects.map((project) => {
        const slug = project.slug?.trim();
        if (!slug) return null;

        const translations = Array.isArray(project.translations)
            ? project.translations
            : [];
        const preferredTranslation =
            translations.find((item) => item?.locale === locale) ||
            translations.find((item) => item?.locale === "tr") ||
            translations[0];
        const title = preferredTranslation?.title?.trim() || "Yeni Proje";

        let description = preferredTranslation?.description?.trim() || "";
        if (description.length > 80) {
            description = description.substring(0, 80) + "...";
        }

        const locationParts = [];
        if (project.district) locationParts.push(project.district);
        if (project.city) locationParts.push(project.city);
        const location = locationParts.join(", ");

        const media = Array.isArray(project.media) ? project.media : [];
        const exteriorCover = media.find(
            (item) =>
                item?.type === "IMAGE" &&
                item?.category === "EXTERIOR" &&
                item?.isCover
        );
        const exteriorImage = media.find(
            (item) => item?.type === "IMAGE" && item?.category === "EXTERIOR"
        );
        const anyCover = media.find(
            (item) =>
                item?.type === "IMAGE" &&
                item?.category !== "DOCUMENT" &&
                item?.category !== "MAP" &&
                item?.isCover
        );
        const fallbackImage = media.find(
            (item) =>
                item?.type === "IMAGE" &&
                item?.category !== "DOCUMENT" &&
                item?.category !== "MAP"
        );
        const imageMedia = exteriorCover || exteriorImage || anyCover || fallbackImage;
        const image = imageMedia?.url?.trim();
        if (!image) return null;

        const imageVersion =
            project.updatedAt?.trim() ||
            imageMedia?.url?.trim() ||
            slug;

        const projectCategory = getProjectCategoryLabel(project.projectType, locale) || null;

        const paymentUnit = (project.projectUnits || []).find((unit) => unit.detailType === "PAYMENT");
        const paymentDetails = paymentUnit
            ? paymentUnit.translations?.find((t) => t.locale === locale)?.title ||
            paymentUnit.translations?.find((t) => t.locale === "tr")?.title ||
            paymentUnit.rooms
            : null;

        const features = (project.projectFeatures || [])
            .filter((feature) => feature.category === "GENERAL")
            .sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER))
            .map((feature) => {
                const title =
                    feature.translations?.find((t) => t.locale === locale)?.title ||
                    feature.translations?.find((t) => t.locale === "tr")?.title ||
                    "";
                return title ? { icon: feature.icon || "Building2", label: title } : null;
            })
            .filter((item): item is NavbarProjectFeature => item !== null)
            .slice(0, 2);

        return {
            title,
            image,
            href: `/proje/${slug}`,
            imageVersion,
            description,
            location,
            projectCategory,
            paymentDetails,
            features,
        } as NavbarProjectMenuItem;
    });
    return items.filter((item): item is NavbarProjectMenuItem => item !== null);
}
