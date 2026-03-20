import { defineRouting } from "next-intl/routing";
import { defaultLocale, publicLocales } from "@/i18n/public-locales";

export const locales = publicLocales;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    locales,
    defaultLocale,
    localePrefix: "always",
    localeDetection: true,
});
