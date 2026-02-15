import * as Minio from "minio";
import sharp from "sharp";
import { randomUUID } from "crypto";

const rawEndpoint = process.env.MINIO_ENDPOINT || "localhost";
const hasProtocol = rawEndpoint.startsWith("http://") || rawEndpoint.startsWith("https://");
const parsedEndpoint = hasProtocol ? new URL(rawEndpoint) : null;
const endPoint = parsedEndpoint ? parsedEndpoint.hostname : rawEndpoint;
const port = parsedEndpoint
    ? Number(parsedEndpoint.port || (parsedEndpoint.protocol === "https:" ? "443" : "80"))
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

const BUCKET_NAME = process.env.MINIO_BUCKET || "guzel-invest";
const DEFAULT_MAX_OPTIMIZED_IMAGE_MB = 8;
const WEBP_QUALITY = 60;

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const MAX_OPTIMIZED_IMAGE_SIZE_MB = parsePositiveInt(
    process.env.MINIO_MAX_OPTIMIZED_IMAGE_MB,
    DEFAULT_MAX_OPTIMIZED_IMAGE_MB
);
const MAX_OPTIMIZED_IMAGE_SIZE_BYTES = MAX_OPTIMIZED_IMAGE_SIZE_MB * 1024 * 1024;

export interface UploadResult {
    url: string;
    thumbnailUrl: string;
    width: number;
    height: number;
    size: number;
}

interface UploadImageOptions {
    collection?: "listings" | "articles";
}

interface MinioUploadErrorLike extends Error {
    code: string;
    details?: string;
}

const createMinioUploadError = (
    code: string,
    message: string,
    details?: string
): MinioUploadErrorLike => {
    const error = new Error(message) as MinioUploadErrorLike;
    error.code = code;
    error.details = details;
    return error;
};

export async function ensureBucketExists(): Promise<void> {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME);
        // Set bucket policy for public access
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${BUCKET_NAME}/public/*`],
                },
            ],
        };
        await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }
}

export async function uploadImage(
    file: Buffer,
    entityId: string,
    _originalFilename: string,
    options: UploadImageOptions = {}
): Promise<UploadResult> {
    await ensureBucketExists();
    void _originalFilename;
    const collection = options.collection || "listings";

    const uuid = randomUUID();

    // Process original image
    const image = sharp(file);
    const metadata = await image.metadata();

    // Convert to WebP for optimization
    const optimizedBuffer = await image
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

    if (optimizedBuffer.length > MAX_OPTIMIZED_IMAGE_SIZE_BYTES) {
        throw createMinioUploadError(
            "MEDIA_OPTIMIZED_TOO_LARGE",
            `Optimize edilen görsel ${MAX_OPTIMIZED_IMAGE_SIZE_MB}MB limitini aştı.`,
            `Orijinal: ${(file.length / (1024 * 1024)).toFixed(2)}MB, optimize: ${(optimizedBuffer.length / (1024 * 1024)).toFixed(2)}MB`
        );
    }

    // Create thumbnail
    const thumbnailBuffer = await sharp(file)
        .resize(400, 300, { fit: "cover" })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

    // Upload paths
    const originalPath = `public/${collection}/${entityId}/original/${uuid}.webp`;
    const thumbnailPath = `public/${collection}/${entityId}/thumb/${uuid}.webp`;

    // Upload files
    await minioClient.putObject(
        BUCKET_NAME,
        originalPath,
        optimizedBuffer,
        optimizedBuffer.length,
        { "Content-Type": "image/webp" }
    );

    await minioClient.putObject(
        BUCKET_NAME,
        thumbnailPath,
        thumbnailBuffer,
        thumbnailBuffer.length,
        { "Content-Type": "image/webp" }
    );

    return {
        url: originalPath,
        thumbnailUrl: thumbnailPath,
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: optimizedBuffer.length,
    };
}

export async function deleteImage(url: string): Promise<void> {
    try {
        const bucketMarker = `${BUCKET_NAME}/`;
        const bucketIndex = url.indexOf(bucketMarker);
        const objectPath =
            bucketIndex >= 0
                ? url.slice(bucketIndex + bucketMarker.length)
                : url;
        await minioClient.removeObject(BUCKET_NAME, objectPath);

        // Also try to delete thumbnail
        const thumbPath = objectPath.replace("/original/", "/thumb/");
        await minioClient.removeObject(BUCKET_NAME, thumbPath).catch(() => { });
    } catch (error) {
        console.error("Failed to delete image:", error);
    }
}

export async function getPresignedUploadUrl(
    listingId: string,
    filename: string
): Promise<string> {
    await ensureBucketExists();
    const uuid = randomUUID();
    const ext = filename.split(".").pop() || "jpg";
    const objectPath = `public/listings/${listingId}/original/${uuid}.${ext}`;

    return minioClient.presignedPutObject(BUCKET_NAME, objectPath, 60 * 60); // 1 hour
}

export { minioClient, BUCKET_NAME };
