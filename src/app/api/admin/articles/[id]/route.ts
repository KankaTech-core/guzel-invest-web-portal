import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";
import {
    extractPlainText,
    getArticleSlugBase,
    normalizeArticleSlug,
    normalizeArticleCategory,
    normalizeArticleTags,
    resolveArticleExcerpt,
    sanitizeArticleContent,
    toArticleStatusOrDefault,
    normalizeOptionalText,
} from "@/lib/articles";

interface RouteParams {
    params: Promise<{ id: string }>;
}

const UpdateArticleSchema = z.object({
    title: z.string().optional(),
    slug: z.string().optional().nullable(),
    excerpt: z.string().optional().nullable(),
    content: z.string().optional(),
    category: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    tags: z.union([z.string(), z.array(z.string())]).optional().nullable(),
    status: z.string().optional().nullable(),
    coverImageUrl: z.string().optional().nullable(),
    coverThumbnailUrl: z.string().optional().nullable(),
});

const ensureUniqueSlug = async (
    baseSlug: string,
    currentId: string
): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.article.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!existing || existing.id === currentId) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
};

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const article = await prisma.article.findUnique({
            where: { id },
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

        if (!article) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json(
            { error: "Failed to fetch article" },
            { status: 500 }
        );
    }
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

        const existing = await prisma.article.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = UpdateArticleSchema.safeParse(body);

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
        const nextTitle = (payload.title ?? existing.title).trim();
        if (nextTitle.length < 3) {
            return NextResponse.json(
                { error: "Makale başlığı en az 3 karakter olmalıdır" },
                { status: 400 }
            );
        }

        const requestedSlug =
            payload.slug !== undefined
                ? normalizeArticleSlug(payload.slug)
                : payload.title !== undefined
                    ? getArticleSlugBase(nextTitle)
                    : existing.slug;

        const nextSlug = await ensureUniqueSlug(
            requestedSlug || getArticleSlugBase(nextTitle),
            id
        );

        const nextContent =
            payload.content !== undefined
                ? sanitizeArticleContent(payload.content)
                : existing.content;

        const contentText = extractPlainText(nextContent);

        if (contentText.length < 20) {
            return NextResponse.json(
                { error: "Makale içeriği çok kısa" },
                { status: 400 }
            );
        }

        const nextStatus = payload.status ?? existing.status;
        const normalizedStatus = toArticleStatusOrDefault(
            nextStatus,
            existing.status
        );

        const article = await prisma.article.update({
            where: { id },
            data: {
                title: nextTitle.slice(0, 180),
                slug: nextSlug,
                excerpt:
                    payload.excerpt !== undefined || payload.content !== undefined
                        ? resolveArticleExcerpt(payload.excerpt, nextContent, 200)
                        : existing.excerpt,
                content: nextContent,
                category:
                    payload.category !== undefined
                        ? normalizeArticleCategory(payload.category)?.slice(0, 80) || null
                        : existing.category,
                tags:
                    payload.tags !== undefined
                        ? normalizeArticleTags(payload.tags, { maxTags: 20, maxTagLength: 40 })
                        : existing.tags,
                status: normalizedStatus as ArticleStatus,
                coverImageUrl:
                    payload.coverImageUrl !== undefined
                        ? normalizeOptionalText(payload.coverImageUrl)?.slice(0, 1200) || null
                        : existing.coverImageUrl,
                coverThumbnailUrl:
                    payload.coverThumbnailUrl !== undefined
                        ? normalizeOptionalText(payload.coverThumbnailUrl)?.slice(0, 1200) || null
                        : existing.coverThumbnailUrl,
                publishedAt:
                    normalizedStatus === ArticleStatus.PUBLISHED && existing.status !== ArticleStatus.PUBLISHED
                        ? new Date()
                        : existing.publishedAt,
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

        return NextResponse.json(article);
    } catch (error) {
        console.error("Error updating article:", error);
        return NextResponse.json(
            { error: "Failed to update article" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getSession();
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const existing = await prisma.article.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            return NextResponse.json({ error: "Article not found" }, { status: 404 });
        }

        await prisma.article.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting article:", error);
        return NextResponse.json(
            { error: "Failed to delete article" },
            { status: 500 }
        );
    }
}
