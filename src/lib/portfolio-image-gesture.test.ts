import assert from "node:assert/strict";
import test from "node:test";

import {
    getImageSwipeDirection,
    shouldIgnoreImageTapAfterSwipe,
    shouldSwipeImageCarousel,
} from "./portfolio-image-gesture";

test("shouldSwipeImageCarousel returns true only for horizontal drags above threshold", () => {
    assert.equal(
        shouldSwipeImageCarousel({ deltaX: 60, deltaY: 12, thresholdPx: 48 }),
        true
    );
    assert.equal(
        shouldSwipeImageCarousel({ deltaX: -70, deltaY: 10, thresholdPx: 48 }),
        true
    );
    assert.equal(
        shouldSwipeImageCarousel({ deltaX: 40, deltaY: 2, thresholdPx: 48 }),
        false
    );
    assert.equal(
        shouldSwipeImageCarousel({ deltaX: 80, deltaY: 80, thresholdPx: 48 }),
        false
    );
    assert.equal(
        shouldSwipeImageCarousel({ deltaX: 30, deltaY: 90, thresholdPx: 48 }),
        false
    );
});

test("getImageSwipeDirection maps negative and positive deltas", () => {
    assert.equal(getImageSwipeDirection(-10), "next");
    assert.equal(getImageSwipeDirection(24), "prev");
});

test("shouldIgnoreImageTapAfterSwipe ignores taps during swipe cooldown only", () => {
    assert.equal(
        shouldIgnoreImageTapAfterSwipe({
            lastSwipeAt: 1_000,
            now: 1_250,
            cooldownMs: 400,
        }),
        true
    );
    assert.equal(
        shouldIgnoreImageTapAfterSwipe({
            lastSwipeAt: 1_000,
            now: 1_500,
            cooldownMs: 400,
        }),
        false
    );
    assert.equal(
        shouldIgnoreImageTapAfterSwipe({
            lastSwipeAt: undefined,
            now: 1_250,
            cooldownMs: 400,
        }),
        false
    );
});
