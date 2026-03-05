import assert from "node:assert/strict";
import test from "node:test";
import { getPeekingCarouselTranslatePx } from "./peeking-carousel-math";

test("uses viewport-based step size for each carousel move", () => {
    assert.equal(
        getPeekingCarouselTranslatePx({
            currentIndex: 1,
            viewportWidthPx: 900,
            cardWidthPercent: 75,
            gapPx: 20,
        }),
        695
    );

    assert.equal(
        getPeekingCarouselTranslatePx({
            currentIndex: 2,
            viewportWidthPx: 900,
            cardWidthPercent: 75,
            gapPx: 20,
        }),
        1390
    );
});

test("returns zero translate for index zero", () => {
    assert.equal(
        getPeekingCarouselTranslatePx({
            currentIndex: 0,
            viewportWidthPx: 900,
            cardWidthPercent: 75,
            gapPx: 20,
        }),
        0
    );
});
