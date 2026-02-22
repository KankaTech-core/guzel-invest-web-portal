import assert from "node:assert/strict";
import test from "node:test";
import {
    buildProjectMediaCategoryMap,
    getNormalizedProjectMediaAssignments,
    getProvidedProjectMediaCategories,
} from "./project-media-categories";

test("getProvidedProjectMediaCategories returns only explicitly provided keys", () => {
    const categories = getProvidedProjectMediaCategories({
        interiorMediaIds: ["m1"],
        documentMediaIds: [],
    });

    assert.deepEqual(categories, ["INTERIOR", "DOCUMENT"]);
});

test("getNormalizedProjectMediaAssignments trims and deduplicates ids", () => {
    const normalized = getNormalizedProjectMediaAssignments({
        exteriorMediaIds: [" m1 ", "m1", "", "m2"],
        mapMediaIds: null,
    });

    assert.deepEqual(normalized.EXTERIOR, ["m1", "m2"]);
    assert.deepEqual(normalized.MAP, []);
});

test("buildProjectMediaCategoryMap resolves duplicates with last category precedence", () => {
    const map = buildProjectMediaCategoryMap({
        exteriorMediaIds: ["m1", "m2"],
        interiorMediaIds: ["m2", "m3"],
        documentMediaIds: ["m1"],
    });

    assert.equal(map.get("m1"), "DOCUMENT");
    assert.equal(map.get("m2"), "INTERIOR");
    assert.equal(map.get("m3"), "INTERIOR");
});
