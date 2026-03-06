import assert from "node:assert/strict";
import test from "node:test";
import { resolveGalleryOpenIndex } from "./gallery-open-index";

test("resolveGalleryOpenIndex returns null when index is missing or invalid", () => {
    assert.equal(resolveGalleryOpenIndex(undefined, 4), null);
    assert.equal(resolveGalleryOpenIndex("2", 4), null);
    assert.equal(resolveGalleryOpenIndex(Number.NaN, 4), null);
});

test("resolveGalleryOpenIndex clamps within available item range", () => {
    assert.equal(resolveGalleryOpenIndex(-2, 4), 0);
    assert.equal(resolveGalleryOpenIndex(2, 4), 2);
    assert.equal(resolveGalleryOpenIndex(99, 4), 3);
});

test("resolveGalleryOpenIndex returns null when there are no gallery items", () => {
    assert.equal(resolveGalleryOpenIndex(0, 0), null);
});
