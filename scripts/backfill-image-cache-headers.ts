import "dotenv/config";
import * as Minio from "minio";

const TARGET_CACHE_CONTROL = "public, max-age=31536000, immutable";
const MIGRATION_VERSION = "image-cache-header-v1";
const MARKER_PATH = `.migrations/${MIGRATION_VERSION}.done`;
const DRY_RUN = process.env.DRY_RUN === "true";
const FORCE = process.env.FORCE === "true";
const LOG_EVERY = 100;

const IMAGE_EXTENSIONS = new Set([
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".webp",
]);

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
const PREFIXES = ["public/listings/", "public/articles/", "public/testimonials/"];

const getExtension = (path: string) => {
    const lastDot = path.lastIndexOf(".");
    if (lastDot === -1) {
        return "";
    }
    return path.slice(lastDot).toLowerCase();
};

const isImagePath = (path: string) => IMAGE_EXTENSIONS.has(getExtension(path));

const inferContentType = (path: string) => {
    const ext = getExtension(path);
    switch (ext) {
        case ".avif":
            return "image/avif";
        case ".gif":
            return "image/gif";
        case ".jpeg":
        case ".jpg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".svg":
            return "image/svg+xml";
        case ".webp":
            return "image/webp";
        default:
            return "application/octet-stream";
    }
};

const normalizeHeaderValue = (value: unknown) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

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
        cacheControl: TARGET_CACHE_CONTROL,
    });

    await minioClient.putObject(BUCKET, MARKER_PATH, body, body.length, {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
    });
}

async function listImageObjects(): Promise<string[]> {
    const paths: string[] = [];

    for (const prefix of PREFIXES) {
        const stream = minioClient.listObjectsV2(BUCKET, prefix, true);
        for await (const obj of stream) {
            if (!obj.name) {
                continue;
            }
            if (!isImagePath(obj.name)) {
                continue;
            }
            paths.push(obj.name);
        }
    }

    return paths;
}

async function main() {
    console.log("[cache-backfill] Starting image cache header backfill");
    console.log(`[cache-backfill] Bucket: ${BUCKET}`);
    console.log(`[cache-backfill] Mode: ${DRY_RUN ? "DRY_RUN" : "LIVE"}`);

    if (!DRY_RUN) {
        if (!FORCE) {
            const alreadyDone = await checkMigrationMarker();
            if (alreadyDone) {
                console.log(
                    `[cache-backfill] Migration "${MIGRATION_VERSION}" already completed. Skipping.`
                );
                return;
            }
        } else {
            console.log("[cache-backfill] FORCE mode enabled; marker ignored.");
        }
    }

    const paths = await listImageObjects();
    console.log(`[cache-backfill] Found ${paths.length} image objects`);

    let processed = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const path of paths) {
        processed += 1;
        try {
            const stat = await minioClient.statObject(BUCKET, path);
            const meta = stat.metaData || {};

            const currentCacheControl =
                normalizeHeaderValue(meta["cache-control"]) ||
                normalizeHeaderValue(meta["Cache-Control"]);

            const contentType =
                (typeof meta["content-type"] === "string" && meta["content-type"]) ||
                (typeof meta["Content-Type"] === "string" && meta["Content-Type"]) ||
                inferContentType(path);

            if (currentCacheControl === TARGET_CACHE_CONTROL.toLowerCase()) {
                skipped += 1;
                continue;
            }

            if (!DRY_RUN) {
                const source = new Minio.CopySourceOptions({
                    Bucket: BUCKET,
                    Object: path,
                });
                const destination = new Minio.CopyDestinationOptions({
                    Bucket: BUCKET,
                    Object: path,
                    MetadataDirective: "REPLACE",
                    Headers: {
                        "Content-Type": contentType,
                        "Cache-Control": TARGET_CACHE_CONTROL,
                    },
                });

                await minioClient.copyObject(source, destination);
            }

            updated += 1;

            if (processed % LOG_EVERY === 0) {
                console.log(
                    `[cache-backfill] Progress ${processed}/${paths.length} (updated=${updated}, skipped=${skipped}, failed=${failed})`
                );
            }
        } catch (error) {
            failed += 1;
            console.error(
                `[cache-backfill] ERROR ${path}:`,
                error instanceof Error ? error.message : error
            );
        }
    }

    console.log("[cache-backfill] Done");
    console.log(
        `[cache-backfill] Summary processed=${processed} updated=${updated} skipped=${skipped} failed=${failed}`
    );

    if (!DRY_RUN && failed === 0) {
        await writeMigrationMarker();
        console.log(`[cache-backfill] Marker written: ${MARKER_PATH}`);
    } else if (!DRY_RUN && failed > 0) {
        console.log(
            "[cache-backfill] Marker not written because some objects failed; rerun required."
        );
    }
}

main().catch((error) => {
    console.error("[cache-backfill] Fatal error:", error);
    process.exit(1);
});
