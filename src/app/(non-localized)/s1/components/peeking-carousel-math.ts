interface PeekingCarouselTranslateInput {
    currentIndex: number;
    viewportWidthPx: number;
    cardWidthPercent: number;
    gapPx: number;
    itemWidthsPercent?: number[];
}

export const getPeekingCarouselTranslatePx = ({
    currentIndex,
    viewportWidthPx,
    cardWidthPercent,
    gapPx,
    itemWidthsPercent,
}: PeekingCarouselTranslateInput): number => {
    if (currentIndex <= 0 || viewportWidthPx <= 0) {
        return 0;
    }

    if (itemWidthsPercent && itemWidthsPercent.length > 0) {
        const safeIndex = Math.max(
            0,
            Math.min(currentIndex, itemWidthsPercent.length - 1)
        );

        if (safeIndex <= 0) {
            return 0;
        }

        const widthsPx = itemWidthsPercent.map(
            (widthPercent) => (viewportWidthPx * widthPercent) / 100
        );
        const translatePx = widthsPx
            .slice(0, safeIndex)
            .reduce((sum, widthPx) => sum + widthPx + gapPx, 0);
        const totalTrackWidthPx =
            widthsPx.reduce((sum, widthPx) => sum + widthPx, 0) +
            Math.max(0, widthsPx.length - 1) * gapPx;
        const maxTranslatePx = Math.max(0, totalTrackWidthPx - viewportWidthPx);

        return Math.min(translatePx, maxTranslatePx);
    }

    const cardWidthPx = (viewportWidthPx * cardWidthPercent) / 100;
    const stepPx = cardWidthPx + gapPx;

    return stepPx * currentIndex;
};
