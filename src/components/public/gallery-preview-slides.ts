export interface GalleryPreviewImageItem {
    id: string;
    src: string;
    alt: string;
}

export type GalleryPreviewSlide =
    | { type: "image"; item: GalleryPreviewImageItem }
    | { type: "view-all"; id: string; label: string };

interface BuildGalleryPreviewSlidesOptions {
    maxSlides?: number;
    includeViewAllSlide?: boolean;
    viewAllLabel?: string;
}

export const buildGalleryPreviewSlides = (
    items: GalleryPreviewImageItem[],
    options: BuildGalleryPreviewSlidesOptions = {}
): GalleryPreviewSlide[] => {
    const {
        maxSlides = 4,
        includeViewAllSlide = false,
        viewAllLabel = "Tümünü Gör",
    } = options;

    if (items.length === 0 || maxSlides <= 0) {
        return [];
    }

    if (!includeViewAllSlide) {
        return items
            .slice(0, maxSlides)
            .map((item) => ({ type: "image" as const, item }));
    }

    const imageSlotCount = Math.max(0, maxSlides - 1);
    const imageSlides = items
        .slice(0, imageSlotCount)
        .map((item) => ({ type: "image" as const, item }));

    return [
        ...imageSlides,
        {
            type: "view-all" as const,
            id: "__preview-view-all__",
            label: viewAllLabel,
        },
    ];
};
