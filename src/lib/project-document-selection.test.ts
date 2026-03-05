import assert from "node:assert/strict";
import test from "node:test";

import { selectProjectDocumentMedia } from "./project-document-selection";

interface MediaStub {
    id: string;
    type: string | null;
    category: string | null;
}

test("prefers DOCUMENT category when category assignments exist", () => {
    const media: MediaStub[] = [
        { id: "old-doc", type: "DOCUMENT", category: null },
        { id: "active-doc", type: "DOCUMENT", category: "DOCUMENT" },
        { id: "map", type: "IMAGE", category: "MAP" },
    ];

    const selected = selectProjectDocumentMedia(media);

    assert.deepEqual(selected.map((item) => item.id), ["active-doc"]);
});

test("returns no documents when assignment mode is active and no document is assigned", () => {
    const media: MediaStub[] = [
        { id: "old-doc", type: "DOCUMENT", category: null },
        { id: "ext", type: "IMAGE", category: "EXTERIOR" },
    ];

    const selected = selectProjectDocumentMedia(media);

    assert.deepEqual(selected, []);
});

test("falls back to DOCUMENT type when category assignments do not exist", () => {
    const media: MediaStub[] = [
        { id: "legacy-doc", type: "DOCUMENT", category: null },
        { id: "image", type: "IMAGE", category: null },
    ];

    const selected = selectProjectDocumentMedia(media);

    assert.deepEqual(selected.map((item) => item.id), ["legacy-doc"]);
});

test("returns empty array when no document-like media exists", () => {
    const media: MediaStub[] = [
        { id: "image", type: "IMAGE", category: "EXTERIOR" },
        { id: "map", type: "IMAGE", category: "MAP" },
    ];

    const selected = selectProjectDocumentMedia(media);

    assert.deepEqual(selected, []);
});
