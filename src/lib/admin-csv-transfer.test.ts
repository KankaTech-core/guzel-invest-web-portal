import assert from "node:assert/strict";
import test from "node:test";
import {
    encodeCsv,
    parseCsv,
    normalizeStoredMediaPath,
    serializeMediaColumns,
    parseMediaColumns,
} from "./admin-csv-transfer";

test("encodeCsv escapes quotes, commas, and new lines", () => {
    const csv = encodeCsv(
        ["name", "note"],
        [["Güzel Invest", "line1\nline2, \"quoted\""]]
    );

    const rows = parseCsv(csv);
    assert.equal(rows.length, 2);
    assert.deepEqual(rows[0], ["name", "note"]);
    assert.deepEqual(rows[1], ["Güzel Invest", 'line1\nline2, "quoted"']);
});

test("normalizeStoredMediaPath extracts object path from full MinIO url", () => {
    const path = normalizeStoredMediaPath(
        "https://cdn.example.com/guzel-invest/public/listings/abc/original/test.webp",
        "guzel-invest"
    );

    assert.equal(path, "public/listings/abc/original/test.webp");
});

test("serializeMediaColumns keeps friendly URLs and metadata JSON", () => {
    const columns = serializeMediaColumns(
        [
            {
                url: "public/listings/abc/original/1.webp",
                thumbnailUrl: "public/listings/abc/thumb/1.webp",
                isCover: true,
                order: 0,
                category: "EXTERIOR",
            },
            {
                url: "public/listings/abc/original/2.webp",
                thumbnailUrl: null,
                isCover: false,
                order: 1,
            },
        ],
        {
            minioBaseUrl: "https://cdn.example.com",
            minioBucket: "guzel-invest",
        }
    );

    assert.match(columns.mediaUrls, /https:\/\/cdn\.example\.com\/guzel-invest\/public\/listings\/abc\/original\/1\.webp/);
    assert.ok(columns.mediaPayloadJson.includes("\"isCover\":true"));
});

test("parseMediaColumns prefers payload JSON and normalizes back to object paths", () => {
    const parsed = parseMediaColumns(
        "https://cdn.example.com/guzel-invest/public/listings/abc/original/legacy.webp",
        JSON.stringify([
            {
                url: "https://cdn.example.com/guzel-invest/public/listings/abc/original/new.webp",
                thumbnailUrl:
                    "https://cdn.example.com/guzel-invest/public/listings/abc/thumb/new.webp",
                isCover: true,
                order: 3,
                category: "MAP",
            },
        ]),
        {
            minioBucket: "guzel-invest",
        }
    );

    assert.equal(parsed.length, 1);
    assert.deepEqual(parsed[0], {
        url: "public/listings/abc/original/new.webp",
        thumbnailUrl: "public/listings/abc/thumb/new.webp",
        isCover: true,
        order: 3,
        category: "MAP",
        type: null,
    });
});
