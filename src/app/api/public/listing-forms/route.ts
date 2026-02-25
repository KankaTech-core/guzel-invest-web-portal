import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ListingFormSubmissionSchema = z.object({
    listingSlug: z.string().trim().min(1, "İlan bilgisi zorunludur."),
    locale: z.string().trim().min(2).max(10).default("tr"),
    name: z.string().trim().min(2, "Ad zorunludur.").max(120),
    surname: z.string().trim().min(2, "Soyad zorunludur.").max(120),
    email: z.string().trim().email("Geçerli bir e-posta adresi girin.").max(190),
    phone: z.string().trim().min(6, "Telefon numarası zorunludur.").max(30),
    message: z.string().trim().min(5, "Mesaj en az 5 karakter olmalıdır.").max(3000),
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

        const parsed = ListingFormSubmissionSchema.safeParse(payload);

        if (!parsed.success) {
            const firstIssue = parsed.error.issues[0];
            return NextResponse.json(
                { error: firstIssue?.message || "Form verileri geçersiz." },
                { status: 400 }
            );
        }

        const locale = parsed.data.locale.toLowerCase();
        const fallbackLocales = Array.from(new Set([locale, "tr"]));

        const listing = await prisma.listing.findFirst({
            where: {
                slug: parsed.data.listingSlug,
                isProject: false,
            },
            select: {
                id: true,
                slug: true,
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

        if (!listing) {
            return NextResponse.json(
                { error: "İlan bulunamadı." },
                { status: 404 }
            );
        }

        const localizedTitle =
            listing.translations.find((item) => item.locale === locale)?.title ||
            listing.translations.find((item) => item.locale === "tr")?.title ||
            listing.slug;

        await prisma.contactSubmission.create({
            data: {
                listingId: listing.id,
                projectSlug: listing.slug,
                projectTitle: normalizeText(localizedTitle),
                name: normalizeText(parsed.data.name),
                surname: normalizeText(parsed.data.surname),
                email: parsed.data.email.toLowerCase(),
                phone: normalizeText(parsed.data.phone),
                message: parsed.data.message.trim(),
                locale,
                source: "listing-form",
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Public listing form submission error:", error);
        return NextResponse.json(
            { error: "Form gönderimi sırasında bir hata oluştu." },
            { status: 500 }
        );
    }
}
