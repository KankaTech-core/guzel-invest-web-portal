import assert from "node:assert/strict";
import test from "node:test";
import { buildPeekingPreviewItems } from "./peeking-preview-items";

const sampleItems = [
    { id: "a", src: "https://example.com/a.jpg", alt: "A" },
    { id: "b", src: "https://example.com/b.jpg", alt: "B" },
];

test("buildPeekingPreviewItems appends a view-all card to the end", () => {
    const cards = buildPeekingPreviewItems(sampleItems);

    assert.equal(cards.length, 3);
    assert.deepEqual(
        cards.map((card) => card.type),
        ["image", "image", "view-all"]
    );
    assert.equal(cards[2]?.type, "view-all");
    assert.equal(cards[2]?.label, "Tümünü Gör");
});

test("buildPeekingPreviewItems returns empty list for empty galleries", () => {
    const cards = buildPeekingPreviewItems([]);

    assert.deepEqual(cards, []);
});
