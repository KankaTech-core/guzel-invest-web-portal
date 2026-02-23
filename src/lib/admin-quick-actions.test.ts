import assert from "node:assert/strict";
import test from "node:test";

import {
    buildAdminQuickActionDefinitions,
    parseAdminQuickActionRoute,
} from "./admin-quick-actions";

test("parseAdminQuickActionRoute detects project detail pages", () => {
    const parsed = parseAdminQuickActionRoute("/tr/proje/colosseum%20oba");

    assert.equal(parsed.locale, "tr");
    assert.equal(parsed.projectSlug, "colosseum oba");
    assert.equal(parsed.isProjectPage, true);
    assert.equal(parsed.listingSlug, null);
    assert.equal(parsed.articleSlug, null);
});

test("buildAdminQuickActionDefinitions always includes projects list action", () => {
    const actions = buildAdminQuickActionDefinitions({
        isListingPage: false,
        isArticlePage: false,
        isProjectPage: false,
        listingId: null,
        articleId: null,
        projectId: null,
        isListingLoading: false,
        isArticleLoading: false,
        isProjectLoading: false,
    });

    assert.deepEqual(
        actions.map((action) => action.id),
        ["listings", "projects", "articles", "portal"]
    );
    assert.equal(
        actions.find((action) => action.id === "projects")?.href,
        "/admin/projeler"
    );
});

test("buildAdminQuickActionDefinitions prepends project action on project detail page", () => {
    const actions = buildAdminQuickActionDefinitions({
        isListingPage: false,
        isArticlePage: false,
        isProjectPage: true,
        listingId: null,
        articleId: null,
        projectId: "project-123",
        isListingLoading: false,
        isArticleLoading: false,
        isProjectLoading: false,
    });

    assert.equal(actions[0]?.id, "project");
    assert.equal(actions[0]?.label, "Projeye git");
    assert.equal(actions[0]?.href, "/admin/projeler/project-123");
    assert.equal(actions[0]?.disabled, false);
});

test("buildAdminQuickActionDefinitions keeps project action disabled while loading", () => {
    const actions = buildAdminQuickActionDefinitions({
        isListingPage: false,
        isArticlePage: false,
        isProjectPage: true,
        listingId: null,
        articleId: null,
        projectId: null,
        isListingLoading: false,
        isArticleLoading: false,
        isProjectLoading: true,
    });

    assert.equal(actions[0]?.id, "project");
    assert.equal(actions[0]?.href, "#");
    assert.equal(actions[0]?.disabled, true);
});
