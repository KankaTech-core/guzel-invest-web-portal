import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const loadHomepageArticlesSection = async () => {
    try {
        return await import("./homepage-articles-section");
    } catch {
        assert.fail("Expected homepage articles section component to exist");
    }
};

test("HomepageArticlesSection hides itself when there are no articles", async () => {
    const homepageArticlesSectionModule = await loadHomepageArticlesSection();
    const markup = renderToStaticMarkup(
        <homepageArticlesSectionModule.HomepageArticlesSection locale="tr" articles={[]} />
    );

    assert.equal(markup, "");
});

test("HomepageArticlesSection renders article cards from database-backed data", async () => {
    const homepageArticlesSectionModule = await loadHomepageArticlesSection();
    const markup = renderToStaticMarkup(
        <homepageArticlesSectionModule.HomepageArticlesSection
            locale="tr"
            articles={[
                {
                    id: "article-1",
                    slug: "alanya-yatirim-raporu",
                    title: "Alanya Yatırım Raporu",
                    excerpt: "Bölgedeki yeni yatırım fırsatları.",
                    category: "Analiz",
                    coverImageUrl: null,
                    coverThumbnailUrl: null,
                    publishedAt: "2026-03-07T10:00:00.000Z",
                    createdAt: "2026-03-06T10:00:00.000Z",
                },
            ]}
        />
    );

    assert.match(markup, /Alanya Yatırım Raporu/);
    assert.match(markup, /Bölgedeki yeni yatırım fırsatları\./);
    assert.match(markup, /\/tr\/blog\/alanya-yatirim-raporu/);
});
