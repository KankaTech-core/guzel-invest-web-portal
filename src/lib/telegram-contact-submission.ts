export interface TelegramContactSubmission {
    id: string;
    sku?: string | null;
    name: string;
    surname: string | null;
    email: string;
    phone: string | null;
    message: string;
    locale: string;
    source: string;
    projectSlug: string | null;
    projectTitle: string | null;
    createdAt: Date;
}

type Logger = Pick<typeof console, "info" | "warn" | "error">;

interface BuildTelegramContactSubmissionMessageOptions {
    adminBaseUrl?: string;
}

interface SendTelegramContactSubmissionNotificationOptions
    extends BuildTelegramContactSubmissionMessageOptions {
    botToken?: string;
    chatId?: string;
    fetchImpl?: typeof fetch;
    logger?: Logger;
}

const MESSAGE_TEXT_MAX_LENGTH = 1500;
const REQUEST_TIMEOUT_MS = 8000;

const getSourceLabel = (source: string) => {
    if (source === "project-form") return "Proje Formu";
    if (source === "listing-form") return "Ilan Formu";
    if (source === "website") return "Iletisim Formu";
    if (source === "homepage-popup") return "Daireni Sat Formu";
    if (source === "facebook") return "Facebook Formu";
    return source;
};

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ");

const truncateText = (value: string, maxLength: number) => {
    if (value.length <= maxLength) {
        return value;
    }

    return `${value.slice(0, maxLength - 1)}...`;
};

const formatFullName = (submission: TelegramContactSubmission) =>
    [submission.name, submission.surname]
        .map((value) => value?.trim())
        .filter(Boolean)
        .join(" ");

const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Europe/Istanbul",
    }).format(date);

const resolveAdminFormUrl = (baseUrl: string | undefined, submissionId: string) => {
    if (!baseUrl) {
        return null;
    }

    try {
        return new URL(`/admin/formlar/${submissionId}`, baseUrl).toString();
    } catch {
        return null;
    }
};

const getAbortSignal = () => {
    if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
        return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    }

    return undefined;
};

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : String(error);

const extractField = (message: string, label: string): string => {
    const regex = new RegExp(`${label}:\\s*([^|]*)`);
    const match = message.match(regex);
    return match ? match[1].trim() : "-";
};

function buildFacebookMessage(
    submission: TelegramContactSubmission,
    adminUrl: string | null
) {
    const fullName = formatFullName(submission) || submission.name.trim();
    const phone = submission.phone?.trim() || "-";
    const msg = submission.message || "";

    const budget = extractField(msg, "Bütçe");
    const purpose = extractField(msg, "Amaç");
    const sellWhen = extractField(msg, "Ne Zaman");

    const lines = [
        "Yeni form bildirimi",
        `Tip: ${getSourceLabel(submission.source)}`,
        `Ad Soyad: ${fullName}`,
        `Telefon: ${phone}`,
        `Bütçe: ${budget}`,
        `Amaç: ${purpose}`,
        `Ne Zaman: ${sellWhen}`,
        `Tarih: ${formatDateTime(submission.createdAt)}`,
        `Kayit No: ${submission.id}`,
    ];

    if (adminUrl) {
        lines.push(`Admin: ${adminUrl}`);
    }

    return lines.join("\n");
}

export function buildTelegramContactSubmissionMessage(
    submission: TelegramContactSubmission,
    options: BuildTelegramContactSubmissionMessageOptions = {}
) {
    const adminUrl = resolveAdminFormUrl(options.adminBaseUrl, submission.id);

    if (submission.source === "facebook") {
        return buildFacebookMessage(submission, adminUrl);
    }

    const title = submission.projectTitle?.trim() || "-";
    const slugOrUrl = submission.projectSlug?.trim() || "-";
    const sku = submission.sku?.trim();
    const phone = submission.phone?.trim() || "-";
    const fullName = formatFullName(submission) || submission.name.trim();
    const message = truncateText(
        normalizeText(submission.message || "-"),
        MESSAGE_TEXT_MAX_LENGTH
    );

    const lines = [
        "Yeni form bildirimi",
        `Tip: ${getSourceLabel(submission.source)}`,
        `Ilan / Proje: ${title}`,
        ...(sku ? [`SKU: ${sku}`] : []),
        `Slug / URL: ${slugOrUrl}`,
        `Ad Soyad: ${fullName}`,
        `E-posta: ${submission.email}`,
        `Telefon: ${phone}`,
        `Dil: ${submission.locale.toUpperCase()}`,
        `Tarih: ${formatDateTime(submission.createdAt)}`,
        `Kayit No: ${submission.id}`,
        `Mesaj: ${message}`,
    ];

    if (adminUrl) {
        lines.push(`Admin: ${adminUrl}`);
    }

    return lines.join("\n");
}

export async function sendTelegramContactSubmissionNotification(
    submission: TelegramContactSubmission,
    options: SendTelegramContactSubmissionNotificationOptions = {}
) {
    const botToken = options.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
    const chatId = options.chatId ?? process.env.TELEGRAM_CHAT_ID;
    const fetchImpl = options.fetchImpl ?? fetch;
    const logger = options.logger ?? console;

    if (!botToken || !chatId) {
        logger.warn("[telegram] submission notification skipped: missing Telegram env", {
            submissionId: submission.id,
            source: submission.source,
        });
        return "skipped" as const;
    }

    const text = buildTelegramContactSubmissionMessage(submission, {
        adminBaseUrl:
            options.adminBaseUrl ||
            process.env.APP_URL ||
            process.env.NEXT_PUBLIC_APP_URL,
    });

    try {
        const response = await fetchImpl(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text,
                    disable_web_page_preview: true,
                }),
                signal: getAbortSignal(),
            }
        );

        if (!response.ok) {
            const responseText = await response.text();
            logger.error("[telegram] submission notification failed", {
                submissionId: submission.id,
                source: submission.source,
                status: response.status,
                responseText,
            });
            return "failed" as const;
        }

        logger.info("[telegram] submission notification sent", {
            submissionId: submission.id,
            source: submission.source,
        });
        return "sent" as const;
    } catch (error) {
        logger.error("[telegram] submission notification failed", {
            submissionId: submission.id,
            source: submission.source,
            error: getErrorMessage(error),
        });
        return "failed" as const;
    }
}
