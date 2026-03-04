import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadDocument } from "@/lib/minio";
import { prisma } from "@/lib/prisma";

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
const MAX_FILE_SIZE_MB = 120;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface RouteParams {
    params: Promise<{ id: string }>;
}

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

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const project = await prisma.listing.findFirst({
            where: { id, isProject: true },
            select: { id: true },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

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
                    error: `${file.name} için maksimum dosya boyutu ${MAX_FILE_SIZE_MB}MB olmalıdır.`,
                },
                { status: 413 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const upload = await uploadDocument(buffer, id, file.name, {
            collection: "listings",
            contentType: file.type || "video/mp4",
        });

        return NextResponse.json(
            {
                url: upload.url,
                size: upload.size,
                contentType: file.type || null,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading project promo video:", { error });
        return NextResponse.json(
            { error: "Promosyon videosu yüklenemedi." },
            { status: 500 }
        );
    }
}
