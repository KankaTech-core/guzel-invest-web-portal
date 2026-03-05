interface DocumentLikeMedia {
    type?: string | null;
    category?: string | null;
}

const PROJECT_MEDIA_CATEGORIES = new Set([
    "EXTERIOR",
    "INTERIOR",
    "MAP",
    "DOCUMENT",
    "LOGO",
]);

export function selectProjectDocumentMedia<T extends DocumentLikeMedia>(
    media: T[]
): T[] {
    const hasCategoryAssignments = media.some((item) =>
        PROJECT_MEDIA_CATEGORIES.has(item.category ?? "")
    );

    if (hasCategoryAssignments) {
        return media.filter((item) => item.category === "DOCUMENT");
    }

    return media.filter((item) => item.type === "DOCUMENT");
}
