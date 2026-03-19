import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[üÜ]/g, "u")
        .replace(/[öÖ]/g, "o")
        .replace(/[çÇ]/g, "c")
        .replace(/[şŞ]/g, "s")
        .replace(/[ıİ]/g, "i")
        .replace(/[ğĞ]/g, "g")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}

export function formatPrice(
    price: number | string,
    currency: string = "EUR"
): string {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;

    const formatter = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(numericPrice);
}

export function formatArea(area: number): string {
    return new Intl.NumberFormat("tr-TR").format(area) + " m²";
}

export function formatDate(date: Date | string, locale: string = "tr"): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(dateObj);
}

export function formatRelativeTime(date: Date | string, locale: string = "tr"): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, "second");
    } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
    } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
    }
}

export function getPropertyTypeLabel(type: string, locale: string = "tr"): string {
    const labels: Record<string, Record<string, string>> = {
        tr: {
            APARTMENT: "Daire",
            VILLA: "Villa",
            PENTHOUSE: "Penthouse",
            LAND: "Arsa",
            COMMERCIAL: "Ticari",
            OFFICE: "Ofis",
            SHOP: "Dükkan",
            FARM: "Çiftlik",
        },
        en: {
            APARTMENT: "Apartment",
            VILLA: "Villa",
            PENTHOUSE: "Penthouse",
            LAND: "Land",
            COMMERCIAL: "Commercial",
            OFFICE: "Office",
            SHOP: "Shop",
            FARM: "Farm",
        },
        de: {
            APARTMENT: "Wohnung",
            VILLA: "Villa",
            PENTHOUSE: "Penthouse",
            LAND: "Grundstück",
            COMMERCIAL: "Gewerbe",
            OFFICE: "Büro",
            SHOP: "Laden",
            FARM: "Bauernhof",
        },
        ru: {
            APARTMENT: "Квартира",
            VILLA: "Вилла",
            PENTHOUSE: "Пентхаус",
            LAND: "Участок",
            COMMERCIAL: "Коммерческая",
            OFFICE: "Офис",
            SHOP: "Магазин",
            FARM: "Ферма",
        },
        ar: {
            APARTMENT: "شقة",
            VILLA: "فيلا",
            PENTHOUSE: "بنتهاوس",
            LAND: "أرض",
            COMMERCIAL: "تجاري",
            OFFICE: "مكتب",
            SHOP: "محل",
            FARM: "مزرعة",
        },
    };

    return labels[locale]?.[type] || labels.en[type] || type;
}

export function getSaleTypeLabel(type: string, locale: string = "tr"): string {
    const labels: Record<string, Record<string, string>> = {
        tr: { SALE: "Satılık", RENT: "Kiralık" },
        en: { SALE: "For Sale", RENT: "For Rent" },
        de: { SALE: "Zu Verkaufen", RENT: "Zu Vermieten" },
        ar: { SALE: "للبيع", RENT: "للإيجار" },
    };

    return labels[locale]?.[type] || labels.en[type] || type;
}

export function getProjectCategoryLabel(
    projectType: string | null | undefined,
    locale: string = "tr"
): string {
    const normalized = (projectType || "").trim().toUpperCase();
    if (!normalized) return "";

    const labels: Record<string, Record<string, string>> = {
        tr: {
            RESIDENCE: "Residence",
            SITE: "Site",
            VILLA_COMPLEX: "Villa Kompleksi",
            VILLA_COMPLEKS: "Villa Kompleksi",
            COMMERCIAL_PROJECT: "Ticari Proje",
            MIXED_USE: "Karma Proje",
            HOTEL: "Otel Projesi",
            OTHER: "Diğer",
        },
        en: {
            RESIDENCE: "Residence",
            SITE: "Site",
            VILLA_COMPLEX: "Villa Complex",
            VILLA_COMPLEKS: "Villa Complex",
            COMMERCIAL_PROJECT: "Commercial Project",
            MIXED_USE: "Mixed Use",
            HOTEL: "Hotel Project",
            OTHER: "Other",
        },
        de: {
            RESIDENCE: "Residenz",
            SITE: "Wohnanlage",
            VILLA_COMPLEX: "Villenkomplex",
            VILLA_COMPLEKS: "Villenkomplex",
            COMMERCIAL_PROJECT: "Gewerbeprojekt",
            MIXED_USE: "Mischnutzung",
            HOTEL: "Hotelprojekt",
            OTHER: "Andere",
        },
        ru: {
            RESIDENCE: "Резиденция",
            SITE: "Жилой комплекс",
            VILLA_COMPLEX: "Вилла комплекс",
            VILLA_COMPLEKS: "Вилла комплекс",
            COMMERCIAL_PROJECT: "Коммерческий проект",
            MIXED_USE: "Смешанное использование",
            HOTEL: "Проект отеля",
            OTHER: "Другое",
        },
        ar: {
            RESIDENCE: "سكن",
            SITE: "مجمع سكني",
            VILLA_COMPLEX: "مجمع فلل",
            VILLA_COMPLEKS: "مجمع فلل",
            COMMERCIAL_PROJECT: "مشروع تجاري",
            MIXED_USE: "متعدد الاستخدامات",
            HOTEL: "مشروع فندق",
            OTHER: "أخرى",
        },
    };

    const localized = labels[locale]?.[normalized] || labels.tr[normalized];
    if (localized) {
        return localized;
    }

    return normalized
        .replace(/_/g, " ")
        .toLocaleLowerCase("tr-TR")
        .replace(/\b\w/g, (char) => char.toLocaleUpperCase("tr-TR"));
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

export function generateListingSlug(
    title: string,
    city: string,
    type: string
): string {
    const base = slugify(`${type}-${title}-${city}`);
    const uniqueSuffix = Date.now().toString(36);
    return `${base}-${uniqueSuffix}`;
}

export function getSkuCityCode(city: string): string {
    const normalized = slugify(city || "")
        .replace(/-/g, "")
        .toUpperCase();

    if (!normalized) return "GEN";
    if (normalized.length >= 3) return normalized.slice(0, 3);
    return normalized.padEnd(3, "X");
}

export function buildListingSku(
    city: string,
    serial: number,
    year = new Date().getFullYear()
): string {
    const cityCode = getSkuCityCode(city);
    const serialPart = String(serial).padStart(6, "0");
    return `GI-${year}-${cityCode}-${serialPart}`;
}

export function getMediaUrl(path: string | null | undefined): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const baseUrl =
        process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000";
    const bucket = process.env.NEXT_PUBLIC_MINIO_BUCKET || "guzel-invest";

    // Ensure double slashes don't happen
    const cleanBaseUrl = baseUrl.endsWith("/")
        ? baseUrl.slice(0, -1)
        : baseUrl;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;

    return `${cleanBaseUrl}/${bucket}/${cleanPath}`;
}
