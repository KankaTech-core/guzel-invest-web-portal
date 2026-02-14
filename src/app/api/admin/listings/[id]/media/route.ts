import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/minio";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);
const MAX_FILE_SIZE_MB = 30;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_UPLOAD_BYTES = 35 * 1024 * 1024; // 35MB
const MAX_FILES_PER_REQUEST = 15;

interface RouteParams {
    params: Promise<{ id: string }>;
}

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

const parseContentLength = (request: NextRequest): number | null => {
    const rawValue = request.headers.get("content-length");
    if (!rawValue) return null;
    const parsed = Number.parseInt(rawValue, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
    let listingId = "unknown";

    try {
        const session = await getSession();
        const { id } = await params;
        listingId = id;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const listing = await prisma.listing.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        const contentLength = parseContentLength(request);
        if (contentLength !== null && contentLength > MAX_TOTAL_UPLOAD_BYTES) {
            return NextResponse.json(
                {
                    error: `Toplam yükleme boyutu ${Math.floor(MAX_TOTAL_UPLOAD_BYTES / (1024 * 1024))}MB sınırını aşıyor.`,
                    code: "MEDIA_TOTAL_SIZE_LIMIT",
                    details: "Dosyaları küçültüp veya tek tek yükleyip tekrar deneyin.",
                },
                { status: 413 }
            );
        }

        const formData = await request.formData();
        const fileCandidates = [...formData.getAll("files")];
        const singleFile = formData.get("file");
        if (singleFile) {
            fileCandidates.push(singleFile);
        }

        const files = fileCandidates.filter(
            (candidate): candidate is File => candidate instanceof File
        );

        if (files.length === 0) {
            return NextResponse.json(
                {
                    error: "Yüklenecek dosya bulunamadı.",
                    code: "MEDIA_MISSING_FILE",
                },
                { status: 400 }
            );
        }

        if (files.length > MAX_FILES_PER_REQUEST) {
            return NextResponse.json(
                {
                    error: `Tek istekte en fazla ${MAX_FILES_PER_REQUEST} dosya yüklenebilir.`,
                    code: "MEDIA_TOO_MANY_FILES",
                },
                { status: 400 }
            );
        }

        const invalidTypeFile = files.find((file) => !ALLOWED_TYPES.has(file.type));
        if (invalidTypeFile) {
            return NextResponse.json(
                {
                    error: `Desteklenmeyen dosya türü: ${invalidTypeFile.name}`,
                    code: "MEDIA_INVALID_TYPE",
                    details: "Sadece JPG, PNG, WEBP, GIF veya AVIF yüklenebilir.",
                },
                { status: 415 }
            );
        }

        const oversizedFile = files.find(
            (file) => file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES
        );
        if (oversizedFile) {
            return NextResponse.json(
                {
                    error: `${oversizedFile.name} için maksimum dosya boyutu ${MAX_FILE_SIZE_MB}MB olmalıdır.`,
                    code: "MEDIA_FILE_TOO_LARGE",
                },
                { status: 413 }
            );
        }

        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > MAX_TOTAL_UPLOAD_BYTES) {
            return NextResponse.json(
                {
                    error: `Toplam yükleme boyutu ${Math.floor(MAX_TOTAL_UPLOAD_BYTES / (1024 * 1024))}MB sınırını aşıyor.`,
                    code: "MEDIA_TOTAL_SIZE_LIMIT",
                    details: "Dosyaları küçültüp veya daha küçük gruplar halinde tekrar deneyin.",
                },
                { status: 413 }
            );
        }

        const [mediaCount, coverExists] = await prisma.$transaction([
            prisma.media.count({ where: { listingId: id } }),
            prisma.media.findFirst({
                where: { listingId: id, isCover: true },
                select: { id: true },
            }),
        ]);

        const createdMedia = [] as Array<{
            id: string;
            listingId: string;
            url: string;
            thumbnailUrl: string | null;
            type: string;
            order: number;
            isCover: boolean;
            aiTags: string[];
            width: number | null;
            height: number | null;
            size: number | null;
            createdAt: Date;
        }>;

        for (const [index, file] of files.entries()) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const upload = await uploadImage(buffer, id, file.name || `upload-${index}`);

            const media = await prisma.media.create({
                data: {
                    listingId: id,
                    url: upload.url,
                    thumbnailUrl: upload.thumbnailUrl,
                    order: mediaCount + index,
                    isCover: !coverExists && index === 0,
                    aiTags: [],
                    width: upload.width || null,
                    height: upload.height || null,
                    size: upload.size || null,
                },
            });

            createdMedia.push(media);
        }

        return NextResponse.json({ media: createdMedia }, { status: 201 });
    } catch (error) {
        const errorCode = getErrorCode(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const errorDetails = getErrorDetails(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        const requestDetails = {
            listingId,
            contentLength: request.headers.get("content-length"),
            userAgent: request.headers.get("user-agent"),
            errorCode,
            errorMessage,
            errorDetails,
        };

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

        if (errorCode === "ECONNRESET" || errorMessage.toLowerCase().includes("aborted")) {
            console.warn("Listing media upload connection aborted:", requestDetails);
            return NextResponse.json(
                {
                    error: "Yükleme sırasında bağlantı kesildi.",
                    code: "MEDIA_CONNECTION_ABORTED",
                    details:
                        "Bu durum genellikle büyük dosya, proxy limiti veya ağ kesintisi nedeniyle oluşur. Dosyaları küçültüp tekrar deneyin.",
                },
                { status: 408 }
            );
        }

        console.error("Error uploading listing media:", {
            ...requestDetails,
            errorStack,
            error,
        });
        return NextResponse.json(
            {
                error: "Medya yükleme işlemi başarısız oldu.",
                code: "MEDIA_UPLOAD_FAILED",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
