import assert from "node:assert/strict";
import test from "node:test";

import { mapPublicProjectsToMenuItems } from "./navbar-project-menu";

test("mapPublicProjectsToMenuItems picks locale title, cover image and project detail href", () => {
    const items = mapPublicProjectsToMenuItems(
        [
            {
                slug: "the-colosseum-oba",
                updatedAt: "2026-02-25T20:00:00.000Z",
                translations: [
                    { locale: "en", title: "The Colosseum" },
                    { locale: "tr", title: "The Colosseum Oba" },
                ],
                media: [
                    { url: "public/listings/1/document.pdf", type: "DOCUMENT", category: "DOCUMENT", isCover: false },
                    { url: "public/listings/1/cover.webp", type: "IMAGE", category: "EXTERIOR", isCover: true },
                ],
            },
        ],
        "tr"
    );

    assert.equal(items.length, 1);
    assert.equal(items[0]?.title, "The Colosseum Oba");
    assert.equal(items[0]?.href, "/proje/the-colosseum-oba");
    assert.equal(items[0]?.image, "public/listings/1/cover.webp");
    assert.equal(items[0]?.imageVersion, "2026-02-25T20:00:00.000Z");
});

test("mapPublicProjectsToMenuItems falls back to first image and safe title", () => {
    const items = mapPublicProjectsToMenuItems(
        [
            {
                slug: "sunset",
                translations: [],
                media: [
                    { url: "public/listings/2/fallback.webp", type: "IMAGE", category: "INTERIOR", isCover: false },
                ],
            },
        ],
        "tr"
    );

    assert.equal(items.length, 1);
    assert.equal(items[0]?.title, "Yeni Proje");
    assert.equal(items[0]?.image, "public/listings/2/fallback.webp");
    assert.equal(items[0]?.imageVersion, "public/listings/2/fallback.webp");
});
