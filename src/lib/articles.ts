import sanitizeHtml from "sanitize-html";
import { slugify } from "@/lib/utils";

export const ARTICLE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED", "REMOVED"] as const;
export type ArticleStatusValue = (typeof ARTICLE_STATUSES)[number];

export const normalizeOptionalText = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

export const sanitizeArticleContent = (value: unknown): string => {
    const html = typeof value === "string" ? value : "";

    return sanitizeHtml(html, {
        allowedTags: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "p",
            "br",
            "hr",
            "ul",
            "ol",
            "li",
            "blockquote",
            "pre",
            "code",
            "table",
            "thead",
            "tbody",
            "tr",
            "th",
            "td",
            "figure",
            "figcaption",
            "strong",
            "em",
            "u",
            "a",
            "img",
        ],
        allowedAttributes: {
            a: ["href", "target", "rel"],
            img: ["src", "alt", "title", "width", "height", "style"],
        },
        allowedSchemes: ["http", "https"],
        allowProtocolRelative: false,
        allowedStyles: {
            img: {
                width: [/^\d+%$/, /^\d+px$/],
                height: [/^auto$/, /^\d+px$/],
                "max-width": [/^\d+%$/, /^\d+px$/],
            },
        },
        transformTags: {
            a: sanitizeHtml.simpleTransform("a", {
                target: "_blank",
                rel: "noopener noreferrer",
            }),
        },
    }).trim();
};

export const extractPlainText = (value: string): string => {
    const text = sanitizeHtml(value || "", {
        allowedTags: [],
        allowedAttributes: {},
    });
    return text.replace(/\s+/g, " ").trim();
};

interface EstimateReadingStatsOptions {
    minMinutes?: number;
    wordsPerMinute?: number;
    secondsPerImage?: number;
}

export interface ReadingStats {
    wordCount: number;
    readingMinutes: number;
}

const DEFAULT_READING_WORDS_PER_MINUTE = 220;
const DEFAULT_IMAGE_SECONDS = 12;

export const estimateReadingStats = (
    value: string,
    options: EstimateReadingStatsOptions = {}
): ReadingStats => {
    const html = typeof value === "string" ? value : "";
    const plainText = extractPlainText(html);
    const wordCount = plainText
        .split(/\s+/)
        .map((word) => word.trim())
        .filter(Boolean).length;
    const imageCount = (html.match(/<img\b/gi) || []).length;
    const wordsPerMinute = Math.max(1, options.wordsPerMinute ?? DEFAULT_READING_WORDS_PER_MINUTE);
    const minMinutes = Math.max(1, options.minMinutes ?? 1);
    const secondsPerImage = Math.max(0, options.secondsPerImage ?? DEFAULT_IMAGE_SECONDS);

    const wordsDurationMinutes = wordCount / wordsPerMinute;
    const imagesDurationMinutes = (imageCount * secondsPerImage) / 60;
    const readingMinutes = Math.max(
        minMinutes,
        Math.ceil(wordsDurationMinutes + imagesDurationMinutes)
    );

    return { wordCount, readingMinutes };
};

export const normalizeArticleSlug = (value: unknown): string =>
    slugify(typeof value === "string" ? value : "");

export const getArticleSlugBase = (title: string): string => {
    const base = normalizeArticleSlug(title);
    return base || `makale-${Date.now().toString(36)}`;
};

export const resolveArticleExcerpt = (
    providedExcerpt: unknown,
    sanitizedContent: string,
    maxLength = 200
): string => {
    const explicitExcerpt = normalizeOptionalText(providedExcerpt);
    if (explicitExcerpt) {
        return explicitExcerpt.slice(0, maxLength);
    }

    const fallback = extractPlainText(sanitizedContent);
    return fallback.slice(0, maxLength);
};

export const normalizeArticleCategory = (value: unknown): string | null => {
    if (Array.isArray(value)) {
        const first = value.find((item) => typeof item === "string" && item.trim().length > 0);
        return normalizeOptionalText(first);
    }

    return normalizeOptionalText(value);
};

const normalizeTagText = (value: string): string =>
    value.replace(/\s+/g, " ").trim();

export const normalizeArticleTags = (
    value: unknown,
    options: {
        maxTags?: number;
        maxTagLength?: number;
    } = {}
): string[] => {
    const maxTags = options.maxTags ?? 20;
    const maxTagLength = options.maxTagLength ?? 40;

    const candidates =
        Array.isArray(value)
            ? value
            : typeof value === "string"
                ? value.split(",")
                : [];

    if (candidates.length === 0) {
        return [];
    }

    const normalized: string[] = [];
    const seen = new Set<string>();

    for (const candidate of candidates) {
        if (typeof candidate !== "string") continue;
        const next = normalizeTagText(candidate).slice(0, maxTagLength);
        if (!next) continue;

        const key = next.toLocaleLowerCase("tr-TR");
        if (seen.has(key)) continue;

        seen.add(key);
        normalized.push(next);

        if (normalized.length >= maxTags) {
            break;
        }
    }

    return normalized;
};

export const toArticleStatusOrDefault = (
    value: unknown,
    fallback: ArticleStatusValue = "DRAFT"
): ArticleStatusValue => {
    if (typeof value === "string" && ARTICLE_STATUSES.includes(value as ArticleStatusValue)) {
        return value as ArticleStatusValue;
    }

    return fallback;
};
