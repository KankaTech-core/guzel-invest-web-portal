import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import {
    defaultLocale,
    isRtl,
    localeFlags,
    localeNames,
    normalizeLocaleTag,
    publicLocales,
    type Locale,
} from "@/i18n/public-locales";

export { defaultLocale, isRtl, localeFlags, localeNames, publicLocales as locales };
export type { Locale };

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const normalizedRequested = normalizeLocaleTag(requested);
    const locale = hasLocale(publicLocales, normalizedRequested)
        ? (normalizedRequested as Locale)
        : defaultLocale;

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default,
    };
});
