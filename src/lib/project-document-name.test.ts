import assert from "node:assert/strict";
import test from "node:test";
import {
    getDocumentNameFromMedia,
    getDocumentNameTag,
    upsertDocumentNameTag,
} from "./project-document-name";

test("getDocumentNameFromMedia prioritizes custom name tag", () => {
    const name = getDocumentNameFromMedia({
        url: "public/listings/p1/documents/sales-pack.pdf",
        aiTags: ["foo", "doc-name:Sat\u0131\u015f Sunumu"],
        fallback: "Belge 1",
    });

    assert.equal(name, "Sat\u0131\u015f Sunumu");
});

test("getDocumentNameFromMedia falls back to decoded filename", () => {
    const name = getDocumentNameFromMedia({
        url: "public/listings/p1/documents/Fiyat%20Listesi.pdf",
        aiTags: [],
        fallback: "Belge 1",
    });

    assert.equal(name, "Fiyat Listesi.pdf");
});

test("getDocumentNameTag returns null when no valid tag exists", () => {
    const name = getDocumentNameTag(["doc-name:", "other"]);

    assert.equal(name, null);
});

test("upsertDocumentNameTag replaces old document-name tag and keeps others", () => {
    const tags = upsertDocumentNameTag(["x", "doc-name:Eski Ad"], "Yeni Ad");

    assert.deepEqual(tags, ["x", "doc-name:Yeni Ad"]);
});

test("upsertDocumentNameTag removes document-name tag for blank value", () => {
    const tags = upsertDocumentNameTag(["x", "doc-name:Eski Ad"], "   ");

    assert.deepEqual(tags, ["x"]);
});
