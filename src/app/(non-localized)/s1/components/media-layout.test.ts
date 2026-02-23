import assert from "node:assert/strict";
import test from "node:test";
import {
    getMapSectionLayout,
    hasSocialGalleryImages,
} from "./media-layout";

test("uses split map layout when map embed and map gallery images both exist", () => {
    const layout = getMapSectionLayout({
        hasMapContent: true,
        mapImageCount: 2,
    });

    assert.deepEqual(layout, {
        showSection: true,
        showMapCard: true,
        showMapGalleryCard: true,
        useSplitLayout: true,
    });
});

test("shows only map card when map images are missing", () => {
    const layout = getMapSectionLayout({
        hasMapContent: true,
        mapImageCount: 0,
    });

    assert.deepEqual(layout, {
        showSection: true,
        showMapCard: true,
        showMapGalleryCard: false,
        useSplitLayout: false,
    });
});

test("shows only map gallery card when map embed is missing", () => {
    const layout = getMapSectionLayout({
        hasMapContent: false,
        mapImageCount: 3,
    });

    assert.deepEqual(layout, {
        showSection: true,
        showMapCard: false,
        showMapGalleryCard: true,
        useSplitLayout: false,
    });
});

test("hides map section entirely when both map embed and map gallery are missing", () => {
    const layout = getMapSectionLayout({
        hasMapContent: false,
        mapImageCount: 0,
    });

    assert.deepEqual(layout, {
        showSection: false,
        showMapCard: false,
        showMapGalleryCard: false,
        useSplitLayout: false,
    });
});

test("detects social gallery visibility from image list", () => {
    assert.equal(hasSocialGalleryImages([]), false);
    assert.equal(hasSocialGalleryImages(["https://example.com/social.jpg"]), true);
});
