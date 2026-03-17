import type { TelegramContactSubmission } from "./telegram-contact-submission";

const GHL_WEBHOOK_URL =
    "https://services.leadconnectorhq.com/hooks/bJ2pSO9nUNi262cOPlZQ/webhook-trigger/MrMnjy2fr2UYhYNmmEP3";

const REQUEST_TIMEOUT_MS = 8000;

type Logger = Pick<typeof console, "info" | "warn" | "error">;

interface SendGhlWebhookOptions {
    webhookUrl?: string;
    fetchImpl?: typeof fetch;
    logger?: Logger;
}

const getAbortSignal = () => {
    if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
        return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    }
    return undefined;
};

const getSourceLabel = (source: string) => {
    if (source === "project-form") return "Proje Formu";
    if (source === "listing-form") return "İlan Formu";
    if (source === "website") return "İletişim Formu";
    if (source === "homepage-popup") return "Daireni Sat Formu";
    if (source === "facebook") return "Facebook Formu";
    return source;
};

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : String(error);

export async function sendGhlWebhookNotification(
    submission: TelegramContactSubmission,
    options: SendGhlWebhookOptions = {}
) {
    const webhookUrl = options.webhookUrl ?? GHL_WEBHOOK_URL;
    const fetchImpl = options.fetchImpl ?? fetch;
    const logger = options.logger ?? console;

    const payload = {
        id: submission.id,
        sku: submission.sku ?? null,
        name: submission.name,
        surname: submission.surname ?? null,
        email: submission.email,
        phone: submission.phone ?? null,
        message: submission.message,
        locale: submission.locale,
        source: submission.source,
        type: getSourceLabel(submission.source),
        projectSlug: submission.projectSlug ?? null,
        projectTitle: submission.projectTitle ?? null,
        createdAt: submission.createdAt.toISOString(),
    };

    try {
        const response = await fetchImpl(webhookUrl, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
            signal: getAbortSignal(),
        });

        if (!response.ok) {
            const responseText = await response.text();
            logger.error("[ghl] webhook notification failed", {
                submissionId: submission.id,
                source: submission.source,
                status: response.status,
                responseText,
            });
            return "failed" as const;
        }

        logger.info("[ghl] webhook notification sent", {
            submissionId: submission.id,
            source: submission.source,
        });
        return "sent" as const;
    } catch (error) {
        logger.error("[ghl] webhook notification failed", {
            submissionId: submission.id,
            source: submission.source,
            error: getErrorMessage(error),
        });
        return "failed" as const;
    }
}
