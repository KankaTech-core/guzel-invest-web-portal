export const PROJECT_ICON_OPTIONS = [
    "Building2",
    "BedDouble",
    "Bath",
    "Trees",
    "ShieldCheck",
    "Car",
    "Dumbbell",
    "Waves",
    "MapPin",
    "Sun",
    "Flower2",
    "Sparkles",
    "School",
    "Hospital",
    "ShoppingBag",
    "Store",
    "Bus",
    "Bike",
    "UtensilsCrossed",
    "Coffee",
    "Wifi",
    "Camera",
    "Video",
    "PlayCircle",
    "CircleParking",
    "Landmark",
    "Building",
    "House",
    "SquareParking",
    "TreePine",
    "Footprints",
    "Phone",
    "Clock3",
    "BadgeCheck",
] as const;

export type ProjectIconName = (typeof PROJECT_ICON_OPTIONS)[number];
export const PROJECT_CUSTOM_SVG_DATA_URI_PREFIX = "data:image/svg+xml;base64,";

const PROJECT_ICON_SET = new Set<string>(PROJECT_ICON_OPTIONS);
const BASE64_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;
const UNSAFE_SVG_PATTERN = /<script|on\w+\s*=|javascript:|<foreignobject/i;
const SVG_ROOT_PATTERN = /<svg[\s>]/i;
const MAX_CUSTOM_SVG_DATA_URI_LENGTH = 40_000;

const decodeBase64 = (value: string): string | null => {
    try {
        if (typeof globalThis.atob === "function") {
            const binary = globalThis.atob(value);
            const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
            return new TextDecoder().decode(bytes);
        }
    } catch {
        return null;
    }

    return null;
};

export function isCustomProjectIconDataUri(value: unknown): value is string {
    if (typeof value !== "string") return false;
    const trimmed = value.trim();

    if (!trimmed.startsWith(PROJECT_CUSTOM_SVG_DATA_URI_PREFIX)) {
        return false;
    }
    if (trimmed.length > MAX_CUSTOM_SVG_DATA_URI_LENGTH) {
        return false;
    }

    const payload = trimmed.slice(PROJECT_CUSTOM_SVG_DATA_URI_PREFIX.length);
    if (!payload || !BASE64_PATTERN.test(payload)) {
        return false;
    }

    const decoded = decodeBase64(payload);
    if (!decoded || decoded.length === 0) {
        return false;
    }

    return SVG_ROOT_PATTERN.test(decoded) && !UNSAFE_SVG_PATTERN.test(decoded);
}

export function normalizeProjectIcon(
    value: unknown,
    fallback: ProjectIconName = "Building2"
): string {
    if (typeof value !== "string") {
        return fallback;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return fallback;
    }

    if (PROJECT_ICON_SET.has(trimmed)) {
        return trimmed;
    }

    return isCustomProjectIconDataUri(trimmed) ? trimmed : fallback;
}
