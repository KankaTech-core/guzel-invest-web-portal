import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const aboutPageSource = readFileSync(
    resolve(process.cwd(), "src/app/(localized)/[locale]/hakkimizda/page.tsx"),
    "utf8"
);

test("About page team member images do not scale on hover", () => {
    assert.doesNotMatch(aboutPageSource, /group-hover:scale-105/);
});
