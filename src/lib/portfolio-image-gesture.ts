interface ShouldSwipeImageCarouselInput {
    deltaX: number;
    deltaY: number;
    thresholdPx: number;
}

export function shouldSwipeImageCarousel({
    deltaX,
    deltaY,
    thresholdPx,
}: ShouldSwipeImageCarouselInput): boolean {
    const horizontalDistance = Math.abs(deltaX);
    const verticalDistance = Math.abs(deltaY);

    return horizontalDistance >= thresholdPx && horizontalDistance > verticalDistance;
}

export function getImageSwipeDirection(deltaX: number): "prev" | "next" {
    return deltaX < 0 ? "next" : "prev";
}
