export type PublicProjectTranslation = {
    locale?: string;
    title?: string | null;
};

export type PublicProjectMedia = {
    url?: string | null;
    type?: string | null;
    category?: string | null;
    isCover?: boolean | null;
};

export type PublicProjectMenuSource = {
    slug?: string | null;
    updatedAt?: string | null;
    translations?: PublicProjectTranslation[] | null;
    media?: PublicProjectMedia[] | null;
};

export type NavbarProjectMenuItem = {
    title: string;
    image: string;
    href: string;
    imageVersion: string;
};

export function mapPublicProjectsToMenuItems(
    projects: PublicProjectMenuSource[],
    locale: string
): NavbarProjectMenuItem[] {
    return projects
        .map((project) => {
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
            } satisfies NavbarProjectMenuItem;
        })
        .filter((item): item is NavbarProjectMenuItem => Boolean(item));
}
