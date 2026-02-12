import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "@/generated/prisma";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const patchThreadSchema = z.object({
    completed: z.boolean(),
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
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    if (session.role !== Role.ADMIN) {
        return {
            error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    return { error: null };
};

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { error } = await ensureAdminSession();
        if (error) return error;

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

        const parsed = patchThreadSchema.safeParse(parsedBody);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Geçersiz güncelleme verisi" },
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

        const thread = await prisma.siteFeedbackThread.update({
            where: { id },
            data: {
                hidden: parsed.data.completed,
                hiddenAt: parsed.data.completed ? new Date() : null,
            },
            include: feedbackThreadInclude,
        });

        return NextResponse.json({ thread });
    } catch (error) {
        console.error("Feedback thread PATCH error:", error);
        return NextResponse.json(
            { error: "Mesaj başlığı güncellenemedi" },
            { status: 500 }
        );
    }
}
