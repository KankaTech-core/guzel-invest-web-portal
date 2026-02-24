import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ProjectFormSubmissionSchema = z.object({
    projectSlug: z.string().trim().min(1, "Proje bilgisi zorunludur."),
    locale: z.string().trim().min(2).max(10).default("tr"),
    name: z.string().trim().min(2, "Ad zorunludur.").max(120),
    surname: z.string().trim().min(2, "Soyad zorunludur.").max(120),
    email: z.string().trim().email("Geçerli bir e-posta adresi girin.").max(190),
    phone: z
        .string()
        .trim()
        .regex(/^\+\d{8,15}$/, "Geçerli bir telefon numarası girin."),
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

        const parsed = ProjectFormSubmissionSchema.safeParse(payload);

        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            return NextResponse.json(
                { error: firstIssue?.message || "Form verileri geçersiz." },
                { status: 400 }
            );
        }

        const locale = parsed.data.locale.toLowerCase();
        const fallbackLocales = Array.from(new Set([locale, "tr"]));

        const project = await prisma.listing.findFirst({
            where: {
                slug: parsed.data.projectSlug,
                isProject: true,
            },
            select: {
                id: true,
                slug: true,
                projectType: true,
                translations: {
                    where: {
                        locale: {
                            in: fallbackLocales,
                        },
                    },
                    select: {
                        locale: true,
                        title: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json(
                { error: "Proje bulunamadı." },
                { status: 404 }
            );
        }

        const localizedTitle =
            project.translations.find((item) => item.locale === locale)?.title ||
            project.translations.find((item) => item.locale === "tr")?.title ||
            project.projectType ||
            project.slug;

        await prisma.contactSubmission.create({
            data: {
                listingId: project.id,
                projectSlug: project.slug,
                projectTitle: normalizeText(localizedTitle),
                name: normalizeText(parsed.data.name),
                surname: normalizeText(parsed.data.surname),
                email: parsed.data.email.toLowerCase(),
                phone: parsed.data.phone,
                message: "Proje formu üzerinden iletişim talebi alındı.",
                locale,
                source: "project-form",
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Public project form submission error:", error);
        return NextResponse.json(
            { error: "Form gönderimi sırasında bir hata oluştu." },
            { status: 500 }
        );
    }
}
