import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";
import {
    getArticleSlugBase,
    normalizeArticleSlug,
    resolveArticleExcerpt,
    sanitizeArticleContent,
    normalizeOptionalText,
    extractPlainText,
    normalizeArticleCategory,
    normalizeArticleTags,
    toArticleStatusOrDefault,
} from "@/lib/articles";

const CreateArticleSchema = z.object({
    title: z.coerce.string(),
    slug: z.string().optional().nullable(),
    excerpt: z.string().optional().nullable(),
    content: z.coerce.string(),
    category: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    tags: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    status: z.string().optional().nullable(),
    coverImageUrl: z.string().optional().nullable(),
    coverThumbnailUrl: z.string().optional().nullable(),
});

const ensureUniqueSlug = async (baseSlug: string): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.article.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
};

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role === "VIEWER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const parsed = CreateArticleSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid article payload",
                    issues: parsed.error.flatten(),
                },
                { status: 400 }
            );
        }

        const payload = parsed.data;
        const title = payload.title.trim();
        if (title.length < 3) {
            return NextResponse.json(
                { error: "Makale başlığı en az 3 karakter olmalıdır" },
                { status: 400 }
            );
        }

        const sanitizedContent = sanitizeArticleContent(payload.content);
        const contentText = extractPlainText(sanitizedContent);

        if (contentText.length < 20) {
            return NextResponse.json(
                { error: "Makale içeriği çok kısa" },
                { status: 400 }
            );
        }

        const desiredSlug =
            normalizeArticleSlug(payload.slug) || getArticleSlugBase(title);
        const slug = await ensureUniqueSlug(desiredSlug);
        const status = toArticleStatusOrDefault(payload.status, "DRAFT");

        const article = await prisma.article.create({
            data: {
                slug,
                title: title.slice(0, 180),
                excerpt: resolveArticleExcerpt(payload.excerpt, sanitizedContent, 200),
                content: sanitizedContent,
                category: normalizeArticleCategory(payload.category)?.slice(0, 80) || null,
                tags: normalizeArticleTags(payload.tags, { maxTags: 20, maxTagLength: 40 }),
                status: status as ArticleStatus,
                coverImageUrl: normalizeOptionalText(payload.coverImageUrl)?.slice(0, 1200) || null,
                coverThumbnailUrl: normalizeOptionalText(payload.coverThumbnailUrl)?.slice(0, 1200) || null,
                publishedAt: status === "PUBLISHED" ? new Date() : null,
                createdById: session.userId,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(article, { status: 201 });
    } catch (error: unknown) {
        const details = error instanceof Error ? error.message : "Unknown error";
        console.error("Error creating article:", error);
        return NextResponse.json(
            { error: "Failed to create article", details },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get("status");
        const status =
            statusParam && Object.values(ArticleStatus).includes(statusParam as ArticleStatus)
                ? (statusParam as ArticleStatus)
                : undefined;

        const articles = await prisma.article.findMany({
            where: {
                ...(status ? { status } : {}),
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(articles);
    } catch (error) {
        console.error("Error fetching articles:", error);
        return NextResponse.json(
            { error: "Failed to fetch articles" },
            { status: 500 }
        );
    }
}
