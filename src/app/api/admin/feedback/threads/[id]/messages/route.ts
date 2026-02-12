import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createMessageSchema = z.object({
    content: z.string().trim().min(1).max(1500),
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

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { session, error } = await ensureAdminSession();
        if (error || !session) return error;

        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "Geçersiz mesaj başlığı" },
                { status: 400 }
            );
        }

        let parsedBody: unknown;
        try {
            parsedBody = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Geçersiz istek gövdesi" },
                { status: 400 }
            );
        }

        const parsed = createMessageSchema.safeParse(parsedBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Geçersiz mesaj içeriği" },
                { status: 400 }
            );
        }

        const existingThread = await prisma.siteFeedbackThread.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existingThread) {
            return NextResponse.json(
                { error: "Mesaj başlığı bulunamadı" },
                { status: 404 }
            );
        }

        await prisma.$transaction([
            prisma.siteFeedbackMessage.create({
                data: {
                    threadId: id,
                    authorId: session.userId,
                    content: parsed.data.content,
                },
            }),
            prisma.siteFeedbackThread.update({
                where: { id },
                data: {
                    updatedAt: new Date(),
                },
            }),
        ]);

        const thread = await prisma.siteFeedbackThread.findUnique({
            where: { id },
            include: feedbackThreadInclude,
        });

        if (!thread) {
            return NextResponse.json(
                { error: "Mesaj başlığı bulunamadı" },
                { status: 404 }
            );
        }

        return NextResponse.json({ thread });
    } catch (error) {
        console.error("Feedback message POST error:", error);
        return NextResponse.json(
            { error: "Mesaj gönderilemedi" },
            { status: 500 }
        );
    }
}
