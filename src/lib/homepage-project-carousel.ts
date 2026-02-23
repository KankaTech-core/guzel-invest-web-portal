export const HOMEPAGE_PROJECT_LIMIT = 3;
export const HOMEPAGE_PROJECT_SLOTS = [1, 2, 3] as const;
export type HomepageProjectSlot = (typeof HOMEPAGE_PROJECT_SLOTS)[number];

interface CanSelectProjectForHomepageCarouselInput {
    selectedCount: number;
    isAlreadySelected: boolean;
}

export function canSelectProjectForHomepageCarousel({
    selectedCount,
    isAlreadySelected,
}: CanSelectProjectForHomepageCarouselInput): boolean {
    if (isAlreadySelected) {
        return true;
    }

    return selectedCount < HOMEPAGE_PROJECT_LIMIT;
}

interface HomepageProjectSelectionErrorInput {
    shouldSelect: boolean;
    isPublished: boolean;
    selectedCount: number;
    isAlreadySelected: boolean;
}

export function getHomepageProjectSelectionError({
    shouldSelect,
    isPublished,
    selectedCount,
    isAlreadySelected,
}: HomepageProjectSelectionErrorInput): string | null {
    if (!shouldSelect) {
        return null;
    }

    if (!isPublished) {
        return "Only published projects can be shown on homepage carousel";
    }

    if (
        !canSelectProjectForHomepageCarousel({
            selectedCount,
            isAlreadySelected,
        })
    ) {
        return "En fazla 3 proje ana sayfa carousel'inde gösterilebilir.";
    }

    return null;
}

export function pickHomepageProjectsForCarousel<T>(
    selectedProjects: T[],
    fallbackProjects: T[]
): T[] {
    if (selectedProjects.length > 0) {
        return selectedProjects.slice(0, HOMEPAGE_PROJECT_LIMIT);
    }

    return fallbackProjects.slice(0, HOMEPAGE_PROJECT_LIMIT);
}

export function parseHomepageProjectSlot(
    value: unknown
): HomepageProjectSlot | null | "invalid" {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
        return "invalid";
    }

    if (!HOMEPAGE_PROJECT_SLOTS.includes(parsed as HomepageProjectSlot)) {
        return "invalid";
    }

    return parsed as HomepageProjectSlot;
}

export function findFirstAvailableHomepageProjectSlot(
    takenSlots: number[]
): HomepageProjectSlot | null {
    for (const slot of HOMEPAGE_PROJECT_SLOTS) {
        if (!takenSlots.includes(slot)) {
            return slot;
        }
    }

    return null;
}
