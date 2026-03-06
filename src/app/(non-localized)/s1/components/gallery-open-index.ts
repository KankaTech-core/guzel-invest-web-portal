export const resolveGalleryOpenIndex = (
    value: unknown,
    itemCount: number
): number | null => {
    if (itemCount <= 0) {
        return null;
    }

    if (typeof value !== "number" || !Number.isFinite(value)) {
        return null;
    }

    const normalized = Math.trunc(value);
    if (normalized < 0) {
        return 0;
    }

    if (normalized >= itemCount) {
        return itemCount - 1;
    }

    return normalized;
};
