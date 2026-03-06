import assert from "node:assert/strict";
import test from "node:test";
import { buildProjectsPortfolioHref } from "./project-portfolio-link";

test("buildProjectsPortfolioHref builds portfolio route with projects filter", () => {
    assert.equal(
        buildProjectsPortfolioHref("tr"),
        "/tr/portfoy?onlyProjects=true"
    );
});

test("buildProjectsPortfolioHref falls back to Turkish locale for empty input", () => {
    assert.equal(
        buildProjectsPortfolioHref(""),
        "/tr/portfoy?onlyProjects=true"
    );
});
