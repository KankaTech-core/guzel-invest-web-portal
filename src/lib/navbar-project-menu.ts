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

export type PublicProjectMenuSource = {
    slug?: string | null;
    city?: string | null;
    district?: string | null;
    updatedAt?: string | null;
    translations?: PublicProjectTranslation[] | null;
    media?: PublicProjectMedia[] | null;
};

export type NavbarProjectMenuItem = {
    title: string;
    image: string;
    href: string;
    imageVersion: string;
    description?: string;
    location?: string;
};

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

        return {
            title,
            image,
            href: `/proje/${slug}`,
            imageVersion,
            description,
            location,
        } as NavbarProjectMenuItem;
    });
    return items.filter((item): item is NavbarProjectMenuItem => item !== null);
}
