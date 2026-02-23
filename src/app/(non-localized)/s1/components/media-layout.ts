interface MapSectionLayoutInput {
    hasMapContent: boolean;
    mapImageCount: number;
}

interface MapSectionLayout {
    showSection: boolean;
    showMapCard: boolean;
    showMapGalleryCard: boolean;
    useSplitLayout: boolean;
}

export const getMapSectionLayout = ({
    hasMapContent,
    mapImageCount,
}: MapSectionLayoutInput): MapSectionLayout => {
    const showMapCard = hasMapContent;
    const showMapGalleryCard = mapImageCount > 0;
    const showSection = showMapCard || showMapGalleryCard;

    return {
        showSection,
        showMapCard,
        showMapGalleryCard,
        useSplitLayout: showMapCard && showMapGalleryCard,
    };
};

export const hasSocialGalleryImages = (socialImages: string[]): boolean =>
    socialImages.length > 0;
