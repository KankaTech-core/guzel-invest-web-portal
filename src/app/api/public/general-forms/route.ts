import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const GeneralFormSubmissionSchema = z.object({
    name: z.string().trim().min(2, "Ad zorunludur.").max(120),
    surname: z.string().trim().min(2, "Soyad zorunludur.").max(120),
    email: z.string().trim().email("Geçerli bir e-posta adresi girin.").max(190),
    phone: z.string().trim().min(6, "Telefon numarası zorunludur.").max(30),
    message: z.string().trim().max(3000).optional(),
    locale: z.string().trim().min(2).max(10).default("tr"),
    source: z.string().trim().max(100).default("website"),
    url: z.string().trim().max(1000).optional(),
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

        const parsed = GeneralFormSubmissionSchema.safeParse(payload);

        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            return NextResponse.json(
                { error: firstIssue?.message || "Form verileri geçersiz." },
                { status: 400 }
            );
        }

        await prisma.contactSubmission.create({
            data: {
                name: normalizeText(parsed.data.name),
                surname: normalizeText(parsed.data.surname),
                email: parsed.data.email.toLowerCase(),
                phone: normalizeText(parsed.data.phone),
                message: parsed.data.message ? parsed.data.message.trim() : "Genel Başvuru",
                locale: parsed.data.locale.toLowerCase(),
                source: parsed.data.source,
                projectSlug: parsed.data.url, // Storing URL or context here for tracking
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("General form submission error:", error);
        return NextResponse.json(
            { error: "Form gönderimi sırasında bir hata oluştu." },
            { status: 500 }
        );
    }
}
