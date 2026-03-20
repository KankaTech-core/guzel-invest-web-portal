export const publicLocales = ["tr", "en", "ru", "de"] as const;
export const localeDisplayOrder = ["en", "tr", "ru", "de"] as const;

export type Locale = (typeof publicLocales)[number];

export const defaultLocale: Locale = "en";

export const localeDisplayNames: Record<Locale, string> = {
    tr: "TR",
    en: "EN",
    ru: "RU",
    de: "DE",
};

export const localeNames: Record<Locale, string> = {
    tr: "Türkçe",
    en: "English",
    ru: "Русский",
    de: "Deutsch",
};

export const localeFlags: Record<Locale, string> = {
    tr: "🇹🇷",
    en: "🇬🇧",
    ru: "🇷🇺",
    de: "🇩🇪",
};

export const rtlLocales: Locale[] = [];

export function isRtl(locale: Locale): boolean {
    return rtlLocales.includes(locale);
}

export function isPublicLocale(value: string): value is Locale {
    return publicLocales.includes(value as Locale);
}

export function normalizeLocaleTag(value: string | null | undefined): string {
    if (typeof value !== "string") {
        return "";
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized) {
        return "";
    }

    return normalized.split(/[-_]/)[0] || "";
}

export function buildLocalizedPath({
    pathname,
    locale,
    search = "",
    hash = "",
}: {
    pathname: string;
    locale: Locale;
    search?: string;
    hash?: string;
}): string {
    const safePathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const segments = safePathname.split("/");
    const nextSegments = [...segments];
    const currentLocale = segments[1] ?? "";

    if (isPublicLocale(currentLocale)) {
        nextSegments[1] = locale;
    } else {
        nextSegments.splice(1, 0, locale);
    }

    const nextPathname = nextSegments.join("/").replace(/\/+$/, "") || "/";
    const normalizedSearch = search ? (search.startsWith("?") ? search : `?${search}`) : "";
    const normalizedHash = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";

    return `${nextPathname}${normalizedSearch}${normalizedHash}`;
}
