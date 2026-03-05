interface PeekingCarouselTranslateInput {
    currentIndex: number;
    viewportWidthPx: number;
    cardWidthPercent: number;
    gapPx: number;
}

export const getPeekingCarouselTranslatePx = ({
    currentIndex,
    viewportWidthPx,
    cardWidthPercent,
    gapPx,
}: PeekingCarouselTranslateInput): number => {
    if (currentIndex <= 0 || viewportWidthPx <= 0) {
        return 0;
    }

    const cardWidthPx = (viewportWidthPx * cardWidthPercent) / 100;
    const stepPx = cardWidthPx + gapPx;

    return stepPx * currentIndex;
};
