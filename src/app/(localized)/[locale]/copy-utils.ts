export const publicLocales = ["tr", "en", "ru", "de"] as const;

export type PublicLocale = (typeof publicLocales)[number];

export function normalizePublicLocale(locale?: string | null): PublicLocale {
    const base = locale?.toLowerCase().split("-")[0];
    return base && publicLocales.includes(base as PublicLocale)
        ? (base as PublicLocale)
        : "tr";
}

export function pickLocaleCopy<T>(copies: Record<PublicLocale, T>, locale?: string | null) {
    return copies[normalizePublicLocale(locale)] ?? copies.tr;
}
