import assert from "node:assert/strict";
import test from "node:test";

import { SOCIAL_LINKS, SOCIAL_LINK_ITEMS } from "./social-links";

test("SOCIAL_LINKS has canonical company URLs", () => {
    assert.equal(SOCIAL_LINKS.instagram, "https://www.instagram.com/guzelinvest");
    assert.equal(SOCIAL_LINKS.youtube, "https://www.youtube.com/@G%C3%9CZEL%C4%B0NVEST");
    assert.equal(SOCIAL_LINKS.facebook, "https://www.facebook.com/guzelinvestalanya");
});

test("SOCIAL_LINK_ITEMS includes Instagram, YouTube and Facebook only", () => {
    assert.deepEqual(
        SOCIAL_LINK_ITEMS.map((item) => item.key),
        ["instagram", "youtube", "facebook"]
    );
});
