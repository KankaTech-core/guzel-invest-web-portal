import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";

export async function GET(req: NextRequest) {
    try {
        const locale = req.nextUrl.searchParams.get("locale")?.toLowerCase().split("-")[0] || "tr";

        const includeTranslations = locale !== "tr";

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
                ...(includeTranslations ? {
                    translations: {
                        where: { locale },
                        take: 1,
                    },
                } : {}),
            },
            orderBy: [
                { publishedAt: "desc" },
                { createdAt: "desc" },
            ],
        });

        if (!includeTranslations || articles.length === 0) {
            return NextResponse.json({ articles });
        }

        // Apply DB translations, fall back to Turkish if not available
        type ArticleOut = { id: string; slug: string; title: string; excerpt: string | null; category: string | null; tags: string[]; coverImageUrl: string | null; coverThumbnailUrl: string | null; publishedAt: Date | null; createdAt: Date };

        const result: ArticleOut[] = articles.map((a) => {
            const dbTr = "translations" in a
                ? (a as typeof a & { translations?: { title: string; excerpt: string | null; category: string | null }[] }).translations?.[0]
                : null;

            return {
                id: a.id, slug: a.slug,
                title: dbTr?.title || a.title,
                excerpt: dbTr?.excerpt ?? a.excerpt,
                category: dbTr?.category ?? a.category,
                tags: a.tags, coverImageUrl: a.coverImageUrl,
                coverThumbnailUrl: a.coverThumbnailUrl,
                publishedAt: a.publishedAt, createdAt: a.createdAt,
            };
        });

        return NextResponse.json({ articles: result });
    } catch (error) {
        console.error("Public articles API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
}
