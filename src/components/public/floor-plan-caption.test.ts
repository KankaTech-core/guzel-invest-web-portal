import assert from "node:assert/strict";
import test from "node:test";
import { resolveFloorPlanOverlayLabel } from "./floor-plan-caption";

test("resolveFloorPlanOverlayLabel returns active item label on floor tab", () => {
    assert.equal(
        resolveFloorPlanOverlayLabel({
            activeGalleryTabKey: "floor",
            itemAlt: "Bahçe Katı",
        }),
        "Bahçe Katı"
    );
});

test("resolveFloorPlanOverlayLabel trims whitespace and ignores empty labels", () => {
    assert.equal(
        resolveFloorPlanOverlayLabel({
            activeGalleryTabKey: "floor",
            itemAlt: "   ",
        }),
        null
    );
    assert.equal(
        resolveFloorPlanOverlayLabel({
            activeGalleryTabKey: "floor",
            itemAlt: "  Çatı Katı  ",
        }),
        "Çatı Katı"
    );
});

test("resolveFloorPlanOverlayLabel returns null outside floor tab", () => {
    assert.equal(
        resolveFloorPlanOverlayLabel({
            activeGalleryTabKey: "all",
            itemAlt: "Bahçe Katı",
        }),
        null
    );
});
