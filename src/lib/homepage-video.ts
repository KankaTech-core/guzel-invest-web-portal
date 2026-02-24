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

export const DEFAULT_HOMEPAGE_VIDEO_ID = "RrAT0lyOO2M";

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

export const buildHomepageHeroAutoplayEmbedUrl = (videoId: string): string =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&playsinline=1`;

export const buildHomepageHeroPopupEmbedUrl = (videoId: string): string =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1&rel=0&playsinline=1`;

export interface HomepageHeroVideoConfig {
    rawInput: string;
    videoId: string;
    embedBaseUrl: string;
    watchUrl: string;
    autoplayEmbedUrl: string;
    popupEmbedUrl: string;
}

export const resolveHomepageHeroVideo = (
    input: string | null | undefined
): HomepageHeroVideoConfig => {
    const rawInput = (input || "").trim();
    const extractedId = rawInput ? extractYoutubeVideoId(rawInput) : null;
    const videoId = extractedId || DEFAULT_HOMEPAGE_VIDEO_ID;

    return {
        rawInput: rawInput || `https://www.youtube.com/embed/${videoId}`,
        videoId,
        embedBaseUrl: `https://www.youtube.com/embed/${videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        autoplayEmbedUrl: buildHomepageHeroAutoplayEmbedUrl(videoId),
        popupEmbedUrl: buildHomepageHeroPopupEmbedUrl(videoId),
    };
};
