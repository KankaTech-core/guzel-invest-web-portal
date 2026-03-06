interface ShouldSwipeImageCarouselInput {
    deltaX: number;
    deltaY: number;
    thresholdPx: number;
}

interface ShouldIgnoreImageTapAfterSwipeInput {
    lastSwipeAt?: number;
    now: number;
    cooldownMs: number;
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

export function shouldIgnoreImageTapAfterSwipe({
    lastSwipeAt,
    now,
    cooldownMs,
}: ShouldIgnoreImageTapAfterSwipeInput): boolean {
    if (typeof lastSwipeAt !== "number") return false;
    return now - lastSwipeAt < cooldownMs;
}
