import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/minio";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "VIEWER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "Yüklenecek dosya bulunamadı.", code: "MEDIA_MISSING_FILE" },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                {
                    error: `Desteklenmeyen dosya türü: ${file.name}`,
                    code: "MEDIA_INVALID_TYPE",
                    details: "Sadece JPG, PNG, WEBP, GIF veya AVIF yüklenebilir.",
                },
                { status: 415 }
            );
        }

        if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json(
                {
                    error: `Maksimum dosya boyutu ${MAX_FILE_SIZE_MB}MB olmalıdır.`,
                    code: "MEDIA_FILE_TOO_LARGE",
                },
                { status: 413 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // entityId = "avatars" so path becomes: public/testimonials/avatars/original/{uuid}.webp
        const upload = await uploadImage(
            buffer,
            "avatars",
            file.name || "testimonial-image",
            { collection: "testimonials" }
        );

        return NextResponse.json({
            url: upload.url,
            thumbnailUrl: upload.thumbnailUrl,
            width: upload.width,
            height: upload.height,
            size: upload.size,
        });
    } catch (error) {
        const errorCode = getErrorCode(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorDetails = getErrorDetails(error);

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

        console.error("Error uploading testimonial image:", {
            errorCode,
            errorMessage,
            errorDetails,
            error,
        });
        return NextResponse.json(
            {
                error: "Görsel yükleme işlemi başarısız oldu.",
                code: "MEDIA_UPLOAD_FAILED",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
