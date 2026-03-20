import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getLegalPageCopy } from "@/app/(localized)/[locale]/legal-copy";

const legalCopyPath = resolve(
    process.cwd(),
    "src/app/(localized)/[locale]/legal-copy.ts"
);
const privacyPagePath = resolve(
    process.cwd(),
    "src/app/(localized)/[locale]/gizlilik/page.tsx"
);
const termsPagePath = resolve(
    process.cwd(),
    "src/app/(localized)/[locale]/kullanim-sartlari/page.tsx"
);

test("localized legal copy source exists with Turkish, English, Russian and German entries", () => {
    assert.equal(existsSync(legalCopyPath), true);

    const legalCopySource = readFileSync(legalCopyPath, "utf8");

    assert.match(legalCopySource, /tr:\s*\{/);
    assert.match(legalCopySource, /en:\s*\{/);
    assert.match(legalCopySource, /ru:\s*\{/);
    assert.match(legalCopySource, /de:\s*\{/);
    assert.match(legalCopySource, /privacy:/);
    assert.match(legalCopySource, /terms:/);
});

test("privacy and terms routes use the shared legal page builder", () => {
    assert.equal(existsSync(privacyPagePath), true);
    assert.equal(existsSync(termsPagePath), true);

    const privacyPageSource = readFileSync(privacyPagePath, "utf8");
    const termsPageSource = readFileSync(termsPagePath, "utf8");

    assert.match(privacyPageSource, /buildLegalPageMetadata/);
    assert.match(privacyPageSource, /renderLegalPage\(\{\s*locale,\s*slug:\s*"privacy"/);
    assert.match(termsPageSource, /buildLegalPageMetadata/);
    assert.match(termsPageSource, /renderLegalPage\(\{\s*locale,\s*slug:\s*"terms"/);
});

test("legal copy resolves the right locale content and normalizes locale tags", () => {
    assert.equal(getLegalPageCopy("tr", "privacy").title, "Gizlilik Politikası");
    assert.equal(getLegalPageCopy("en", "terms").title, "Terms of Use");
    assert.equal(
        getLegalPageCopy("ru", "privacy").title,
        "Политика конфиденциальности"
    );
    assert.equal(getLegalPageCopy("de-DE", "terms").title, "Nutzungsbedingungen");
    assert.equal(getLegalPageCopy(undefined, "privacy").title, "Gizlilik Politikası");
});
