import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GHL (GoHighLevel) sends Facebook lead form data to this endpoint.
 * We store it as a ContactSubmission with source "facebook".
 *
 * GHL sends data in multiple places — we check in priority order:
 * 1. Top-level standard fields (first_name, last_name, email, phone)
 * 2. customData (the key-value pairs configured in the GHL webhook action)
 * 3. Fallback: Form Message field
 */

const toString = (value: unknown): string =>
    typeof value === "string" ? value.trim() : "";

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

const pick = (...values: unknown[]): string => {
    for (const v of values) {
        const s = toString(v);
        if (s) return s;
    }
    return "";
};

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

        const custom =
            payload.customData && typeof payload.customData === "object"
                ? (payload.customData as Record<string, unknown>)
                : {};

        const name = normalizeText(
            pick(
                payload.first_name,
                custom.name,
                payload.full_name,
                payload.name
            )
        );
        const surname = normalizeText(
            pick(payload.last_name, custom.surname)
        );
        const email = pick(payload.email, custom.email).toLowerCase();
        const phone = normalizeText(
            pick(payload.phone, custom.phone)
        );
        const message = normalizeText(
            pick(
                custom.message,
                payload["Form Message"],
                payload.Message
            )
        );

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
