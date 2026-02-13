import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const status = body?.status as ArticleStatus | undefined;

        if (!status || !Object.values(ArticleStatus).includes(status)) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const existing = await prisma.article.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                publishedAt: true,
            },
        });

        if (!existing) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        const article = await prisma.article.update({
            where: { id },
            data: {
                status,
                publishedAt:
                    status === ArticleStatus.PUBLISHED && existing.status !== ArticleStatus.PUBLISHED
                        ? new Date()
                        : existing.publishedAt,
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error("Error updating article status:", error);
        return NextResponse.json(
            { error: "Failed to update article status" },
            { status: 500 }
        );
    }
}
