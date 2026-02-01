import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/minio";

export const runtime = "nodejs";

interface RouteParams {
    params: Promise<{ id: string }>;
}

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

        const listing = await prisma.listing.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        const formData = await request.formData();
        const rawFiles = formData.getAll("files");
        const files = rawFiles.filter(
            (file): file is File =>
                typeof file === "object" && file !== null && "arrayBuffer" in file
        );

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No files uploaded" },
                { status: 400 }
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
        console.error("Error uploading listing media:", error);
        return NextResponse.json(
            { error: "Failed to upload media" },
            { status: 500 }
        );
    }
}
