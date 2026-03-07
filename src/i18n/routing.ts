import { defineRouting } from "next-intl/routing";

export const locales = ["tr"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
    locales,
    defaultLocale: "tr",
    localePrefix: "always",
    localeDetection: false,
});
