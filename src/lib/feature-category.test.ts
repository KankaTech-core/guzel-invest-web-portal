import assert from "node:assert/strict";
import test from "node:test";

import {
    categorizeFeature,
    splitFeaturesByCategory,
    type FeatureCategory,
} from "./feature-category";

test("categorizeFeature maps known social features", () => {
    assert.equal(categorizeFeature("Havuz"), "SOCIAL");
    assert.equal(categorizeFeature("Spor salonu"), "SOCIAL");
    assert.equal(categorizeFeature("Bilardo"), "SOCIAL");
});

test("categorizeFeature maps known general features", () => {
    assert.equal(categorizeFeature("Kapalı otopark"), "GENERAL");
    assert.equal(categorizeFeature("Asansör"), "GENERAL");
    assert.equal(categorizeFeature("Jeneratör"), "GENERAL");
});

test("categorizeFeature defaults unknown features to social", () => {
    assert.equal(categorizeFeature("Akıllı yaşam"), "SOCIAL");
});

test("splitFeaturesByCategory preserves order by category", () => {
    const features = [
        "Asansör",
        "Havuz",
        "Kapalı Otopark",
        "Bilardo",
        "Akıllı yaşam",
    ];

    const result = splitFeaturesByCategory(features);

    assert.deepEqual(result.GENERAL, ["Asansör", "Kapalı Otopark"]);
    assert.deepEqual(result.SOCIAL, ["Havuz", "Bilardo", "Akıllı yaşam"]);
});

test("feature category type includes GENERAL and SOCIAL", () => {
    const general: FeatureCategory = "GENERAL";
    const social: FeatureCategory = "SOCIAL";

    assert.equal(general, "GENERAL");
    assert.equal(social, "SOCIAL");
});
