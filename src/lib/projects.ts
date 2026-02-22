import { ListingStatus } from "@/generated/prisma";
import { normalizeProjectIcon as normalizeCatalogProjectIcon } from "@/lib/project-icon-catalog";
import { slugify } from "@/lib/utils";

const PROJECT_STATUS_ALIASES: Record<string, ListingStatus> = {
    DRAFT: ListingStatus.DRAFT,
    PUBLISHED: ListingStatus.PUBLISHED,
    ARCHIVED: ListingStatus.ARCHIVED,
    REMOVED: ListingStatus.REMOVED,
};

const PROJECT_FEATURE_CATEGORY_ALIASES: Record<string, "GENERAL" | "SOCIAL"> = {
    GENERAL: "GENERAL",
    SOCIAL: "SOCIAL",
};

export function normalizeProjectText(value: unknown): string | null {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

export function getProjectSlugBase(title: string, city?: string | null): string {
    const titlePart = normalizeProjectText(title) || "proje";
    const cityPart = normalizeProjectText(city || "") || "alanya";
    return slugify(`${titlePart}-${cityPart}-proje`);
}

export function normalizeProjectStatus(
    value: unknown,
    fallback: ListingStatus = ListingStatus.DRAFT
): ListingStatus {
    const normalized = String(value ?? "")
        .trim()
        .toUpperCase();
    return PROJECT_STATUS_ALIASES[normalized] || fallback;
}

export function normalizeProjectFeatureCategory(
    value: unknown
): "GENERAL" | "SOCIAL" {
    const normalized = String(value ?? "")
        .trim()
        .toUpperCase();
    return PROJECT_FEATURE_CATEGORY_ALIASES[normalized] || "GENERAL";
}

export function normalizeProjectIcon(value: unknown): string {
    return normalizeCatalogProjectIcon(value);
}
