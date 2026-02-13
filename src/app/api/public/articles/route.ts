import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";

export async function GET() {
    try {
        const articles = await prisma.article.findMany({
            where: {
                status: ArticleStatus.PUBLISHED,
            },
            select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                category: true,
                tags: true,
                coverImageUrl: true,
                coverThumbnailUrl: true,
                publishedAt: true,
                createdAt: true,
            },
            orderBy: [
                { publishedAt: "desc" },
                { createdAt: "desc" },
            ],
        });

        return NextResponse.json({ articles });
    } catch (error) {
        console.error("Public articles API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
}
