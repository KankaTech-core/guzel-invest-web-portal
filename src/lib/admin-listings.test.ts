import assert from "node:assert/strict";
import test from "node:test";

import { buildAdminListingsWhere } from "./admin-listings";

test("buildAdminListingsWhere always excludes project records", () => {
    const where = buildAdminListingsWhere({
        status: "PUBLISHED",
        type: "VILLA",
        saleType: "SALE",
        company: "Guzel Invest",
        platform: "HEPSIEMLAK",
    });

    assert.equal(where.isProject, false);
    assert.equal(where.status, "PUBLISHED");
    assert.equal(where.type, "VILLA");
    assert.equal(where.saleType, "SALE");
    assert.equal(where.company, "Guzel Invest");
    assert.equal(where.publishToHepsiemlak, true);
});

test("buildAdminListingsWhere excludes archived when no status provided", () => {
    const where = buildAdminListingsWhere({});

    assert.equal(where.isProject, false);
    assert.deepEqual(where.status, { not: "ARCHIVED" });
});

test("buildAdminListingsWhere creates case-insensitive OR search for query", () => {
    const where = buildAdminListingsWhere({ query: "alanya" });

    assert.ok(Array.isArray(where.OR));
    assert.equal(where.OR?.length, 5);
});
