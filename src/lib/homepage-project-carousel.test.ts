import assert from "node:assert/strict";
import test from "node:test";

import {
    HOMEPAGE_PROJECT_LIMIT,
    HOMEPAGE_PROJECT_SLOTS,
    canSelectProjectForHomepageCarousel,
    findFirstAvailableHomepageProjectSlot,
    getHomepageProjectSelectionError,
    parseHomepageProjectSlot,
    pickHomepageProjectsForCarousel,
} from "./homepage-project-carousel";

test("canSelectProjectForHomepageCarousel enforces max 3 selections", () => {
    assert.equal(HOMEPAGE_PROJECT_LIMIT, 3);
    assert.equal(
        canSelectProjectForHomepageCarousel({
            selectedCount: 2,
            isAlreadySelected: false,
        }),
        true
    );
    assert.equal(
        canSelectProjectForHomepageCarousel({
            selectedCount: 3,
            isAlreadySelected: false,
        }),
        false
    );
    assert.equal(
        canSelectProjectForHomepageCarousel({
            selectedCount: 3,
            isAlreadySelected: true,
        }),
        true
    );
});

test("getHomepageProjectSelectionError validates status and limit", () => {
    assert.equal(
        getHomepageProjectSelectionError({
            shouldSelect: true,
            isPublished: false,
            selectedCount: 0,
            isAlreadySelected: false,
        }),
        "Only published projects can be shown on homepage carousel"
    );

    assert.equal(
        getHomepageProjectSelectionError({
            shouldSelect: true,
            isPublished: true,
            selectedCount: 3,
            isAlreadySelected: false,
        }),
        "En fazla 3 proje ana sayfa carousel'inde gösterilebilir."
    );

    assert.equal(
        getHomepageProjectSelectionError({
            shouldSelect: false,
            isPublished: false,
            selectedCount: 99,
            isAlreadySelected: false,
        }),
        null
    );
});

test("pickHomepageProjectsForCarousel returns selected projects when available", () => {
    const selected = [{ id: "1" }, { id: "2" }];
    const fallback = [{ id: "3" }, { id: "4" }, { id: "5" }];

    assert.deepEqual(
        pickHomepageProjectsForCarousel(selected, fallback),
        selected
    );
});

test("pickHomepageProjectsForCarousel falls back to latest projects when none selected", () => {
    const fallback = [{ id: "3" }, { id: "4" }, { id: "5" }, { id: "6" }];

    assert.deepEqual(
        pickHomepageProjectsForCarousel([], fallback),
        [{ id: "3" }, { id: "4" }, { id: "5" }]
    );
});

test("parseHomepageProjectSlot validates 1, 2, 3 slots", () => {
    assert.deepEqual(HOMEPAGE_PROJECT_SLOTS, [1, 2, 3]);
    assert.equal(parseHomepageProjectSlot(1), 1);
    assert.equal(parseHomepageProjectSlot("2"), 2);
    assert.equal(parseHomepageProjectSlot(""), null);
    assert.equal(parseHomepageProjectSlot(null), null);
    assert.equal(parseHomepageProjectSlot(undefined), null);
    assert.equal(parseHomepageProjectSlot("4"), "invalid");
});

test("findFirstAvailableHomepageProjectSlot picks first free slot", () => {
    assert.equal(findFirstAvailableHomepageProjectSlot([]), 1);
    assert.equal(findFirstAvailableHomepageProjectSlot([2]), 1);
    assert.equal(findFirstAvailableHomepageProjectSlot([1, 3]), 2);
    assert.equal(findFirstAvailableHomepageProjectSlot([1, 2, 3]), null);
});
