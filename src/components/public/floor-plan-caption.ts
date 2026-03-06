export const FLOOR_GALLERY_TAB_KEY = "floor";

interface ResolveFloorPlanOverlayLabelOptions {
    activeGalleryTabKey?: string;
    itemAlt?: string;
}

export const resolveFloorPlanOverlayLabel = ({
    activeGalleryTabKey,
    itemAlt,
}: ResolveFloorPlanOverlayLabelOptions): string | null => {
    if (activeGalleryTabKey !== FLOOR_GALLERY_TAB_KEY) {
        return null;
    }

    const normalizedLabel = itemAlt?.trim();
    if (!normalizedLabel) {
        return null;
    }

    return normalizedLabel;
};
