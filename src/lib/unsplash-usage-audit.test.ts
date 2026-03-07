import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const PROJECT_ROOT = process.cwd();
const SOURCE_ROOTS = ["src/app", "src/components", "src/data"] as const;
const MANIFEST_PATH = path.join(
    PROJECT_ROOT,
    "docs/compliance/unsplash-usage.json"
);
const UNSPLASH_URL_PATTERN =
    /https:\/\/images\.unsplash\.com\/(photo-[^?"' )]+)(?:\?[^"' )]+)?/g;

type UnsplashUsageManifest = {
    checkedAt: string;
    policy: {
        licenseUrl: string;
        commercialUseAllowed: boolean;
        attributionRequired: boolean;
        apiGuidelinesUrl: string;
        apiIntegrationDetected: boolean;
        summary: string[];
    };
    photos: Array<{
        id: string;
        files: string[];
    }>;
};

function collectSourceFiles(relativeDir: string): string[] {
    const absoluteDir = path.join(PROJECT_ROOT, relativeDir);
    const entries = readdirSync(absoluteDir);
    const files: string[] = [];

    for (const entry of entries) {
        const absoluteEntry = path.join(absoluteDir, entry);
        const relativeEntry = path.relative(PROJECT_ROOT, absoluteEntry);
        const stats = statSync(absoluteEntry);

        if (stats.isDirectory()) {
            files.push(...collectSourceFiles(relativeEntry));
            continue;
        }

        if (!/\.(ts|tsx)$/.test(entry) || entry.includes(".test.")) {
            continue;
        }

        files.push(relativeEntry);
    }

    return files.sort();
}

function scanUnsplashUsage(): Map<string, string[]> {
    const usageByPhotoId = new Map<string, Set<string>>();

    for (const sourceRoot of SOURCE_ROOTS) {
        for (const relativeFilePath of collectSourceFiles(sourceRoot)) {
            const source = readFileSync(
                path.join(PROJECT_ROOT, relativeFilePath),
                "utf8"
            );

            for (const match of source.matchAll(UNSPLASH_URL_PATTERN)) {
                const photoId = match[1];
                if (!photoId) continue;

                const files = usageByPhotoId.get(photoId) ?? new Set<string>();
                files.add(relativeFilePath);
                usageByPhotoId.set(photoId, files);
            }
        }
    }

    return new Map(
        [...usageByPhotoId.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([photoId, files]) => [photoId, [...files].sort()])
    );
}

function loadManifest(): UnsplashUsageManifest {
    assert.ok(
        existsSync(MANIFEST_PATH),
        `Missing Unsplash usage manifest: ${MANIFEST_PATH}`
    );

    return JSON.parse(
        readFileSync(MANIFEST_PATH, "utf8")
    ) as UnsplashUsageManifest;
}

function normalizeManifestPhotos(
    manifest: UnsplashUsageManifest
): Map<string, string[]> {
    return new Map(
        manifest.photos
            .map((photo) => [photo.id, [...new Set(photo.files)].sort()] as const)
            .sort(([left], [right]) => left.localeCompare(right))
    );
}

test("every hardcoded Unsplash photo is registered in the compliance manifest", () => {
    const manifest = loadManifest();

    assert.ok(
        manifest.photos.length > 0,
        "Expected the Unsplash manifest to document at least one photo."
    );

    assert.deepEqual(normalizeManifestPhotos(manifest), scanUnsplashUsage());
});

test("manifest captures the official Unsplash policy used for this repo", () => {
    const manifest = loadManifest();

    assert.equal(manifest.policy.licenseUrl, "https://unsplash.com/license");
    assert.equal(manifest.policy.commercialUseAllowed, true);
    assert.equal(manifest.policy.attributionRequired, false);
    assert.equal(
        manifest.policy.apiGuidelinesUrl,
        "https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines"
    );
    assert.equal(manifest.policy.apiIntegrationDetected, false);
    assert.ok(
        manifest.policy.summary.some((item) =>
            item.includes("direct images.unsplash.com URLs")
        ),
        "Expected the manifest to explain why API-specific requirements do not apply here."
    );
});
