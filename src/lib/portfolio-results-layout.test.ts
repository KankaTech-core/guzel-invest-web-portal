import assert from "node:assert/strict";
import test from "node:test";

import { resolvePortfolioResultsLayout } from "./portfolio-results-layout";

test("uses filtered listings when there are matches", () => {
    const result = resolvePortfolioResultsLayout({
        filteredListings: ["a", "b"],
        fallbackListings: ["x"],
        hasActiveFilters: true,
    });

    assert.deepEqual(result.visibleListings, ["a", "b"]);
    assert.equal(result.showNoResultsCard, false);
    assert.equal(result.showDivider, false);
    assert.equal(result.shouldFetchFallbackListings, false);
});

test("shows fallback listings with divider when active filters have no matches", () => {
    const result = resolvePortfolioResultsLayout({
        filteredListings: [],
        fallbackListings: ["x", "y"],
        hasActiveFilters: true,
    });

    assert.deepEqual(result.visibleListings, ["x", "y"]);
    assert.equal(result.showNoResultsCard, true);
    assert.equal(result.showDivider, true);
    assert.equal(result.shouldFetchFallbackListings, true);
});

test("keeps only empty state when fallback listings are unavailable", () => {
    const result = resolvePortfolioResultsLayout({
        filteredListings: [],
        fallbackListings: [],
        hasActiveFilters: true,
    });

    assert.deepEqual(result.visibleListings, []);
    assert.equal(result.showNoResultsCard, true);
    assert.equal(result.showDivider, false);
    assert.equal(result.shouldFetchFallbackListings, true);
});

test("does not show fallback listings without active filters", () => {
    const result = resolvePortfolioResultsLayout({
        filteredListings: [],
        fallbackListings: ["x"],
        hasActiveFilters: false,
    });

    assert.deepEqual(result.visibleListings, []);
    assert.equal(result.showNoResultsCard, true);
    assert.equal(result.showDivider, false);
    assert.equal(result.shouldFetchFallbackListings, false);
});
