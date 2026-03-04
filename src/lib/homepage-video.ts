const YOUTUBE_HOSTS = new Set([
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "www.youtu.be",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
]);

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const VIDEO_FILE_EXTENSIONS = new Set(["mp4", "webm", "ogg", "mov", "m4v"]);

export const DEFAULT_HOMEPAGE_VIDEO_ID = "RrAT0lyOO2M";

const resolveMediaUrl = (path: string): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    const bucket = process.env.NEXT_PUBLIC_MINIO_BUCKET || "guzel-invest";

    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${cleanBaseUrl}/${bucket}/${cleanPath}`;
};

const coerceYoutubeUrl = (value: string): URL | null => {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    if (trimmed.includes("<iframe")) {
        const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
        if (!srcMatch?.[1]) {
            return null;
        }

        try {
            return new URL(srcMatch[1]);
        } catch {
            return null;
        }
    }

    try {
        return new URL(trimmed);
    } catch {
        return null;
    }
};

const sanitizeVideoId = (value: string | null | undefined): string | null => {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();
    if (!YOUTUBE_ID_PATTERN.test(trimmed)) {
        return null;
    }

    return trimmed;
};

export const extractYoutubeVideoId = (value: string): string | null => {
    const url = coerceYoutubeUrl(value);
    if (!url) {
        return null;
    }

    if (!YOUTUBE_HOSTS.has(url.hostname)) {
        return null;
    }

    if (url.hostname.includes("youtu.be")) {
        return sanitizeVideoId(url.pathname.slice(1));
    }

    const watchId = sanitizeVideoId(url.searchParams.get("v"));
    if (watchId) {
        return watchId;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
        return null;
    }

    const [section, maybeId] = pathParts;
    if (section !== "embed" && section !== "shorts" && section !== "v") {
        return null;
    }

    return sanitizeVideoId(maybeId);
};

const getPathFromInput = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    try {
        return new URL(trimmed).pathname || "";
    } catch {
        return trimmed;
    }
};

export const isLikelyVideoFileInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    if (extractYoutubeVideoId(trimmed)) return false;

    const path = getPathFromInput(trimmed)
        .split("?")[0]
        .split("#")[0]
        .toLowerCase();

    const extension = path.split(".").pop() || "";
    return VIDEO_FILE_EXTENSIONS.has(extension);
};

export const buildHomepageHeroAutoplayEmbedUrl = (videoId: string): string =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&playsinline=1`;

export const buildHomepageHeroPopupEmbedUrl = (videoId: string): string =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1&rel=0&playsinline=1`;

export type HomepageHeroVideoSource = "youtube" | "file";

export interface HomepageHeroVideoConfig {
    source: HomepageHeroVideoSource;
    rawInput: string;
    videoId: string | null;
    embedBaseUrl: string | null;
    watchUrl: string | null;
    autoplayEmbedUrl: string | null;
    popupEmbedUrl: string | null;
    playbackUrl: string;
}

export const resolveHomepageHeroVideo = (
    input: string | null | undefined
): HomepageHeroVideoConfig => {
    const rawInput = (input || "").trim();
    const extractedId = rawInput ? extractYoutubeVideoId(rawInput) : null;

    if (extractedId) {
        return {
            source: "youtube",
            rawInput,
            videoId: extractedId,
            embedBaseUrl: `https://www.youtube.com/embed/${extractedId}`,
            watchUrl: `https://www.youtube.com/watch?v=${extractedId}`,
            autoplayEmbedUrl: buildHomepageHeroAutoplayEmbedUrl(extractedId),
            popupEmbedUrl: buildHomepageHeroPopupEmbedUrl(extractedId),
            playbackUrl: `https://www.youtube.com/watch?v=${extractedId}`,
        };
    }

    if (rawInput && isLikelyVideoFileInput(rawInput)) {
        return {
            source: "file",
            rawInput,
            videoId: null,
            embedBaseUrl: null,
            watchUrl: null,
            autoplayEmbedUrl: null,
            popupEmbedUrl: null,
            playbackUrl: resolveMediaUrl(rawInput),
        };
    }

    const fallbackVideoId = DEFAULT_HOMEPAGE_VIDEO_ID;

    return {
        source: "youtube",
        rawInput: `https://www.youtube.com/embed/${fallbackVideoId}`,
        videoId: fallbackVideoId,
        embedBaseUrl: `https://www.youtube.com/embed/${fallbackVideoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${fallbackVideoId}`,
        autoplayEmbedUrl: buildHomepageHeroAutoplayEmbedUrl(fallbackVideoId),
        popupEmbedUrl: buildHomepageHeroPopupEmbedUrl(fallbackVideoId),
        playbackUrl: `https://www.youtube.com/watch?v=${fallbackVideoId}`,
    };
};
