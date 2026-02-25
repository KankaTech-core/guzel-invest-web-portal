const GOOGLE_MAPS_SHORT_HOSTS = ["maps.app.goo.gl", "goo.gl"] as const;
const DEFAULT_SHORT_LINK_RESOLVE_TIMEOUT_MS = 3000;

export interface GoogleMapsCoordinates {
    latitude: number;
    longitude: number;
}

interface ExpandGoogleMapsShortLinkOptions {
    fetchImpl?: (input: string, init?: RequestInit) => Promise<{ url?: string }>;
    timeoutMs?: number;
}

export const isGoogleMapsShortHost = (hostname: string): boolean =>
    GOOGLE_MAPS_SHORT_HOSTS.some(
        (shortHost) => hostname === shortHost || hostname.endsWith(`.${shortHost}`)
    );

export const isGoogleMapsShortLink = (
    value: string | null | undefined
): boolean => {
    if (!value) return false;
    const trimmed = value.trim();
    if (!trimmed) return false;

    try {
        const url = new URL(trimmed);
        return isGoogleMapsShortHost(url.hostname.toLowerCase());
    } catch {
        return false;
    }
};

export const isLikelyGoogleMapsUrl = (url: URL): boolean => {
    const host = url.hostname.toLowerCase();
    if (isGoogleMapsShortHost(host)) return true;
    if (!host.includes("google.")) return false;

    return (
        host.startsWith("maps.") ||
        url.pathname.startsWith("/maps") ||
        url.pathname.startsWith("/place")
    );
};

const trimTrailingPunctuation = (value: string): string =>
    value.replace(/[\]\)\},.;]+$/g, "");

export const normalizeGoogleMapsLink = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    const cleaned = trimTrailingPunctuation(trimmed);
    try {
        const url = new URL(cleaned);
        return isLikelyGoogleMapsUrl(url) ? cleaned : null;
    } catch {
        return null;
    }
};

const parseLatLngFromText = (
    value: string | null | undefined
): GoogleMapsCoordinates | null => {
    if (!value) return null;
    const match = value.match(/(-?\d{1,2}(?:\.\d+)?)[,\s]+(-?\d{1,3}(?:\.\d+)?)/);
    if (!match) return null;

    const latitude = Number(match[1]);
    const longitude = Number(match[2]);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;

    return { latitude, longitude };
};

export const extractCoordinatesFromGoogleMapsLink = (
    value: string
): GoogleMapsCoordinates | null => {
    try {
        const url = new URL(value);
        const candidates = [
            url.searchParams.get("q"),
            url.searchParams.get("query"),
            url.searchParams.get("ll"),
            url.searchParams.get("center"),
        ];

        for (const candidate of candidates) {
            const parsed = parseLatLngFromText(candidate);
            if (parsed) return parsed;
        }

        const atMatch = url.pathname.match(
            /@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/
        );
        if (atMatch) {
            return parseLatLngFromText(`${atMatch[1]},${atMatch[2]}`);
        }

        const bangMatch = url.pathname.match(
            /!3d(-?\d{1,2}(?:\.\d+)?)!4d(-?\d{1,3}(?:\.\d+)?)/
        );
        if (bangMatch) {
            return parseLatLngFromText(`${bangMatch[1]},${bangMatch[2]}`);
        }

        const reverseBangMatch = url.pathname.match(
            /!4d(-?\d{1,3}(?:\.\d+)?)!3d(-?\d{1,2}(?:\.\d+)?)/
        );
        if (reverseBangMatch) {
            return parseLatLngFromText(`${reverseBangMatch[2]},${reverseBangMatch[1]}`);
        }
    } catch {
        return null;
    }

    return null;
};

export const expandGoogleMapsShortLink = async (
    value: string,
    options: ExpandGoogleMapsShortLinkOptions = {}
): Promise<string> => {
    const fetchImpl = options.fetchImpl ?? fetch;
    const timeoutMs = options.timeoutMs ?? DEFAULT_SHORT_LINK_RESOLVE_TIMEOUT_MS;

    try {
        const url = new URL(value);
        if (!isGoogleMapsShortHost(url.hostname.toLowerCase())) {
            return value;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetchImpl(value, {
                redirect: "follow",
                signal: controller.signal,
            });
            if (response?.url) return response.url;
        } finally {
            clearTimeout(timeoutId);
        }
    } catch {
        return value;
    }

    return value;
};

export const resolveGoogleMapsLink = async (
    value: unknown,
    options: ExpandGoogleMapsShortLinkOptions = {}
): Promise<{ link: string; coordinates: GoogleMapsCoordinates | null } | null> => {
    const normalized = normalizeGoogleMapsLink(value);
    if (!normalized) return null;

    const expanded = await expandGoogleMapsShortLink(normalized, options);
    const normalizedExpanded = normalizeGoogleMapsLink(expanded) || normalized;

    return {
        link: normalizedExpanded,
        coordinates:
            extractCoordinatesFromGoogleMapsLink(normalizedExpanded) ||
            extractCoordinatesFromGoogleMapsLink(normalized),
    };
};

export const toGoogleMapsEmbedLink = (
    value: string | null | undefined
): string | null => {
    const normalized = normalizeGoogleMapsLink(value);
    if (!normalized) return null;

    try {
        const url = new URL(normalized);
        const host = url.hostname.toLowerCase();

        // Short links frequently produce "Some customised on-map content..."
        // in iframe embeds. We resolve them first and then embed the expanded URL.
        if (isGoogleMapsShortHost(host)) {
            return null;
        }

        const coordinates = extractCoordinatesFromGoogleMapsLink(normalized);
        if (coordinates) {
            return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&z=15&output=embed`;
        }

        url.searchParams.set("output", "embed");
        return url.toString();
    } catch {
        return null;
    }
};
