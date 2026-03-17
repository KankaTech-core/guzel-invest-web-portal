import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GHL (GoHighLevel) sends Facebook lead form data to this endpoint.
 * We store it as a ContactSubmission with source "facebook".
 *
 * GHL template variables (e.g. {{contact.first_name}}) may resolve to
 * undefined, null, or empty strings — so every field is treated as optional
 * and coerced to a safe string before saving.
 */

const toString = (value: unknown): string =>
    typeof value === "string" ? value.trim() : "";

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

export async function POST(request: NextRequest) {
    try {
        let payload: Record<string, unknown>;
        try {
            payload = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Geçersiz istek gövdesi." },
                { status: 400 }
            );
        }

        console.info(
            "[ghl-webhook-incoming] Payload received:",
            JSON.stringify(payload)
        );

        const name = normalizeText(toString(payload.name));
        const surname = normalizeText(toString(payload.surname));
        const email = toString(payload.email).toLowerCase();
        const phone = normalizeText(toString(payload.phone));
        const message = normalizeText(toString(payload.message));

        const submission = await prisma.contactSubmission.create({
            data: {
                name: name || "İsimsiz",
                surname: surname || null,
                email: email || "",
                phone: phone || null,
                message:
                    message ||
                    "Facebook formu üzerinden iletişim talebi alındı.",
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
