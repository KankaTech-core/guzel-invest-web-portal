"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    Save,
    Send,
    Archive,
    CircleOff,
    Trash2,
    ArrowLeft,
    Building2,
    MapPin,
    Home,
    Languages,
    Image as ImageIcon,
    Sparkles,
    Upload,
    CloudUpload,
    X,
    Copy,
    ExternalLink,
    Plus,
    Star,
} from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    getMediaUrl,
    cn,
} from "@/lib/utils";
import {
    getFriendlyFetchErrorMessage,
    parseApiErrorMessage,
} from "@/lib/fetch-error";
import { Select } from "@/components/ui";
import { TagInput } from "./tag-input";
import { AiFillModal, ParsedData } from "./ai-fill-modal";
import { ConfirmModal } from "./confirm-modal";
import { UnsavedChangesModal } from "./unsaved-changes-modal";
import { MediaOptimizationModal } from "./media-optimization-modal";
import {
    CompanyOptionSelect,
    RoomOptionSelect // New component
} from "./";

interface ListingTranslation {
    id?: string;
    locale: string;
    title: string;
    description: string;
    features: string[];
}

interface Media {
    id: string;
    url: string;
    thumbnailUrl: string | null;
    order: number;
    isCover: boolean;
}

interface PendingMedia {
    id: string;
    file: File;
    previewUrl: string;
}

interface TagData {
    id: string;
    name: string;
    color: string;
}

type ListingStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";
type MediaOptimizationState = "hidden" | "optimizing" | "completed";
type HomepageHeroSlotValue = 1 | 2 | 3;

interface ListingData {
    id?: string;
    slug?: string;
    sku?: string | null;
    status: ListingStatusValue;
    type: string;
    saleType: string;
    company: string;
    city: string;
    district: string;
    neighborhood: string | null;
    address: string | null;
    googleMapsLink: string | null;
    latitude: number | null;
    longitude: number | null;
    price: number;
    currency: string;
    area: number;
    rooms: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    wcCount: number | null;
    floor: number | null;
    totalFloors: number | null;
    buildYear: number | null;
    heating: string | null;
    furnished: boolean;
    balcony: boolean;
    garden: boolean;
    pool: boolean;
    parking: boolean;
    elevator: boolean;
    security: boolean;
    seaView: boolean;
    // Land-specific fields
    parcelNo: string | null;
    emsal: number | null;
    zoningStatus: string | null;
    // Commercial-specific fields
    groundFloorArea: number | null;
    basementArea: number | null;
    // Farm-specific fields
    hasWaterSource: boolean;
    hasFruitTrees: boolean;
    existingStructure: string | null;
    // Eligibility
    citizenshipEligible: boolean;
    residenceEligible: boolean;
    publishToHepsiemlak: boolean;
    publishToSahibinden: boolean;
    homepageHeroSlot: HomepageHeroSlotValue | null;
    // Relations
    translations: ListingTranslation[];
    media?: Media[];
    tags?: TagData[];
}

interface ListingFormProps {
    listing?: ListingData;
    isNew?: boolean;
}

const CURRENCY_OPTIONS = [
    { value: "EUR", label: "€" },
    { value: "USD", label: "$" },
    { value: "TRY", label: "₺" },
    { value: "GBP", label: "£" },
];

const PROPERTY_TYPES = [
    { value: "APARTMENT", label: "Daire" },
    { value: "VILLA", label: "Villa" },
    { value: "PENTHOUSE", label: "Penthouse" },
    { value: "LAND", label: "Arsa" },
    { value: "COMMERCIAL", label: "Ticari" },
    { value: "OFFICE", label: "Ofis" },
    { value: "SHOP", label: "Dükkan" },
    { value: "FARM", label: "Çiftlik" },
];

const SALE_TYPES = [
    { value: "SALE", label: "Satılık" },
    { value: "RENT", label: "Kiralık" },
];

const HOMEPAGE_HERO_SLOT_OPTIONS: HomepageHeroSlotValue[] = [1, 2, 3];

const LOCALES = [
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

const MAX_MEDIA_FILE_SIZE_MB = 30;
const MAX_MEDIA_FILE_SIZE_BYTES = MAX_MEDIA_FILE_SIZE_MB * 1024 * 1024;
const MEDIA_UPLOAD_CHUNK_SIZE = 4;
const MEDIA_UPLOAD_CHUNK_MAX_MB = 30;
const MEDIA_UPLOAD_CHUNK_MAX_BYTES = MEDIA_UPLOAD_CHUNK_MAX_MB * 1024 * 1024;
const ALLOWED_MEDIA_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

const FIELD_LABELS: Record<
    "title" | "description" | "propertyType" | "saleType" | "heating" | "features" | "tags",
    Record<LocaleCode, string>
> = {
    title: { tr: "Başlık", en: "Title", de: "Titel", ru: "Заголовок" },
    description: { tr: "Açıklama", en: "Description", de: "Beschreibung", ru: "Описание" },
    propertyType: { tr: "Mülk Tipi", en: "Property Type", de: "Objekttyp", ru: "Тип недвижимости" },
    saleType: { tr: "Satış Tipi", en: "Sale Type", de: "Verkaufsart", ru: "Тип сделки" },
    heating: { tr: "Isıtma", en: "Heating", de: "Heizung", ru: "Отопление" },
    features: { tr: "Özellikler", en: "Features", de: "Ausstattung", ru: "Особенности" },
    tags: { tr: "Etiketler", en: "Tags", de: "Tags", ru: "Теги" },
};

const PROPERTY_TYPE_LABELS: Record<string, Record<LocaleCode, string>> = {
    APARTMENT: { tr: "Daire", en: "Apartment", de: "Wohnung", ru: "Квартира" },
    VILLA: { tr: "Villa", en: "Villa", de: "Villa", ru: "Вилла" },
    PENTHOUSE: { tr: "Penthouse", en: "Penthouse", de: "Penthouse", ru: "Пентхаус" },
    LAND: { tr: "Arsa", en: "Land", de: "Grundstück", ru: "Участок" },
    COMMERCIAL: { tr: "Ticari", en: "Commercial", de: "Gewerbe", ru: "Коммерческая" },
    OFFICE: { tr: "Ofis", en: "Office", de: "Büro", ru: "Офис" },
    SHOP: { tr: "Dükkan", en: "Shop", de: "Laden", ru: "Магазин" },
    FARM: { tr: "Çiftlik", en: "Farm", de: "Bauernhof", ru: "Ферма" },
};

const SALE_TYPE_LABELS: Record<string, Record<LocaleCode, string>> = {
    SALE: { tr: "Satılık", en: "For Sale", de: "Zum Verkauf", ru: "Продажа" },
    RENT: { tr: "Kiralık", en: "For Rent", de: "Zur Miete", ru: "Аренда" },
};

const HEATING_LABELS: Record<string, Record<LocaleCode, string>> = {
    central: { tr: "Merkezi", en: "Central Heating", de: "Zentralheizung", ru: "Центральное отопление" },
    individual: { tr: "Bireysel", en: "Individual Heating", de: "Individuelle Heizung", ru: "Индивидуальное отопление" },
    floor: { tr: "Yerden Isıtma", en: "Underfloor Heating", de: "Fußbodenheizung", ru: "Теплый пол" },
    ac: { tr: "Klima", en: "Air Conditioning", de: "Klimaanlage", ru: "Кондиционер" },
    none: { tr: "Yok", en: "None", de: "Keine", ru: "Нет" },
};

const FEATURE_LABELS: Record<string, Record<LocaleCode, string>> = {
    furnished: { tr: "Eşyalı", en: "Furnished", de: "Möbliert", ru: "Меблировано" },
    balcony: { tr: "Balkon", en: "Balcony", de: "Balkon", ru: "Балкон" },
    garden: { tr: "Bahçe", en: "Garden", de: "Garten", ru: "Сад" },
    pool: { tr: "Havuz", en: "Pool", de: "Pool", ru: "Бассейн" },
    parking: { tr: "Otopark", en: "Parking", de: "Parkplatz", ru: "Парковка" },
    elevator: { tr: "Asansör", en: "Elevator", de: "Aufzug", ru: "Лифт" },
    security: { tr: "Güvenlik", en: "Security", de: "Sicherheit", ru: "Охрана" },
    seaView: { tr: "Deniz Manzarası", en: "Sea View", de: "Meerblick", ru: "Вид на море" },
};

const TAG_TRANSLATION_PREFIX = "tag:";

const buildTranslations = (
    existing: ListingTranslation[] = []
): ListingTranslation[] => {
    const byLocale = new Map(existing.map((item) => [item.locale, item]));
    return LOCALES.map((locale) => {
        const current = byLocale.get(locale.code);
        return {
            id: current?.id,
            locale: locale.code,
            title: current?.title ?? "",
            description: current?.description ?? "",
            features: current?.features ?? [],
        };
    });
};

const hasNonTurkishTranslations = (
    translations: ListingTranslation[] | undefined
): boolean =>
    (translations ?? []).some(
        (translation) =>
            translation.locale !== "tr" &&
            ((translation.title && translation.title.trim().length > 0) ||
                (translation.description && translation.description.trim().length > 0))
    );

const validateMediaFiles = (files: File[]): string | null => {
    if (files.length === 0) return "Yüklenecek dosya bulunamadı.";

    const unsupportedFile = files.find((file) => !ALLOWED_MEDIA_TYPES.has(file.type));
    if (unsupportedFile) {
        return `Desteklenmeyen dosya türü: ${unsupportedFile.name}. Sadece JPG, PNG, WEBP, GIF veya AVIF yükleyin.`;
    }

    const oversizedFile = files.find(
        (file) => file.size <= 0 || file.size > MAX_MEDIA_FILE_SIZE_BYTES
    );
    if (oversizedFile) {
        return `${oversizedFile.name} için maksimum dosya boyutu ${MAX_MEDIA_FILE_SIZE_MB}MB olmalıdır.`;
    }

    return null;
};

const buildMediaUploadChunks = (items: PendingMedia[]): PendingMedia[][] => {
    const chunks: PendingMedia[][] = [];
    let currentChunk: PendingMedia[] = [];
    let currentChunkBytes = 0;

    for (const item of items) {
        const fileSize = item.file.size;
        const wouldExceedCount = currentChunk.length >= MEDIA_UPLOAD_CHUNK_SIZE;
        const wouldExceedBytes =
            currentChunk.length > 0 &&
            currentChunkBytes + fileSize > MEDIA_UPLOAD_CHUNK_MAX_BYTES;

        if (wouldExceedCount || wouldExceedBytes) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentChunkBytes = 0;
        }

        currentChunk.push(item);
        currentChunkBytes += fileSize;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
};

const formatTranslatedValue = (translated: string, turkish: string): string => {
    const translatedValue = translated?.trim() ?? "";
    const turkishValue = turkish?.trim() ?? "";

    if (translatedValue && turkishValue) {
        return `${translatedValue} (${turkishValue})`;
    }
    if (translatedValue) return translatedValue;
    if (turkishValue) return `(${turkishValue})`;
    return "";
};

const getLocalizedLabel = (
    labels: Record<LocaleCode, string>,
    locale: LocaleCode
): string => {
    const trLabel = labels.tr;
    if (locale === "tr") return trLabel;
    const translatedLabel = labels[locale] || trLabel;
    return formatTranslatedValue(translatedLabel, trLabel);
};

const getLocalizedValue = (
    labels: Record<LocaleCode, string> | undefined,
    locale: LocaleCode
): string => {
    if (!labels) return "";
    return getLocalizedLabel(labels, locale);
};

const buildTagTranslationEntries = (
    tags: { id: string; name: string }[] | undefined
): string[] =>
    (tags || [])
        .map((tag) => {
            const name = tag.name?.trim();
            if (!tag.id || !name) return null;
            return `${TAG_TRANSLATION_PREFIX}${tag.id}:${name}`;
        })
        .filter((value): value is string => Boolean(value));

const mergeTagTranslationEntries = (
    existing: string[] | undefined,
    entries: string[]
): string[] => {
    if (entries.length === 0) return existing || [];
    const preserved = (existing || []).filter(
        (item) => !item.startsWith(TAG_TRANSLATION_PREFIX)
    );
    return [...preserved, ...entries];
};

const parseTagTranslations = (items: string[] | undefined): Record<string, string> => {
    const map: Record<string, string> = {};
    (items || []).forEach((item) => {
        if (!item.startsWith(TAG_TRANSLATION_PREFIX)) return;
        const parts = item.split(":");
        if (parts.length < 3) return;
        const id = parts[1];
        const value = parts.slice(2).join(":").trim();
        if (id && value) {
            map[id] = value;
        }
    });
    return map;
};

const TABS = [
    { id: "details", label: "Detaylar", icon: Building2 },
    { id: "location", label: "Konum", icon: MapPin },
    { id: "features", label: "Özellikler", icon: Home },
    { id: "media", label: "Medya", icon: ImageIcon },
];

interface LocationsPayload {
    cities?: string[];
    districts?: string[];
    neighborhoods?: string[];
    defaultCity?: string;
    defaultDistrict?: string;
}

const PROPERTY_TYPE_ALIASES: Record<string, string> = {
    APARTMENT: "APARTMENT",
    DAIRE: "APARTMENT",
    VILLA: "VILLA",
    PENTHOUSE: "PENTHOUSE",
    LAND: "LAND",
    ARSA: "LAND",
    COMMERCIAL: "COMMERCIAL",
    TICARI: "COMMERCIAL",
    OFFICE: "OFFICE",
    OFIS: "OFFICE",
    SHOP: "SHOP",
    DUKKAN: "SHOP",
    FARM: "FARM",
    CIFTLIK: "FARM",
    TARLA: "FARM",
};

const SALE_TYPE_ALIASES: Record<string, string> = {
    SALE: "SALE",
    SATILIK: "SALE",
    SATIS: "SALE",
    RENT: "RENT",
    KIRALIK: "RENT",
    KIRA: "RENT",
};

const CURRENCY_ALIASES: Record<string, string> = {
    EUR: "EUR",
    EURO: "EUR",
    USD: "USD",
    DOLAR: "USD",
    DOLLAR: "USD",
    TRY: "TRY",
    TL: "TRY",
    GBP: "GBP",
    STERLIN: "GBP",
    POUND: "GBP",
};

const HEATING_ALIASES: Record<string, string> = {
    CENTRAL: "central",
    MERKEZI: "central",
    INDIVIDUAL: "individual",
    BIREYSEL: "individual",
    FLOOR: "floor",
    YERDENISITMA: "floor",
    AC: "ac",
    KLIMA: "ac",
    NONE: "none",
    YOK: "none",
};

const ZONING_STATUS_ALIASES: Record<string, string> = {
    IMARLI: "imarlı",
    IMARSIZ: "imarsız",
    TARLA: "tarla",
    KONUT: "konut",
    TICARI: "ticari",
};

// Property types that show residential-specific fields
const RESIDENTIAL_TYPES = ["APARTMENT", "VILLA", "PENTHOUSE"];
const LAND_TYPES = ["LAND"];
const COMMERCIAL_TYPES = ["COMMERCIAL", "SHOP", "OFFICE"];
const FARM_TYPES = ["FARM"];
const MEDIA_OPTIMIZATION_SUCCESS_DURATION_MS = 1100;

const wait = (ms: number) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });

const defaultTranslations: ListingTranslation[] = buildTranslations();

const defaultListing: ListingData = {
    status: "DRAFT",
    type: "APARTMENT",
    saleType: "SALE",
    company: "Güzel Invest",
    city: "Antalya",
    district: "Alanya",
    neighborhood: null,
    address: null,
    googleMapsLink: null,
    latitude: null,
    longitude: null,
    price: 0,
    currency: "EUR",
    area: 0,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
    wcCount: null,
    floor: null,
    totalFloors: null,
    buildYear: null,
    heating: null,
    furnished: false,
    balcony: false,
    garden: false,
    pool: false,
    parking: false,
    elevator: false,
    security: false,
    seaView: false,
    // New fields
    parcelNo: null,
    emsal: null,
    zoningStatus: null,
    groundFloorArea: null,
    basementArea: null,
    hasWaterSource: false,
    hasFruitTrees: false,
    existingStructure: null,
    citizenshipEligible: false,
    residenceEligible: false,
    publishToHepsiemlak: false,
    publishToSahibinden: false,
    homepageHeroSlot: null,
    translations: defaultTranslations,
    media: [],
    tags: [],
};

const normalizeLookupKey = (value: unknown): string =>
    String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/ı/g, "i")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .toUpperCase();

const normalizeTextValue = (value: unknown): string | null => {
    if (value === undefined || value === null) return null;
    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
};

const parseNumberValue = (value: unknown): number | null => {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;

    const raw = String(value).trim();
    if (!raw) return null;

    const cleaned = raw.replace(/[^0-9,.-]/g, "");
    if (!cleaned) return null;

    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");
    let normalized = cleaned;

    if (lastComma > -1 && lastDot > -1) {
        normalized =
            lastComma > lastDot
                ? cleaned.replace(/\./g, "").replace(",", ".")
                : cleaned.replace(/,/g, "");
    } else if (lastComma > -1) {
        const decimalLength = cleaned.length - lastComma - 1;
        normalized =
            decimalLength === 3
                ? cleaned.replace(/,/g, "")
                : cleaned.replace(",", ".");
    } else if (lastDot > -1) {
        const decimalLength = cleaned.length - lastDot - 1;
        normalized =
            decimalLength === 3 ? cleaned.replace(/\./g, "") : cleaned;
    }

    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
};

const parseIntegerValue = (value: unknown): number | null => {
    const parsed = parseNumberValue(value);
    return parsed === null ? null : Math.round(parsed);
};

const buildGoogleMapsLink = (
    latitude: number | null,
    longitude: number | null,
    locationLabel: string
): string => {
    if (
        latitude !== null &&
        longitude !== null &&
        !(latitude === 0 && longitude === 0)
    ) {
        return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
    if (locationLabel) {
        return `https://www.google.com/maps?q=${encodeURIComponent(locationLabel)}`;
    }
    return "";
};

const toGoogleMapsEmbedLink = (value: string | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
        const url = new URL(trimmed);
        if (!url.hostname.includes("google")) {
            return null;
        }
        url.searchParams.set("output", "embed");
        return url.toString();
    } catch {
        return null;
    }
};

const parseRoomsValue = (value: unknown): string | null => {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (/^\d+\+\d+$/.test(trimmed)) return trimmed;
        // Handle "3 oda 1 salon" style
        const match = trimmed.toLowerCase().match(/(\d+)\s*(?:oda|odalı)?\s*(\d+)\s*(?:salon|salonu)?/);
        if (match) return `${match[1]}+${match[2]}`;
    }

    // Fallback for numbers or total sums
    const num = typeof value === "number" ? value : Number.parseInt(String(value), 10);
    if (isNaN(num)) return null;
    if (num <= 1) return "1+0";
    return `${num - 1}+1`;
};

const parseBooleanValue = (value: unknown): boolean | null => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") {
        if (value === 1) return true;
        if (value === 0) return false;
        return null;
    }

    if (typeof value === "string") {
        const normalized = normalizeLookupKey(value);
        if (["TRUE", "EVET", "YES", "VAR", "1"].includes(normalized)) return true;
        if (["FALSE", "HAYIR", "NO", "YOK", "0"].includes(normalized)) return false;
    }

    return null;
};

const normalizePropertyType = (value: unknown): string | null => {
    const normalized = normalizeLookupKey(value);
    return normalized ? PROPERTY_TYPE_ALIASES[normalized] || null : null;
};

const normalizeSaleType = (value: unknown): string | null => {
    const normalized = normalizeLookupKey(value);
    return normalized ? SALE_TYPE_ALIASES[normalized] || null : null;
};

const normalizeCurrency = (value: unknown): string | null => {
    if (value === "€") return "EUR";
    if (value === "$") return "USD";
    if (value === "₺") return "TRY";
    if (value === "£") return "GBP";

    const normalized = normalizeLookupKey(value);
    return normalized ? CURRENCY_ALIASES[normalized] || null : null;
};

const normalizeHeating = (value: unknown): string | null => {
    const normalized = normalizeLookupKey(value);
    return normalized ? HEATING_ALIASES[normalized] || null : null;
};

const normalizeZoningStatus = (value: unknown): string | null => {
    const normalized = normalizeLookupKey(value);
    return normalized ? ZONING_STATUS_ALIASES[normalized] || null : null;
};

const normalizeFeatureList = (value: unknown): string[] | null => {
    if (Array.isArray(value)) {
        const normalized = value
            .map((item) => normalizeTextValue(item))
            .filter((item): item is string => Boolean(item));
        return normalized.length > 0 ? normalized : null;
    }

    const textValue = normalizeTextValue(value);
    if (!textValue) return null;

    const normalized = textValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    return normalized.length > 0 ? normalized : null;
};

interface SortableMediaItemProps {
    item: Media;
    index: number;
    resolveMediaUrl: (path: string) => string;
    onRemove?: (id: string | null | undefined) => void;
}

function SortableMediaItem({
    item,
    index,
    resolveMediaUrl,
    onRemove,
}: SortableMediaItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0 : undefined,
    };

    const isCover = index === 0;
    const isPortfolio = index > 0 && index < 4;
    const imagePath = item.thumbnailUrl || item.url;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing group",
                isCover
                    ? "border-orange-500 shadow-md"
                    : isPortfolio
                        ? "border-blue-500 shadow-md"
                        : "border-transparent hover:border-orange-200",
                isDragging &&
                    (isPortfolio
                        ? "scale-105 shadow-xl ring-2 ring-blue-400 z-50 opacity-80"
                        : "scale-105 shadow-xl ring-2 ring-orange-400 z-50 opacity-80")
            )}
        >
            <img
                src={resolveMediaUrl(imagePath)}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
            />

            {isCover && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm z-10">
                    Kapak
                </span>
            )}
            {isPortfolio && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm z-10">
                    Portföy
                </span>
            )}

            {/* Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2 pointer-events-none">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.(item.id);
                    }}
                    className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg pointer-events-auto cursor-pointer"
                    title="Sil"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function SortablePendingMediaItem({
    item,
    index,
    onRemove,
}: {
    item: PendingMedia;
    index: number;
    onRemove?: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0 : undefined,
    };

    const isCover = index === 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing group",
                isCover ? "border-orange-500 shadow-md" : "border-gray-100 hover:border-orange-200",
                isDragging && "scale-105 shadow-xl ring-2 ring-orange-400 z-50 opacity-80"
            )}
        >
            <img
                src={item.previewUrl}
                alt=""
                className="w-full h-full object-cover"
            />

            {isCover && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm z-10">
                    Kapak
                </span>
            )}

            {/* Remove Action */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2 pointer-events-none">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove?.(item.id);
                    }}
                    className="p-1.5 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg pointer-events-auto cursor-pointer"
                    title="Seçimi Kaldır"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export function ListingForm({ listing, isNew = false }: ListingFormProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("details");
    const [activeLocale, setActiveLocale] = useState<LocaleCode>("tr");
    const [formData, setFormData] = useState<ListingData>(() => {
        if (!listing) return defaultListing;
        return {
            ...defaultListing,
            ...listing,
            company: listing.company || defaultListing.company,
            rooms: listing.rooms ? String(listing.rooms) : null,
            translations: buildTranslations(listing.translations),
        };
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
    const [isAiFillOpen, setIsAiFillOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedTags, setSelectedTags] = useState<TagData[]>(listing?.tags || []);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<
        | null
        | "archive"
        | "remove"
        | "delete"
        | "homepageHero"
        | "homepageHeroReplacementRequired"
    >(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [translationsLocked, setTranslationsLocked] = useState(
        hasNonTurkishTranslations(listing?.translations)
    );
    const [isMounted, setIsMounted] = useState(false);
    const [mediaOptimizationState, setMediaOptimizationState] =
        useState<MediaOptimizationState>("hidden");
    const [leaveIntent, setLeaveIntent] = useState<{
        type: "href" | "back";
        href?: string;
        external?: boolean;
    } | null>(null);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const [copiedField, setCopiedField] = useState<null | "id" | "sku">(null);
    const [pendingHomepageHeroSlot, setPendingHomepageHeroSlot] = useState<
        HomepageHeroSlotValue | null
    >(null);
    const [isLeavePromptOpen, setIsLeavePromptOpen] = useState(false);
    const [leaveAction, setLeaveAction] = useState<null | "draft" | "publish">(null);
    const bypassUnsavedCheckRef = useRef(false);
    const initialSnapshotRef = useRef<string>("");
    const currentUrlRef = useRef<string>("");
    const autoMapsLinkRef = useRef<string>("");
    const errorBannerRef = useRef<HTMLDivElement | null>(null);

    // Room Options State
    const [roomOptions, setRoomOptions] = useState<string[]>([
        "1+0", "1+1", "2+1", "3+1", "4+1", "5+1"
    ]);
    const [customRoomInput, setCustomRoomInput] = useState("");
    const [isAddingRoom, setIsAddingRoom] = useState(false);

    // Feature State
    const [featureInput, setFeatureInput] = useState("");
    const [isAddingFeature, setIsAddingFeature] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!error) return;

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        const rafId = window.requestAnimationFrame(() => {
            errorBannerRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });

        return () => {
            window.cancelAnimationFrame(rafId);
        };
    }, [error]);

    const resolveMediaUrl = (path: string) => getMediaUrl(path);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const runWithNavigationBypass = (callback: () => void) => {
        bypassUnsavedCheckRef.current = true;
        callback();
        setTimeout(() => {
            bypassUnsavedCheckRef.current = false;
        }, 0);
    };

    const safePush = (href: string) => {
        runWithNavigationBypass(() => router.push(href));
    };

    const safeBack = () => {
        runWithNavigationBypass(() => router.back());
    };

    const buildUnsavedSnapshot = (
        data: ListingData,
        tags: TagData[],
        pending: PendingMedia[]
    ) => ({
        formData: data,
        tags: tags.map((tag) => ({ id: tag.id, name: tag.name, color: tag.color })),
        pendingMedia: pending.map((item) => ({
            id: item.id,
            name: item.file.name,
            size: item.file.size,
            lastModified: item.file.lastModified,
            type: item.file.type,
        })),
    });

    const currentSnapshot = useMemo(
        () => JSON.stringify(buildUnsavedSnapshot(formData, selectedTags, pendingMedia)),
        [formData, selectedTags, pendingMedia]
    );

    useEffect(() => {
        if (!initialSnapshotRef.current) {
            initialSnapshotRef.current = currentSnapshot;
        }
    }, [currentSnapshot]);

    const hasUnsavedChanges = useMemo(() => {
        if (!initialSnapshotRef.current) return false;
        return initialSnapshotRef.current !== currentSnapshot;
    }, [currentSnapshot]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            currentUrlRef.current = window.location.href;
        }
    }, [pathname]);

    const openLeavePrompt = useCallback((intent: {
        type: "href" | "back";
        href?: string;
        external?: boolean;
    }) => {
        if (isLeavePromptOpen) return;
        setLeaveIntent(intent);
        setIsLeavePromptOpen(true);
    }, [isLeavePromptOpen]);

    const closeLeavePrompt = useCallback(() => {
        setIsLeavePromptOpen(false);
        setLeaveIntent(null);
        setLeaveAction(null);
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!hasUnsavedChanges || bypassUnsavedCheckRef.current) return;
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            if (!hasUnsavedChanges || bypassUnsavedCheckRef.current) return;
            const target = event.target as HTMLElement | null;
            const anchor = target?.closest("a") as HTMLAnchorElement | null;
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("#")) return;
            if (anchor.target && anchor.target !== "_self") return;
            if (anchor.hasAttribute("download")) return;
            if (anchor.getAttribute("data-skip-unsaved") === "true") return;

            const url = new URL(href, window.location.href);
            event.preventDefault();
            event.stopPropagation();
            // Stop Next.js Link handler in capture phase
            if ("stopImmediatePropagation" in event) {
                (event as unknown as { stopImmediatePropagation: () => void }).stopImmediatePropagation();
            }
            openLeavePrompt({
                type: "href",
                href: url.href,
                external: url.origin !== window.location.origin,
            });
        };

        document.addEventListener("click", handleLinkClick, true);
        return () => {
            document.removeEventListener("click", handleLinkClick, true);
        };
    }, [hasUnsavedChanges, isLeavePromptOpen, openLeavePrompt]);

    useEffect(() => {
        const handlePopState = () => {
            if (!hasUnsavedChanges || bypassUnsavedCheckRef.current) {
                currentUrlRef.current = window.location.href;
                return;
            }

            const destination = window.location.href;
            const fallbackUrl = currentUrlRef.current || "/admin/ilanlar";
            runWithNavigationBypass(() => router.push(fallbackUrl));
            openLeavePrompt({
                type: "href",
                href: destination,
                external: new URL(destination).origin !== window.location.origin,
            });
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [hasUnsavedChanges, router, openLeavePrompt]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setFormData((prev) => {
                if (!prev.media) return prev;
                const oldIndex = prev.media.findIndex((m) => m.id === active.id);
                const newIndex = prev.media.findIndex((m) => m.id === over.id);

                const newMedia = arrayMove(prev.media, oldIndex, newIndex).map(
                    (item, index) => ({
                        ...item,
                        order: index,
                        isCover: index === 0,
                    })
                );

                return {
                    ...prev,
                    media: newMedia,
                };
            });
        }
    };

    const handlePendingDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPendingMedia((prev) => {
                const oldIndex = prev.findIndex((m) => m.id === active.id);
                const newIndex = prev.findIndex((m) => m.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const handleRemoveMedia = (id: string | null | undefined) => {
        if (!id) return;
        setFormData((prev) => {
            const newMedia = (prev.media?.filter((m) => m.id !== id) || []).map((m, i) => ({
                ...m,
                order: i,
                isCover: i === 0,
            }));
            return {
                ...prev,
                media: newMedia,
            };
        });
    };

    // Check property type categories
    const isResidential = RESIDENTIAL_TYPES.includes(formData.type);
    const isLand = LAND_TYPES.includes(formData.type);
    const isCommercial = COMMERCIAL_TYPES.includes(formData.type);
    const isFarm = FARM_TYPES.includes(formData.type);
    const cityOptions =
        formData.city && !availableCities.includes(formData.city)
            ? [formData.city, ...availableCities]
            : availableCities;
    const districtOptions =
        formData.district && !availableDistricts.includes(formData.district)
            ? [formData.district, ...availableDistricts]
            : availableDistricts;
    const neighborhoodOptions =
        formData.neighborhood && !availableNeighborhoods.includes(formData.neighborhood)
            ? [formData.neighborhood, ...availableNeighborhoods]
            : availableNeighborhoods;
    const locationLabel = [
        formData.address,
        formData.neighborhood,
        formData.district,
        formData.city,
    ]
        .filter(Boolean)
        .join(", ");
    const latitudeValue =
        typeof formData.latitude === "number" && !Number.isNaN(formData.latitude)
            ? formData.latitude
            : null;
    const longitudeValue =
        typeof formData.longitude === "number" && !Number.isNaN(formData.longitude)
            ? formData.longitude
            : null;
    const autoMapsLink = buildGoogleMapsLink(
        latitudeValue,
        longitudeValue,
        locationLabel
    );
    const manualEmbedLink = toGoogleMapsEmbedLink(formData.googleMapsLink);
    const autoEmbedLink = toGoogleMapsEmbedLink(autoMapsLink);
    const mapSrc = manualEmbedLink || autoEmbedLink;

    useEffect(() => {
        let active = true;

        const loadCities = async () => {
            try {
                const response = await fetch("/api/admin/locations");
                if (!response.ok) return;
                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;

                const cities = payload.cities || [];
                setAvailableCities(cities);

                if (!payload.defaultCity) return;

                setFormData((prev) => {
                    if (prev.city) return prev;
                    return {
                        ...prev,
                        city: payload.defaultCity || prev.city,
                        district:
                            payload.defaultDistrict ||
                            prev.district ||
                            "",
                        neighborhood: null,
                    };
                });
            } catch {
                // no-op
            }
        };

        void loadCities();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!formData.city) {
            setAvailableDistricts([]);
            return;
        }

        let active = true;
        const loadDistricts = async () => {
            try {
                const response = await fetch(
                    `/api/admin/locations?city=${encodeURIComponent(formData.city)}`
                );
                if (!response.ok) return;
                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;

                const districts = payload.districts || [];
                setAvailableDistricts(districts);

                setFormData((prev) => {
                    if (prev.city !== formData.city) return prev;
                    if (!prev.district || districts.includes(prev.district)) return prev;

                    return {
                        ...prev,
                        district: districts[0] || "",
                        neighborhood: null,
                    };
                });
            } catch {
                // no-op
            }
        };

        void loadDistricts();

        return () => {
            active = false;
        };
    }, [formData.city]);

    useEffect(() => {
        if (!formData.city || !formData.district) {
            setAvailableNeighborhoods([]);
            return;
        }

        let active = true;
        const loadNeighborhoods = async () => {
            try {
                const response = await fetch(
                    `/api/admin/locations?city=${encodeURIComponent(formData.city)}&district=${encodeURIComponent(formData.district)}`
                );
                if (!response.ok) return;
                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;

                const neighborhoods = payload.neighborhoods || [];
                setAvailableNeighborhoods(neighborhoods);

                setFormData((prev) => {
                    if (
                        prev.city !== formData.city ||
                        prev.district !== formData.district
                    ) {
                        return prev;
                    }
                    if (!prev.neighborhood || neighborhoods.includes(prev.neighborhood)) {
                        return prev;
                    }
                    return {
                        ...prev,
                        neighborhood: null,
                    };
                });
            } catch {
                // no-op
            }
        };

        void loadNeighborhoods();

        return () => {
            active = false;
        };
    }, [formData.city, formData.district]);

    useEffect(() => {
        if (!autoMapsLink) return;
        setFormData((prev) => {
            const current = prev.googleMapsLink?.trim() || "";
            const shouldUpdate =
                !current || current === autoMapsLinkRef.current;
            autoMapsLinkRef.current = autoMapsLink;
            if (!shouldUpdate) return prev;
            if (current === autoMapsLink) return prev;
            return { ...prev, googleMapsLink: autoMapsLink };
        });
    }, [autoMapsLink]);

    // Handle AI fill data
    const handleAiFillApply = (data: ParsedData) => {
        setFormData((prev) => {
            const updated = { ...prev };

            // Map AI data to form fields
            const normalizedType = normalizePropertyType(data.type);
            if (normalizedType) updated.type = normalizedType;

            const normalizedSaleType = normalizeSaleType(data.saleType);
            if (normalizedSaleType) updated.saleType = normalizedSaleType;

            const parsedPrice = parseNumberValue(data.price);
            if (parsedPrice !== null) updated.price = parsedPrice;

            const normalizedCurrency = normalizeCurrency(data.currency);
            if (normalizedCurrency) updated.currency = normalizedCurrency;

            const parsedArea = parseIntegerValue(data.area);
            if (parsedArea !== null) updated.area = parsedArea;

            const parsedRooms = parseRoomsValue(data.rooms);
            if (parsedRooms !== null) updated.rooms = parsedRooms;

            const parsedBedrooms = parseIntegerValue(data.bedrooms);
            if (parsedBedrooms !== null) updated.bedrooms = parsedBedrooms;

            const parsedBathrooms = parseIntegerValue(data.bathrooms);
            if (parsedBathrooms !== null) updated.bathrooms = parsedBathrooms;

            const parsedWcCount = parseIntegerValue(data.wcCount);
            if (parsedWcCount !== null) updated.wcCount = parsedWcCount;

            const parsedFloor = parseIntegerValue(data.floor);
            if (parsedFloor !== null) updated.floor = parsedFloor;

            const parsedTotalFloors = parseIntegerValue(data.totalFloors);
            if (parsedTotalFloors !== null) updated.totalFloors = parsedTotalFloors;

            const parsedBuildYear = parseIntegerValue(data.buildYear);
            if (parsedBuildYear !== null) updated.buildYear = parsedBuildYear;

            const normalizedHeating = normalizeHeating(data.heating);
            if (normalizedHeating) updated.heating = normalizedHeating;

            const normalizedCity = normalizeTextValue(data.city);
            const normalizedDistrict = normalizeTextValue(data.district);
            const normalizedNeighborhood = normalizeTextValue(data.neighborhood);
            if (normalizedCity) updated.city = normalizedCity;
            if (normalizedDistrict) updated.district = normalizedDistrict;
            if (normalizedNeighborhood) updated.neighborhood = normalizedNeighborhood;

            const parsedLatitude = parseNumberValue(data.latitude);
            if (parsedLatitude !== null) updated.latitude = parsedLatitude;

            const parsedLongitude = parseNumberValue(data.longitude);
            if (parsedLongitude !== null) updated.longitude = parsedLongitude;

            const normalizedMapsLink = normalizeTextValue(data.googleMapsLink);
            if (normalizedMapsLink) updated.googleMapsLink = normalizedMapsLink;

            // Boolean features
            const furnished = parseBooleanValue(data.furnished);
            if (furnished !== null) updated.furnished = furnished;

            const balcony = parseBooleanValue(data.balcony);
            if (balcony !== null) updated.balcony = balcony;

            const garden = parseBooleanValue(data.garden);
            if (garden !== null) updated.garden = garden;

            const pool = parseBooleanValue(data.pool);
            if (pool !== null) updated.pool = pool;

            const parking = parseBooleanValue(data.parking);
            if (parking !== null) updated.parking = parking;

            const elevator = parseBooleanValue(data.elevator);
            if (elevator !== null) updated.elevator = elevator;

            const security = parseBooleanValue(data.security);
            if (security !== null) updated.security = security;

            const seaView = parseBooleanValue(data.seaView);
            if (seaView !== null) updated.seaView = seaView;

            // Land-specific
            const normalizedParcelNo = normalizeTextValue(data.parcelNo);
            if (normalizedParcelNo) updated.parcelNo = normalizedParcelNo;

            const parsedEmsal = parseNumberValue(data.emsal);
            if (parsedEmsal !== null) updated.emsal = parsedEmsal;

            const normalizedZoningStatus =
                normalizeZoningStatus(data.zoningStatus) ||
                normalizeTextValue(data.zoningStatus);
            if (normalizedZoningStatus) updated.zoningStatus = normalizedZoningStatus;

            // Commercial-specific
            const parsedGroundFloorArea = parseIntegerValue(data.groundFloorArea);
            if (parsedGroundFloorArea !== null) updated.groundFloorArea = parsedGroundFloorArea;

            const parsedBasementArea = parseIntegerValue(data.basementArea);
            if (parsedBasementArea !== null) updated.basementArea = parsedBasementArea;

            // Farm-specific
            const hasWaterSource = parseBooleanValue(data.hasWaterSource);
            if (hasWaterSource !== null) updated.hasWaterSource = hasWaterSource;

            const hasFruitTrees = parseBooleanValue(data.hasFruitTrees);
            if (hasFruitTrees !== null) updated.hasFruitTrees = hasFruitTrees;

            const normalizedExistingStructure = normalizeTextValue(data.existingStructure);
            if (normalizedExistingStructure) updated.existingStructure = normalizedExistingStructure;

            // Eligibility
            const citizenshipEligible = parseBooleanValue(data.citizenshipEligible);
            if (citizenshipEligible !== null) {
                updated.citizenshipEligible = citizenshipEligible;
            }

            const residenceEligible = parseBooleanValue(data.residenceEligible);
            if (residenceEligible !== null) {
                updated.residenceEligible = residenceEligible;
            }

            const normalizedTitle = normalizeTextValue(data.title);
            const normalizedDescription = normalizeTextValue(data.description);
            const normalizedFeatures = normalizeFeatureList(data.features);

            // Update Turkish translation with title and description
            if (normalizedTitle || normalizedDescription || normalizedFeatures) {
                updated.translations = updated.translations.map((t) => {
                    if (t.locale === "tr") {
                        return {
                            ...t,
                            title: normalizedTitle ?? t.title,
                            description: normalizedDescription ?? t.description,
                            features: normalizedFeatures ?? t.features,
                        };
                    }
                    return t;
                });
            }

            return updated;
        });
    };


    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        const checked =
            type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
        const nullableNumberFields = new Set([
            "bedrooms",
            "bathrooms",
            "wcCount",
            "floor",
            "totalFloors",
            "buildYear",
            "latitude",
            "longitude",
            "groundFloorArea",
            "basementArea",
            "emsal",
        ]);

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                        ? value === ""
                            ? nullableNumberFields.has(name)
                                ? null
                                : 0
                            : Number(value)
                        : value,
        }));
    };

    const handleTranslationChange = (
        locale: string,
        field: "title" | "description",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            translations: prev.translations.map((t) =>
                t.locale === locale ? { ...t, [field]: value } : t
            ),
        }));
    };

    const handleTranslate = async () => {
        if (isTranslating || translationsLocked) return;

        const trTranslation = formData.translations.find((t) => t.locale === "tr");
        const title = trTranslation?.title?.trim() ?? "";
        const description = trTranslation?.description?.trim() ?? "";

        if (!title && !description) {
            setError("Çeviri için önce Türkçe başlık veya açıklama ekleyin.");
            return;
        }

        setIsTranslating(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/ai/translate-listing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    listingId: formData.id || null,
                    tags: selectedTags.map((tag) => ({ id: tag.id, name: tag.name })),
                }),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    setTranslationsLocked(true);
                }
                const apiError = await parseApiErrorMessage(
                    response,
                    "Çeviri başarısız."
                );
                throw new Error(apiError);
            }

            const data = await response.json().catch(() => ({}));

            const translations = data.translations;

            if (!translations) {
                throw new Error("Çeviri yanıtı alınamadı");
            }

            const enTagEntries = buildTagTranslationEntries(translations.en?.tags);
            const deTagEntries = buildTagTranslationEntries(translations.de?.tags);
            const ruTagEntries = buildTagTranslationEntries(translations.ru?.tags);

            setFormData((prev) => ({
                ...prev,
                translations: prev.translations.map((t) => {
                    if (t.locale === "en") {
                        return {
                            ...t,
                            title: translations.en?.title ?? t.title,
                            description: translations.en?.description ?? t.description,
                            features: mergeTagTranslationEntries(t.features, enTagEntries),
                        };
                    }
                    if (t.locale === "de") {
                        return {
                            ...t,
                            title: translations.de?.title ?? t.title,
                            description: translations.de?.description ?? t.description,
                            features: mergeTagTranslationEntries(t.features, deTagEntries),
                        };
                    }
                    if (t.locale === "ru") {
                        return {
                            ...t,
                            title: translations.ru?.title ?? t.title,
                            description: translations.ru?.description ?? t.description,
                            features: mergeTagTranslationEntries(t.features, ruTagEntries),
                        };
                    }
                    return t;
                }),
            }));

            setTranslationsLocked(true);
        } catch (err) {
            setError(
                getFriendlyFetchErrorMessage(err, "Çeviri başarısız.", {
                    networkMessage:
                        "Çeviri isteği sırasında bağlantı kesildi (Load failed). İnternet/proxy bağlantısını kontrol edip tekrar deneyin.",
                })
            );
        } finally {
            setIsTranslating(false);
        }
    };

    const createPendingId = () =>
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const revokePendingMedia = (items: PendingMedia[]) => {
        items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };

    const persistListing = async (
        options: {
            statusOverride?: ListingStatusValue;
        } = {}
    ): Promise<string> => {
        const hasListing = Boolean(formData.id);
        const endpoint = hasListing
            ? `/api/admin/listings/${formData.id}`
            : "/api/admin/listings";
        const method = hasListing ? "PATCH" : "POST";

        const body = {
            ...formData,
            status: options.statusOverride ?? formData.status,
            tags: selectedTags,
        };

        const response = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const apiError = await parseApiErrorMessage(response, "Kayıt başarısız.");
            throw new Error(apiError);
        }

        const savedListing = await response.json();
        const listingId = savedListing?.id || formData.id;

        if (!listingId) {
            throw new Error("İlan kimliği alınamadı. Lütfen tekrar deneyin.");
        }

        setFormData((prev) => ({
            ...prev,
            id: listingId,
            slug: savedListing.slug || prev.slug,
            sku: savedListing.sku ?? prev.sku,
            company: savedListing.company || prev.company,
            status: savedListing.status || prev.status,
            homepageHeroSlot:
                savedListing.homepageHeroSlot ?? prev.homepageHeroSlot,
        }));

        return listingId;
    };

    const uploadMediaFiles = async (
        listingId: string,
        items: PendingMedia[]
    ): Promise<{ uploaded: Media[]; failed: PendingMedia[] }> => {
        if (items.length === 0) {
            return { uploaded: [], failed: [] };
        }

        const validationError = validateMediaFiles(items.map((item) => item.file));
        if (validationError) {
            setError(validationError);
            return { uploaded: [], failed: items };
        }

        setIsUploading(true);
        setError(null);

        const uploadedMedia: Media[] = [];
        let completedCount = 0;
        let failedItems: PendingMedia[] = [];
        const uploadChunks = buildMediaUploadChunks(items);

        try {
            for (const chunk of uploadChunks) {
                const payload = new FormData();
                chunk.forEach((item) => payload.append("files", item.file));

                const response = await fetch(`/api/admin/listings/${listingId}/media`, {
                    method: "POST",
                    body: payload,
                });

                if (!response.ok) {
                    const apiError = await parseApiErrorMessage(
                        response,
                        "Bir veya daha fazla görsel yüklenemedi."
                    );
                    throw new Error(apiError);
                }

                const data = (await response.json().catch(() => ({}))) as {
                    media?: Media[];
                };
                const uploaded = Array.isArray(data.media) ? data.media : [];

                if (uploaded.length === 0) {
                    throw new Error(
                        "Yüklenen görseller için sunucudan geçerli medya yanıtı alınamadı."
                    );
                }

                uploadedMedia.push(...uploaded);
                completedCount += chunk.length;
            }
        } catch (err) {
            failedItems = items.slice(completedCount);
            const partialInfo =
                completedCount > 0
                    ? ` ${completedCount} görsel yüklendi, kalan ${failedItems.length} görsel beklemede.`
                    : "";
            const message = getFriendlyFetchErrorMessage(err, "Medya yükleme hatası.", {
                networkMessage:
                    "Yükleme sırasında bağlantı kesildi (Load failed). Dosya boyutunu küçültüp tekrar deneyin.",
            });
            setError(`${message}${partialInfo}`);
        } finally {
            setIsUploading(false);
        }

        if (uploadedMedia.length > 0) {
            setFormData((prev) => ({
                ...prev,
                media: [...(prev.media || []), ...uploadedMedia],
            }));
        }

        return { uploaded: uploadedMedia, failed: failedItems };
    };

    const uploadMediaImmediately = async (items: PendingMedia[]) => {
        if (items.length === 0) return;

        setMediaOptimizationState("optimizing");
        setError(null);

        let listingId = formData.id;

        try {
            if (!listingId) {
                setIsSaving(true);
                listingId = await persistListing({ statusOverride: "DRAFT" });
            }

            const { uploaded, failed } = await uploadMediaFiles(listingId, items);
            const failedIdSet = new Set(failed.map((item) => item.id));
            const succeededItems = items.filter((item) => !failedIdSet.has(item.id));

            if (succeededItems.length > 0) {
                revokePendingMedia(succeededItems);
            }

            setPendingMedia((prev) => {
                const uploadedAttemptIds = new Set(items.map((item) => item.id));
                const untouchedItems = prev.filter(
                    (item) => !uploadedAttemptIds.has(item.id)
                );
                return [...untouchedItems, ...failed];
            });

            if (uploaded.length > 0 && failed.length === 0) {
                setMediaOptimizationState("completed");
                await wait(MEDIA_OPTIMIZATION_SUCCESS_DURATION_MS);
            }
        } catch (err) {
            setError(
                getFriendlyFetchErrorMessage(err, "Medya yükleme hatası.", {
                    networkMessage:
                        "Yükleme sırasında bağlantı kesildi (Load failed). Dosya boyutunu küçültüp tekrar deneyin.",
                })
            );
        } finally {
            setIsSaving(false);
            setMediaOptimizationState("hidden");
        }
    };

    const handleFiles = (files: File[]) => {
        if (files.length === 0) return;

        if (isUploading || isSaving) {
            setError("Medya yükleme işlemi devam ediyor. Lütfen bitmesini bekleyin.");
            return;
        }

        if (!files.every((file) => file.type.startsWith("image/"))) {
            setError("Sadece görsel dosyaları yükleyebilirsiniz.");
            return;
        }

        const validationError = validateMediaFiles(files);
        if (validationError) {
            setError(validationError);
            return;
        }

        const pendingItems = files.map((file) => ({
            id: createPendingId(),
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setPendingMedia((prev) => [...prev, ...pendingItems]);
        setError(null);

        void uploadMediaImmediately(pendingItems);
    };

    const handleMediaSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);
        handleFiles(files);
        event.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (isUploading || isSaving) {
            setError("Medya yükleme işlemi devam ediyor. Lütfen bitmesini bekleyin.");
            return;
        }

        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        );
        handleFiles(files);
    };

    const handleSubmit = async (
        options: {
            statusOverride?: ListingStatusValue;
            redirectTo?: string;
            skipRedirect?: boolean;
        } = {}
    ): Promise<boolean> => {
        setIsSaving(true);
        setMediaOptimizationState("hidden");
        setError(null);

        try {
            await persistListing({ statusOverride: options.statusOverride });

            if (!options.skipRedirect) {
                const target = options.redirectTo ?? "/admin/ilanlar";
                safePush(target);
                router.refresh();
            }
            return true;
        } catch (err) {
            setMediaOptimizationState("hidden");
            setError(
                getFriendlyFetchErrorMessage(err, "Bir hata oluştu.", {
                    networkMessage:
                        "İşlem sırasında bağlantı kesildi (Load failed). İnternet/proxy bağlantısını kontrol edip tekrar deneyin.",
                })
            );
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.id) return;

        const response = await fetch(`/api/admin/listings/${formData.id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const apiError = await parseApiErrorMessage(response, "Silme başarısız.");
            throw new Error(apiError);
        }
    };

    const handleStatusOnlyUpdate = async (status: ListingStatusValue) => {
        if (!formData.id) return;

        const response = await fetch(`/api/admin/listings/${formData.id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const apiError = await parseApiErrorMessage(
                response,
                "Durum güncellenemedi."
            );
            throw new Error(apiError);
        }
    };

    const handleHomepageHeroUpdate = async (
        slot: HomepageHeroSlotValue | null
    ) => {
        if (!formData.id) return;

        const response = await fetch(`/api/admin/listings/${formData.id}/homepage-hero`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slot }),
        });

        if (!response.ok) {
            const apiError = await parseApiErrorMessage(
                response,
                "Ana sayfa hero ayarı güncellenemedi."
            );
            throw new Error(apiError);
        }

        setFormData((prev) => ({
            ...prev,
            homepageHeroSlot: slot,
        }));
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        setIsActionLoading(true);
        setError(null);

        try {
            if (confirmAction === "homepageHeroReplacementRequired") {
                safePush("/admin/ilanlar");
                return;
            }
            if (confirmAction === "homepageHero") {
                await handleHomepageHeroUpdate(pendingHomepageHeroSlot);
                router.refresh();
                return;
            }
            if (confirmAction === "archive") {
                await handleStatusOnlyUpdate("ARCHIVED");
                safePush("/admin/ilanlar");
                router.refresh();
                return;
            }
            if (confirmAction === "remove") {
                await handleStatusOnlyUpdate("REMOVED");
                safePush("/admin/ilanlar");
                router.refresh();
                return;
            }
            if (confirmAction === "delete") {
                await handleDelete();
                safePush("/admin/ilanlar");
                router.refresh();
            }
        } catch (err) {
            setError(
                getFriendlyFetchErrorMessage(err, "Bir hata oluştu.", {
                    networkMessage:
                        "İşlem sırasında bağlantı kesildi (Load failed). Lütfen tekrar deneyin.",
                })
            );
        } finally {
            setIsActionLoading(false);
            setConfirmAction(null);
            setPendingHomepageHeroSlot(null);
        }
    };

    const handleLeaveSave = async (statusOverride: ListingStatusValue) => {
        if (!leaveIntent) return;
        setLeaveAction(statusOverride === "DRAFT" ? "draft" : "publish");
        const success = await handleSubmit({ statusOverride, skipRedirect: true });
        if (!success) {
            setLeaveAction(null);
            return;
        }

        const intent = leaveIntent;
        closeLeavePrompt();

        if (intent.type === "back") {
            safeBack();
            return;
        }

        if (intent.href) {
            if (intent.external) {
                bypassUnsavedCheckRef.current = true;
                window.location.assign(intent.href);
            } else {
                safePush(intent.href);
            }
        }
    };

    const handleLeaveDiscard = () => {
        if (!leaveIntent) return;
        const intent = leaveIntent;
        closeLeavePrompt();

        if (intent.type === "back") {
            safeBack();
            return;
        }

        if (intent.href) {
            if (intent.external) {
                bypassUnsavedCheckRef.current = true;
                window.location.assign(intent.href);
            } else {
                safePush(intent.href);
            }
        }
    };

    const currentTranslation =
        formData.translations.find((t) => t.locale === activeLocale) ||
        formData.translations[0];
    const turkishTranslation =
        formData.translations.find((t) => t.locale === "tr") ||
        currentTranslation;
    const isTranslationView = activeLocale !== "tr";
    const displayTitle = isTranslationView
        ? formatTranslatedValue(currentTranslation?.title || "", turkishTranslation?.title || "")
        : currentTranslation?.title || "";
    const displayDescription = isTranslationView
        ? formatTranslatedValue(
            currentTranslation?.description || "",
            turkishTranslation?.description || ""
        )
        : currentTranslation?.description || "";
    const tagTranslationMap = useMemo(
        () => parseTagTranslations(currentTranslation?.features),
        [currentTranslation?.features]
    );
    const confirmConfig: Record<
        string,
        {
            title: string;
            description: string;
            tone: "warning" | "danger";
            confirmLabel: string;
            cancelLabel?: string;
        }
    > = {
        archive: {
            title: "İlan arşivlensin mi?",
            description: "Arşivlenen ilan sitede görünmez.",
            tone: "warning",
            confirmLabel: "Arşivle",
            cancelLabel: "Vazgeç",
        },
        remove: {
            title: "İlan yayından kaldırılsın mı?",
            description: "Bu işlem ilanın durumunu Kaldırıldı olarak günceller.",
            tone: "danger",
            confirmLabel: "Yayından Kaldır",
            cancelLabel: "Vazgeç",
        },
        delete: {
            title: "İlan tamamen silinsin mi?",
            description: "Bu işlem geri alınamaz.",
            tone: "danger",
            confirmLabel: "İlanı Sil",
            cancelLabel: "Vazgeç",
        },
        homepageHeroReplacementRequired: {
            title: "Bu ilan ana sayfada gösteriliyor",
            description:
                `Bu ilan Ana Sayfa ${formData.homepageHeroSlot ?? "?"} alanında gösteriliyor. Yayından kaldırmadan önce bu slot için başka bir ilan seçmelisiniz.`,
            tone: "warning",
            confirmLabel: "İlanlara Git",
            cancelLabel: "Vazgeç",
        },
    };
    const activeConfirm =
        confirmAction === "homepageHero"
            ? {
                title: pendingHomepageHeroSlot
                    ? `Ana Sayfa ${pendingHomepageHeroSlot} alanında gösterilsin mi?`
                    : "Ana sayfa slider alanından kaldırmak istiyor musunuz?",
                description: pendingHomepageHeroSlot
                    ? `Bu seçimden sonra ilan Ana Sayfa ${pendingHomepageHeroSlot} slotunda görünecek. O slotta seçili ilan varsa otomatik kaldırılacak.`
                    : "Bu işlem ilanın ana sayfa slider slot atamasını kaldırır.",
                tone: "warning" as const,
                confirmLabel: pendingHomepageHeroSlot ? "Evet, Ata" : "Kaldır",
                cancelLabel: "Vazgeç",
            }
            : confirmAction
                ? confirmConfig[confirmAction]
                : null;

    const handleCopyValue = async (field: "id" | "sku", value: string | null | undefined) => {
        if (!value || typeof navigator === "undefined") return;
        try {
            await navigator.clipboard.writeText(value);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 1400);
        } catch {
            // no-op
        }
    };

    const getHomepageHeroValidationError = (): string | null => {
        if (!formData.saleType?.trim()) {
            return "Satılık / Kiralık seçimi yapılmadı.";
        }

        if (!formData.type?.trim()) {
            return "Gayrimenkul tipi seçilmedi.";
        }

        if (!Number.isFinite(formData.price) || formData.price <= 0) {
            return "Fiyat girilmedi.";
        }

        if (!turkishTranslation?.title?.trim()) {
            return "Başlık eklenmedi.";
        }

        const hasCoverPhoto = (formData.media || []).some(
            (item, index) => item.isCover || index === 0
        );

        if (!hasCoverPhoto) {
            return "Kapak fotoğrafı eklenmedi.";
        }

        return null;
    };

    const handleHomepageHeroRequest = (slot: HomepageHeroSlotValue | null) => {
        if (slot !== null) {
            const validationError = getHomepageHeroValidationError();
            if (validationError) {
                setError(validationError);
                return;
            }
        }

        if (slot === formData.homepageHeroSlot) {
            return;
        }

        setPendingHomepageHeroSlot(slot);
        setConfirmAction("homepageHero");
    };

    const handleSectionNavigation = (sectionId: string) => {
        setActiveTab(sectionId);
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) {
            const offset = 80; // Account for the sticky header
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = targetSection.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    // Scroll Spy Logic
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-10% 0px -80% 0px",
            threshold: 0,
        };

        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id.replace("section-", "");
                    setActiveTab(sectionId);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        const sections = TABS.map((tab) => document.getElementById(`section-${tab.id}`));

        sections.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => {
            sections.forEach((section) => {
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            if (hasUnsavedChanges) {
                                openLeavePrompt({ type: "back" });
                                return;
                            }
                            safeBack();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isNew ? "Yeni İlan" : "İlan Düzenle"}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {isNew
                                ? "Yeni bir ilan oluşturun"
                                : displayTitle || "İsimsiz İlan"}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAiFillOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm cursor-pointer"
                        >
                            <Sparkles className="w-4 h-4" />
                            AI ile Doldur
                        </button>
                        {!isNew && (
                            <span
                                className={cn(
                                    "px-3 py-1 rounded-full text-sm font-medium",
                                    formData.status === "PUBLISHED"
                                        ? "bg-green-100 text-green-700 shadow-[0_0_0_1px_rgba(34,197,94,0.1)]"
                                        : formData.status === "DRAFT"
                                            ? "bg-yellow-100 text-yellow-700 shadow-[0_0_0_1px_rgba(234,179,8,0.1)]"
                                            : formData.status === "REMOVED"
                                                ? "bg-red-100 text-red-700 shadow-[0_0_0_1px_rgba(239,68,68,0.1)]"
                                                : "bg-gray-100 text-gray-600 shadow-[0_0_0_1px_rgba(107,114,128,0.1)]"
                                )}
                            >
                                {formData.status === "PUBLISHED"
                                    ? "Yayında"
                                    : formData.status === "DRAFT"
                                        ? "Taslak"
                                        : formData.status === "REMOVED"
                                            ? "Kaldırıldı"
                                            : "Arşiv"}
                            </span>
                        )}
                    </div>
                    {(formData.id || formData.sku) && (
                        <div className="flex flex-wrap justify-end gap-2">
                            {formData.id && (
                                <button
                                    type="button"
                                    onClick={() => handleCopyValue("id", formData.id)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-500">ID</span>
                                    <span className="font-mono max-w-[220px] truncate">{formData.id}</span>
                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                    {copiedField === "id" && (
                                        <span className="text-green-600 font-semibold">Kopyalandı</span>
                                    )}
                                </button>
                            )}
                            {formData.sku && (
                                <button
                                    type="button"
                                    onClick={() => handleCopyValue("sku", formData.sku)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-500">SKU</span>
                                    <span className="font-mono">{formData.sku}</span>
                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                    {copiedField === "sku" && (
                                        <span className="text-green-600 font-semibold">Kopyalandı</span>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                    {!isNew && formData.id && (
                        <div className="flex flex-wrap justify-end gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                {HOMEPAGE_HERO_SLOT_OPTIONS.map((slot) => {
                                    const isSelected = formData.homepageHeroSlot === slot;
                                    return (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => handleHomepageHeroRequest(slot)}
                                            disabled={
                                                isActionLoading ||
                                                formData.status !== "PUBLISHED"
                                            }
                                            className={cn(
                                                "inline-flex items-center gap-2 px-4 py-1.5 border text-sm font-semibold rounded-lg transition-all shadow-sm",
                                                isSelected
                                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                                                formData.status !== "PUBLISHED" &&
                                                    "opacity-60 cursor-not-allowed hover:bg-white",
                                                isActionLoading && "opacity-75 cursor-wait"
                                            )}
                                            title={
                                                formData.status !== "PUBLISHED"
                                                    ? "Ana sayfada göstermek için ilanın yayınlanmış olması gerekir."
                                                    : `Bu ilanı Ana Sayfa ${slot} slotuna ata`
                                            }
                                        >
                                            <Star className="w-3.5 h-3.5" />
                                            <span>
                                                {isSelected
                                                    ? `Ana Sayfa ${slot} (Seçili)`
                                                    : `Ana Sayfa ${slot}`}
                                            </span>
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => handleHomepageHeroRequest(null)}
                                    disabled={
                                        isActionLoading ||
                                        formData.status !== "PUBLISHED" ||
                                        formData.homepageHeroSlot === null
                                    }
                                    className={cn(
                                        "inline-flex items-center gap-2 px-4 py-1.5 border text-sm font-semibold rounded-lg transition-all shadow-sm",
                                        "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                                        (formData.status !== "PUBLISHED" ||
                                            formData.homepageHeroSlot === null) &&
                                            "opacity-60 cursor-not-allowed hover:bg-white",
                                        isActionLoading && "opacity-75 cursor-wait"
                                    )}
                                    title={
                                        formData.homepageHeroSlot === null
                                            ? "Bu ilanın ana sayfa slot ataması bulunmuyor."
                                            : "İlanı ana sayfa slotundan kaldır"
                                    }
                                >
                                    Ana Sayfadan Kaldır
                                </button>
                            </div>
                            {formData.status === "PUBLISHED" && formData.slug && (
                                <Link
                                    href={`/tr/ilan/${formData.slug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 text-sm font-semibold rounded-lg hover:bg-green-100 hover:border-green-300 hover:text-green-800 transition-all shadow-sm group"
                                    title="İlanı Gör"
                                >
                                    <span>İlanı Gör</span>
                                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div
                    ref={errorBannerRef}
                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600"
                >
                    {error}
                </div>
            )}

            {/* Section Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 rounded-t-xl transition-all duration-200">
                    <div className="flex flex-wrap items-center gap-2 p-3">
                        <div className="flex flex-wrap gap-2">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => handleSectionNavigation(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        activeTab === tab.id
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            {translationsLocked ? (
                                LOCALES.map((locale) => (
                                    <button
                                        key={locale.code}
                                        type="button"
                                        onClick={() => setActiveLocale(locale.code)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                                            activeLocale === locale.code
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                        title={locale.label}
                                    >
                                        {locale.code.toUpperCase()}
                                    </button>
                                ))
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleTranslate}
                                    disabled={isTranslating}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors",
                                        isTranslating
                                            ? "border-gray-200 text-gray-400 bg-gray-50"
                                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                                    )}
                                >
                                    <Languages className="w-4 h-4" />
                                    {isTranslating ? "Çeviriliyor..." : "Çeviri Ekle"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <section id="section-details" className="space-y-8 scroll-mt-28">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Detaylar</h2>
                        </div>
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            <CompanyOptionSelect
                                value={formData.company}
                                onChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        company: value,
                                    }))
                                }
                                className="w-full md:max-w-sm"
                            />
                            <div className="flex items-center gap-2 md:ml-auto">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            publishToHepsiemlak: !prev.publishToHepsiemlak,
                                        }))
                                    }
                                    className={cn(
                                        "relative overflow-hidden px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer",
                                        formData.publishToHepsiemlak
                                            ? "bg-[#E1241C] text-white border-[#E1241C] hover:bg-[#C41E17]"
                                            : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                                    )}
                                >
                                    {!formData.publishToHepsiemlak && (
                                        <span className="pointer-events-none absolute inset-0">
                                            <span className="absolute left-[-18%] top-[70%] h-px w-[140%] -rotate-[32deg] bg-gray-500" />
                                        </span>
                                    )}
                                    Hepsiemlak
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            publishToSahibinden: !prev.publishToSahibinden,
                                        }))
                                    }
                                    className={cn(
                                        "relative overflow-hidden px-4 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer",
                                        formData.publishToSahibinden
                                            ? "bg-[#FFE802] text-black border-[#FFE802] hover:bg-[#E6D002]"
                                            : "bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                                    )}
                                >
                                    {!formData.publishToSahibinden && (
                                        <span className="pointer-events-none absolute inset-0">
                                            <span className="absolute left-[-18%] top-[70%] h-px w-[140%] -rotate-[32deg] bg-gray-500" />
                                        </span>
                                    )}
                                    Sahibinden
                                </button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {getLocalizedLabel(FIELD_LABELS.title, activeLocale)}
                                </label>
                                <input
                                    type="text"
                                    value={displayTitle}
                                    onChange={
                                        activeLocale === "tr"
                                            ? (e) =>
                                                handleTranslationChange(
                                                    "tr",
                                                    "title",
                                                    e.target.value
                                                )
                                            : undefined
                                    }
                                    readOnly={activeLocale !== "tr"}
                                    className={cn(
                                        "input",
                                        activeLocale !== "tr" && "bg-gray-50 text-gray-600"
                                    )}
                                    placeholder="İlan başlığı"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {getLocalizedLabel(FIELD_LABELS.description, activeLocale)}
                                </label>
                                <textarea
                                    value={displayDescription}
                                    onChange={
                                        activeLocale === "tr"
                                            ? (e) =>
                                                handleTranslationChange(
                                                    "tr",
                                                    "description",
                                                    e.target.value
                                                )
                                            : undefined
                                    }
                                    readOnly={activeLocale !== "tr"}
                                    className={cn(
                                        "input min-h-[200px]",
                                        activeLocale !== "tr" && "bg-gray-50 text-gray-600"
                                    )}
                                    placeholder="İlan açıklaması"
                                />
                            </div>
                        </div>
                        {/* Core Fields - Always Visible */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                {activeLocale === "tr" ? (
                                    <Select
                                        label={getLocalizedLabel(FIELD_LABELS.propertyType, activeLocale)}
                                        value={formData.type}
                                        onChange={(value) =>
                                            setFormData((prev) => ({ ...prev, type: value }))
                                        }
                                        options={PROPERTY_TYPES}
                                    />
                                ) : (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {getLocalizedLabel(FIELD_LABELS.propertyType, activeLocale)}
                                        </label>
                                        <div className="input bg-gray-50 text-gray-600">
                                            {getLocalizedValue(
                                                PROPERTY_TYPE_LABELS[formData.type],
                                                activeLocale
                                            ) || "-"}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div>
                                {activeLocale === "tr" ? (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {getLocalizedLabel(FIELD_LABELS.saleType, activeLocale)}
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {SALE_TYPES.map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            saleType: type.value,
                                                        }))
                                                    }
                                                    className={cn(
                                                        "px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                                                        formData.saleType === type.value
                                                            ? "border-orange-500 bg-orange-50 text-orange-600"
                                                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                                    )}
                                                >
                                                    {type.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {getLocalizedLabel(FIELD_LABELS.saleType, activeLocale)}
                                        </label>
                                        <div className="input bg-gray-50 text-gray-600">
                                            {getLocalizedValue(
                                                SALE_TYPE_LABELS[formData.saleType],
                                                activeLocale
                                            ) || "-"}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fiyat
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price || ""}
                                        onChange={handleInputChange}
                                        className="input flex-1 min-w-0"
                                        placeholder="0"
                                    />
                                    <Select
                                        value={formData.currency}
                                        onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                                        options={CURRENCY_OPTIONS}
                                        className="!w-24 shrink-0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alan (m²)
                                </label>
                                <input
                                    type="number"
                                    name="area"
                                    value={formData.area || ""}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Residential Fields - Apartments, Villas, Penthouses */}
                        {isResidential && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Konut Detayları
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {/* 1. Room Count */}
                                    <div className="col-span-2 md:col-span-1 lg:col-span-1">
                                        <RoomOptionSelect
                                            value={formData.rooms}
                                            onChange={(val) => setFormData(prev => ({ ...prev, rooms: val }))}
                                            options={roomOptions}
                                            onOptionsChange={setRoomOptions}
                                        />
                                    </div>

                                    {/* 2. Bathroom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Banyo
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="2"
                                        />
                                    </div>

                                    {/* 3. WC */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            WC
                                        </label>
                                        <input
                                            type="number"
                                            name="wcCount"
                                            value={formData.wcCount || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="1"
                                        />
                                    </div>

                                    {/* 4. Total Floors */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kat Sayısı
                                        </label>
                                        <input
                                            type="number"
                                            name="totalFloors"
                                            value={formData.totalFloors || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="5"
                                        />
                                    </div>

                                    {/* 5. Floor Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bulunduğu Kat
                                        </label>
                                        <input
                                            type="number"
                                            name="floor"
                                            value={formData.floor || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="3"
                                        />
                                    </div>

                                    {/* 6. Build Year */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Yapım Yılı
                                        </label>
                                        <input
                                            type="number"
                                            name="buildYear"
                                            value={formData.buildYear || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    {/* Heating */}
                                    <div>
                                        {activeLocale === "tr" ? (
                                            <Select
                                                label={getLocalizedLabel(FIELD_LABELS.heating, activeLocale)}
                                                value={formData.heating || ""}
                                                onChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        heating: value || null,
                                                    }))
                                                }
                                                options={[
                                                    { value: "", label: "Seçiniz" },
                                                    { value: "central", label: "Merkezi" },
                                                    { value: "individual", label: "Bireysel" },
                                                    { value: "floor", label: "Yerden Isıtma" },
                                                    { value: "ac", label: "Klima" },
                                                    { value: "none", label: "Yok" },
                                                ]}
                                            />
                                        ) : (
                                            <>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    {getLocalizedLabel(FIELD_LABELS.heating, activeLocale)}
                                                </label>
                                                <div className="input bg-gray-50 text-gray-600">
                                                    {getLocalizedValue(
                                                        formData.heating
                                                            ? HEATING_LABELS[formData.heating]
                                                            : undefined,
                                                        activeLocale
                                                    ) || "-"}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Suitability */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Uygunluk Durumu
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        citizenshipEligible: !prev.citizenshipEligible,
                                                    }))
                                                }
                                                className={cn(
                                                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                    formData.citizenshipEligible
                                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                )}
                                            >
                                                Vatandaşlığa Uygun
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        residenceEligible: !prev.residenceEligible,
                                                    }))
                                                }
                                                className={cn(
                                                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                    formData.residenceEligible
                                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                )}
                                            >
                                                İkametgaha Uygun
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Land Fields */}
                        {isLand && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Arsa Detayları
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ada / Parsel
                                        </label>
                                        <input
                                            type="text"
                                            name="parcelNo"
                                            value={formData.parcelNo || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="308 Ada 7 Parsel"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Emsal (KAKS)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="emsal"
                                            value={formData.emsal || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="0.40"
                                        />
                                    </div>

                                    <div>
                                        <Select
                                            label="İmar Durumu"
                                            value={formData.zoningStatus || ""}
                                            onChange={(value) => setFormData(prev => ({ ...prev, zoningStatus: value || null }))}
                                            options={[
                                                { value: "", label: "Seçiniz" },
                                                { value: "imarlı", label: "İmarlı" },
                                                { value: "imarsız", label: "İmarsız" },
                                                { value: "tarla", label: "Tarla" },
                                                { value: "konut", label: "Konut İmarlı" },
                                                { value: "ticari", label: "Ticari İmarlı" },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Commercial Fields */}
                        {isCommercial && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Ticari Mülk Detayları
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Zemin Kat Alanı (m²)
                                        </label>
                                        <input
                                            type="number"
                                            name="groundFloorArea"
                                            value={formData.groundFloorArea || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="220"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bodrum Kat Alanı (m²)
                                        </label>
                                        <input
                                            type="number"
                                            name="basementArea"
                                            value={formData.basementArea || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="230"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Farm Fields */}
                        {isFarm && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Çiftlik / Tarla Detayları
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mevcut Yapı
                                        </label>
                                        <input
                                            type="text"
                                            name="existingStructure"
                                            value={formData.existingStructure || ""}
                                            onChange={handleInputChange}
                                            className="input"
                                            placeholder="2 katlı ev, havuz"
                                        />
                                    </div>

                                    <div className="flex items-center gap-6 pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="hasWaterSource"
                                                checked={formData.hasWaterSource}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">Su Kaynağı</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="hasFruitTrees"
                                                checked={formData.hasFruitTrees}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-700">Meyve Ağaçları</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isResidential && (
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Uygunluk Durumu
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                citizenshipEligible: !prev.citizenshipEligible,
                                            }))
                                        }
                                        className={cn(
                                            "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                                            formData.citizenshipEligible
                                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        Vatandaşlığa Uygun
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                residenceEligible: !prev.residenceEligible,
                                            }))
                                        }
                                        className={cn(
                                            "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                                            formData.residenceEligible
                                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        İkametgaha Uygun
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    <section id="section-location" className="scroll-mt-28 mt-10 space-y-6">
                        <div className="border-t border-gray-100 pt-8">
                            <h2 className="text-lg font-semibold text-gray-900">Konum</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select
                                    label="Şehir"
                                    value={formData.city}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            city: value,
                                            district: "",
                                            neighborhood: null,
                                        }))
                                    }
                                    options={[
                                        { value: "", label: "Seçiniz" },
                                        ...cityOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        })),
                                    ]}
                                    searchable
                                    searchPlaceholder="Şehir yazın"
                                    searchMatchMode="startsWith"
                                />
                                <Select
                                    label="İlçe"
                                    value={formData.district}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            district: value,
                                            neighborhood: null,
                                        }))
                                    }
                                    options={[
                                        { value: "", label: "Seçiniz" },
                                        ...districtOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        })),
                                    ]}
                                    searchable
                                    searchPlaceholder="İlçe yazın"
                                    searchMatchMode="startsWith"
                                />
                                <Select
                                    label="Mahalle"
                                    value={formData.neighborhood || ""}
                                    onChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            neighborhood: value || null,
                                        }))
                                    }
                                    options={[
                                        { value: "", label: "Seçiniz" },
                                        ...neighborhoodOptions.map((option) => ({
                                            value: option,
                                            label: option,
                                        })),
                                    ]}
                                    searchable
                                    searchPlaceholder="Mahalle yazın"
                                    searchMatchMode="startsWith"
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adres
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ""}
                                        onChange={handleInputChange}
                                        className="input"
                                        placeholder="Açık adres"
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Enlem
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    name="latitude"
                                                    value={formData.latitude || ""}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                    placeholder="36.5489"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Boylam
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    name="longitude"
                                                    value={formData.longitude || ""}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                    placeholder="32.0489"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Google Maps Linki
                                                </label>
                                                <input
                                                    type="text"
                                                    name="googleMapsLink"
                                                    value={formData.googleMapsLink || ""}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                    placeholder="https://www.google.com/maps?q=36.5489,32.0489"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-end">
                                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 border border-dashed border-gray-200 rounded-lg px-3 py-2">
                                                    <span>
                                                        Koordinat veya adres girince Google Maps linki otomatik dolabilir.
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                                        onClick={() =>
                                                            autoMapsLink &&
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                googleMapsLink: autoMapsLink,
                                                            }))
                                                        }
                                                        disabled={!autoMapsLink}
                                                    >
                                                        Otomatik Doldur
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="min-h-[200px] h-full">
                                        {mapSrc ? (
                                            <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-50 h-full flex flex-col">
                                                <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100 shrink-0">
                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                                        <MapPin className="w-4 h-4 text-orange-500" />
                                                        Harita Önizleme
                                                    </div>
                                                    <span className="text-xs text-gray-400">Google Maps</span>
                                                </div>
                                                <div className="flex-1 w-full relative min-h-[150px]">
                                                    <iframe
                                                        title="İlan konumu"
                                                        src={mapSrc}
                                                        className="absolute inset-0 w-full h-full"
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    />
                                                </div>
                                                {locationLabel && (
                                                    <div className="px-4 py-2.5 bg-white border-t border-gray-100 text-xs text-gray-500 shrink-0">
                                                        {locationLabel}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500 h-full flex items-center justify-center text-center">
                                                Harita önizlemesi için adres veya koordinat bilgisi girin.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                        <section id="section-features" className="scroll-mt-28 space-y-6">
                            <div className="border-t border-gray-100 pt-8">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {getLocalizedLabel(FIELD_LABELS.features, activeLocale)}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {/* Active Features (Booleans + Custom) */}
                                {(() => {
                                    const booleanFeatures = [
                                        { key: "furnished", labels: FEATURE_LABELS.furnished },
                                        { key: "balcony", labels: FEATURE_LABELS.balcony },
                                        { key: "garden", labels: FEATURE_LABELS.garden },
                                        { key: "pool", labels: FEATURE_LABELS.pool },
                                        { key: "parking", labels: FEATURE_LABELS.parking },
                                        { key: "elevator", labels: FEATURE_LABELS.elevator },
                                        { key: "security", labels: FEATURE_LABELS.security },
                                        { key: "seaView", labels: FEATURE_LABELS.seaView },
                                    ];

                                    const currentTranslation = formData.translations.find(t => t.locale === activeLocale);
                                    const customFeatures = currentTranslation?.features || [];

                                    // Combined list for display
                                    const activeBooleanFeatures = booleanFeatures.filter(f => formData[f.key as keyof ListingData]);

                                    return (
                                        <>
                                            {/* Boolean Features */}
                                            {activeBooleanFeatures.map(f => (
                                                <div key={f.key} className="relative group">
                                                    <div className="px-3 py-2 rounded-lg border border-orange-500 bg-orange-50 text-orange-700 text-sm font-medium">
                                                        {getLocalizedLabel(f.labels, activeLocale)}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setFormData(prev => ({ ...prev, [f.key]: false }));
                                                        }}
                                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                                    >
                                                        <X className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Custom Features */}
                                            {customFeatures.map((feature, idx) => (
                                                <div key={`custom-${idx}`} className="relative group">
                                                    <div className="px-3 py-2 rounded-lg border border-orange-500 bg-orange-50 text-orange-700 text-sm font-medium">
                                                        {feature}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setFormData(prev => {
                                                                const newTranslations = prev.translations.map(t => {
                                                                    if (t.locale === activeLocale) {
                                                                        return {
                                                                            ...t,
                                                                            features: t.features.filter((_, i) => i !== idx)
                                                                        };
                                                                    }
                                                                    return t;
                                                                });
                                                                return { ...prev, translations: newTranslations };
                                                            });
                                                        }}
                                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                                    >
                                                        <X className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* Suggestions (Inactive Booleans) */}
                                            {booleanFeatures.filter(f => !formData[f.key as keyof ListingData]).map(f => (
                                                <button
                                                    key={`suggestion-${f.key}`}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, [f.key]: true }))}
                                                    className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50/50 text-sm font-medium transition-colors"
                                                >
                                                    + {getLocalizedLabel(f.labels, activeLocale)}
                                                </button>
                                            ))}

                                            {/* Add Input */}
                                            {isAddingFeature ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={featureInput}
                                                        onChange={(e) => setFeatureInput(e.target.value)}
                                                        className="w-32 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                        placeholder="Özellik ekle..."
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const text = featureInput.trim();
                                                                if (text) {
                                                                    const matchedBool = booleanFeatures.find(b =>
                                                                        getLocalizedLabel(b.labels, activeLocale).toLowerCase() === text.toLowerCase()
                                                                    );

                                                                    if (matchedBool) {
                                                                        setFormData(prev => ({ ...prev, [matchedBool.key]: true }));
                                                                    } else {
                                                                        setFormData(prev => {
                                                                            const newTranslations = prev.translations.map(t => {
                                                                                if (t.locale === activeLocale) {
                                                                                    return { ...t, features: [...(t.features || []), text] };
                                                                                }
                                                                                return t;
                                                                            });
                                                                            return { ...prev, translations: newTranslations };
                                                                        });
                                                                    }
                                                                    setFeatureInput("");
                                                                    setIsAddingFeature(false);
                                                                }
                                                            } else if (e.key === 'Escape') {
                                                                setIsAddingFeature(false);
                                                                setFeatureInput("");
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            const text = featureInput.trim();
                                                            if (text) {
                                                                const matchedBool = booleanFeatures.find(b =>
                                                                    getLocalizedLabel(b.labels, activeLocale).toLowerCase() === text.toLowerCase()
                                                                );

                                                                if (matchedBool) {
                                                                    setFormData(prev => ({ ...prev, [matchedBool.key]: true }));
                                                                } else {
                                                                    setFormData(prev => {
                                                                        const newTranslations = prev.translations.map(t => {
                                                                            if (t.locale === activeLocale) {
                                                                                return { ...t, features: [...(t.features || []), text] };
                                                                            }
                                                                            return t;
                                                                        });
                                                                        return { ...prev, translations: newTranslations };
                                                                    });
                                                                }
                                                            }
                                                            setFeatureInput("");
                                                            setIsAddingFeature(false);
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingFeature(true)}
                                                    className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 text-sm"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Özel Ekle
                                                </button>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                        </section>

                        <section id="section-labels" className="scroll-mt-28 space-y-6">
                            <div className="border-t border-gray-100 pt-8">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Etiketler
                                </h2>
                                <div className="mt-6">
                                    {activeLocale === "tr" ? (
                                        <>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Bu ilana etiketler ekleyerek kategorize edebilir ve filtrelenebilir hale getirebilirsiniz.
                                            </p>
                                            <TagInput
                                                selectedTags={selectedTags}
                                                onTagsChange={setSelectedTags}
                                            />
                                        </>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTags.length === 0 && (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                            {selectedTags.map((tag) => {
                                                const translatedName = tagTranslationMap[tag.id];
                                                const label = formatTranslatedValue(
                                                    translatedName || "",
                                                    tag.name
                                                );
                                                return (
                                                    <span
                                                        key={tag.id}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white"
                                                        style={{ backgroundColor: tag.color }}
                                                    >
                                                        {label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <section id="section-media" className="scroll-mt-28 mt-10 space-y-6">
                        <div className="border-t border-gray-100 pt-8">
                            <h2 className="text-lg font-semibold text-gray-900">Medya</h2>
                        </div>
                        <div className="space-y-6">
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={cn(
                                    "relative border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out p-12 text-center cursor-pointer",
                                    isDragging
                                        ? "border-orange-500 bg-orange-50/50 scale-[1.01]"
                                        : "border-gray-100 hover:border-orange-200 hover:bg-orange-50/30"
                                )}
                                onClick={() => {
                                    const input = document.getElementById(
                                        "media-upload"
                                    ) as HTMLInputElement;
                                    input?.click();
                                }}
                            >
                                <input
                                    id="media-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleMediaSelect}
                                    disabled={isUploading || isSaving}
                                    className="sr-only"
                                />
                                <div className="flex flex-col items-center gap-4">
                                    <div
                                        className={cn(
                                            "p-4 rounded-full transition-colors",
                                            isDragging
                                                ? "bg-orange-100 text-orange-600"
                                                : "bg-gray-100 text-gray-400"
                                        )}
                                    >
                                        {isDragging ? (
                                            <CloudUpload className="w-10 h-10 animate-bounce" />
                                        ) : (
                                            <Upload className="w-10 h-10" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {isDragging
                                                ? "Görselleri buraya bırakın"
                                                : "Görsel yüklemek için tıklayın veya sürükleyin"}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {isUploading
                                                ? "Görseller 4'lü partiler halinde optimize edilerek yükleniyor..."
                                                : "PNG, JPG, WebP, GIF ve AVIF formatları desteklenmektedir."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {pendingMedia.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    {isUploading
                                        ? "Seçilen görseller şimdi optimize edilip 4'lü partiler halinde yükleniyor."
                                        : "Aşağıdaki görseller yüklenemedi. Kaldırıp yeniden deneyebilirsiniz."}
                                </p>
                            )}
                            {(formData.media?.length || 0) > 0 && (
                                <p className="text-xs text-gray-500">
                                    İlk görsel kapak olarak kullanılır. Sonraki ilk 3 görsel portföy carouseli için mavi etiketle işaretlenir.
                                </p>
                            )}

                            {isMounted && (
                                <DndContext
                                    id="existing-media-dnd"
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <SortableContext
                                            items={(formData.media || []).map((m) => m.id)}
                                            strategy={rectSortingStrategy}
                                        >
                                            {(formData.media || []).map((item, index) => (
                                                <SortableMediaItem
                                                    key={item.id}
                                                    item={item}
                                                    index={index}
                                                    resolveMediaUrl={resolveMediaUrl}
                                                    onRemove={handleRemoveMedia}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>

                                    <DragOverlay adjustScale={true}>
                                        {(() => {
                                            if (!activeId) return null;
                                            const activeMediaIndex =
                                                formData.media?.findIndex((m) => m.id === activeId) ?? -1;
                                            if (activeMediaIndex < 0) return null;
                                            const item = formData.media?.[activeMediaIndex];
                                            if (!item) return null;
                                            const isActivePortfolio =
                                                activeMediaIndex > 0 && activeMediaIndex < 4;

                                            return (
                                                <div
                                                    className={cn(
                                                        "relative aspect-square rounded-lg overflow-hidden border-2 shadow-2xl scale-105 ring-4 bg-white",
                                                        isActivePortfolio
                                                            ? "border-blue-500 ring-blue-500/20"
                                                            : "border-orange-500 ring-orange-500/20"
                                                    )}
                                                >
                                                    <img
                                                        src={resolveMediaUrl(
                                                            item.thumbnailUrl || item.url
                                                        )}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                        decoding="async"
                                                        draggable={false}
                                                    />
                                                </div>
                                            );
                                        })()}
                                    </DragOverlay>
                                </DndContext>
                            )}

                            {isMounted && pendingMedia.length > 0 && (
                                <DndContext
                                    id="pending-media-dnd"
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handlePendingDragEnd}
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <SortableContext
                                            items={pendingMedia.map((m) => m.id)}
                                            strategy={rectSortingStrategy}
                                        >
                                            {pendingMedia.map((item, index) => (
                                                <SortablePendingMediaItem
                                                    key={item.id}
                                                    item={item}
                                                    index={index}
                                                    onRemove={(id: string) => {
                                                        const revoked = pendingMedia.filter((m) => m.id === id);
                                                        revokePendingMedia(revoked);
                                                        setPendingMedia((prev) =>
                                                            prev.filter((m) => m.id !== id)
                                                        );
                                                    }}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>

                                    <DragOverlay adjustScale={true}>
                                        {activeId ? (
                                            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-orange-500 shadow-2xl scale-105 ring-4 ring-orange-500/20 bg-white">
                                                {(() => {
                                                    const item = pendingMedia.find((m) => m.id === activeId);
                                                    if (!item) return null;
                                                    return (
                                                        <img
                                                            src={item.previewUrl}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
                            )}

                            {!formData.media?.length && pendingMedia.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Henüz medya yüklenmemiş</p>
                                    <p className="text-sm mt-2">
                                        Görsellerinizi ekleyerek başlayın
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                    {!isNew && formData.status !== "ARCHIVED" && formData.status !== "REMOVED" && (
                        <button
                            onClick={() => setConfirmAction("archive")}
                            className="btn btn-ghost btn-md text-gray-500"
                        >
                            <Archive className="w-4 h-4" />
                            Arşivle
                        </button>
                    )}
                    {!isNew && formData.status === "PUBLISHED" && (
                        <button
                            onClick={() => {
                                if (formData.homepageHeroSlot !== null) {
                                    setConfirmAction("homepageHeroReplacementRequired");
                                    return;
                                }
                                setConfirmAction("remove");
                            }}
                            className="btn btn-ghost btn-md text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <CircleOff className="w-4 h-4" />
                            Yayından Kaldır
                        </button>
                    )}
                    {!isNew && (
                        <button
                            onClick={() => setConfirmAction("delete")}
                            className="btn btn-ghost btn-md text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            İlanı Sil
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSubmit({ statusOverride: "DRAFT" })}
                        disabled={isSaving || isUploading}
                        className="btn btn-outline btn-md"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Kaydediliyor..." : "Taslak Kaydet"}
                    </button>
                    <button
                        onClick={() => handleSubmit({ statusOverride: "PUBLISHED" })}
                        disabled={isSaving || isUploading}
                        className="btn btn-primary btn-md"
                    >
                        <Send className="w-4 h-4" />
                        {isSaving ? "Yayınlanıyor..." : "Yayınla"}
                    </button>
                </div>
            </div>

            <UnsavedChangesModal
                isOpen={isLeavePromptOpen}
                isLoading={isSaving || isUploading}
                loadingAction={leaveAction}
                onCancel={closeLeavePrompt}
                onDiscard={handleLeaveDiscard}
                onSaveDraft={() => handleLeaveSave("DRAFT")}
                onPublish={() => handleLeaveSave("PUBLISHED")}
            />

            <MediaOptimizationModal
                isOpen={mediaOptimizationState !== "hidden"}
                stage={
                    mediaOptimizationState === "completed"
                        ? "completed"
                        : "optimizing"
                }
            />

            <ConfirmModal
                isOpen={Boolean(confirmAction)}
                title={activeConfirm?.title || ""}
                description={activeConfirm?.description}
                confirmLabel={activeConfirm?.confirmLabel}
                cancelLabel={activeConfirm?.cancelLabel}
                tone={activeConfirm?.tone}
                isLoading={isActionLoading}
                onCancel={() => {
                    if (!isActionLoading) {
                        setConfirmAction(null);
                        setPendingHomepageHeroSlot(null);
                    }
                }}
                onConfirm={handleConfirmAction}
            />

            {/* AI Fill Modal */}
            <AiFillModal
                isOpen={isAiFillOpen}
                onClose={() => setIsAiFillOpen(false)}
                onApply={handleAiFillApply}
                currentType={formData.type}
            />
        </div>
    );
}
