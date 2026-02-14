const NETWORK_FETCH_MARKERS = [
    "load failed",
    "failed to fetch",
    "networkerror",
    "network request failed",
    "fetch failed",
    "econnreset",
    "socket hang up",
];

const STATUS_FALLBACKS: Record<number, string> = {
    400: "İstek geçersiz.",
    401: "Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapın.",
    403: "Bu işlem için yetkiniz yok.",
    404: "İstenen kayıt bulunamadı.",
    408: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.",
    413: "Yükleme boyutu sınırı aşıldı. Dosya boyutunu düşürüp tekrar deneyin.",
    415: "Desteklenmeyen dosya türü.",
    429: "Çok fazla istek gönderildi. Kısa süre sonra tekrar deneyin.",
    500: "Sunucu tarafında bir hata oluştu.",
    502: "Sunucuya geçici olarak ulaşılamıyor.",
    503: "Servis geçici olarak kullanılamıyor.",
    504: "Sunucu yanıtı zaman aşımına uğradı.",
};

const asText = (value: unknown): string | null => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

export const isAbortFetchError = (error: unknown): boolean => {
    if (!(error instanceof Error)) return false;
    return error.name === "AbortError";
};

export const isLikelyNetworkFetchError = (error: unknown): boolean => {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return NETWORK_FETCH_MARKERS.some((marker) => message.includes(marker));
};

export const getFriendlyFetchErrorMessage = (
    error: unknown,
    fallbackMessage: string,
    options?: {
        networkMessage?: string;
        abortedMessage?: string;
    }
): string => {
    if (isAbortFetchError(error)) {
        return (
            options?.abortedMessage ||
            "İstek iptal edildi. Lütfen tekrar deneyin."
        );
    }

    if (isLikelyNetworkFetchError(error)) {
        return (
            options?.networkMessage ||
            "Sunucu bağlantısı kesildi (Load failed). İnternet/proxy bağlantınızı kontrol edip tekrar deneyin."
        );
    }

    if (error instanceof Error) {
        const message = asText(error.message);
        if (message) return message;
    }

    return fallbackMessage;
};

export async function parseApiErrorMessage(
    response: Response,
    fallbackMessage: string
): Promise<string> {
    let payload: Record<string, unknown> | null = null;

    try {
        payload = (await response.json()) as Record<string, unknown>;
    } catch {
        payload = null;
    }

    const message =
        asText(payload?.error) ||
        asText(payload?.message) ||
        asText(payload?.details);

    if (message) {
        return message;
    }

    const statusFallback =
        STATUS_FALLBACKS[response.status] || fallbackMessage;

    return `${statusFallback} (HTTP ${response.status})`;
}
