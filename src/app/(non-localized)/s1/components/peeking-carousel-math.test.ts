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

test("supports variable card widths and keeps translation within track bounds", () => {
    assert.equal(
        getPeekingCarouselTranslatePx({
            currentIndex: 2,
            viewportWidthPx: 900,
            cardWidthPercent: 75,
            gapPx: 20,
            itemWidthsPercent: [75, 75, 75, 75, 18.75],
        }),
        1390
    );

    assert.equal(
        getPeekingCarouselTranslatePx({
            currentIndex: 4,
            viewportWidthPx: 900,
            cardWidthPercent: 75,
            gapPx: 20,
            itemWidthsPercent: [75, 75, 75, 75, 18.75],
        }),
        2048.75
    );
});
