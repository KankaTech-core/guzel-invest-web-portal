import assert from "node:assert/strict";
import test from "node:test";

import { shouldShowLastUnitsRibbon } from "./last-units-ribbon";

test("shows ribbon only for projects with last-units flag", () => {
    assert.equal(
        shouldShowLastUnitsRibbon({
            isProject: true,
            hasLastUnitsBanner: true,
        }),
        true
    );

    assert.equal(
        shouldShowLastUnitsRibbon({
            isProject: true,
            hasLastUnitsBanner: false,
        }),
        false
    );

    assert.equal(
        shouldShowLastUnitsRibbon({
            isProject: false,
            hasLastUnitsBanner: true,
        }),
        false
    );

    assert.equal(
        shouldShowLastUnitsRibbon({
            isProject: false,
            hasLastUnitsBanner: false,
        }),
        false
    );
});
