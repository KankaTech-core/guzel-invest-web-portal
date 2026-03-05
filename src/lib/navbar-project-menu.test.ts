import assert from "node:assert/strict";
import test from "node:test";

import {
    getNavbarProjectMenuColumnCount,
    mapPublicProjectsToMenuItems,
} from "./navbar-project-menu";

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

test("mapPublicProjectsToMenuItems keeps only first two GENERAL features", () => {
    const items = mapPublicProjectsToMenuItems(
        [
            {
                slug: "general-features-only",
                translations: [{ locale: "tr", title: "Genel Özellik Projesi" }],
                media: [
                    {
                        url: "public/listings/3/cover.webp",
                        type: "IMAGE",
                        category: "EXTERIOR",
                        isCover: true,
                    },
                ],
                projectFeatures: [
                    {
                        category: "SOCIAL",
                        order: 0,
                        icon: "Sparkles",
                        translations: [{ locale: "tr", title: "Sosyal Alan" }],
                    },
                    {
                        category: "GENERAL",
                        order: 1,
                        icon: "Car",
                        translations: [{ locale: "tr", title: "Kapalı Otopark" }],
                    },
                    {
                        category: "GENERAL",
                        order: 2,
                        icon: "Shield",
                        translations: [{ locale: "tr", title: "7/24 Güvenlik" }],
                    },
                    {
                        category: "GENERAL",
                        order: 3,
                        icon: "Waves",
                        translations: [{ locale: "tr", title: "Açık Havuz" }],
                    },
                ],
            },
        ],
        "tr"
    );

    assert.deepEqual(items[0]?.features, [
        { icon: "Car", label: "Kapalı Otopark" },
        { icon: "Shield", label: "7/24 Güvenlik" },
    ]);
});

test("getNavbarProjectMenuColumnCount clamps values between 1 and 3", () => {
    assert.equal(getNavbarProjectMenuColumnCount(0), 1);
    assert.equal(getNavbarProjectMenuColumnCount(1), 1);
    assert.equal(getNavbarProjectMenuColumnCount(2), 2);
    assert.equal(getNavbarProjectMenuColumnCount(3), 3);
    assert.equal(getNavbarProjectMenuColumnCount(6), 3);
});
