import assert from "node:assert/strict";
import test from "node:test";

import {
    getImageSwipeDirection,
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
