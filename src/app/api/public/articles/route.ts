import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";
import { translateBatch } from "@/lib/ai-translate";

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

        // Apply DB translations, collect items needing AI translation
        type ArticleOut = { id: string; slug: string; title: string; excerpt: string | null; category: string | null; tags: string[]; coverImageUrl: string | null; coverThumbnailUrl: string | null; publishedAt: Date | null; createdAt: Date };
        const batchItems: { key: string; text: string }[] = [];

        const result: ArticleOut[] = articles.map((a, i) => {
            const dbTr = "translations" in a
                ? (a as typeof a & { translations?: { title: string; excerpt: string | null; category: string | null }[] }).translations?.[0]
                : null;

            if (dbTr?.title) {
                return {
                    id: a.id, slug: a.slug,
                    title: dbTr.title,
                    excerpt: dbTr.excerpt ?? a.excerpt,
                    category: dbTr.category ?? a.category,
                    tags: a.tags, coverImageUrl: a.coverImageUrl,
                    coverThumbnailUrl: a.coverThumbnailUrl,
                    publishedAt: a.publishedAt, createdAt: a.createdAt,
                };
            }

            // Collect for AI batch
            batchItems.push({ key: `title-${i}`, text: a.title });
            if (a.excerpt) batchItems.push({ key: `excerpt-${i}`, text: a.excerpt });
            if (a.category) batchItems.push({ key: `cat-${i}`, text: a.category });

            return {
                id: a.id, slug: a.slug,
                title: a.title, excerpt: a.excerpt, category: a.category,
                tags: a.tags, coverImageUrl: a.coverImageUrl,
                coverThumbnailUrl: a.coverThumbnailUrl,
                publishedAt: a.publishedAt, createdAt: a.createdAt,
            };
        });

        if (batchItems.length > 0) {
            const translated = await translateBatch(batchItems, locale);
            for (let i = 0; i < result.length; i++) {
                if (translated[`title-${i}`]) {
                    result[i].title = translated[`title-${i}`] || result[i].title;
                    result[i].excerpt = result[i].excerpt ? (translated[`excerpt-${i}`] || result[i].excerpt) : result[i].excerpt;
                    result[i].category = result[i].category ? (translated[`cat-${i}`] || result[i].category) : result[i].category;
                }
            }
        }

        return NextResponse.json({ articles: result });
    } catch (error) {
        console.error("Public articles API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
}
