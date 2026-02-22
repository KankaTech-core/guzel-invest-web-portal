import assert from "node:assert/strict";
import test from "node:test";

import {
    getProjectSlugBase,
    normalizeProjectIcon,
    normalizeProjectStatus,
    normalizeProjectFeatureCategory,
    normalizeProjectText,
} from "./projects";

test("getProjectSlugBase creates deterministic, city-aware slug base", () => {
    const slug = getProjectSlugBase("Colosseum Oba", "Alanya");
    assert.equal(slug, "colosseum-oba-alanya-proje");
});

test("normalizeProjectStatus maps loose values and falls back safely", () => {
    assert.equal(normalizeProjectStatus("published", "DRAFT"), "PUBLISHED");
    assert.equal(normalizeProjectStatus("ARCHIVED", "DRAFT"), "ARCHIVED");
    assert.equal(normalizeProjectStatus("unknown", "DRAFT"), "DRAFT");
});

test("normalizeProjectFeatureCategory maps unknown values to GENERAL", () => {
    assert.equal(normalizeProjectFeatureCategory("SOCIAL"), "SOCIAL");
    assert.equal(normalizeProjectFeatureCategory("social"), "SOCIAL");
    assert.equal(normalizeProjectFeatureCategory("anything"), "GENERAL");
});

test("normalizeProjectText trims and handles blank values", () => {
    assert.equal(normalizeProjectText("  Test  "), "Test");
    assert.equal(normalizeProjectText("   "), null);
    assert.equal(normalizeProjectText(null), null);
});

test("normalizeProjectIcon only allows whitelisted icon names", () => {
    assert.equal(normalizeProjectIcon("Waves"), "Waves");
    assert.equal(normalizeProjectIcon(" UnknownIcon "), "Building2");
    assert.equal(normalizeProjectIcon(""), "Building2");
});

test("normalizeProjectIcon allows safe SVG data URI icons", () => {
    const customSvg =
        "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJsMyA2aDYtbDQuNSA0LjUtNi41IDEuNSA0IDEwTDExIDE4IDMuNSAyNGw0LTEwTDEgMTJoNmw1LTZ6Ii8+PC9zdmc+";
    assert.equal(normalizeProjectIcon(customSvg), customSvg);
});

test("normalizeProjectIcon rejects invalid SVG data URIs", () => {
    const invalidSvg = "data:image/svg+xml;base64,!!not-valid-base64!!";
    assert.equal(normalizeProjectIcon(invalidSvg), "Building2");
});
