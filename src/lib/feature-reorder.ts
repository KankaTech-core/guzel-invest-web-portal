export type FeatureCategory = "GENERAL" | "SOCIAL";

const FEATURE_SORTABLE_ID_SEPARATOR = "::";
const FEATURE_CATEGORIES = new Set<FeatureCategory>(["GENERAL", "SOCIAL"]);

interface IdentifiableRow {
    id: string;
}

export const toFeatureSortableId = (category: FeatureCategory, id: string): string =>
    `${category}${FEATURE_SORTABLE_ID_SEPARATOR}${id}`;

export const fromFeatureSortableId = (
    value: string
): { category: FeatureCategory; id: string } | null => {
    const parts = value.split(FEATURE_SORTABLE_ID_SEPARATOR);
    if (parts.length !== 2) return null;

    const [rawCategory, id] = parts;
    if (!rawCategory || !id) return null;
    if (!FEATURE_CATEGORIES.has(rawCategory as FeatureCategory)) return null;

    return {
        category: rawCategory as FeatureCategory,
        id,
    };
};

export const reorderFeatureRows = <T extends IdentifiableRow>(
    rows: T[],
    activeId: string,
    overId: string
): T[] => {
    const oldIndex = rows.findIndex((row) => row.id === activeId);
    const newIndex = rows.findIndex((row) => row.id === overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
        return rows;
    }

    const next = [...rows];
    const [moved] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, moved);
    return next;
};
