import assert from "node:assert/strict";
import test from "node:test";

import { resolvePortfolioResultCount } from "./portfolio-result-count";

test("uses API total count when available", () => {
    assert.equal(
        resolvePortfolioResultCount({
            totalCount: 13,
            loadedCount: 8,
        }),
        13
    );
});

test("keeps zero total count when there are no matching records", () => {
    assert.equal(
        resolvePortfolioResultCount({
            totalCount: 0,
            loadedCount: 8,
        }),
        0
    );
});

test("falls back to loaded count when API total count is missing", () => {
    assert.equal(
        resolvePortfolioResultCount({
            loadedCount: 8,
        }),
        8
    );
});
