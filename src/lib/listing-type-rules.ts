export const PROPERTY_TYPE_OPTIONS = [
    { value: "APARTMENT", label: "Daire" },
    { value: "VILLA", label: "Villa" },
    { value: "PENTHOUSE", label: "Penthouse" },
    { value: "LAND", label: "Arsa" },
    { value: "COMMERCIAL", label: "Ticari" },
    { value: "OFFICE", label: "Ofis" },
    { value: "SHOP", label: "Dükkan" },
    { value: "FARM", label: "Çiftlik" },
] as const;

export type PropertyTypeValue = (typeof PROPERTY_TYPE_OPTIONS)[number]["value"];

export const RESIDENTIAL_PROPERTY_TYPES = [
    "APARTMENT",
    "VILLA",
    "PENTHOUSE",
] as const;
export const LAND_PROPERTY_TYPES = ["LAND"] as const;
export const COMMERCIAL_PROPERTY_TYPES = [
    "COMMERCIAL",
    "OFFICE",
    "SHOP",
] as const;
export const FARM_PROPERTY_TYPES = ["FARM"] as const;

export const ZONING_STATUS_OPTIONS = [
    { value: "imarlı", label: "İmarlı" },
    { value: "imarsız", label: "İmarsız" },
    { value: "tarla", label: "Tarla" },
    { value: "konut", label: "Konut İmarlı" },
    { value: "ticari", label: "Ticari İmarlı" },
] as const;

const ZONING_STATUS_ALIASES: Record<string, string> = {
    "imarlı": "imarlı",
    "imarli": "imarlı",
    "imarsız": "imarsız",
    "imarsiz": "imarsız",
    "tarla": "tarla",
    "konut": "konut",
    "ticari": "ticari",
};

export function normalizeZoningStatus(value: string | null | undefined) {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    if (!normalized) return undefined;
    return ZONING_STATUS_ALIASES[normalized];
}

export type ListingCategoryFieldKey =
    | "rooms"
    | "bathrooms"
    | "wcCount"
    | "totalFloors"
    | "floor"
    | "buildYear"
    | "heating"
    | "parcelNo"
    | "emsal"
    | "zoningStatus"
    | "groundFloorArea"
    | "basementArea"
    | "existingStructure"
    | "hasWaterSource"
    | "hasFruitTrees"
    | "citizenshipEligible"
    | "residenceEligible";

// Keep this matrix aligned with category-specific sections in the admin listing form.
const CATEGORY_FIELDS_BY_TYPE: Record<PropertyTypeValue, readonly ListingCategoryFieldKey[]> = {
    APARTMENT: [
        "rooms",
        "bathrooms",
        "wcCount",
        "totalFloors",
        "floor",
        "buildYear",
        "heating",
        "citizenshipEligible",
        "residenceEligible",
    ],
    VILLA: [
        "rooms",
        "bathrooms",
        "wcCount",
        "totalFloors",
        "floor",
        "buildYear",
        "heating",
        "citizenshipEligible",
        "residenceEligible",
    ],
    PENTHOUSE: [
        "rooms",
        "bathrooms",
        "wcCount",
        "totalFloors",
        "floor",
        "buildYear",
        "heating",
        "citizenshipEligible",
        "residenceEligible",
    ],
    LAND: ["parcelNo", "emsal", "zoningStatus", "citizenshipEligible", "residenceEligible"],
    COMMERCIAL: [
        "groundFloorArea",
        "basementArea",
        "citizenshipEligible",
        "residenceEligible",
    ],
    OFFICE: [
        "groundFloorArea",
        "basementArea",
        "citizenshipEligible",
        "residenceEligible",
    ],
    SHOP: [
        "groundFloorArea",
        "basementArea",
        "citizenshipEligible",
        "residenceEligible",
    ],
    FARM: [
        "existingStructure",
        "hasWaterSource",
        "hasFruitTrees",
        "citizenshipEligible",
        "residenceEligible",
    ],
};

const PROPERTY_TYPE_SET = new Set<string>(PROPERTY_TYPE_OPTIONS.map((option) => option.value));
const ALL_CATEGORY_FIELD_KEYS = Array.from(
    new Set(
        Object.values(CATEGORY_FIELDS_BY_TYPE).flat()
    )
) as ListingCategoryFieldKey[];

function isPropertyTypeValue(value: string): value is PropertyTypeValue {
    return PROPERTY_TYPE_SET.has(value);
}

function normalizeSelectedTypes(selectedTypes: readonly string[]): PropertyTypeValue[] {
    return selectedTypes.filter((type): type is PropertyTypeValue =>
        isPropertyTypeValue(type)
    );
}

export function getVisibleCategoryFieldKeys(
    selectedTypes: readonly string[]
): Set<ListingCategoryFieldKey> {
    const normalizedTypes = normalizeSelectedTypes(selectedTypes);
    const activeTypes =
        normalizedTypes.length > 0
            ? normalizedTypes
            : (PROPERTY_TYPE_OPTIONS.map((option) => option.value) as PropertyTypeValue[]);

    const visibleFieldKeys = new Set<ListingCategoryFieldKey>();

    activeTypes.forEach((type) => {
        CATEGORY_FIELDS_BY_TYPE[type].forEach((fieldKey) => {
            visibleFieldKeys.add(fieldKey);
        });
    });

    if (visibleFieldKeys.size === 0) {
        ALL_CATEGORY_FIELD_KEYS.forEach((fieldKey) => {
            visibleFieldKeys.add(fieldKey);
        });
    }

    return visibleFieldKeys;
}

export function isCategoryFieldVisibleForTypes(
    fieldKey: ListingCategoryFieldKey,
    selectedTypes: readonly string[]
): boolean {
    return getVisibleCategoryFieldKeys(selectedTypes).has(fieldKey);
}
