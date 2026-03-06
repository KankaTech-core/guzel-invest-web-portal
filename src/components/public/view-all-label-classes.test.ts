import assert from "node:assert/strict";
import test from "node:test";
import { buildViewAllLabelClassName } from "./view-all-label-classes";

test("buildViewAllLabelClassName keeps label visible on mobile by default", () => {
    const className = buildViewAllLabelClassName("text-lg font-semibold");

    assert.equal(className, "text-lg font-semibold");
});

test("buildViewAllLabelClassName hides label on mobile and shows on md+", () => {
    const className = buildViewAllLabelClassName("text-lg font-semibold", {
        hideOnMobile: true,
    });

    assert.equal(className, "hidden md:inline text-lg font-semibold");
});
