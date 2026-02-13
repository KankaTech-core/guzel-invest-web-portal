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

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
                { error: "Dosya boyutu 10MB altında olmalı" },
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
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error uploading article media:", error);
        return NextResponse.json(
            { error: `Failed to upload image: ${errorMessage}` },
            { status: 500 }
        );
    }
}
