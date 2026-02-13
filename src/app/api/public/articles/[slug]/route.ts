import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const article = await prisma.article.findFirst({
            where: {
                slug,
                status: ArticleStatus.PUBLISHED,
            },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                content: true,
                category: true,
                tags: true,
                coverImageUrl: true,
                coverThumbnailUrl: true,
                createdAt: true,
                publishedAt: true,
            },
        });

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json({ article });
    } catch (error) {
        console.error("Public article detail API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch article detail" },
            { status: 500 }
        );
    }
}
