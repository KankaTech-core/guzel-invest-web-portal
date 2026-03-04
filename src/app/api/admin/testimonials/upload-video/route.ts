import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadDocument } from "@/lib/minio";

export const runtime = "nodejs";

const ALLOWED_VIDEO_TYPES = new Set([
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-m4v",
    "video/mpeg",
]);
const ALLOWED_VIDEO_EXTENSIONS = new Set(["mp4", "webm", "ogg", "mov", "m4v", "mpeg"]);
const MAX_FILE_SIZE_MB = 80;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const getFileExtension = (filename: string) => {
    const parts = filename.toLowerCase().split(".");
    if (parts.length < 2) return "";
    return (parts.pop() || "").replace(/[^a-z0-9]/g, "");
};

const isAllowedVideoFile = (file: File) => {
    const extension = getFileExtension(file.name);
    if (ALLOWED_VIDEO_EXTENSIONS.has(extension)) {
        return true;
    }

    const type = file.type.trim().toLowerCase();
    return ALLOWED_VIDEO_TYPES.has(type);
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
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json(
                { error: "Yüklenecek video dosyası bulunamadı." },
                { status: 400 }
            );
        }

        if (!isAllowedVideoFile(file)) {
            return NextResponse.json(
                {
                    error: `Desteklenmeyen video türü: ${file.name}`,
                    details: "Sadece MP4, WEBM, OGG, MOV, M4V veya MPEG yüklenebilir.",
                },
                { status: 415 }
            );
        }

        if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json(
                {
                    error: `Maksimum video dosyası boyutu ${MAX_FILE_SIZE_MB}MB olmalıdır.`,
                },
                { status: 413 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const upload = await uploadDocument(buffer, "videos", file.name, {
            collection: "testimonials",
            contentType: file.type || "video/mp4",
        });

        return NextResponse.json({
            url: upload.url,
            size: upload.size,
            contentType: file.type || null,
        });
    } catch (error) {
        console.error("Error uploading testimonial video:", { error });
        return NextResponse.json(
            {
                error: "Video yükleme işlemi başarısız oldu.",
                code: "MEDIA_UPLOAD_FAILED",
            },
            { status: 500 }
        );
    }
}
