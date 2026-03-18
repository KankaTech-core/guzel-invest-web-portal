import assert from "node:assert/strict";
import test from "node:test";
import {
    getLocalizedFallbackLocales,
    normalizeLocaleTag,
    pickLocalizedEntry,
} from "./public-content-localization";

test("pickLocalizedEntry prefers the requested locale", () => {
    const entry = pickLocalizedEntry(
        [
            { locale: "tr", title: "Türkçe" },
            { locale: "en", title: "English" },
        ],
        "en"
    );

    assert.deepEqual(entry, { locale: "en", title: "English" });
});

test("pickLocalizedEntry falls back to Turkish when the requested locale is missing", () => {
    const entry = pickLocalizedEntry(
        [
            { locale: "tr", title: "Türkçe" },
            { locale: "de", title: "Deutsch" },
        ],
        "ru"
    );

    assert.deepEqual(entry, { locale: "tr", title: "Türkçe" });
});

test("pickLocalizedEntry falls back to the first available item when Turkish is missing", () => {
    const entry = pickLocalizedEntry(
        [
            { locale: "de", title: "Deutsch" },
            { locale: "fr", title: "Français" },
        ],
        "ru"
    );

    assert.deepEqual(entry, { locale: "de", title: "Deutsch" });
});

test("pickLocalizedEntry normalizes locale tags before matching", () => {
    const entry = pickLocalizedEntry(
        [
            { locale: "tr", title: "Türkçe" },
            { locale: "en", title: "English" },
        ],
        "en-US"
    );

    assert.deepEqual(entry, { locale: "en", title: "English" });
});

test("normalizeLocaleTag lowers case and strips region tags", () => {
    assert.equal(normalizeLocaleTag("EN-us"), "en");
    assert.equal(normalizeLocaleTag("  tr-TR  "), "tr");
});

test("getLocalizedFallbackLocales keeps requested locale first and Turkish second", () => {
    assert.deepEqual(getLocalizedFallbackLocales("en-US"), ["en", "tr"]);
    assert.deepEqual(getLocalizedFallbackLocales("tr"), ["tr"]);
});
