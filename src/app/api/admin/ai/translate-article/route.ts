import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { translateBatch, translateText } from "@/lib/ai-translate";

const LOCALES = ["en", "de", "ru", "ar"] as const;

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key not configured" },
                { status: 500 }
            );
        }

        const { articleId, title, excerpt, content, category, tags } = await req.json();

        if (!articleId || typeof articleId !== "string") {
            return NextResponse.json(
                { error: "Article ID is required" },
                { status: 400 }
            );
        }

        const safeTitle = typeof title === "string" ? title.trim() : "";
        const safeExcerpt = typeof excerpt === "string" ? excerpt.trim() : "";
        const safeContent = typeof content === "string" ? content.trim() : "";
        const safeCategory = typeof category === "string" ? category.trim() : "";
        const safeTags: string[] = Array.isArray(tags)
            ? tags.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
            : [];

        if (!safeTitle && !safeContent) {
            return NextResponse.json(
                { error: "Title or content is required" },
                { status: 400 }
            );
        }

        // Check if translations already exist
        const existingTranslation = await prisma.articleTranslation.findFirst({
            where: {
                articleId,
                locale: { in: [...LOCALES] },
                OR: [
                    { title: { not: "" } },
                    { content: { not: null } },
                ],
            },
        });

        if (existingTranslation) {
            return NextResponse.json(
                { error: "Translations already exist" },
                { status: 409 }
            );
        }

        // Translate for each locale
        const translations: Record<string, {
            title: string;
            excerpt: string | null;
            content: string | null;
            category: string | null;
            tags: string[];
        }> = {};

        for (const locale of LOCALES) {
            // Batch translate short fields
            const batchItems: { key: string; text: string }[] = [];
            if (safeTitle) batchItems.push({ key: "title", text: safeTitle });
            if (safeExcerpt) batchItems.push({ key: "excerpt", text: safeExcerpt });
            if (safeCategory) batchItems.push({ key: "category", text: safeCategory });
            safeTags.forEach((tag, i) => {
                batchItems.push({ key: `tag-${i}`, text: tag });
            });

            const batchResult = batchItems.length > 0
                ? await translateBatch(batchItems, locale)
                : {};

            // Translate content separately (HTML-aware, potentially long)
            const translatedContent = safeContent
                ? await translateText(safeContent, locale, { html: true })
                : null;

            translations[locale] = {
                title: batchResult["title"] || safeTitle,
                excerpt: safeExcerpt ? (batchResult["excerpt"] || safeExcerpt) : null,
                content: translatedContent,
                category: safeCategory ? (batchResult["category"] || safeCategory) : null,
                tags: safeTags.map((tag, i) => batchResult[`tag-${i}`] || tag),
            };

            // Upsert to DB
            await prisma.articleTranslation.upsert({
                where: { articleId_locale: { articleId, locale } },
                create: {
                    articleId,
                    locale,
                    ...translations[locale],
                },
                update: translations[locale],
            });
        }

        return NextResponse.json({
            success: true,
            translations,
        });
    } catch (error) {
        console.error("Error translating article:", error);
        return NextResponse.json(
            { error: "Failed to translate article" },
            { status: 500 }
        );
    }
}
