import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/minio";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const MAX_FILE_SIZE_MB = 30;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const getErrorCode = (error: unknown): string | null => {
    if (!error || typeof error !== "object") return null;
    const maybeCode = (error as { code?: unknown }).code;
    return typeof maybeCode === "string" ? maybeCode : null;
};

const getErrorDetails = (error: unknown): string | null => {
    if (!error || typeof error !== "object") return null;
    const maybeDetails = (error as { details?: unknown }).details;
    return typeof maybeDetails === "string" ? maybeDetails : null;
};

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await request.formData();
        const candidate = formData.get("file") || formData.getAll("files")[0];

        if (!(candidate instanceof File)) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        if (candidate.size <= 0 || candidate.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `Dosya boyutu ${MAX_FILE_SIZE_MB}MB altında olmalı` },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.has(candidate.type)) {
            return NextResponse.json(
                { error: "Sadece JPG, PNG, WEBP veya GIF yüklenebilir" },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await candidate.arrayBuffer());
        const upload = await uploadImage(
            buffer,
            `${session.userId}-${randomUUID()}`,
            candidate.name || "article-image",
            { collection: "articles" }
        );

        return NextResponse.json(
            {
                url: upload.url,
                thumbnailUrl: upload.thumbnailUrl,
                width: upload.width,
                height: upload.height,
                size: upload.size,
            },
            { status: 201 }
        );
    } catch (error) {
        const errorCode = getErrorCode(error);
        const errorDetails = getErrorDetails(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (errorCode === "MEDIA_OPTIMIZED_TOO_LARGE") {
            return NextResponse.json(
                {
                    error: "Optimize edilmiş görsel boyutu limiti aşıldı.",
                    code: "MEDIA_OPTIMIZED_TOO_LARGE",
                    details:
                        errorDetails ||
                        "Görsel optimize edildikten sonra da izin verilen maksimum boyutu aşıyor.",
                },
                { status: 413 }
            );
        }

        console.error("Error uploading article media:", error);
        return NextResponse.json(
            { error: `Failed to upload image: ${errorMessage}` },
            { status: 500 }
        );
    }
}
