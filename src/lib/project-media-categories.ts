export const PROJECT_MEDIA_CATEGORY_VALUES = [
    "EXTERIOR",
    "INTERIOR",
    "MAP",
    "DOCUMENT",
] as const;

export type ProjectMediaCategory = (typeof PROJECT_MEDIA_CATEGORY_VALUES)[number];

export interface ProjectMediaAssignmentInput {
    exteriorMediaIds?: string[] | null;
    interiorMediaIds?: string[] | null;
    mapMediaIds?: string[] | null;
    documentMediaIds?: string[] | null;
}

const CATEGORY_BY_FIELD = [
    { field: "exteriorMediaIds", category: "EXTERIOR" },
    { field: "interiorMediaIds", category: "INTERIOR" },
    { field: "mapMediaIds", category: "MAP" },
    { field: "documentMediaIds", category: "DOCUMENT" },
] as const;

type ProjectMediaField = (typeof CATEGORY_BY_FIELD)[number]["field"];

function normalizeMediaIds(values: string[] | null | undefined): string[] {
    if (!Array.isArray(values)) return [];

    const unique = new Set<string>();
    values.forEach((value) => {
        if (typeof value !== "string") return;
        const normalized = value.trim();
        if (!normalized) return;
        unique.add(normalized);
    });

    return Array.from(unique);
}

export function getProvidedProjectMediaCategories(
    input: ProjectMediaAssignmentInput
): ProjectMediaCategory[] {
    return CATEGORY_BY_FIELD.filter(({ field }) => input[field] !== undefined).map(
        ({ category }) => category
    );
}

export function getNormalizedProjectMediaAssignments(
    input: ProjectMediaAssignmentInput
): Record<ProjectMediaCategory, string[]> {
    return {
        EXTERIOR: normalizeMediaIds(input.exteriorMediaIds),
        INTERIOR: normalizeMediaIds(input.interiorMediaIds),
        MAP: normalizeMediaIds(input.mapMediaIds),
        DOCUMENT: normalizeMediaIds(input.documentMediaIds),
    };
}

export function buildProjectMediaCategoryMap(
    input: ProjectMediaAssignmentInput
): Map<string, ProjectMediaCategory> {
    const mediaCategoryMap = new Map<string, ProjectMediaCategory>();

    CATEGORY_BY_FIELD.forEach(({ field, category }) => {
        const ids = normalizeMediaIds(input[field as ProjectMediaField]);
        ids.forEach((mediaId) => {
            mediaCategoryMap.set(mediaId, category);
        });
    });

    return mediaCategoryMap;
}
