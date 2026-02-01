import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

export const locales = ["tr", "en", "de", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
    tr: "Türkçe",
    en: "English",
    de: "Deutsch",
    ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
    tr: "🇹🇷",
    en: "🇬🇧",
    de: "🇩🇪",
    ar: "🇸🇦",
};

// RTL languages
export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
    return rtlLocales.includes(locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(locales, requested) ? requested : defaultLocale;

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});
