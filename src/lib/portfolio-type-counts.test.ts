import assert from "node:assert/strict";
import test from "node:test";

import { PROPERTY_TYPE_OPTIONS } from "./listing-type-rules";
import { buildPortfolioTypeCounts } from "./portfolio-type-counts";

test("returns all known property types with zero when DB rows are empty", () => {
    const counts = buildPortfolioTypeCounts([]);

    PROPERTY_TYPE_OPTIONS.forEach((option) => {
        assert.equal(counts[option.value], 0);
    });
});

test("maps DB groupBy rows to category counts", () => {
    const counts = buildPortfolioTypeCounts([
        { type: "APARTMENT", _count: { _all: 7 } },
        { type: "LAND", _count: { _all: 2 } },
        { type: "CUSTOM", _count: { _all: 5 } },
    ]);

    assert.equal(counts.APARTMENT, 7);
    assert.equal(counts.LAND, 2);
    assert.equal(counts.CUSTOM, 5);
    assert.equal(counts.VILLA, 0);
});

test("ignores non-finite and negative values from DB rows", () => {
    const counts = buildPortfolioTypeCounts([
        { type: "APARTMENT", _count: { _all: Number.NaN } },
        { type: "VILLA", _count: { _all: -2 } },
        { type: "SHOP", _count: { _all: 3.9 } },
    ]);

    assert.equal(counts.APARTMENT, 0);
    assert.equal(counts.VILLA, 0);
    assert.equal(counts.SHOP, 3);
});
