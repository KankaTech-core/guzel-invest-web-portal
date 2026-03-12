import assert from "node:assert/strict";
import test from "node:test";

import { SOCIAL_LINKS, SOCIAL_LINK_ITEMS } from "./social-links";

test("SOCIAL_LINKS has canonical company URLs", () => {
    assert.equal(SOCIAL_LINKS.instagram, "https://www.instagram.com/guzelinvest");
    assert.equal(SOCIAL_LINKS.instagramDm, "https://ig.me/m/guzelinvest");
    assert.equal(SOCIAL_LINKS.youtube, "https://www.youtube.com/@G%C3%9CZEL%C4%B0NVEST");
    assert.equal(SOCIAL_LINKS.facebook, "https://www.facebook.com/guzelinvestalanya");
    assert.equal(SOCIAL_LINKS.telegram, "https://t.me/+905324994007");
    assert.equal(SOCIAL_LINKS.whatsapp, "https://wa.me/905384751111");
});

test("SOCIAL_LINK_ITEMS includes Instagram, YouTube and Facebook only", () => {
    assert.deepEqual(
        SOCIAL_LINK_ITEMS.map((item) => item.key),
        ["instagram", "youtube", "facebook"]
    );
});
