import { NextRequest, NextResponse } from "next/server";
import { MediaType } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { uploadDocument } from "@/lib/minio";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_DOCUMENT_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const ALLOWED_DOCUMENT_EXTENSIONS = new Set(["pdf", "doc", "docx", "ppt", "pptx"]);
const MAX_FILE_SIZE_MB = 30;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_UPLOAD_BYTES = 70 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;

interface RouteParams {
    params: Promise<{ id: string }>;
}

const parseContentLength = (request: NextRequest): number | null => {
    const rawValue = request.headers.get("content-length");
    if (!rawValue) return null;
    const parsed = Number.parseInt(rawValue, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const getFileExtension = (filename: string) => {
    const parts = filename.toLowerCase().split(".");
    if (parts.length < 2) return "";
    return (parts.pop() || "").replace(/[^a-z0-9]/g, "");
};

const isAllowedDocumentFile = (file: File) => {
    const extension = getFileExtension(file.name);
    if (ALLOWED_DOCUMENT_EXTENSIONS.has(extension)) {
        return true;
    }

    const contentType = file.type.trim().toLowerCase();
    return ALLOWED_DOCUMENT_TYPES.has(contentType);
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

        const project = await prisma.listing.findFirst({
            where: { id, isProject: true },
            select: { id: true },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const contentLength = parseContentLength(request);
        if (contentLength !== null && contentLength > MAX_TOTAL_UPLOAD_BYTES) {
            return NextResponse.json(
                {
                    error: `Toplam yükleme boyutu ${Math.floor(
                        MAX_TOTAL_UPLOAD_BYTES / (1024 * 1024)
                    )}MB sınırını aşıyor.`,
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
                { error: "Yüklenecek dosya bulunamadı." },
                { status: 400 }
            );
        }

        if (files.length > MAX_FILES_PER_REQUEST) {
            return NextResponse.json(
                {
                    error: `Tek istekte en fazla ${MAX_FILES_PER_REQUEST} dosya yüklenebilir.`,
                },
                { status: 400 }
            );
        }

        const invalidFile = files.find((file) => !isAllowedDocumentFile(file));
        if (invalidFile) {
            return NextResponse.json(
                {
                    error: `Desteklenmeyen belge türü: ${invalidFile.name}`,
                    details: "Sadece PDF, DOC, DOCX, PPT veya PPTX yüklenebilir.",
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
                },
                { status: 413 }
            );
        }

        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > MAX_TOTAL_UPLOAD_BYTES) {
            return NextResponse.json(
                {
                    error: `Toplam yükleme boyutu ${Math.floor(
                        MAX_TOTAL_UPLOAD_BYTES / (1024 * 1024)
                    )}MB sınırını aşıyor.`,
                },
                { status: 413 }
            );
        }

        const mediaCount = await prisma.media.count({
            where: { listingId: id },
        });

        const createdDocuments: Array<{
            id: string;
            url: string;
            category: string | null;
            type: MediaType;
            order: number;
        }> = [];

        for (const [index, file] of files.entries()) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const upload = await uploadDocument(buffer, id, file.name, {
                collection: "listings",
                contentType: file.type || "application/octet-stream",
            });

            const media = await prisma.media.create({
                data: {
                    listingId: id,
                    url: upload.url,
                    thumbnailUrl: null,
                    type: MediaType.DOCUMENT,
                    category: "DOCUMENT",
                    order: mediaCount + index,
                    isCover: false,
                    aiTags: [],
                    width: null,
                    height: null,
                    size: upload.size,
                    customGalleryId: null,
                    projectUnitId: null,
                },
                select: {
                    id: true,
                    url: true,
                    category: true,
                    type: true,
                    order: true,
                },
            });

            createdDocuments.push(media);
        }

        return NextResponse.json({ documents: createdDocuments }, { status: 201 });
    } catch (error) {
        console.error("Error uploading project documents:", {
            listingId,
            error,
        });
        return NextResponse.json(
            { error: "Belge yükleme işlemi başarısız oldu." },
            { status: 500 }
        );
    }
}
