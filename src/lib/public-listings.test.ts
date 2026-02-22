import assert from "node:assert/strict";
import test from "node:test";
import { buildListingsRoomScope } from "./public-listings";

test("returns null when room filter is not active", () => {
    const scope = buildListingsRoomScope({
        canUseRoomFilters: false,
        rooms: ["2+1"],
    });

    assert.equal(scope, null);
});

test("returns null when no room value is provided", () => {
    const scope = buildListingsRoomScope({
        canUseRoomFilters: true,
        rooms: [],
    });

    assert.equal(scope, null);
});

test("builds OR condition for single room value", () => {
    const scope = buildListingsRoomScope({
        canUseRoomFilters: true,
        rooms: ["2+1"],
    });

    assert.deepEqual(scope, {
        OR: [
            {
                isProject: false,
                rooms: "2+1",
            },
            {
                isProject: true,
                projectUnits: {
                    some: {
                        rooms: "2+1",
                    },
                },
            },
        ],
    });
});

test("builds OR condition for multiple room values", () => {
    const scope = buildListingsRoomScope({
        canUseRoomFilters: true,
        rooms: ["2+1", "3+1"],
    });

    assert.deepEqual(scope, {
        OR: [
            {
                isProject: false,
                rooms: {
                    in: ["2+1", "3+1"],
                },
            },
            {
                isProject: true,
                projectUnits: {
                    some: {
                        rooms: {
                            in: ["2+1", "3+1"],
                        },
                    },
                },
            },
        ],
    });
});
