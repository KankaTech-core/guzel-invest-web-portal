/**
 * Migration Script: Re-optimize existing images
 *
 * This script downloads each original image from MinIO, resizes it to
 * max 1920×1080 if larger, re-encodes as WebP (quality 60, effort 4),
 * regenerates the thumbnail (400×300), and uploads the optimized versions
 * BACK to the SAME paths — preserving all database references.
 *
 * Safety features:
 * - Backs up the original to a /backup/ path before overwriting
 * - Skips images that are already within the size limit (optional)
 * - Dry-run mode (DRY_RUN=true) to preview changes without writing
 * - Logs every action for full auditability
 *
 * Usage:
 *   npx tsx scripts/optimize-existing-images.ts
 *   DRY_RUN=true npx tsx scripts/optimize-existing-images.ts
 *   SKIP_SMALL=true npx tsx scripts/optimize-existing-images.ts
 */

import * as Minio from "minio";
import sharp from "sharp";

// ─── Configuration ───────────────────────────────────────────────

const WEBP_QUALITY = 60;
const WEBP_EFFORT = 4;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const THUMB_WIDTH = 400;
const THUMB_HEIGHT = 300;
const IMAGE_CACHE_CONTROL = "public, max-age=31536000, immutable";

const DRY_RUN = process.env.DRY_RUN === "true";
const SKIP_SMALL = process.env.SKIP_SMALL === "true";

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

async function streamToBuffer(
    stream: NodeJS.ReadableStream
): Promise<Buffer> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

interface ImageStats {
    path: string;
    originalSize: number;
    originalWidth: number;
    originalHeight: number;
    newSize: number;
    newWidth: number;
    newHeight: number;
    saved: number;
    skipped: boolean;
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

async function objectExists(path: string): Promise<boolean> {
    try {
        await minioClient.statObject(BUCKET, path);
        return true;
    } catch {
        return false;
    }
}

// ─── Main ────────────────────────────────────────────────────────

async function main() {
    console.log("═══════════════════════════════════════════════════════════");
    console.log("  Güzel Invest — Image Re-Optimization Migration");
    console.log(`  Mode: ${DRY_RUN ? "🔍 DRY RUN (no writes)" : "✏️  LIVE"}`);
    console.log(`  Skip already small: ${SKIP_SMALL}`);
    console.log("═══════════════════════════════════════════════════════════\n");

    const images = await listOriginalImages();
    console.log(`Found ${images.length} original images to process.\n`);

    if (images.length === 0) {
        console.log("Nothing to do.");
        return;
    }

    const stats: ImageStats[] = [];
    let errorCount = 0;

    for (const [index, imagePath] of images.entries()) {
        const progress = `[${index + 1}/${images.length}]`;

        try {
            // 1. Download original
            const stream = await minioClient.getObject(BUCKET, imagePath);
            const originalBuffer = await streamToBuffer(stream);
            const meta = await sharp(originalBuffer).metadata();
            const origWidth = meta.width || 0;
            const origHeight = meta.height || 0;

            // 2. Check if already small enough
            const needsResize =
                origWidth > MAX_WIDTH || origHeight > MAX_HEIGHT;

            if (SKIP_SMALL && !needsResize) {
                console.log(
                    `${progress} SKIP ${imagePath} (${origWidth}×${origHeight} — already within limits)`
                );
                stats.push({
                    path: imagePath,
                    originalSize: originalBuffer.length,
                    originalWidth: origWidth,
                    originalHeight: origHeight,
                    newSize: originalBuffer.length,
                    newWidth: origWidth,
                    newHeight: origHeight,
                    saved: 0,
                    skipped: true,
                });
                continue;
            }

            // 3. Re-optimize: resize (if needed) + re-encode WebP
            const optimizedBuffer = await sharp(originalBuffer)
                .resize(MAX_WIDTH, MAX_HEIGHT, {
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
                .toBuffer();

            const newMeta = await sharp(optimizedBuffer).metadata();
            const newWidth = newMeta.width || origWidth;
            const newHeight = newMeta.height || origHeight;

            // 4. Regenerate thumbnail
            const thumbBuffer = await sharp(originalBuffer)
                .resize(THUMB_WIDTH, THUMB_HEIGHT, { fit: "cover" })
                .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
                .toBuffer();

            const saved = originalBuffer.length - optimizedBuffer.length;
            const savedPct = ((saved / originalBuffer.length) * 100).toFixed(1);
            const sizeKB = (optimizedBuffer.length / 1024).toFixed(0);
            const origSizeKB = (originalBuffer.length / 1024).toFixed(0);

            console.log(
                `${progress} ${imagePath}  ${origWidth}×${origHeight} → ${newWidth}×${newHeight}  ${origSizeKB}KB → ${sizeKB}KB  (${saved >= 0 ? "-" : "+"}${Math.abs(Number(savedPct))}%)`
            );

            if (!DRY_RUN) {
                // 5. Backup original (never lose data)
                const backupPath = getBackupPath(imagePath);
                const backupExists = await objectExists(backupPath);
                if (!backupExists) {
                    await minioClient.putObject(
                        BUCKET,
                        backupPath,
                        originalBuffer,
                        originalBuffer.length,
                        {
                            "Content-Type": "image/webp",
                            "Cache-Control": IMAGE_CACHE_CONTROL,
                        }
                    );
                }

                // 6. Overwrite original with optimized version
                await minioClient.putObject(
                    BUCKET,
                    imagePath,
                    optimizedBuffer,
                    optimizedBuffer.length,
                    {
                        "Content-Type": "image/webp",
                        "Cache-Control": IMAGE_CACHE_CONTROL,
                    }
                );

                // 7. Overwrite thumbnail
                const thumbPath = getThumbPath(imagePath);
                await minioClient.putObject(
                    BUCKET,
                    thumbPath,
                    thumbBuffer,
                    thumbBuffer.length,
                    {
                        "Content-Type": "image/webp",
                        "Cache-Control": IMAGE_CACHE_CONTROL,
                    }
                );
            }

            stats.push({
                path: imagePath,
                originalSize: originalBuffer.length,
                originalWidth: origWidth,
                originalHeight: origHeight,
                newSize: optimizedBuffer.length,
                newWidth: newWidth,
                newHeight: newHeight,
                saved,
                skipped: false,
            });
        } catch (error) {
            errorCount++;
            console.error(
                `${progress} ERROR processing ${imagePath}:`,
                error instanceof Error ? error.message : error
            );
        }
    }

    // ─── Summary ─────────────────────────────────────────────────

    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("  Summary");
    console.log("═══════════════════════════════════════════════════════════");

    const processed = stats.filter((s) => !s.skipped);
    const skipped = stats.filter((s) => s.skipped);
    const totalSaved = processed.reduce((sum, s) => sum + s.saved, 0);
    const totalOriginal = processed.reduce((sum, s) => sum + s.originalSize, 0);
    const totalNew = processed.reduce((sum, s) => sum + s.newSize, 0);

    console.log(`  Total images found:    ${images.length}`);
    console.log(`  Processed:             ${processed.length}`);
    console.log(`  Skipped (small):       ${skipped.length}`);
    console.log(`  Errors:                ${errorCount}`);
    console.log(
        `  Original total size:   ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`
    );
    console.log(
        `  New total size:        ${(totalNew / (1024 * 1024)).toFixed(2)} MB`
    );
    console.log(
        `  Total saved:           ${(totalSaved / (1024 * 1024)).toFixed(2)} MB (${totalOriginal > 0 ? ((totalSaved / totalOriginal) * 100).toFixed(1) : 0}%)`
    );

    if (DRY_RUN) {
        console.log(
            "\n  ℹ️  This was a DRY RUN. No files were modified."
        );
        console.log(
            "  Run without DRY_RUN=true to apply changes.\n"
        );
    } else {
        console.log(
            "\n  ✅ All originals backed up to /backup/ paths before overwriting."
        );
        console.log("  Database references remain unchanged.\n");
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
