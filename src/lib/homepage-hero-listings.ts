export const HOMEPAGE_HERO_SLOTS = [1, 2, 3] as const;
export const HOMEPAGE_HERO_SLOT_LIMIT = HOMEPAGE_HERO_SLOTS.length;
export type HomepageHeroSlot = (typeof HOMEPAGE_HERO_SLOTS)[number];

export function parseHomepageHeroSlot(
    value: unknown
): HomepageHeroSlot | null | "invalid" {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed)) {
        return "invalid";
    }

    if (!HOMEPAGE_HERO_SLOTS.includes(parsed as HomepageHeroSlot)) {
        return "invalid";
    }

    return parsed as HomepageHeroSlot;
}

interface HomepageHeroListingRemovalErrorInput {
    requestedSlot: number | null;
    selectedCount: number;
    isCurrentlySelected: boolean;
}

export function getHomepageHeroListingRemovalError({
    requestedSlot,
    selectedCount,
    isCurrentlySelected,
}: HomepageHeroListingRemovalErrorInput): string | null {
    if (requestedSlot !== null) {
        return null;
    }

    if (!isCurrentlySelected) {
        return null;
    }

    if (selectedCount <= 1) {
        return "Ana sayfada en az 1 ilan kalmalıdır.";
    }

    return null;
}
