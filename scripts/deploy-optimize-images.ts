/**
 * Deployment-safe Image Optimization Migration
 *
 * Designed to run as part of the build/deploy pipeline.
 * Uses a marker object in MinIO to ensure it only runs ONCE.
 *
 * Safety guarantees:
 * 1. MARKER FILE: Writes `.migrations/image-optimize-v1.done` to MinIO
 *    after completion. If this marker exists, the script exits immediately.
 * 2. BACKUP: Every original is copied to /backup/ BEFORE being overwritten.
 *    Even if the script crashes mid-way, already-backed-up images are safe.
 * 3. IDEMPOTENT: Can be safely re-run — already backed-up images won't be
 *    re-backed-up (checks existence first), and the marker prevents
 *    re-processing.
 * 4. DATABASE UNTOUCHED: File paths in the database don't change at all.
 *    Only the file *contents* at those paths are replaced with optimized
 *    versions.
 *
 * Usage in build pipeline (package.json):
 *   "build": "prisma generate && ... && next build && node scripts/deploy-optimize-images.mjs"
 *
 * Or standalone:
 *   npx tsx scripts/deploy-optimize-images.ts
 *   FORCE=true npx tsx scripts/deploy-optimize-images.ts  (ignore marker, re-run)
 */

import "dotenv/config";
import * as Minio from "minio";
import sharp from "sharp";

// ─── Configuration ───────────────────────────────────────────────

const MIGRATION_VERSION = "image-optimize-v1";
const MARKER_PATH = `.migrations/${MIGRATION_VERSION}.done`;

const WEBP_QUALITY = 60;
const WEBP_EFFORT = 4;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const THUMB_WIDTH = 400;
const THUMB_HEIGHT = 300;

const FORCE = process.env.FORCE === "true";

// ─── MinIO client (reuses same env vars as the app) ──────────────

const rawEndpoint = process.env.MINIO_ENDPOINT || "localhost";
const hasProtocol =
    rawEndpoint.startsWith("http://") || rawEndpoint.startsWith("https://");
const parsedEndpoint = hasProtocol ? new URL(rawEndpoint) : null;
const endPoint = parsedEndpoint ? parsedEndpoint.hostname : rawEndpoint;
const port = parsedEndpoint
    ? Number(
        parsedEndpoint.port ||
        (parsedEndpoint.protocol === "https:" ? "443" : "80")
    )
    : Number.parseInt(process.env.MINIO_PORT || "9000", 10);
const useSSL = parsedEndpoint
    ? parsedEndpoint.protocol === "https:"
    : process.env.MINIO_USE_SSL === "true";

const minioClient = new Minio.Client({
    endPoint,
    port,
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const BUCKET = process.env.MINIO_BUCKET || "guzel-invest";

// ─── Helpers ─────────────────────────────────────────────────────

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

async function objectExists(path: string): Promise<boolean> {
    try {
        await minioClient.statObject(BUCKET, path);
        return true;
    } catch {
        return false;
    }
}

async function checkMigrationMarker(): Promise<boolean> {
    return objectExists(MARKER_PATH);
}

async function writeMigrationMarker(): Promise<void> {
    const body = JSON.stringify({
        migration: MIGRATION_VERSION,
        completedAt: new Date().toISOString(),
        config: { MAX_WIDTH, MAX_HEIGHT, WEBP_QUALITY, WEBP_EFFORT },
    });
    await minioClient.putObject(BUCKET, MARKER_PATH, body, body.length, {
        "Content-Type": "application/json",
    });
}

async function listOriginalImages(): Promise<string[]> {
    const paths: string[] = [];
    const prefixes = ["public/listings/", "public/articles/"];

    for (const prefix of prefixes) {
        const stream = minioClient.listObjectsV2(BUCKET, prefix, true);
        for await (const obj of stream) {
            if (
                obj.name &&
                obj.name.includes("/original/") &&
                obj.name.endsWith(".webp")
            ) {
                paths.push(obj.name);
            }
        }
    }

    return paths;
}

function getThumbPath(originalPath: string): string {
    return originalPath.replace("/original/", "/thumb/");
}

function getBackupPath(originalPath: string): string {
    return originalPath.replace("/original/", "/backup/");
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
    console.log("\n[deploy-optimize] Checking image optimization migration...");

    // 1. Check if already done
    if (!FORCE) {
        const alreadyDone = await checkMigrationMarker();
        if (alreadyDone) {
            console.log(
                `[deploy-optimize] ✅ Migration "${MIGRATION_VERSION}" already completed. Skipping.`
            );
            return;
        }
    } else {
        console.log("[deploy-optimize] FORCE mode — ignoring marker.");
    }

    // 2. List all original images
    const images = await listOriginalImages();
    console.log(`[deploy-optimize] Found ${images.length} images to process.`);

    if (images.length === 0) {
        await writeMigrationMarker();
        console.log("[deploy-optimize] No images found. Marker written. Done.");
        return;
    }

    // 3. Process each image
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    let totalSavedBytes = 0;

    for (const [index, imagePath] of images.entries()) {
        const progress = `[${index + 1}/${images.length}]`;

        try {
            // Download
            const stream = await minioClient.getObject(BUCKET, imagePath);
            const originalBuffer = await streamToBuffer(stream);
            const meta = await sharp(originalBuffer).metadata();
            const origWidth = meta.width || 0;
            const origHeight = meta.height || 0;

            // Re-optimize with resize cap
            const optimizedBuffer = await sharp(originalBuffer)
                .resize(MAX_WIDTH, MAX_HEIGHT, {
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
                .toBuffer();

            // Skip if optimization made the file BIGGER (already very optimized)
            if (optimizedBuffer.length >= originalBuffer.length) {
                skipped++;
                continue;
            }

            const newMeta = await sharp(optimizedBuffer).metadata();

            // Regenerate thumbnail from original (best quality source)
            const thumbBuffer = await sharp(originalBuffer)
                .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: "cover" })
                .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
                .toBuffer();

            // SAFETY: Backup original FIRST
            const backupPath = getBackupPath(imagePath);
            const backupExists = await objectExists(backupPath);
            if (!backupExists) {
                await minioClient.putObject(
                    BUCKET,
                    backupPath,
                    originalBuffer,
                    originalBuffer.length,
                    { "Content-Type": "image/webp" }
                );
            }

            // Overwrite original with optimized version
            await minioClient.putObject(
                BUCKET,
                imagePath,
                optimizedBuffer,
                optimizedBuffer.length,
                { "Content-Type": "image/webp" }
            );

            // Overwrite thumbnail
            const thumbPath = getThumbPath(imagePath);
            await minioClient.putObject(
                BUCKET,
                thumbPath,
                thumbBuffer,
                thumbBuffer.length,
                { "Content-Type": "image/webp" }
            );

            const saved = originalBuffer.length - optimizedBuffer.length;
            totalSavedBytes += saved;
            processed++;

            console.log(
                `${progress} ${origWidth}×${origHeight}→${newMeta.width}×${newMeta.height}  ` +
                `${(originalBuffer.length / 1024).toFixed(0)}KB→${(optimizedBuffer.length / 1024).toFixed(0)}KB  ` +
                `${imagePath.split("/").pop()}`
            );
        } catch (error) {
            errors++;
            console.error(
                `${progress} ERROR ${imagePath}:`,
                error instanceof Error ? error.message : error
            );
        }
    }

    // 4. Write marker so it doesn't run again
    await writeMigrationMarker();

    // 5. Summary
    console.log("\n[deploy-optimize] ═══════════ Summary ═══════════");
    console.log(`  Processed:  ${processed}`);
    console.log(`  Skipped:    ${skipped} (already optimal or smaller)`);
    console.log(`  Errors:     ${errors}`);
    console.log(
        `  Saved:      ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`
    );
    console.log(
        `  Backups:    All originals preserved at /backup/ paths`
    );
    console.log(`  Marker:     ${MARKER_PATH} written to MinIO`);
    console.log("[deploy-optimize] ✅ Done.\n");
}

main().catch((error) => {
    console.error("[deploy-optimize] Fatal error:", error);
    // Don't exit(1) — we don't want to break the deploy if MinIO
    // is unreachable. The migration will retry on next deploy.
    console.error(
        "[deploy-optimize] ⚠️  Migration failed but build continues."
    );
});
