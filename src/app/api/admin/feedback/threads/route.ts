import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createThreadSchema = z.object({
    pagePath: z
        .string()
        .trim()
        .min(1)
        .max(400)
        .refine((value) => value.startsWith("/"), "Path must start with '/'"),
    anchorX: z.number().min(0).max(1),
    anchorY: z.number().min(0).max(1),
    message: z.string().trim().min(1).max(1500),
});

const feedbackThreadInclude = {
    createdBy: {
        select: {
            id: true,
            name: true,
            role: true,
        },
    },
    messages: {
        orderBy: {
            createdAt: "asc" as const,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
    },
} as const;

const ensureAdminSession = async () => {
    const session = await getSession();

    if (!session) {
        return {
            session: null,
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (session.role !== Role.ADMIN) {
        return {
            session: null,
            error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    return { session, error: null };
};

const normalizePath = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed.startsWith("/")) {
        return "";
    }
    return trimmed.replace(/\/+$/, "") || "/";
};

export async function GET(request: NextRequest) {
    try {
        const { error } = await ensureAdminSession();
        if (error) return error;

        const rawPath = request.nextUrl.searchParams.get("path") ?? "";
        const pagePath = normalizePath(rawPath);

        if (!pagePath) {
            return NextResponse.json(
                { error: "Geçersiz sayfa yolu" },
                { status: 400 }
            );
        }

        const threads = await prisma.siteFeedbackThread.findMany({
            where: {
                pagePath,
                hidden: false,
            },
            include: feedbackThreadInclude,
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json({ threads });
    } catch (error) {
        console.error("Feedback threads GET error:", error);
        return NextResponse.json(
            { error: "Mesajlar alınamadı" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { session, error } = await ensureAdminSession();
        if (error || !session) return error;

        let parsedBody: unknown;
        try {
            parsedBody = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Geçersiz istek gövdesi" },
                { status: 400 }
            );
        }

        const parsed = createThreadSchema.safeParse(parsedBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Geçersiz mesaj verisi" },
                { status: 400 }
            );
        }

        const pagePath = normalizePath(parsed.data.pagePath);
        if (!pagePath) {
            return NextResponse.json(
                { error: "Geçersiz sayfa yolu" },
                { status: 400 }
            );
        }

        const thread = await prisma.siteFeedbackThread.create({
            data: {
                pagePath,
                anchorX: parsed.data.anchorX,
                anchorY: parsed.data.anchorY,
                createdById: session.userId,
                messages: {
                    create: {
                        authorId: session.userId,
                        content: parsed.data.message,
                    },
                },
            },
            include: feedbackThreadInclude,
        });

        return NextResponse.json({ thread }, { status: 201 });
    } catch (error) {
        console.error("Feedback threads POST error:", error);
        return NextResponse.json(
            { error: "Mesaj oluşturulamadı" },
            { status: 500 }
        );
    }
}
