import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GHL (GoHighLevel) sends Facebook lead form data to this endpoint.
 * We store it as a ContactSubmission with source "facebook".
 */

const GhlWebhookSchema = z.object({
    name: z.string().trim().min(1, "Ad zorunludur.").max(200),
    surname: z.string().trim().max(200).optional().default(""),
    email: z
        .string()
        .trim()
        .email("Geçerli bir e-posta adresi girin.")
        .max(190)
        .optional()
        .default(""),
    phone: z.string().trim().max(30).optional().default(""),
    message: z.string().trim().max(5000).optional().default(""),
});

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

export async function POST(request: NextRequest) {
    try {
        let payload: unknown;
        try {
            payload = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Geçersiz istek gövdesi." },
                { status: 400 }
            );
        }

        console.info("[ghl-webhook-incoming] Payload received:", JSON.stringify(payload));

        const parsed = GhlWebhookSchema.safeParse(payload);

        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            console.error("[ghl-webhook-incoming] Validation failed:", parsed.error.issues);
            return NextResponse.json(
                { error: firstIssue?.message || "Veri doğrulama hatası." },
                { status: 400 }
            );
        }

        const { name, surname, email, phone, message } = parsed.data;

        const submission = await prisma.contactSubmission.create({
            data: {
                name: normalizeText(name),
                surname: surname ? normalizeText(surname) : null,
                email: email ? email.toLowerCase() : "",
                phone: phone ? normalizeText(phone) : null,
                message: message || "Facebook formu üzerinden iletişim talebi alındı.",
                locale: "tr",
                source: "facebook",
            },
        });

        console.info("[ghl-webhook-incoming] Submission created:", {
            id: submission.id,
            name: submission.name,
            source: submission.source,
        });

        return NextResponse.json(
            { success: true, id: submission.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("[ghl-webhook-incoming] Error:", error);
        return NextResponse.json(
            { error: "Webhook işlenirken bir hata oluştu." },
            { status: 500 }
        );
    }
}
