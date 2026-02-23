import { getMediaUrl } from "@/lib/utils";

export interface CsvEncodeInput {
    headers: string[];
    rows: Array<Array<string | number | boolean | null | undefined>>;
}

export interface CsvMediaRecord {
    url: string;
    thumbnailUrl: string | null;
    order: number;
    isCover: boolean;
    category: string | null;
    type: string | null;
}

interface MediaSerializationOptions {
    minioBaseUrl?: string;
    minioBucket?: string;
}

const DEFAULT_BUCKET = "guzel-invest";

const isSpreadsheetFormula = (value: string): boolean =>
    /^[=+\-@]/.test(value);

const toSafeCellValue = (value: string): string => {
    if (!value) return value;
    if (!isSpreadsheetFormula(value)) return value;

    // Prevent CSV formula injection in spreadsheet tools.
    return `'${value}`;
};

const escapeCsvCell = (value: string | number | boolean | null | undefined): string => {
    if (value === null || value === undefined) return "";

    const normalized = toSafeCellValue(String(value));
    const escaped = normalized.replace(/"/g, '""');
    if (/[",\n\r]/.test(escaped)) {
        return `"${escaped}"`;
    }

    return escaped;
};

export const encodeCsv = (
    headers: string[],
    rows: Array<Array<string | number | boolean | null | undefined>>
): string => {
    const encodedRows = [headers, ...rows].map((row) =>
        row.map((cell) => escapeCsvCell(cell)).join(",")
    );

    return encodedRows.join("\n");
};

export const encodeCsvWithBom = (
    headers: string[],
    rows: Array<Array<string | number | boolean | null | undefined>>
): string => {
    return `\uFEFF${encodeCsv(headers, rows)}`;
};

export function parseCsv(content: string): string[][] {
    const source = content.replace(/^\uFEFF/, "");
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < source.length; i += 1) {
        const char = source[i];

        if (inQuotes) {
            if (char === '"') {
                const next = source[i + 1];
                if (next === '"') {
                    cell += '"';
                    i += 1;
                } else {
                    inQuotes = false;
                }
            } else {
                cell += char;
            }
            continue;
        }

        if (char === '"') {
            inQuotes = true;
            continue;
        }

        if (char === ",") {
            row.push(cell);
            cell = "";
            continue;
        }

        if (char === "\n") {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
            continue;
        }

        if (char === "\r") {
            continue;
        }

        cell += char;
    }

    row.push(cell);
    rows.push(row);

    return rows.filter((values) => values.some((value) => value.trim().length > 0));
}

const normalizeBaseUrl = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed.replace(/\/+$/, "");
    }

    const protocol = trimmed.includes("localhost") ? "http://" : "https://";
    return `${protocol}${trimmed.replace(/\/+$/, "")}`;
};

const resolveMinioBaseUrl = (options?: MediaSerializationOptions): string => {
    if (options?.minioBaseUrl) {
        return normalizeBaseUrl(options.minioBaseUrl);
    }

    const configured =
        process.env.NEXT_PUBLIC_MINIO_URL ||
        process.env.MINIO_ENDPOINT ||
        "http://localhost:9000";

    return normalizeBaseUrl(configured);
};

const resolveMinioBucket = (options?: MediaSerializationOptions): string => {
    return (
        options?.minioBucket ||
        process.env.NEXT_PUBLIC_MINIO_BUCKET ||
        process.env.MINIO_BUCKET ||
        DEFAULT_BUCKET
    );
};

export const buildPublicMediaUrl = (
    path: string,
    options?: MediaSerializationOptions
): string => {
    const trimmed = (path || "").trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    const cleanPath = trimmed.replace(/^\/+/, "");

    if (!options?.minioBaseUrl && !options?.minioBucket) {
        return getMediaUrl(cleanPath);
    }

    const baseUrl = resolveMinioBaseUrl(options);
    const bucket = resolveMinioBucket(options);

    return `${baseUrl}/${bucket}/${cleanPath}`;
};

export const normalizeStoredMediaPath = (
    value: string,
    bucketName?: string
): string => {
    const trimmed = (value || "").trim();
    if (!trimmed) return "";

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
        return trimmed.replace(/^\/+/, "");
    }

    const bucket = bucketName || resolveMinioBucket();

    try {
        const parsed = new URL(trimmed);
        const segments = parsed.pathname
            .split("/")
            .map((segment) => segment.trim())
            .filter(Boolean)
            .map((segment) => decodeURIComponent(segment));

        const bucketIndex = segments.indexOf(bucket);
        if (bucketIndex >= 0 && bucketIndex + 1 < segments.length) {
            return segments.slice(bucketIndex + 1).join("/");
        }

        const publicIndex = segments.indexOf("public");
        if (publicIndex >= 0) {
            return segments.slice(publicIndex).join("/");
        }

        return trimmed;
    } catch {
        return trimmed;
    }
};

const parseMediaPayloadJson = (
    rawValue: string,
    options?: MediaSerializationOptions
): CsvMediaRecord[] => {
    if (!rawValue.trim()) return [];

    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((entry, index) => {
                if (!entry || typeof entry !== "object") return null;
                const item = entry as Record<string, unknown>;
                const url = normalizeStoredMediaPath(
                    typeof item.url === "string" ? item.url : "",
                    resolveMinioBucket(options)
                );
                if (!url) return null;

                const thumbnailUrl =
                    typeof item.thumbnailUrl === "string"
                        ? normalizeStoredMediaPath(
                              item.thumbnailUrl,
                              resolveMinioBucket(options)
                          )
                        : null;
                const parsedOrder = Number(item.order);

                return {
                    url,
                    thumbnailUrl,
                    order: Number.isFinite(parsedOrder) ? parsedOrder : index,
                    isCover: item.isCover === true,
                    category:
                        typeof item.category === "string" && item.category.trim().length > 0
                            ? item.category.trim()
                            : null,
                    type:
                        typeof item.type === "string" && item.type.trim().length > 0
                            ? item.type.trim()
                            : null,
                } as CsvMediaRecord;
            })
            .filter((item): item is CsvMediaRecord => Boolean(item));
    } catch {
        return [];
    }
};

const parseMediaUrls = (
    rawValue: string,
    options?: MediaSerializationOptions
): CsvMediaRecord[] => {
    if (!rawValue.trim()) return [];

    const urls = rawValue
        .split(/\s*\|\s*|\n/)
        .map((item) => item.trim())
        .filter(Boolean);

    const bucket = resolveMinioBucket(options);

    return urls.map((url, index) => ({
        url: normalizeStoredMediaPath(url, bucket),
        thumbnailUrl: null,
        order: index,
        isCover: index === 0,
        category: null,
        type: null,
    }));
};

const dedupeMediaByUrl = (items: CsvMediaRecord[]): CsvMediaRecord[] => {
    const byUrl = new Map<string, CsvMediaRecord>();

    items.forEach((item) => {
        const existing = byUrl.get(item.url);
        if (!existing) {
            byUrl.set(item.url, item);
            return;
        }

        byUrl.set(item.url, {
            ...existing,
            thumbnailUrl: item.thumbnailUrl || existing.thumbnailUrl,
            category: item.category || existing.category,
            type: item.type || existing.type,
            order:
                Number.isFinite(item.order) && item.order >= 0
                    ? item.order
                    : existing.order,
            isCover: existing.isCover || item.isCover,
        });
    });

    const deduped = Array.from(byUrl.values()).sort((a, b) => a.order - b.order);

    if (deduped.length > 0 && !deduped.some((item) => item.isCover)) {
        deduped[0].isCover = true;
    }

    return deduped.map((item, index) => ({
        ...item,
        order: Number.isFinite(item.order) ? item.order : index,
    }));
};

export const parseMediaColumns = (
    mediaUrls: string | null | undefined,
    mediaPayloadJson: string | null | undefined,
    options?: MediaSerializationOptions
): CsvMediaRecord[] => {
    const payloadItems = parseMediaPayloadJson(mediaPayloadJson || "", options);

    if (payloadItems.length > 0) {
        return dedupeMediaByUrl(payloadItems);
    }

    const urlItems = parseMediaUrls(mediaUrls || "", options);
    return dedupeMediaByUrl(urlItems);
};

export const serializeMediaColumns = (
    mediaItems: Array<Partial<CsvMediaRecord>>,
    options?: MediaSerializationOptions
): { mediaUrls: string; mediaPayloadJson: string } => {
    const normalized = dedupeMediaByUrl(
        mediaItems
            .map((item, index) => {
                if (!item || typeof item.url !== "string") return null;
                const url = item.url.trim();
                if (!url) return null;

                return {
                    url,
                    thumbnailUrl:
                        typeof item.thumbnailUrl === "string" && item.thumbnailUrl.trim().length > 0
                            ? item.thumbnailUrl.trim()
                            : null,
                    order:
                        typeof item.order === "number" && Number.isFinite(item.order)
                            ? item.order
                            : index,
                    isCover: item.isCover === true,
                    category:
                        typeof item.category === "string" && item.category.trim().length > 0
                            ? item.category.trim()
                            : null,
                    type:
                        typeof item.type === "string" && item.type.trim().length > 0
                            ? item.type.trim()
                            : null,
                } as CsvMediaRecord;
            })
            .filter((item): item is CsvMediaRecord => Boolean(item))
    );

    const mediaUrls = normalized
        .map((item) => buildPublicMediaUrl(item.url, options))
        .join(" | ");

    const mediaPayloadJson = JSON.stringify(
        normalized.map((item) => ({
            ...item,
            url: buildPublicMediaUrl(item.url, options),
            thumbnailUrl: item.thumbnailUrl
                ? buildPublicMediaUrl(item.thumbnailUrl, options)
                : null,
        }))
    );

    return {
        mediaUrls,
        mediaPayloadJson,
    };
};

export const mapCsvRows = (rows: string[][]): Array<Record<string, string>> => {
    if (rows.length <= 1) return [];

    const headers = rows[0].map((header) => header.trim());
    return rows.slice(1).map((row) => {
        const mapped: Record<string, string> = {};
        headers.forEach((header, index) => {
            mapped[header] = row[index] || "";
        });
        return mapped;
    });
};

export const parseJsonCell = <T>(value: string | null | undefined, fallback: T): T => {
    if (!value || !value.trim()) return fallback;

    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};

export const parseBooleanCell = (
    value: string | null | undefined,
    fallback = false
): boolean => {
    const normalized = (value || "").trim().toLowerCase();
    if (!normalized) return fallback;

    if (["true", "1", "evet", "yes", "y", "var"].includes(normalized)) {
        return true;
    }

    if (["false", "0", "hayir", "hayır", "no", "n", "yok"].includes(normalized)) {
        return false;
    }

    return fallback;
};

export const parseNumberCell = (
    value: string | null | undefined,
    fallback = 0
): number => {
    const normalized = (value || "").trim();
    if (!normalized) return fallback;

    const cleaned = normalized.replace(/[^0-9,.-]/g, "");
    if (!cleaned) return fallback;

    const decimalCandidate = cleaned.replace(/\.(?=.*\.)/g, "").replace(",", ".");
    const parsed = Number(decimalCandidate);
    return Number.isFinite(parsed) ? parsed : fallback;
};
