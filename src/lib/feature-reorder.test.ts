import assert from "node:assert/strict";
import test from "node:test";

import {
    fromFeatureSortableId,
    reorderFeatureRows,
    toFeatureSortableId,
    type FeatureCategory,
} from "./feature-reorder";

const generalCategory: FeatureCategory = "GENERAL";

test("toFeatureSortableId and fromFeatureSortableId round-trip valid IDs", () => {
    const sortableId = toFeatureSortableId(generalCategory, "row-123");
    assert.equal(sortableId, "GENERAL::row-123");
    assert.deepEqual(fromFeatureSortableId(sortableId), {
        category: "GENERAL",
        id: "row-123",
    });
});

test("fromFeatureSortableId returns null for malformed IDs", () => {
    assert.equal(fromFeatureSortableId("GENERAL"), null);
    assert.equal(fromFeatureSortableId("GENERAL::"), null);
    assert.equal(fromFeatureSortableId("UNKNOWN::row-1"), null);
});

test("reorderFeatureRows moves only when active/over IDs are different and present", () => {
    const rows = [
        { id: "a", title: "A", icon: "Building2" },
        { id: "b", title: "B", icon: "Building2" },
        { id: "c", title: "C", icon: "Building2" },
    ];

    const moved = reorderFeatureRows(rows, "a", "c");
    assert.deepEqual(
        moved.map((row) => row.id),
        ["b", "c", "a"]
    );

    const unchangedSameId = reorderFeatureRows(rows, "b", "b");
    assert.equal(unchangedSameId, rows);

    const unchangedMissingId = reorderFeatureRows(rows, "x", "b");
    assert.equal(unchangedMissingId, rows);
});
