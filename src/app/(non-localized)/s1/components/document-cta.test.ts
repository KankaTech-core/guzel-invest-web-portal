import assert from "node:assert/strict";
import test from "node:test";

import { getDocumentCta } from "./document-cta";

test("returns single-document CTA with '<name> İndir' title", () => {
    const cta = getDocumentCta([
        {
            id: "doc-1",
            name: "Sunum Dosyası",
            url: "https://example.com/sunum.pdf",
        },
    ]);

    assert.deepEqual(cta, {
        type: "single",
        href: "https://example.com/sunum.pdf",
        title: "Sunum Dosyası İndir",
    });
});

test("returns multi-document CTA when more than one document exists", () => {
    const cta = getDocumentCta([
        {
            id: "doc-1",
            name: "Sunum",
            url: "https://example.com/sunum.pdf",
        },
        {
            id: "doc-2",
            name: "Fiyat Listesi",
            url: "https://example.com/fiyat.pdf",
        },
    ]);

    assert.equal(cta?.type, "multiple");
    assert.equal(cta?.title, "Belgelere Gözat");
});

test("returns null when there are no documents", () => {
    const cta = getDocumentCta([]);

    assert.equal(cta, null);
});

test("falls back to generic title when single document name is blank", () => {
    const cta = getDocumentCta([
        {
            id: "doc-1",
            name: "   ",
            url: "https://example.com/sunum.pdf",
        },
    ]);

    assert.deepEqual(cta, {
        type: "single",
        href: "https://example.com/sunum.pdf",
        title: "Belgeyi İndir",
    });
});
