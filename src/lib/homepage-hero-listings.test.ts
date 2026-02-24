import assert from "node:assert/strict";
import test from "node:test";

import {
    HOMEPAGE_HERO_SLOT_LIMIT,
    HOMEPAGE_HERO_SLOTS,
    getHomepageHeroListingRemovalError,
    parseHomepageHeroSlot,
} from "./homepage-hero-listings";

test("homepage hero slots are limited to 3", () => {
    assert.equal(HOMEPAGE_HERO_SLOT_LIMIT, 3);
    assert.deepEqual(HOMEPAGE_HERO_SLOTS, [1, 2, 3]);
});

test("parseHomepageHeroSlot accepts only slots 1, 2, 3", () => {
    assert.equal(parseHomepageHeroSlot(1), 1);
    assert.equal(parseHomepageHeroSlot("2"), 2);
    assert.equal(parseHomepageHeroSlot(null), null);
    assert.equal(parseHomepageHeroSlot(undefined), null);
    assert.equal(parseHomepageHeroSlot(""), null);
    assert.equal(parseHomepageHeroSlot(4), "invalid");
    assert.equal(parseHomepageHeroSlot("abc"), "invalid");
});

test("getHomepageHeroListingRemovalError blocks removing last selected listing", () => {
    assert.equal(
        getHomepageHeroListingRemovalError({
            requestedSlot: null,
            selectedCount: 1,
            isCurrentlySelected: true,
        }),
        "Ana sayfada en az 1 ilan kalmalıdır."
    );

    assert.equal(
        getHomepageHeroListingRemovalError({
            requestedSlot: null,
            selectedCount: 2,
            isCurrentlySelected: true,
        }),
        null
    );

    assert.equal(
        getHomepageHeroListingRemovalError({
            requestedSlot: 2,
            selectedCount: 1,
            isCurrentlySelected: true,
        }),
        null
    );
});
