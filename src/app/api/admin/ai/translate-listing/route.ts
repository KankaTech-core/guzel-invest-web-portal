import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional real estate translator.
Translate the provided Turkish listing title and description into English, German, and Russian.
If tags are provided, translate each tag name and keep the tag "id" exactly the same.
Return a JSON object with keys "en", "de", "ru". Each key should contain:
{
  "title": "...",
  "description": "...",
  "tags": [{ "id": "...", "name": "..." }]
}
If there are no tags, return an empty "tags" array.
Only return the JSON object. Do not include Turkish text, parentheses, or extra commentary.`;

const normalizeText = (value: unknown): string => {
    if (typeof value !== "string") return "";
    return value.trim();
};

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

        const { title, description, listingId, tags } = await req.json();
        const safeTitle = normalizeText(title);
        const safeDescription = normalizeText(description);
        const safeTags: { id: string; name: string }[] = Array.isArray(tags)
            ? tags
                .map((tag) => ({
                    id: typeof tag?.id === "string" ? tag.id : "",
                    name: typeof tag?.name === "string" ? normalizeText(tag.name) : "",
                }))
                .filter((tag) => tag.id && tag.name)
            : [];

        if (!safeTitle && !safeDescription) {
            return NextResponse.json(
                { error: "Title or description is required" },
                { status: 400 }
            );
        }

        if (listingId && typeof listingId === "string") {
            const existingTranslation = await prisma.listingTranslation.findFirst({
                where: {
                    listingId,
                    locale: { in: ["en", "de", "ru"] },
                    OR: [
                        { title: { not: "" } },
                        { description: { not: "" } },
                    ],
                },
            });

            if (existingTranslation) {
                return NextResponse.json(
                    { error: "Translations already exist" },
                    { status: 409 }
                );
            }
        }

        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_TEXT || "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `Başlık: ${safeTitle}\n\nAçıklama: ${safeDescription}\n\nEtiketler: ${JSON.stringify(
                        safeTags
                    )}`,
                },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 2000,
        });

        const responseText = completion.choices[0]?.message?.content;

        if (!responseText) {
            return NextResponse.json(
                { error: "AI response was empty" },
                { status: 500 }
            );
        }

        let parsedResponse: {
            en?: { title?: string; description?: string };
            de?: { title?: string; description?: string };
            ru?: { title?: string; description?: string };
        };

        try {
            parsedResponse = JSON.parse(responseText);
        } catch (error) {
            console.error("Failed to parse AI translation response:", responseText);
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

        const normalizeTags = (value: unknown) => {
            if (!Array.isArray(value)) return [];
            return value
                .map((tag) => ({
                    id: typeof tag?.id === "string" ? tag.id : "",
                    name: normalizeText(tag?.name),
                }))
                .filter((tag) => tag.id && tag.name);
        };

        const normalizeTranslation = (value: {
            title?: string;
            description?: string;
            tags?: unknown;
        } | undefined) => ({
            title: normalizeText(value?.title),
            description: normalizeText(value?.description),
            tags: normalizeTags(value?.tags),
        });

        const translations = {
            en: normalizeTranslation(parsedResponse.en),
            de: normalizeTranslation(parsedResponse.de),
            ru: normalizeTranslation(parsedResponse.ru),
        };

        return NextResponse.json({
            success: true,
            translations,
            tokensUsed: completion.usage?.total_tokens || 0,
        });
    } catch (error) {
        console.error("Error translating listing:", error);
        return NextResponse.json(
            { error: "Failed to translate listing" },
            { status: 500 }
        );
    }
}
