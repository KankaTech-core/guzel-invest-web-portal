import assert from "node:assert/strict";
import test from "node:test";

import {
    DEFAULT_HOMEPAGE_VIDEO_ID,
    buildHomepageHeroAutoplayEmbedUrl,
    buildHomepageHeroPopupEmbedUrl,
    extractYoutubeVideoId,
    resolveHomepageHeroVideo,
} from "./homepage-video";

test("extractYoutubeVideoId supports iframe embed, watch and short urls", () => {
    const iframeInput = `<iframe width="560" height="315" src="https://www.youtube.com/embed/RrAT0lyOO2M?si=xq_98bb1rM7dlIm1" title="YouTube video player"></iframe>`;

    assert.equal(extractYoutubeVideoId(iframeInput), "RrAT0lyOO2M");
    assert.equal(
        extractYoutubeVideoId("https://www.youtube.com/watch?v=RrAT0lyOO2M"),
        "RrAT0lyOO2M"
    );
    assert.equal(
        extractYoutubeVideoId("https://youtu.be/RrAT0lyOO2M"),
        "RrAT0lyOO2M"
    );
    assert.equal(extractYoutubeVideoId("https://example.com/video"), null);
});

test("buildHomepageHeroAutoplayEmbedUrl generates muted loop player", () => {
    const url = buildHomepageHeroAutoplayEmbedUrl("RrAT0lyOO2M");

    assert.equal(
        url,
        "https://www.youtube.com/embed/RrAT0lyOO2M?autoplay=1&mute=1&loop=1&playlist=RrAT0lyOO2M&controls=0&rel=0&playsinline=1"
    );
});

test("buildHomepageHeroPopupEmbedUrl keeps controls visible", () => {
    const url = buildHomepageHeroPopupEmbedUrl("RrAT0lyOO2M");

    assert.equal(
        url,
        "https://www.youtube.com/embed/RrAT0lyOO2M?autoplay=1&mute=0&loop=1&playlist=RrAT0lyOO2M&controls=1&rel=0&playsinline=1"
    );
});

test("resolveHomepageHeroVideo returns fallback video for invalid input", () => {
    const resolved = resolveHomepageHeroVideo("not-a-youtube-url");

    assert.equal(resolved.videoId, DEFAULT_HOMEPAGE_VIDEO_ID);
    assert.match(
        resolved.autoplayEmbedUrl,
        new RegExp(`/embed/${DEFAULT_HOMEPAGE_VIDEO_ID}`)
    );
    assert.match(
        resolved.popupEmbedUrl,
        new RegExp(`/embed/${DEFAULT_HOMEPAGE_VIDEO_ID}`)
    );
});
