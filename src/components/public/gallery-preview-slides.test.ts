import assert from "node:assert/strict";
import test from "node:test";
import { buildGalleryPreviewSlides } from "./gallery-preview-slides";

const sampleItems = [
    { id: "1", src: "https://example.com/1.jpg", alt: "1" },
    { id: "2", src: "https://example.com/2.jpg", alt: "2" },
    { id: "3", src: "https://example.com/3.jpg", alt: "3" },
    { id: "4", src: "https://example.com/4.jpg", alt: "4" },
    { id: "5", src: "https://example.com/5.jpg", alt: "5" },
];

test("buildGalleryPreviewSlides returns first four image slides by default", () => {
    const slides = buildGalleryPreviewSlides(sampleItems);

    assert.equal(slides.length, 4);
    assert.deepEqual(
        slides.map((slide) => slide.type),
        ["image", "image", "image", "image"]
    );
    const lastSlide = slides[3];
    assert.equal(lastSlide?.type, "image");
    if (lastSlide?.type === "image") {
        assert.equal(lastSlide.item.id, "4");
    }
});

test("buildGalleryPreviewSlides appends view-all as last slide when enabled", () => {
    const slides = buildGalleryPreviewSlides(sampleItems, {
        includeViewAllSlide: true,
        viewAllLabel: "Tümünü Gör",
    });

    assert.equal(slides.length, 4);
    assert.deepEqual(
        slides.map((slide) => slide.type),
        ["image", "image", "image", "view-all"]
    );
    const lastSlide = slides[3];
    assert.equal(lastSlide?.type, "view-all");
    if (lastSlide?.type === "view-all") {
        assert.equal(lastSlide.label, "Tümünü Gör");
    }
});

test("buildGalleryPreviewSlides keeps view-all as last slide for single-image gallery", () => {
    const slides = buildGalleryPreviewSlides([sampleItems[0]], {
        includeViewAllSlide: true,
    });

    assert.equal(slides.length, 2);
    assert.deepEqual(
        slides.map((slide) => slide.type),
        ["image", "view-all"]
    );
});
