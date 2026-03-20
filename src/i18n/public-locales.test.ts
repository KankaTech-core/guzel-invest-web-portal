import assert from "node:assert/strict";
import test from "node:test";
import {
    buildLocalizedPath,
    defaultLocale,
    isPublicLocale,
    localeDisplayNames,
    localeDisplayOrder,
    publicLocales,
} from "@/i18n/public-locales";

test("public locales are exposed in display order", () => {
    assert.deepEqual(publicLocales, ["tr", "en", "ru", "de"]);
    assert.equal(defaultLocale, "tr");
});

test("public locale metadata excludes Arabic", () => {
    assert.equal(isPublicLocale("ar"), false);
    assert.equal(localeDisplayNames.en, "EN");
    assert.deepEqual(localeDisplayOrder, ["en", "tr", "ru", "de"]);
});

test("buildLocalizedPath preserves pathname query and hash", () => {
    const result = buildLocalizedPath({
        pathname: "/tr/projeler",
        locale: "en",
        search: "?onlyProjects=true&sort=priceAsc",
        hash: "#contact",
    });

    assert.equal(result, "/en/projeler?onlyProjects=true&sort=priceAsc#contact");
});
