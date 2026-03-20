import { normalizeLocaleTag } from "@/i18n/public-locales";

export type LocalizedEntry = {
    locale: string;
};

export function getLocalizedFallbackLocales(
    requestedLocale: string,
    fallbackLocale = "tr"
): string[] {
    const locales = [normalizeLocaleTag(requestedLocale), normalizeLocaleTag(fallbackLocale)].filter(
        Boolean
    );

    return Array.from(new Set(locales));
}

export function pickLocalizedEntry<T extends LocalizedEntry>(
    entries: readonly T[] | null | undefined,
    requestedLocale: string,
    fallbackLocale = "tr"
): T | null {
    const items = Array.isArray(entries) ? entries : [];
    if (items.length === 0) {
        return null;
    }

    const normalizedRequestedLocale = normalizeLocaleTag(requestedLocale);
    const normalizedFallbackLocale = normalizeLocaleTag(fallbackLocale);
    const normalizedEntries = items.map((entry) => ({
        entry,
        locale: normalizeLocaleTag(entry.locale),
    }));

    const preferredEntry =
        normalizedEntries.find((item) => item.locale === normalizedRequestedLocale)?.entry ||
        normalizedEntries.find((item) => item.locale === normalizedFallbackLocale)?.entry ||
        items[0];

    return preferredEntry ?? null;
}

export { normalizeLocaleTag } from "@/i18n/public-locales";
