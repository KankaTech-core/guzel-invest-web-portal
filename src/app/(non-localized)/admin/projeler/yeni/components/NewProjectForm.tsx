"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
    type DragOverEvent,
    type DragStartEvent,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    defaultAnimateLayoutChanges,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    ArrowLeft,
    Building2,
    Check as CheckIcon,
    FileText,
    GripVertical,
    Home,
    Image as ImageIcon,
    ImagePlus,
    ExternalLink,
    Loader2,
    Languages,
    MapPin,
    MessageSquare,
    PlayCircle,
    Plus,
    PlusCircle,
    Save,
    Send,
    Settings,
    Sparkles,
    Star,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { Select } from "@/components/ui";
import { CompanyOptionSelect } from "@/components/admin/company-option-select";
import { AiFillModal, ParsedData } from "@/components/admin/ai-fill-modal";
import { MediaOptimizationModal } from "@/components/admin/media-optimization-modal";
import { UnsavedChangesModal } from "@/components/admin/unsaved-changes-modal";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import {
    isCustomProjectIconDataUri,
    PROJECT_ICON_OPTIONS,
} from "@/lib/project-icon-catalog";
import {
    getFriendlyFetchErrorMessage,
    parseApiErrorMessage,
} from "@/lib/fetch-error";
import {
    fromFeatureSortableId,
    reorderFeatureRows,
    toFeatureSortableId,
    type FeatureCategory,
} from "@/lib/feature-reorder";
import { splitFeaturesByCategory } from "@/lib/feature-category";
import { cn, getMediaUrl } from "@/lib/utils";

type ProjectStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type HomepageProjectSlotValue = 1 | 2 | 3;
type MediaOptimizationState = "hidden" | "optimizing" | "completed";
type LeaveIntent =
    | {
        type: "href";
        href: string;
        external: boolean;
    }
    | {
        type: "back";
    };

interface UploadedMedia {
    id: string;
    url: string;
    thumbnailUrl: string | null;
    order: number;
    isCover: boolean;
}

interface UploadedDocument {
    id: string;
    url: string;
    category: string | null;
    type: string;
    order: number;
}

interface FeatureRow {
    id: string;
    title: string;
    icon: string;
}

interface FaqRow {
    id: string;
    question: string;
    answer: string;
}

interface FloorPlanRow {
    id: string;
    title: string;
    area: string;
    imageUrl: string;
    mediaId: string | null;
}

interface LocationsPayload {
    cities?: string[];
    districts?: string[];
    neighborhoods?: string[];
    defaultCity?: string;
    defaultDistrict?: string;
}

interface UploadPanelProps {
    title: string;
    subtitle: string;
    onFilesSelected: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    compact?: boolean;
}

interface MediaGridProps {
    items: UploadedMedia[];
    onRemove: (id: string) => void;
    emptyMessage: string;
}

interface NewProjectFormProps {
    initialProjectId?: string;
}

interface ProjectTranslationRecord {
    locale: string;
    title: string;
    description: string;
    features?: string[];
}

interface ProjectFeatureTranslationRecord {
    locale: string;
    title: string;
}

interface ProjectFeatureRecord {
    id: string;
    icon: string;
    category: string;
    translations?: ProjectFeatureTranslationRecord[];
}

interface ProjectMediaRecord extends UploadedMedia {
    category: string | null;
    type: string;
    customGalleryId?: string | null;
    projectUnitId?: string | null;
}

interface CustomGalleryRecord {
    id: string;
    media?: ProjectMediaRecord[];
}

interface FloorPlanTranslationRecord {
    locale: string;
    title: string;
}

interface FloorPlanRecord {
    id: string;
    imageUrl: string;
    area?: string | null;
    translations?: FloorPlanTranslationRecord[];
}

interface FaqTranslationRecord {
    locale: string;
    question: string;
    answer: string;
}

interface FaqRecord {
    id: string;
    translations?: FaqTranslationRecord[];
}

interface ProjectDetailResponse {
    id: string;
    slug?: string;
    status: string;
    type: string;
    company: string;
    city: string;
    district: string;
    neighborhood?: string | null;
    address?: string | null;
    googleMapsLink?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    projectType?: string | null;
    deliveryDate?: string | null;
    homepageProjectSlot?: number | null;
    translations?: ProjectTranslationRecord[];
    projectFeatures?: ProjectFeatureRecord[];
    customGalleries?: CustomGalleryRecord[];
    floorPlans?: FloorPlanRecord[];
    faqs?: FaqRecord[];
    media?: ProjectMediaRecord[];
}

const HOMEPAGE_PROJECT_SLOT_OPTIONS: HomepageProjectSlotValue[] = [1, 2, 3];

const normalizeHomepageProjectSlot = (
    value: unknown
): HomepageProjectSlotValue | null => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return null;
    if (!HOMEPAGE_PROJECT_SLOT_OPTIONS.includes(parsed as HomepageProjectSlotValue)) {
        return null;
    }
    return parsed as HomepageProjectSlotValue;
};

const TABS = [
    { id: "details", label: "Temel Bilgiler", icon: FileText },
    { id: "features", label: "Özellikler", icon: Settings },
    { id: "location", label: "Konum", icon: MapPin },
    { id: "media", label: "Medya", icon: ImageIcon },
    { id: "units", label: "Kat Planları", icon: Building2 },
    { id: "faq", label: "Sıkça Sorulan Sorular", icon: MessageSquare },
] as const;

const PROPERTY_TYPES = [
    { value: "APARTMENT", label: "Konut Projesi" },
    { value: "VILLA", label: "Villa Kompleksi" },
    { value: "COMMERCIAL", label: "Ticari Merkez" },
    { value: "LAND", label: "Arsa" },
    { value: "OFFICE", label: "Ofis" },
    { value: "SHOP", label: "Dükkan" },
    { value: "FARM", label: "Çiftlik" },
] as const;

const PROJECT_CATEGORY_OPTIONS: Array<{ value: string; label: string }> = [
    { value: "RESIDENCE", label: "Residence" },
    { value: "SITE", label: "Site" },
    { value: "VILLA_COMPLEX", label: "Villa Kompleksi" },
    { value: "COMMERCIAL_PROJECT", label: "Ticari Proje" },
    { value: "MIXED_USE", label: "Karma Proje" },
    { value: "HOTEL", label: "Otel Projesi" },
    { value: "OTHER", label: "Diğer" },
];

const LOCALES = [
    { code: "tr", label: "Türkçe" },
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
    { code: "ru", label: "Русский" },
] as const;

type LocaleCode = (typeof LOCALES)[number]["code"];

interface TranslationFormRow {
    locale: LocaleCode;
    title: string;
    description: string;
    features: string[];
}

const ALLOWED_MEDIA_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

const MAX_MEDIA_FILE_SIZE_MB = 30;
const MAX_MEDIA_FILE_SIZE_BYTES = MAX_MEDIA_FILE_SIZE_MB * 1024 * 1024;
const MEDIA_UPLOAD_CHUNK_SIZE = 4;
const MEDIA_UPLOAD_CHUNK_MAX_MB = 30;
const MEDIA_UPLOAD_CHUNK_MAX_BYTES = MEDIA_UPLOAD_CHUNK_MAX_MB * 1024 * 1024;
const MEDIA_OPTIMIZATION_SUCCESS_DURATION_MS = 1100;

const wait = (ms: number) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });

const createRowId = () =>
    `row-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const parseNumberValue = (value: string): number | null => {
    const normalized = value.trim().replace(/\./g, "").replace(",", ".");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
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

const buildMediaUploadChunks = (files: File[]): File[][] => {
    const chunks: File[][] = [];
    let currentChunk: File[] = [];
    let currentChunkBytes = 0;

    for (const file of files) {
        const wouldExceedCount = currentChunk.length >= MEDIA_UPLOAD_CHUNK_SIZE;
        const wouldExceedBytes =
            currentChunk.length > 0 &&
            currentChunkBytes + file.size > MEDIA_UPLOAD_CHUNK_MAX_BYTES;

        if (wouldExceedCount || wouldExceedBytes) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentChunkBytes = 0;
        }

        currentChunk.push(file);
        currentChunkBytes += file.size;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
};

const toUniqueMedia = (items: UploadedMedia[]): UploadedMedia[] => {
    const byId = new Map<string, UploadedMedia>();
    items.forEach((item) => byId.set(item.id, item));
    return Array.from(byId.values());
};

const getTurkishTranslation = <T extends { locale: string }>(items: T[] | undefined) => {
    const list = items || [];
    return list.find((item) => item.locale === "tr") || list[0] || null;
};

const toUploadedMedia = (item: ProjectMediaRecord): UploadedMedia => ({
    id: item.id,
    url: item.url,
    thumbnailUrl: item.thumbnailUrl ?? null,
    order: typeof item.order === "number" ? item.order : 0,
    isCover: Boolean(item.isCover),
});

const buildDefaultTranslations = (): TranslationFormRow[] =>
    LOCALES.map((locale) => ({
        locale: locale.code,
        title: "",
        description: "",
        features: [],
    }));

const hasNonTurkishTranslations = (translations: TranslationFormRow[]) =>
    translations.some(
        (translation) =>
            translation.locale !== "tr" &&
            (translation.title.trim().length > 0 ||
                translation.description.trim().length > 0)
    );

function UploadPanel({
    title,
    subtitle,
    onFilesSelected,
    multiple = true,
    accept = "image/*",
    disabled = false,
    compact = false,
}: UploadPanelProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0 || disabled) return;
        onFilesSelected(Array.from(files));
    };

    return (
        <div
            onDragOver={(event) => {
                event.preventDefault();
                if (disabled) return;
                setIsDragging(true);
            }}
            onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
            }}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                if (disabled) return;
                handleFiles(event.dataTransfer.files);
            }}
            onClick={() => {
                if (disabled) return;
                inputRef.current?.click();
            }}
            className={cn(
                "relative border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out text-center cursor-pointer",
                compact ? "p-8" : "p-12",
                disabled && "opacity-60 cursor-not-allowed",
                isDragging
                    ? "border-orange-500 bg-orange-50/50"
                    : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50"
            )}
        >
            <input
                ref={inputRef}
                type="file"
                className="sr-only"
                accept={accept}
                multiple={multiple}
                onChange={(event) => {
                    handleFiles(event.target.files);
                    event.target.value = "";
                }}
                disabled={disabled}
            />

            <div className="flex flex-col items-center gap-4">
                <div className={cn("p-4 rounded-full", isDragging ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400")}>
                    <Upload className={cn(compact ? "w-8 h-8" : "w-10 h-10")} />
                </div>
                <div>
                    <p className={cn("font-semibold text-slate-900", compact ? "text-base" : "text-lg")}>
                        {title}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

function MediaGrid({ items, onRemove, emptyMessage }: MediaGridProps) {
    if (items.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
                <div key={item.id} className="relative group rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={getMediaUrl(item.thumbnailUrl || item.url)}
                        alt=""
                        className="w-full aspect-square object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 border border-slate-200 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Sil"
                    >
                        <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                </div>
            ))}
        </div>
    );
}

interface SortableFeatureRowProps {
    category: FeatureCategory;
    row: FeatureRow;
    onOpenIconPicker: () => void;
    onTitleChange: (value: string) => void;
    onRemove: () => void;
}

function SortableFeatureRow({
    category,
    row,
    onOpenIconPicker,
    onTitleChange,
    onRemove,
}: SortableFeatureRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: toFeatureSortableId(category, row.id),
        animateLayoutChanges: (args) => defaultAnimateLayoutChanges(args),
        transition: {
            duration: 180,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        willChange: "transform",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group transition-[transform,box-shadow,border-color] duration-200",
                isDragging
                    ? "shadow-lg ring-2 ring-orange-200 bg-white border-orange-300 z-10"
                    : "hover:border-orange-200"
            )}
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 hover:bg-white cursor-grab active:cursor-grabbing touch-none"
                aria-label="Özelliği sürükleyerek sırala"
                title="Sürükleyerek sırala"
            >
                <GripVertical className="w-5 h-5 shrink-0" />
            </button>

            <button
                type="button"
                onClick={onOpenIconPicker}
                className="w-10 h-10 rounded border border-slate-200 bg-white flex items-center justify-center text-orange-500 cursor-pointer hover:border-orange-500 transition-all shadow-sm shrink-0"
                title="İkon seç"
            >
                <ProjectIcon name={row.icon} className="w-5 h-5" />
            </button>

            <input
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-medium"
                placeholder="Özellik adı girin..."
                type="text"
                value={row.title}
                onChange={(event) => onTitleChange(event.target.value)}
            />

            <button
                type="button"
                onClick={onRemove}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                title="Özelliği sil"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}

export default function NewProjectForm({
    initialProjectId,
}: NewProjectFormProps = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const isEditMode = Boolean(initialProjectId);

    const [activeTab, setActiveTab] = useState("details");
    const [projectId, setProjectId] = useState<string | null>(
        initialProjectId ?? null
    );
    const [projectSlug, setProjectSlug] = useState<string | null>(null);
    const [isHydrating, setIsHydrating] = useState(Boolean(initialProjectId));

    const [status, setStatus] = useState<ProjectStatusValue>("DRAFT");
    const [company, setCompany] = useState("Güzel Invest");
    const [type, setType] = useState<string>("APARTMENT");
    const [projectType, setProjectType] = useState("");
    const [translations, setTranslations] =
        useState<TranslationFormRow[]>(buildDefaultTranslations);
    const [activeLocale, setActiveLocale] = useState<LocaleCode>("tr");
    const [isTranslating, setIsTranslating] = useState(false);
    const [translationsLocked, setTranslationsLocked] = useState(false);
    const [isAiFillModalOpen, setIsAiFillModalOpen] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [homepageProjectSlot, setHomepageProjectSlot] =
        useState<HomepageProjectSlotValue | null>(null);
    const [promoVideoUrl, setPromoVideoUrl] = useState("");

    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [googleMapsLink, setGoogleMapsLink] = useState("");

    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);

    const [generalFeatures, setGeneralFeatures] = useState<FeatureRow[]>([]);
    const [socialFeatures, setSocialFeatures] = useState<FeatureRow[]>([
        { id: createRowId(), title: "Açık Yüzme Havuzu", icon: "Waves" },
        { id: createRowId(), title: "Fitness Salonu", icon: "Dumbbell" },
    ]);

    const [coverMedia, setCoverMedia] = useState<UploadedMedia[]>([]);
    const [logoMedia, setLogoMedia] = useState<UploadedMedia[]>([]);
    const [mapMedia, setMapMedia] = useState<UploadedMedia[]>([]);
    const [exteriorMedia, setExteriorMedia] = useState<UploadedMedia[]>([]);
    const [socialMedia, setSocialMedia] = useState<UploadedMedia[]>([]);
    const [interiorMedia, setInteriorMedia] = useState<UploadedMedia[]>([]);

    const [documents, setDocuments] = useState<UploadedDocument[]>([]);

    const [floorPlans, setFloorPlans] = useState<FloorPlanRow[]>([
        {
            id: createRowId(),
            title: "",
            area: "",
            imageUrl: "",
            mediaId: null,
        },
    ]);

    const [faqs, setFaqs] = useState<FaqRow[]>([
        {
            id: createRowId(),
            question: "Vatandaşlık için uygun mu?",
            answer:
                "Evet, projemiz 400.000$ limitine uygundur ve vatandaşlık başvurusu için gereken şartları sağlamaktadır.",
        },
    ]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [mediaOptimizationState, setMediaOptimizationState] =
        useState<MediaOptimizationState>("hidden");
    const [isLeavePromptOpen, setIsLeavePromptOpen] = useState(false);
    const [leaveIntent, setLeaveIntent] = useState<LeaveIntent | null>(null);
    const [leaveAction, setLeaveAction] = useState<null | "draft" | "publish">(null);

    const [iconPickerTarget, setIconPickerTarget] = useState<{
        category: FeatureCategory;
        id: string;
    } | null>(null);
    const [activeFeatureDrag, setActiveFeatureDrag] = useState<{
        category: FeatureCategory;
        id: string;
    } | null>(null);
    const [isFeatureDndReady, setIsFeatureDndReady] = useState(false);
    const customSvgInputRef = useRef<HTMLInputElement | null>(null);
    const autoMapsLinkRef = useRef("");
    const bypassUnsavedCheckRef = useRef(false);
    const initialSnapshotRef = useRef<string>("");
    const currentUrlRef = useRef<string>("");
    const featureSensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const cityOptions =
        city && !availableCities.includes(city)
            ? [city, ...availableCities]
            : availableCities;
    const districtOptions =
        district && !availableDistricts.includes(district)
            ? [district, ...availableDistricts]
            : availableDistricts;
    const neighborhoodOptions =
        neighborhood && !availableNeighborhoods.includes(neighborhood)
            ? [neighborhood, ...availableNeighborhoods]
            : availableNeighborhoods;
    const projectCategoryOptions = useMemo(() => {
        const options = PROJECT_CATEGORY_OPTIONS.map((item) => ({
            value: item.value,
            label: item.label,
        }));

        if (projectType && !options.some((item) => item.value === projectType)) {
            options.unshift({ value: projectType, label: projectType });
        }

        return [{ value: "", label: "Seçiniz" }, ...options];
    }, [projectType]);
    const currentTranslation =
        translations.find((translation) => translation.locale === activeLocale) ||
        translations[0];
    const turkishTranslation =
        translations.find((translation) => translation.locale === "tr") ||
        currentTranslation;

    const locationLabel = [address, neighborhood, district, city]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(", ");

    const latitudeValue = useMemo(() => {
        const parsed = Number.parseFloat(latitude);
        return Number.isFinite(parsed) ? parsed : null;
    }, [latitude]);

    const longitudeValue = useMemo(() => {
        const parsed = Number.parseFloat(longitude);
        return Number.isFinite(parsed) ? parsed : null;
    }, [longitude]);

    const autoMapsLink = useMemo(
        () => buildGoogleMapsLink(latitudeValue, longitudeValue, locationLabel),
        [latitudeValue, longitudeValue, locationLabel]
    );

    const mapSrc = useMemo(() => {
        const manual = toGoogleMapsEmbedLink(googleMapsLink);
        if (manual) return manual;
        return toGoogleMapsEmbedLink(autoMapsLink);
    }, [googleMapsLink, autoMapsLink]);

    const runWithNavigationBypass = useCallback((callback: () => void) => {
        bypassUnsavedCheckRef.current = true;
        callback();
        setTimeout(() => {
            bypassUnsavedCheckRef.current = false;
        }, 0);
    }, []);

    const safePush = useCallback(
        (href: string) => {
            runWithNavigationBypass(() => router.push(href));
        },
        [router, runWithNavigationBypass]
    );

    const safeReplace = useCallback(
        (href: string) => {
            runWithNavigationBypass(() => router.replace(href));
        },
        [router, runWithNavigationBypass]
    );

    const safeBack = useCallback(() => {
        runWithNavigationBypass(() => router.back());
    }, [router, runWithNavigationBypass]);

    const buildUnsavedSnapshot = useCallback(
        (overrides?: {
            projectId?: string | null;
            status?: ProjectStatusValue;
        }) => ({
            projectId: overrides?.projectId ?? projectId,
            status: overrides?.status ?? status,
            company,
            type,
            projectType,
            translations: translations.map((translation) => ({
                locale: translation.locale,
                title: translation.title,
                description: translation.description,
                features: translation.features,
            })),
            deliveryDate,
            homepageProjectSlot,
            promoVideoUrl,
            city,
            district,
            neighborhood,
            address,
            latitude,
            longitude,
            googleMapsLink,
            generalFeatures: generalFeatures.map((item) => ({
                id: item.id,
                title: item.title,
                icon: item.icon,
            })),
            socialFeatures: socialFeatures.map((item) => ({
                id: item.id,
                title: item.title,
                icon: item.icon,
            })),
            coverMedia: coverMedia.map((item) => ({
                id: item.id,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                order: item.order,
                isCover: item.isCover,
            })),
            logoMedia: logoMedia.map((item) => ({
                id: item.id,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                order: item.order,
                isCover: item.isCover,
            })),
            mapMedia: mapMedia.map((item) => ({
                id: item.id,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                order: item.order,
                isCover: item.isCover,
            })),
            exteriorMedia: exteriorMedia.map((item) => ({
                id: item.id,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                order: item.order,
                isCover: item.isCover,
            })),
            socialMedia: socialMedia.map((item) => ({
                id: item.id,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                order: item.order,
                isCover: item.isCover,
            })),
            interiorMedia: interiorMedia.map((item) => ({
                id: item.id,
                url: item.url,
                thumbnailUrl: item.thumbnailUrl,
                order: item.order,
                isCover: item.isCover,
            })),
            documents: documents.map((item) => ({
                id: item.id,
                url: item.url,
                category: item.category,
                type: item.type,
                order: item.order,
            })),
            floorPlans: floorPlans.map((item) => ({
                id: item.id,
                title: item.title,
                area: item.area,
                imageUrl: item.imageUrl,
                mediaId: item.mediaId,
            })),
            faqs: faqs.map((item) => ({
                id: item.id,
                question: item.question,
                answer: item.answer,
            })),
        }),
        [
            projectId,
            status,
            company,
            type,
            projectType,
            translations,
            deliveryDate,
            homepageProjectSlot,
            promoVideoUrl,
            city,
            district,
            neighborhood,
            address,
            latitude,
            longitude,
            googleMapsLink,
            generalFeatures,
            socialFeatures,
            coverMedia,
            logoMedia,
            mapMedia,
            exteriorMedia,
            socialMedia,
            interiorMedia,
            documents,
            floorPlans,
            faqs,
        ]
    );

    const currentSnapshot = useMemo(
        () => JSON.stringify(buildUnsavedSnapshot()),
        [buildUnsavedSnapshot]
    );

    useEffect(() => {
        if (isHydrating || initialSnapshotRef.current) return;
        initialSnapshotRef.current = currentSnapshot;
    }, [currentSnapshot, isHydrating]);

    const hasUnsavedChanges = useMemo(() => {
        if (isHydrating || !initialSnapshotRef.current) return false;
        return initialSnapshotRef.current !== currentSnapshot;
    }, [currentSnapshot, isHydrating]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            currentUrlRef.current = window.location.href;
        }
    }, [pathname]);

    const openLeavePrompt = useCallback(
        (intent: LeaveIntent) => {
            if (isLeavePromptOpen) return;
            setLeaveIntent(intent);
            setIsLeavePromptOpen(true);
        },
        [isLeavePromptOpen]
    );

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
            if ("stopImmediatePropagation" in event) {
                (
                    event as unknown as {
                        stopImmediatePropagation: () => void;
                    }
                ).stopImmediatePropagation();
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
    }, [hasUnsavedChanges, openLeavePrompt]);

    useEffect(() => {
        const handlePopState = () => {
            if (!hasUnsavedChanges || bypassUnsavedCheckRef.current) {
                currentUrlRef.current = window.location.href;
                return;
            }

            const destination = window.location.href;
            const fallbackUrl = currentUrlRef.current || "/admin/projeler";
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
    }, [hasUnsavedChanges, openLeavePrompt, router, runWithNavigationBypass]);

    useEffect(() => {
        setIsFeatureDndReady(true);
    }, []);

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

                if (payload.defaultCity && !city) {
                    setCity(payload.defaultCity);
                }
                if (payload.defaultDistrict && !district) {
                    setDistrict(payload.defaultDistrict);
                }
            } catch {
                // no-op
            }
        };

        void loadCities();

        return () => {
            active = false;
        };
    }, [city, district]);

    useEffect(() => {
        if (!city) {
            setAvailableDistricts([]);
            return;
        }

        let active = true;

        const loadDistricts = async () => {
            try {
                const response = await fetch(
                    `/api/admin/locations?city=${encodeURIComponent(city)}`
                );
                if (!response.ok) return;

                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;

                const districts = payload.districts || [];
                setAvailableDistricts(districts);

                if (district && !districts.includes(district)) {
                    setDistrict(districts[0] || "");
                    setNeighborhood("");
                }
            } catch {
                // no-op
            }
        };

        void loadDistricts();

        return () => {
            active = false;
        };
    }, [city, district]);

    useEffect(() => {
        if (!city || !district) {
            setAvailableNeighborhoods([]);
            return;
        }

        let active = true;

        const loadNeighborhoods = async () => {
            try {
                const response = await fetch(
                    `/api/admin/locations?city=${encodeURIComponent(
                        city
                    )}&district=${encodeURIComponent(district)}`
                );
                if (!response.ok) return;

                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;

                const neighborhoods = payload.neighborhoods || [];
                setAvailableNeighborhoods(neighborhoods);

                if (neighborhood && !neighborhoods.includes(neighborhood)) {
                    setNeighborhood("");
                }
            } catch {
                // no-op
            }
        };

        void loadNeighborhoods();

        return () => {
            active = false;
        };
    }, [city, district, neighborhood]);

    useEffect(() => {
        if (!autoMapsLink) return;

        setGoogleMapsLink((current) => {
            const normalized = current.trim();
            const shouldUpdate = !normalized || normalized === autoMapsLinkRef.current;
            autoMapsLinkRef.current = autoMapsLink;

            if (!shouldUpdate || normalized === autoMapsLink) {
                return current;
            }

            return autoMapsLink;
        });
    }, [autoMapsLink]);

    const handleTranslationFieldChange = (
        locale: LocaleCode,
        field: "title" | "description",
        value: string
    ) => {
        setTranslations((prev) =>
            prev.map((translation) =>
                translation.locale === locale
                    ? { ...translation, [field]: value }
                    : translation
            )
        );
    };

    const handleAiFillApply = (data: ParsedData) => {
        const normalizeText = (value: unknown) => {
            if (typeof value !== "string") return "";
            return value.trim();
        };

        const normalizeFeatures = (value: unknown): string[] => {
            if (!Array.isArray(value)) return [];
            return value
                .map((item) => normalizeText(item))
                .filter((item) => item.length > 0)
                .slice(0, 40);
        };

        const normalizedType = normalizeText(data.type).toUpperCase();
        if (PROPERTY_TYPES.some((item) => item.value === normalizedType)) {
            setType(normalizedType);
        }

        const normalizedCity = normalizeText(data.city);
        const normalizedDistrict = normalizeText(data.district);
        const normalizedNeighborhood = normalizeText(data.neighborhood);
        const normalizedMapsLink = normalizeText(data.googleMapsLink);
        const normalizedTitle = normalizeText(data.title);
        const normalizedDescription = normalizeText(data.description);
        const normalizedFeatures = normalizeFeatures(data.features);

        if (normalizedCity) setCity(normalizedCity);
        if (normalizedDistrict) setDistrict(normalizedDistrict);
        if (normalizedNeighborhood) setNeighborhood(normalizedNeighborhood);
        if (normalizedMapsLink) setGoogleMapsLink(normalizedMapsLink);
        if (typeof data.latitude === "number" && Number.isFinite(data.latitude)) {
            setLatitude(String(data.latitude));
        }
        if (typeof data.longitude === "number" && Number.isFinite(data.longitude)) {
            setLongitude(String(data.longitude));
        }

        if (normalizedTitle || normalizedDescription || normalizedFeatures.length > 0) {
            setTranslations((prev) =>
                prev.map((translation) =>
                    translation.locale === "tr"
                        ? {
                            ...translation,
                            title: normalizedTitle || translation.title,
                            description:
                                normalizedDescription || translation.description,
                            features:
                                normalizedFeatures.length > 0
                                    ? normalizedFeatures
                                    : translation.features,
                        }
                        : translation
                )
            );
        }

        if (normalizedFeatures.length > 0) {
            const categorizedFeatures = splitFeaturesByCategory(normalizedFeatures);
            const toNormalizedSet = (rows: FeatureRow[]) =>
                new Set(rows.map((item) => item.title.trim().toLocaleLowerCase("tr-TR")));

            setGeneralFeatures((prev) => {
                const existingTitles = toNormalizedSet(prev);
                const newRows = categorizedFeatures.GENERAL.filter(
                    (feature) =>
                        !existingTitles.has(feature.trim().toLocaleLowerCase("tr-TR"))
                ).map((feature) => ({
                    id: createRowId(),
                    title: feature,
                    icon: "Building2",
                }));

                return newRows.length > 0 ? [...prev, ...newRows] : prev;
            });

            setSocialFeatures((prev) => {
                const existingTitles = toNormalizedSet(prev);
                const newRows = categorizedFeatures.SOCIAL.filter(
                    (feature) =>
                        !existingTitles.has(feature.trim().toLocaleLowerCase("tr-TR"))
                ).map((feature) => ({
                    id: createRowId(),
                    title: feature,
                    icon: "Sparkles",
                }));

                return newRows.length > 0 ? [...prev, ...newRows] : prev;
            });
        }
    };

    const handleTranslate = async () => {
        if (isTranslating || translationsLocked) return;

        const title = turkishTranslation?.title?.trim() || "";
        const description = turkishTranslation?.description?.trim() || "";

        if (!title && !description) {
            setError("Çeviri için önce Türkçe başlık veya açıklama ekleyin.");
            return;
        }

        setIsTranslating(true);
        setError("");

        try {
            const response = await fetch("/api/admin/ai/translate-listing", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    listingId: projectId || null,
                    tags: [],
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

            const data = (await response.json().catch(() => ({}))) as {
                translations?: Record<
                    "en" | "de" | "ru",
                    { title?: string; description?: string; tags?: { name?: string }[] }
                >;
            };

            const aiTranslations = data.translations;
            if (!aiTranslations) {
                throw new Error("Çeviri yanıtı alınamadı.");
            }

            const getTagFeatures = (value: { name?: string }[] | undefined) =>
                Array.isArray(value)
                    ? value
                        .map((tag) =>
                            typeof tag?.name === "string" ? tag.name.trim() : ""
                        )
                        .filter(Boolean)
                    : [];

            setTranslations((prev) =>
                prev.map((translation) => {
                    if (translation.locale === "en") {
                        return {
                            ...translation,
                            title: aiTranslations.en?.title?.trim() || translation.title,
                            description:
                                aiTranslations.en?.description?.trim() ||
                                translation.description,
                            features: getTagFeatures(aiTranslations.en?.tags),
                        };
                    }
                    if (translation.locale === "de") {
                        return {
                            ...translation,
                            title: aiTranslations.de?.title?.trim() || translation.title,
                            description:
                                aiTranslations.de?.description?.trim() ||
                                translation.description,
                            features: getTagFeatures(aiTranslations.de?.tags),
                        };
                    }
                    if (translation.locale === "ru") {
                        return {
                            ...translation,
                            title: aiTranslations.ru?.title?.trim() || translation.title,
                            description:
                                aiTranslations.ru?.description?.trim() ||
                                translation.description,
                            features: getTagFeatures(aiTranslations.ru?.tags),
                        };
                    }
                    return translation;
                })
            );

            setTranslationsLocked(true);
            setActiveLocale("en");
        } catch (errorValue) {
            setError(
                getFriendlyFetchErrorMessage(errorValue, "Çeviri başarısız.", {
                    networkMessage:
                        "Çeviri isteği sırasında bağlantı kesildi (Load failed). İnternet/proxy bağlantısını kontrol edip tekrar deneyin.",
                })
            );
        } finally {
            setIsTranslating(false);
        }
    };

    useEffect(() => {
        if (!initialProjectId) {
            setIsHydrating(false);
            return;
        }

        let active = true;

        const loadProject = async () => {
            setIsHydrating(true);

            try {
                const response = await fetch(`/api/admin/projects/${initialProjectId}`);
                if (!response.ok) {
                    const apiError = await parseApiErrorMessage(
                        response,
                        "Proje verisi yüklenemedi."
                    );
                    throw new Error(apiError);
                }

                const project = (await response.json()) as ProjectDetailResponse;
                if (!active) return;

                setProjectSlug(project.slug || null);

                const media = Array.isArray(project.media) ? project.media : [];
                const exterior = media.filter(
                    (item) => item.category === "EXTERIOR" && item.type !== "DOCUMENT"
                );
                const cover = exterior.find((item) => item.isCover) || exterior[0];
                const interior = media.filter(
                    (item) => item.category === "INTERIOR" && item.type !== "DOCUMENT"
                );
                const map = media.filter(
                    (item) => item.category === "MAP" && item.type !== "DOCUMENT"
                );
                const logo = media.filter(
                    (item) => item.category === "LOGO" && item.type !== "DOCUMENT"
                );
                const documentItems = media.filter(
                    (item) => item.category === "DOCUMENT" || item.type === "DOCUMENT"
                );

                const initialTranslations = buildDefaultTranslations().map((row) => {
                    const source = (project.translations || []).find(
                        (translation) => translation.locale === row.locale
                    );
                    return {
                        ...row,
                        title: source?.title?.trim() || "",
                        description: source?.description?.trim() || "",
                        features: Array.isArray(source?.features)
                            ? source.features
                                .map((feature) =>
                                    typeof feature === "string" ? feature.trim() : ""
                                )
                                .filter(Boolean)
                            : [],
                    };
                });
                const featureRows = (project.projectFeatures || [])
                    .map((feature) => {
                        const translation = getTurkishTranslation(feature.translations);
                        const title = translation?.title?.trim() || "";
                        return {
                            id: createRowId(),
                            title,
                            icon: feature.icon || "Building2",
                            category:
                                feature.category === "SOCIAL" ? "SOCIAL" : "GENERAL",
                        };
                    })
                    .filter((item) => item.title.length > 0);

                const generalRows = featureRows
                    .filter((item) => item.category === "GENERAL")
                    .map((item) => ({
                        id: item.id,
                        title: item.title,
                        icon: item.icon,
                    }));
                const socialRows = featureRows
                    .filter((item) => item.category === "SOCIAL")
                    .map((item) => ({
                        id: item.id,
                        title: item.title,
                        icon: item.icon,
                    }));

                const socialGalleryMedia = (project.customGalleries || []).flatMap(
                    (gallery) => (gallery.media || []).map(toUploadedMedia)
                );
                const fallbackSocialMedia = media
                    .filter((item) => Boolean(item.customGalleryId))
                    .map(toUploadedMedia);
                const socialItems =
                    socialGalleryMedia.length > 0
                        ? socialGalleryMedia
                        : fallbackSocialMedia;

                const floorPlanRows = (project.floorPlans || [])
                    .map((plan) => {
                        const translation = getTurkishTranslation(plan.translations);
                        return {
                            id: createRowId(),
                            title: translation?.title || "",
                            area: plan.area || "",
                            imageUrl: plan.imageUrl || "",
                            mediaId: null,
                        };
                    })
                    .filter((item) => item.imageUrl || item.title);

                const faqRows = (project.faqs || [])
                    .map((faq) => {
                        const translation = getTurkishTranslation(faq.translations);
                        if (!translation) return null;
                        const question = translation.question?.trim() || "";
                        const answer = translation.answer?.trim() || "";
                        if (!question && !answer) return null;
                        return {
                            id: createRowId(),
                            question,
                            answer,
                        };
                    })
                    .filter((item): item is FaqRow => Boolean(item));

                const normalizedStatus: ProjectStatusValue =
                    project.status === "PUBLISHED"
                        ? "PUBLISHED"
                        : project.status === "ARCHIVED"
                            ? "ARCHIVED"
                            : "DRAFT";

                setProjectId(project.id || initialProjectId);
                setStatus(normalizedStatus);
                setCompany(project.company || "Güzel Invest");
                setType(project.type || "APARTMENT");
                setProjectType(project.projectType || "");
                setTranslations(initialTranslations);
                setTranslationsLocked(hasNonTurkishTranslations(initialTranslations));
                setActiveLocale("tr");
                setDeliveryDate(project.deliveryDate || "");
                setHomepageProjectSlot(
                    normalizeHomepageProjectSlot(project.homepageProjectSlot)
                );
                setCity(project.city || "");
                setDistrict(project.district || "");
                setNeighborhood(project.neighborhood || "");
                setAddress(project.address || "");
                setLatitude(
                    typeof project.latitude === "number"
                        ? String(project.latitude)
                        : ""
                );
                setLongitude(
                    typeof project.longitude === "number"
                        ? String(project.longitude)
                        : ""
                );
                setGoogleMapsLink(project.googleMapsLink || "");
                setGeneralFeatures(generalRows);
                setSocialFeatures(socialRows);
                setCoverMedia(cover ? [toUploadedMedia(cover)] : []);
                setLogoMedia(logo[0] ? [toUploadedMedia(logo[0])] : []);
                setExteriorMedia(
                    exterior
                        .filter((item) => item.id !== cover?.id)
                        .map(toUploadedMedia)
                );
                setInteriorMedia(interior.map(toUploadedMedia));
                setMapMedia(map.map(toUploadedMedia));
                setSocialMedia(toUniqueMedia(socialItems));
                setDocuments(
                    documentItems.map((item) => ({
                        id: item.id,
                        url: item.url,
                        category: item.category,
                        type: item.type,
                        order: item.order,
                    }))
                );
                setFloorPlans(
                    floorPlanRows.length > 0
                        ? floorPlanRows
                        : [
                            {
                                id: createRowId(),
                                title: "",
                                area: "",
                                imageUrl: "",
                                mediaId: null,
                            },
                        ]
                );
                setFaqs(faqRows);
            } catch (errorValue) {
                if (!active) return;
                setError(
                    getFriendlyFetchErrorMessage(
                        errorValue,
                        "Proje verisi yüklenemedi."
                    )
                );
            } finally {
                if (active) {
                    setIsHydrating(false);
                }
            }
        };

        void loadProject();

        return () => {
            active = false;
        };
    }, [initialProjectId]);

    const handleSectionNavigation = (sectionId: string) => {
        setActiveTab(sectionId);
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (!targetSection) return;

        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
        });
    };

    const updateFeatureRows = (
        category: FeatureCategory,
        updater: (rows: FeatureRow[]) => FeatureRow[]
    ) => {
        if (category === "GENERAL") {
            setGeneralFeatures((prev) => updater(prev));
            return;
        }
        setSocialFeatures((prev) => updater(prev));
    };

    const addFeatureRow = (category: FeatureCategory) => {
        updateFeatureRows(category, (rows) => [
            ...rows,
            {
                id: createRowId(),
                title: "",
                icon: category === "GENERAL" ? "Building2" : "Sparkles",
            },
        ]);
    };

    const updateFeatureRow = (
        category: FeatureCategory,
        id: string,
        patch: Partial<FeatureRow>
    ) => {
        updateFeatureRows(category, (rows) =>
            rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
        );
    };

    const removeFeatureRow = (category: FeatureCategory, id: string) => {
        updateFeatureRows(category, (rows) => rows.filter((row) => row.id !== id));
    };

    const handleFeatureSortEnd = (
        category: FeatureCategory,
        event: DragEndEvent
    ) => {
        setActiveFeatureDrag(null);

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeFeature = fromFeatureSortableId(String(active.id));
        const overFeature = fromFeatureSortableId(String(over.id));

        if (!activeFeature || !overFeature) return;
        if (activeFeature.category !== category || overFeature.category !== category) {
            return;
        }

        updateFeatureRows(category, (rows) =>
            reorderFeatureRows(rows, activeFeature.id, overFeature.id)
        );
    };

    const handleFeatureSortStart = (
        category: FeatureCategory,
        event: DragStartEvent
    ) => {
        const activeFeature = fromFeatureSortableId(String(event.active.id));
        if (!activeFeature || activeFeature.category !== category) {
            setActiveFeatureDrag(null);
            return;
        }

        setActiveFeatureDrag(activeFeature);
    };

    const handleFeatureSortOver = (
        category: FeatureCategory,
        event: DragOverEvent
    ) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeFeature = fromFeatureSortableId(String(active.id));
        const overFeature = fromFeatureSortableId(String(over.id));

        if (!activeFeature || !overFeature) return;
        if (activeFeature.category !== category || overFeature.category !== category) {
            return;
        }

        updateFeatureRows(category, (rows) =>
            reorderFeatureRows(rows, activeFeature.id, overFeature.id)
        );
    };

    const handleFeatureSortCancel = () => {
        setActiveFeatureDrag(null);
    };

    const getIconPickerRow = () => {
        if (!iconPickerTarget) return null;
        const rows =
            iconPickerTarget.category === "GENERAL" ? generalFeatures : socialFeatures;
        return rows.find((row) => row.id === iconPickerTarget.id) || null;
    };

    const encodeSvgToDataUri = (svg: string) => {
        const encoded = new TextEncoder().encode(svg);
        let binary = "";
        encoded.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });
        return `data:image/svg+xml;base64,${window.btoa(binary)}`;
    };

    const handleCustomSvgUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        event.target.value = "";

        if (!file || !iconPickerTarget) return;

        if (!file.name.toLowerCase().endsWith(".svg") && file.type !== "image/svg+xml") {
            setError("Lütfen sadece SVG dosyası seçin.");
            return;
        }

        try {
            const svgContent = await file.text();
            const svgDataUri = encodeSvgToDataUri(svgContent);

            if (!isCustomProjectIconDataUri(svgDataUri)) {
                setError(
                    "SVG dosyası güvenlik kontrolünden geçemedi. Script veya event attribute içermeyen sade bir SVG kullanın."
                );
                return;
            }

            updateFeatureRow(iconPickerTarget.category, iconPickerTarget.id, {
                icon: svgDataUri,
            });
            setIconPickerTarget(null);
            setError("");
        } catch {
            setError("SVG dosyası okunamadı.");
        }
    };

    const buildPayload = (
        statusOverride?: ProjectStatusValue,
        options?: { bootstrapDraft?: boolean }
    ) => {
        const parsedLatitude = parseNumberValue(latitude);
        const parsedLongitude = parseNumberValue(longitude);
        const turkishRow =
            translations.find((translation) => translation.locale === "tr") ||
            buildDefaultTranslations()[0];
        const normalizedTitle = turkishRow.title.trim();
        const normalizedDescription = turkishRow.description.trim();
        const normalizedCity = city.trim();
        const normalizedDistrict = district.trim();

        const resolvedTitle =
            options?.bootstrapDraft && !normalizedTitle
                ? "Yeni Proje Taslak"
                : normalizedTitle;
        const resolvedCity =
            options?.bootstrapDraft && !normalizedCity
                ? "Antalya"
                : normalizedCity;
        const resolvedDistrict =
            options?.bootstrapDraft && !normalizedDistrict
                ? "Alanya"
                : normalizedDistrict;
        const resolvedStatus = statusOverride ?? status;

        const projectFeaturesPayload = [
            ...generalFeatures.map((item, index) => ({
                icon: item.icon,
                category: "GENERAL",
                order: index,
                translations: [{ locale: "tr", title: item.title.trim() }],
            })),
            ...socialFeatures.map((item, index) => ({
                icon: item.icon,
                category: "SOCIAL",
                order: index,
                translations: [{ locale: "tr", title: item.title.trim() }],
            })),
        ].filter((item) => item.translations[0].title);

        const customGalleryPayload =
            socialMedia.length > 0
                ? [
                    {
                        order: 0,
                        mediaIds: socialMedia.map((media) => media.id),
                        translations: [
                            {
                                locale: "tr",
                                title: "Sosyal İmkanlar",
                                subtitle: null,
                            },
                        ],
                    },
                ]
                : [];

        const floorPlanPayload = floorPlans
            .map((item) => ({
                imageUrl: item.imageUrl.trim(),
                area: item.area.trim() || null,
                translations: [{ locale: "tr", title: item.title.trim() }],
            }))
            .filter((item) => item.imageUrl && item.translations[0].title);

        const faqPayload = faqs
            .map((item, index) => ({
                order: index,
                translations: [
                    {
                        locale: "tr",
                        question: item.question.trim(),
                        answer: item.answer.trim(),
                    },
                ],
            }))
            .filter(
                (item) =>
                    item.translations[0].question.length > 0 &&
                    item.translations[0].answer.length > 0
            );

        const exteriorMediaIds = Array.from(
            new Set([...coverMedia, ...exteriorMedia].map((media) => media.id))
        );
        const trFeatureList = [...generalFeatures, ...socialFeatures]
            .map((item) => item.title.trim())
            .filter(Boolean)
            .slice(0, 40);
        const translationsPayload = translations
            .map((translation) => {
                const locale = translation.locale;
                const title =
                    locale === "tr"
                        ? resolvedTitle
                        : translation.title.trim();
                const description =
                    locale === "tr"
                        ? normalizedDescription
                        : translation.description.trim();
                const features =
                    locale === "tr"
                        ? trFeatureList
                        : translation.features
                            .map((item) => item.trim())
                            .filter(Boolean)
                            .slice(0, 40);

                return {
                    locale,
                    title,
                    description,
                    features,
                };
            })
            .filter(
                (translation) =>
                    translation.locale === "tr" ||
                    translation.title.length > 0 ||
                    translation.description.length > 0 ||
                    translation.features.length > 0
            );

        return {
            status: resolvedStatus,
            type,
            saleType: "SALE",
            company: company.trim() || "Güzel Invest",
            city: resolvedCity,
            district: resolvedDistrict,
            neighborhood: neighborhood.trim() || null,
            address: address.trim() || null,
            googleMapsLink: googleMapsLink.trim() || null,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            projectType: projectType.trim() || null,
            deliveryDate: deliveryDate.trim() || null,
            homepageProjectSlot:
                resolvedStatus === "PUBLISHED" ? homepageProjectSlot : null,
            translations: translationsPayload,
            projectFeatures: projectFeaturesPayload,
            customGalleries: customGalleryPayload,
            floorPlans: floorPlanPayload,
            faqs: faqPayload,
            exteriorMediaIds,
            interiorMediaIds: interiorMedia.map((media) => media.id),
            mapMediaIds: mapMedia.map((media) => media.id),
            documentMediaIds: documents.map((document) => document.id),
            logoMediaIds: logoMedia.map((media) => media.id).slice(0, 1),
        };
    };

    const persistProject = async (
        statusOverride?: ProjectStatusValue,
        options?: { silent?: boolean; bootstrapDraft?: boolean }
    ) => {
        const payload = buildPayload(statusOverride, {
            bootstrapDraft: options?.bootstrapDraft,
        });

        const trTranslation = payload.translations.find(
            (translation) => translation.locale === "tr"
        );

        if (!trTranslation?.title) {
            throw new Error("Türkçe proje başlığı zorunludur.");
        }

        if (!payload.city || !payload.district) {
            throw new Error("Şehir ve ilçe zorunludur.");
        }

        const endpoint = projectId
            ? `/api/admin/projects/${projectId}`
            : "/api/admin/projects";
        const method = projectId ? "PATCH" : "POST";

        const response = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const apiError = await parseApiErrorMessage(response, "Proje kaydedilemedi.");
            throw new Error(apiError);
        }

        const data = (await response.json().catch(() => ({}))) as { id?: string };
        const resolvedId = projectId || data.id || null;

        if (!resolvedId) {
            throw new Error("Proje kaydedildi ancak kimlik alınamadı.");
        }

        setProjectId(resolvedId);
        setStatus((statusOverride ?? status) as ProjectStatusValue);

        if (!options?.silent) {
            setSuccess(
                statusOverride === "PUBLISHED"
                    ? "Proje yayınlandı."
                    : "Proje taslak olarak kaydedildi."
            );
        }

        return resolvedId;
    };

    const ensureProjectId = async () => {
        if (projectId) return projectId;
        return persistProject("DRAFT", { silent: true, bootstrapDraft: true });
    };

    const uploadImageFiles = async (files: File[]): Promise<UploadedMedia[]> => {
        const listingId = await ensureProjectId();
        const chunks = buildMediaUploadChunks(files);
        const uploadedMedia: UploadedMedia[] = [];

        for (const chunk of chunks) {
            const formData = new FormData();
            chunk.forEach((file) => formData.append("files", file));

            const response = await fetch(`/api/admin/listings/${listingId}/media`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const apiError = await parseApiErrorMessage(
                    response,
                    "Bir veya daha fazla görsel yüklenemedi."
                );
                throw new Error(apiError);
            }

            const payload = (await response.json()) as { media?: UploadedMedia[] };
            const uploaded = Array.isArray(payload.media) ? payload.media : [];

            if (uploaded.length === 0) {
                throw new Error(
                    "Yüklenen görseller için sunucudan geçerli medya yanıtı alınamadı."
                );
            }

            uploadedMedia.push(...uploaded);
        }

        return uploadedMedia;
    };

    const handleImageUpload = async (
        files: File[],
        onUploaded: (items: UploadedMedia[]) => void,
        options?: { useFirstOnly?: boolean }
    ) => {
        if (files.length === 0) return;

        const validationError = validateMediaFiles(files);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setSuccess("");
        setIsUploading(true);
        setMediaOptimizationState("optimizing");

        try {
            const uploaded = await uploadImageFiles(files);
            const selected = options?.useFirstOnly ? uploaded.slice(0, 1) : uploaded;
            onUploaded(selected);

            setMediaOptimizationState("completed");
            await wait(MEDIA_OPTIMIZATION_SUCCESS_DURATION_MS);
            setSuccess(`${selected.length} görsel yüklendi.`);
        } catch (errorValue) {
            setError(
                getFriendlyFetchErrorMessage(errorValue, "Medya yükleme hatası.", {
                    networkMessage:
                        "Yükleme sırasında bağlantı kesildi (Load failed). Dosya boyutunu küçültüp tekrar deneyin.",
                })
            );
        } finally {
            setIsUploading(false);
            setMediaOptimizationState("hidden");
        }
    };

    const handleDocumentUpload = async (files: File[]) => {
        if (files.length === 0) return;

        setError("");
        setSuccess("");
        setIsUploading(true);

        try {
            const listingId = await ensureProjectId();
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            const response = await fetch(`/api/admin/projects/${listingId}/documents`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const apiError = await parseApiErrorMessage(
                    response,
                    "Belge yükleme işlemi başarısız oldu."
                );
                throw new Error(apiError);
            }

            const payload = (await response.json()) as { documents?: UploadedDocument[] };
            const uploaded = Array.isArray(payload.documents) ? payload.documents : [];

            if (uploaded.length > 0) {
                const byId = new Map<string, UploadedDocument>();
                [...documents, ...uploaded].forEach((item) => byId.set(item.id, item));
                setDocuments(Array.from(byId.values()));
            }

            setSuccess(`${uploaded.length} belge yüklendi.`);
        } catch (errorValue) {
            setError(getFriendlyFetchErrorMessage(errorValue, "Belge yükleme hatası."));
        } finally {
            setIsUploading(false);
        }
    };

    const handleFloorPlanImageUpload = async (floorPlanId: string, files: File[]) => {
        if (files.length === 0) return;

        await handleImageUpload(
            [files[0]],
            (uploaded) => {
                const item = uploaded[0];
                if (!item) return;

                setFloorPlans((prev) =>
                    prev.map((plan) =>
                        plan.id === floorPlanId
                            ? {
                                ...plan,
                                imageUrl: item.url,
                                mediaId: item.id,
                            }
                            : plan
                    )
                );
            },
            { useFirstOnly: true }
        );
    };

    const handleSaveAction = async (
        nextStatus: ProjectStatusValue,
        options: { skipRedirect?: boolean } = {}
    ): Promise<boolean> => {
        setError("");
        setSuccess("");
        setIsSaving(true);

        try {
            const savedId = await persistProject(nextStatus);
            initialSnapshotRef.current = JSON.stringify(
                buildUnsavedSnapshot({
                    projectId: savedId,
                    status: nextStatus,
                })
            );

            if (!options.skipRedirect) {
                if (nextStatus === "PUBLISHED") {
                    safePush(`/admin/projeler/${savedId}`);
                    router.refresh();
                    return true;
                }

                safeReplace(`/admin/projeler/${savedId}`);
                router.refresh();
            }

            return true;
        } catch (errorValue) {
            setError(getFriendlyFetchErrorMessage(errorValue, "Kaydetme hatası."));
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleLeaveSave = async (statusOverride: ProjectStatusValue) => {
        if (!leaveIntent) return;
        setLeaveAction(statusOverride === "DRAFT" ? "draft" : "publish");

        const success = await handleSaveAction(statusOverride, {
            skipRedirect: true,
        });

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

        if (intent.external) {
            bypassUnsavedCheckRef.current = true;
            window.location.assign(intent.href);
            return;
        }

        safePush(intent.href);
    };

    const handleLeaveDiscard = () => {
        if (!leaveIntent) return;

        const intent = leaveIntent;
        closeLeavePrompt();

        if (intent.type === "back") {
            safeBack();
            return;
        }

        if (intent.external) {
            bypassUnsavedCheckRef.current = true;
            window.location.assign(intent.href);
            return;
        }

        safePush(intent.href);
    };

    const activeIconRow = getIconPickerRow();

    return (
        <>
            <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 pb-12 font-sans text-slate-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/projeler"
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-slate-500" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                {isEditMode ? "Proje Düzenle" : "Yeni Proje"}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {isEditMode
                                    ? "Mevcut projeyi güncelleyin"
                                    : "Yeni bir proje oluşturun"}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => void handleSaveAction("DRAFT")}
                                disabled={isSaving || isUploading || isHydrating}
                                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed text-slate-700 font-medium text-sm rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Taslak Kaydet
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleSaveAction("PUBLISHED")}
                                disabled={isSaving || isUploading || isHydrating}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg flex items-center gap-2 transition-all shadow-sm"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {isEditMode ? "Güncelle & Yayınla" : "Yayınla"}
                            </button>
                            {status === "PUBLISHED" && projectSlug && (
                                <Link
                                    href={`/tr/proje/${projectSlug}`}
                                    target="_blank"
                                    className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 border border-green-200 text-sm font-semibold rounded-lg hover:bg-green-100 hover:border-green-300 hover:text-green-800 transition-all shadow-sm group"
                                    title="Projeyi Gör"
                                >
                                    <span>Projeyi Gör</span>
                                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                            {HOMEPAGE_PROJECT_SLOT_OPTIONS.map((slot) => {
                                const isSelected = homepageProjectSlot === slot;
                                return (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setHomepageProjectSlot(slot)}
                                        disabled={isSaving || isUploading || isHydrating}
                                        className={cn(
                                            "inline-flex items-center gap-2 px-4 py-1.5 border text-sm font-semibold rounded-lg transition-all shadow-sm",
                                            isSelected
                                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                                            (isSaving || isUploading || isHydrating) &&
                                            "opacity-60 cursor-not-allowed"
                                        )}
                                        title={`Projeyi Ana Sayfa ${slot} slotuna ata`}
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
                                onClick={() => setHomepageProjectSlot(null)}
                                disabled={
                                    isSaving ||
                                    isUploading ||
                                    isHydrating ||
                                    homepageProjectSlot === null
                                }
                                className={cn(
                                    "inline-flex items-center gap-2 px-4 py-1.5 border text-sm font-semibold rounded-lg transition-all shadow-sm",
                                    "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                                    (isSaving ||
                                        isUploading ||
                                        isHydrating ||
                                        homepageProjectSlot === null) &&
                                    "opacity-60 cursor-not-allowed"
                                )}
                                title={
                                    homepageProjectSlot === null
                                        ? "Bu proje için ana sayfa slot seçimi yapılmadı."
                                        : "Projeyi ana sayfa slotundan kaldır"
                                }
                            >
                                Ana Sayfadan Kaldır
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}
                {isHydrating && (
                    <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                        Proje verileri yükleniyor...
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 rounded-t-xl transition-all duration-200">
                        <div className="flex flex-wrap items-center gap-2 p-3">
                            <div className="flex flex-wrap gap-2">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => handleSectionNavigation(tab.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                                            activeTab === tab.id
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                        )}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="ml-auto flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAiFillModalOpen(true)}
                                    disabled={isHydrating || isSaving || isUploading}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors",
                                        isHydrating || isSaving || isUploading
                                            ? "border-slate-200 text-slate-400 bg-slate-50"
                                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                    )}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    AI ile Doldur
                                </button>
                                {translationsLocked ? (
                                    LOCALES.map((locale) => (
                                        <button
                                            key={locale.code}
                                            type="button"
                                            onClick={() => setActiveLocale(locale.code)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                                                activeLocale === locale.code
                                                    ? "bg-slate-900 text-white border-slate-900"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {locale.code.toUpperCase()}
                                        </button>
                                    ))
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleTranslate}
                                        disabled={
                                            isHydrating ||
                                            isSaving ||
                                            isUploading ||
                                            isTranslating
                                        }
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-colors",
                                            isHydrating ||
                                                isSaving ||
                                                isUploading ||
                                                isTranslating
                                                ? "border-slate-200 text-slate-400 bg-slate-50"
                                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        <Languages className="w-4 h-4" />
                                        {isTranslating ? "Çeviriliyor..." : "Çeviri Ekle"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 lg:p-8 space-y-12">
                        <section id="section-details" className="scroll-mt-28 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-orange-500" />
                                    Temel Bilgiler
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Proje Başlığı ({activeLocale.toUpperCase()})
                                        </label>
                                        <input
                                            value={currentTranslation?.title || ""}
                                            onChange={(event) =>
                                                handleTranslationFieldChange(
                                                    activeLocale,
                                                    "title",
                                                    event.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="örn. Sunset Residency"
                                            type="text"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium">
                                                Teslim Tarihi
                                            </label>
                                            <input
                                                value={deliveryDate}
                                                onChange={(event) =>
                                                    setDeliveryDate(event.target.value)
                                                }
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                type="date"
                                            />
                                        </div>
                                        <Select
                                            label="Mülk Tipi"
                                            value={type}
                                            onChange={(value) => setType(value)}
                                            options={PROPERTY_TYPES.map((item) => ({
                                                value: item.value,
                                                label: item.label,
                                            }))}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <Select
                                            label="Proje Kategorisi"
                                            value={projectType}
                                            onChange={(value) => setProjectType(value)}
                                            options={projectCategoryOptions}
                                            searchable
                                            searchPlaceholder="Kategori yazın"
                                            searchMatchMode="startsWith"
                                        />
                                        <CompanyOptionSelect
                                            value={company}
                                            onChange={setCompany}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">
                                            Açıklama ({activeLocale.toUpperCase()})
                                        </label>
                                        <textarea
                                            value={currentTranslation?.description || ""}
                                            onChange={(event) =>
                                                handleTranslationFieldChange(
                                                    activeLocale,
                                                    "description",
                                                    event.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400"
                                            placeholder="Proje özelliklerini, konum avantajlarını ve satış noktalarını açıklayın..."
                                            rows={6}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                                <PlayCircle className="w-4 h-4 text-orange-500" />
                                                Tanıtım Videosu
                                            </h3>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Video URLsi
                                                </label>
                                                <input
                                                    value={promoVideoUrl}
                                                    onChange={(event) =>
                                                        setPromoVideoUrl(event.target.value)
                                                    }
                                                    className="w-full rounded-lg border border-slate-200 bg-white py-3 px-3 text-sm text-slate-900 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400"
                                                    placeholder="https://youtube.com/..."
                                                    type="text"
                                                />
                                                <p className="text-xs text-slate-500">
                                                    YouTube veya Vimeo bağlantılarını destekler.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-200 space-y-4">
                                            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                                <ImagePlus className="w-4 h-4 text-orange-500" />
                                                Kapak Fotoğrafı
                                            </h3>
                                            <UploadPanel
                                                title="Görsel yüklemek için tıklayın"
                                                subtitle="PNG, JPG, WebP, GIF, AVIF (Max 30MB)"
                                                onFilesSelected={(files) =>
                                                    void handleImageUpload(files, (uploaded) => {
                                                        const first = uploaded[0];
                                                        if (!first) return;
                                                        setCoverMedia([first]);
                                                    }, { useFirstOnly: true })
                                                }
                                                multiple={false}
                                                disabled={isSaving || isUploading}
                                                compact
                                            />
                                            <MediaGrid
                                                items={coverMedia}
                                                onRemove={(id) =>
                                                    setCoverMedia((prev) =>
                                                        prev.filter((item) => item.id !== id)
                                                    )
                                                }
                                                emptyMessage="Henüz kapak görseli yok"
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-slate-200 space-y-4">
                                            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                                <ImagePlus className="w-4 h-4 text-orange-500" />
                                                Proje Logosu
                                            </h3>
                                            <UploadPanel
                                                title="Logo yüklemek için tıklayın"
                                                subtitle="PNG, JPG, WebP, GIF, AVIF (Max 30MB)"
                                                onFilesSelected={(files) =>
                                                    void handleImageUpload(
                                                        files,
                                                        (uploaded) => {
                                                            const first = uploaded[0];
                                                            if (!first) return;
                                                            setLogoMedia([first]);
                                                        },
                                                        { useFirstOnly: true }
                                                    )
                                                }
                                                multiple={false}
                                                disabled={isSaving || isUploading}
                                                compact
                                            />
                                            <MediaGrid
                                                items={logoMedia}
                                                onRemove={(id) =>
                                                    setLogoMedia((prev) =>
                                                        prev.filter((item) => item.id !== id)
                                                    )
                                                }
                                                emptyMessage="Henüz logo eklenmedi"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="section-features" className="scroll-mt-28 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {(
                                    [
                                        {
                                            category: "GENERAL" as const,
                                            title: "Genel Özellikler",
                                            icon: Settings,
                                            rows: generalFeatures,
                                        },
                                        {
                                            category: "SOCIAL" as const,
                                            title: "Sosyal İmkanlar",
                                            icon: Sparkles,
                                            rows: socialFeatures,
                                        },
                                    ] as const
                                ).map((section) => (
                                    <div
                                        key={section.category}
                                        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
                                    >
                                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                                <section.icon className="w-5 h-5 text-orange-500" />
                                                {section.title}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => addFeatureRow(section.category)}
                                                className="text-orange-500 hover:bg-orange-500/5 px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" /> Satır Ekle
                                            </button>
                                        </div>

                                        <div className="p-6">
                                            {section.rows.length === 0 && (
                                                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                                    Henüz özellik yok.
                                                </div>
                                            )}

                                            {section.rows.length > 0 && (
                                                isFeatureDndReady ? (
                                                    <DndContext
                                                        id={`project-feature-sort-${section.category.toLowerCase()}`}
                                                        sensors={featureSensors}
                                                        collisionDetection={closestCenter}
                                                        onDragStart={(event) =>
                                                            handleFeatureSortStart(
                                                                section.category,
                                                                event
                                                            )
                                                        }
                                                        onDragOver={(event) =>
                                                            handleFeatureSortOver(
                                                                section.category,
                                                                event
                                                            )
                                                        }
                                                        onDragEnd={(event) =>
                                                            handleFeatureSortEnd(
                                                                section.category,
                                                                event
                                                            )
                                                        }
                                                        onDragCancel={handleFeatureSortCancel}
                                                    >
                                                        <SortableContext
                                                            items={section.rows.map((row) =>
                                                                toFeatureSortableId(
                                                                    section.category,
                                                                    row.id
                                                                )
                                                            )}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            <div className="space-y-3">
                                                                {section.rows.map((row) => (
                                                                    <SortableFeatureRow
                                                                        key={row.id}
                                                                        category={section.category}
                                                                        row={row}
                                                                        onOpenIconPicker={() =>
                                                                            setIconPickerTarget({
                                                                                category: section.category,
                                                                                id: row.id,
                                                                            })
                                                                        }
                                                                        onTitleChange={(value) =>
                                                                            updateFeatureRow(
                                                                                section.category,
                                                                                row.id,
                                                                                {
                                                                                    title: value,
                                                                                }
                                                                            )
                                                                        }
                                                                        onRemove={() =>
                                                                            removeFeatureRow(
                                                                                section.category,
                                                                                row.id
                                                                            )
                                                                        }
                                                                    />
                                                                ))}
                                                            </div>
                                                        </SortableContext>
                                                        <DragOverlay adjustScale>
                                                            {activeFeatureDrag &&
                                                                activeFeatureDrag.category ===
                                                                section.category ? (
                                                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-300 shadow-xl ring-2 ring-orange-200">
                                                                    <GripVertical className="w-5 h-5 text-slate-400 shrink-0" />
                                                                    <div className="w-10 h-10 rounded border border-slate-200 bg-white flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                                                                        <ProjectIcon
                                                                            name={
                                                                                section.rows.find(
                                                                                    (row) =>
                                                                                        row.id ===
                                                                                        activeFeatureDrag.id
                                                                                )?.icon ||
                                                                                "Building2"
                                                                            }
                                                                            className="w-5 h-5"
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm font-medium text-slate-800">
                                                                        {section.rows.find(
                                                                            (row) =>
                                                                                row.id ===
                                                                                activeFeatureDrag.id
                                                                        )?.title ||
                                                                            "Özellik"}
                                                                    </span>
                                                                </div>
                                                            ) : null}
                                                        </DragOverlay>
                                                    </DndContext>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {section.rows.map((row) => (
                                                            <div
                                                                key={row.id}
                                                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 group"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-600 hover:bg-white cursor-grab active:cursor-grabbing touch-none"
                                                                    aria-label="Özelliği sürükleyerek sırala"
                                                                    title="Sürükleyerek sırala"
                                                                >
                                                                    <GripVertical className="w-5 h-5 shrink-0" />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setIconPickerTarget({
                                                                            category: section.category,
                                                                            id: row.id,
                                                                        })
                                                                    }
                                                                    className="w-10 h-10 rounded border border-slate-200 bg-white flex items-center justify-center text-orange-500 cursor-pointer hover:border-orange-500 transition-all shadow-sm shrink-0"
                                                                    title="İkon seç"
                                                                >
                                                                    <ProjectIcon
                                                                        name={row.icon}
                                                                        className="w-5 h-5"
                                                                    />
                                                                </button>

                                                                <input
                                                                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-medium"
                                                                    placeholder="Özellik adı girin..."
                                                                    type="text"
                                                                    value={row.title}
                                                                    onChange={(event) =>
                                                                        updateFeatureRow(
                                                                            section.category,
                                                                            row.id,
                                                                            {
                                                                                title:
                                                                                    event.target
                                                                                        .value,
                                                                            }
                                                                        )
                                                                    }
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeFeatureRow(
                                                                            section.category,
                                                                            row.id
                                                                        )
                                                                    }
                                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                                                    title="Özelliği sil"
                                                                >
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section id="section-location" className="scroll-mt-28 space-y-6">
                            <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-orange-500" />
                                    Konum
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Select
                                        label="Şehir"
                                        value={city}
                                        onChange={(value) => {
                                            setCity(value);
                                            setDistrict("");
                                            setNeighborhood("");
                                        }}
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
                                        value={district}
                                        onChange={(value) => {
                                            setDistrict(value);
                                            setNeighborhood("");
                                        }}
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
                                        value={neighborhood}
                                        onChange={(value) => setNeighborhood(value)}
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
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Adres
                                        </label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(event) => setAddress(event.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                            placeholder="Açık adres"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-6">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Enlem
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={latitude}
                                                        onChange={(event) =>
                                                            setLatitude(event.target.value)
                                                        }
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                        placeholder="36.5489"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Boylam
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="any"
                                                        value={longitude}
                                                        onChange={(event) =>
                                                            setLongitude(event.target.value)
                                                        }
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                        placeholder="32.0489"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                                        Google Maps Linki
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={googleMapsLink}
                                                        onChange={(event) =>
                                                            setGoogleMapsLink(event.target.value)
                                                        }
                                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                                        placeholder="https://www.google.com/maps?q=36.5489,32.0489"
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-end">
                                                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border border-dashed border-slate-200 bg-slate-50 rounded-lg px-3 py-2">
                                                        <span>
                                                            Koordinat veya adres girince Google Maps linki otomatik dolabilir.
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="text-orange-600 hover:text-orange-700 font-medium"
                                                            onClick={() => {
                                                                if (autoMapsLink) {
                                                                    setGoogleMapsLink(autoMapsLink);
                                                                }
                                                            }}
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
                                                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 h-full flex flex-col">
                                                    <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-100 shrink-0">
                                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                                            <MapPin className="w-4 h-4 text-orange-500" />
                                                            Harita Önizleme
                                                        </div>
                                                        <span className="text-xs text-slate-400">Google Maps</span>
                                                    </div>
                                                    <div className="flex-1 w-full relative min-h-[150px]">
                                                        <iframe
                                                            title="Proje konumu"
                                                            src={mapSrc}
                                                            className="absolute inset-0 w-full h-full"
                                                            loading="lazy"
                                                            referrerPolicy="no-referrer-when-downgrade"
                                                        />
                                                    </div>
                                                    {locationLabel && (
                                                        <div className="px-4 py-2.5 bg-white border-t border-slate-100 text-xs text-slate-500 shrink-0">
                                                            {locationLabel}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 h-full flex items-center justify-center text-center">
                                                    Harita önizlemesi için adres veya koordinat bilgisi girin.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 space-y-4 mt-8">
                                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                        <ImagePlus className="w-4 h-4 text-orange-500" />
                                        Konum & Çevre Görselleri
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Projenin çevresini veya harita üzerindeki konumunu gösteren özel krokiler/görseller.
                                    </p>
                                    <UploadPanel
                                        title="Konum görsellerini buraya sürükleyin veya seçin"
                                        subtitle="PNG, JPG, WebP, GIF, AVIF (Max 30MB)"
                                        onFilesSelected={(files) =>
                                            void handleImageUpload(files, (uploaded) =>
                                                setMapMedia((prev) =>
                                                    toUniqueMedia([...prev, ...uploaded])
                                                )
                                            )
                                        }
                                        disabled={isSaving || isUploading}
                                        compact
                                    />
                                    <MediaGrid
                                        items={mapMedia}
                                        onRemove={(id) =>
                                            setMapMedia((prev) =>
                                                prev.filter((item) => item.id !== id)
                                            )
                                        }
                                        emptyMessage="Henüz konum görseli yok"
                                    />
                                </div>
                            </div>
                        </section>

                        <section id="section-media" className="scroll-mt-28 space-y-12">
                            <div className="space-y-6">
                                <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-orange-500" />
                                        Dış Görseller
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Projenin dış cephe, peyzaj ve genel vaziyet planı görselleri.
                                    </p>
                                </div>
                                <UploadPanel
                                    title="Dış görselleri buraya sürükleyin veya seçin"
                                    subtitle="Yüklenen görseller WebP olarak optimize edilir."
                                    onFilesSelected={(files) =>
                                        void handleImageUpload(files, (uploaded) =>
                                            setExteriorMedia((prev) =>
                                                toUniqueMedia([...prev, ...uploaded])
                                            )
                                        )
                                    }
                                    disabled={isSaving || isUploading}
                                />
                                <MediaGrid
                                    items={exteriorMedia}
                                    onRemove={(id) =>
                                        setExteriorMedia((prev) =>
                                            prev.filter((item) => item.id !== id)
                                        )
                                    }
                                    emptyMessage="Henüz dış görsel yok"
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-orange-500" />
                                        Sosyal İmkan Görselleri
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Havuz, fitness, lobi ve diğer ortak alan görselleri.
                                    </p>
                                </div>
                                <UploadPanel
                                    title="Sosyal alan görsellerini buraya sürükleyin veya seçin"
                                    subtitle="Yüklenen görseller WebP olarak optimize edilir."
                                    onFilesSelected={(files) =>
                                        void handleImageUpload(files, (uploaded) =>
                                            setSocialMedia((prev) =>
                                                toUniqueMedia([...prev, ...uploaded])
                                            )
                                        )
                                    }
                                    disabled={isSaving || isUploading}
                                />
                                <MediaGrid
                                    items={socialMedia}
                                    onRemove={(id) =>
                                        setSocialMedia((prev) =>
                                            prev.filter((item) => item.id !== id)
                                        )
                                    }
                                    emptyMessage="Henüz sosyal alan görseli yok"
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Home className="w-5 h-5 text-orange-500" />
                                        İç Görseller
                                    </h2>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Örnek daire iç mekan, mutfak ve banyo görselleri.
                                    </p>
                                </div>
                                <UploadPanel
                                    title="İç mekan görsellerini buraya sürükleyin veya seçin"
                                    subtitle="Yüklenen görseller WebP olarak optimize edilir."
                                    onFilesSelected={(files) =>
                                        void handleImageUpload(files, (uploaded) =>
                                            setInteriorMedia((prev) =>
                                                toUniqueMedia([...prev, ...uploaded])
                                            )
                                        )
                                    }
                                    disabled={isSaving || isUploading}
                                />
                                <MediaGrid
                                    items={interiorMedia}
                                    onRemove={(id) =>
                                        setInteriorMedia((prev) =>
                                            prev.filter((item) => item.id !== id)
                                        )
                                    }
                                    emptyMessage="Henüz iç görsel yok"
                                />
                            </div>

                            <section className="space-y-6">
                                <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-orange-500" />
                                        Proje Dokümanları
                                    </h2>
                                </div>
                                <UploadPanel
                                    title="Belge yüklemek için tıklayın veya sürükleyin"
                                    subtitle="PDF, DOC, DOCX, PPT, PPTX (Max 30MB)"
                                    onFilesSelected={(files) => void handleDocumentUpload(files)}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                    disabled={isSaving || isUploading}
                                    compact
                                />

                                <div className="space-y-2">
                                    {documents.length === 0 && (
                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                                            Henüz doküman yüklenmedi.
                                        </div>
                                    )}
                                    {documents.map((document) => (
                                        <div
                                            key={document.id}
                                            className="flex items-center justify-between rounded-lg border border-slate-100 bg-white shadow-sm p-4"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {document.id}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {document.type}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={getMediaUrl(document.url)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-sm text-orange-600 hover:text-orange-700"
                                                >
                                                    Aç
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDocuments((prev) =>
                                                            prev.filter(
                                                                (item) =>
                                                                    item.id !== document.id
                                                            )
                                                        )
                                                    }
                                                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </section>

                        <section id="section-units" className="scroll-mt-28 space-y-8">
                            <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-orange-500" />
                                    Kat Planları
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {floorPlans.map((plan, index) => (
                                    <div
                                        key={plan.id}
                                        className="rounded-xl border border-slate-200 bg-white p-5 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Kat Planı #{index + 1}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFloorPlans((prev) =>
                                                        prev.filter((item) => item.id !== plan.id)
                                                    )
                                                }
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={plan.title}
                                                onChange={(event) =>
                                                    setFloorPlans((prev) =>
                                                        prev.map((item) =>
                                                            item.id === plan.id
                                                                ? {
                                                                    ...item,
                                                                    title: event.target.value,
                                                                }
                                                                : item
                                                        )
                                                    )
                                                }
                                                placeholder="Kat planı başlığı"
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={plan.area}
                                                onChange={(event) =>
                                                    setFloorPlans((prev) =>
                                                        prev.map((item) =>
                                                            item.id === plan.id
                                                                ? {
                                                                    ...item,
                                                                    area: event.target.value,
                                                                }
                                                                : item
                                                        )
                                                    )
                                                }
                                                placeholder="Alan (örn. 95 m²)"
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                                            />
                                        </div>

                                        <UploadPanel
                                            title="Kat planı görseli seçin"
                                            subtitle="Tek görsel yükleyin"
                                            onFilesSelected={(files) =>
                                                void handleFloorPlanImageUpload(plan.id, files)
                                            }
                                            multiple={false}
                                            disabled={isSaving || isUploading}
                                            compact
                                        />

                                        {plan.imageUrl ? (
                                            <div className="rounded-xl border border-slate-200 overflow-hidden max-w-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={getMediaUrl(plan.imageUrl)}
                                                    alt=""
                                                    className="w-full h-56 object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                                Bu kat planı için henüz görsel yüklenmedi.
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFloorPlans((prev) => [
                                            ...prev,
                                            {
                                                id: createRowId(),
                                                title: "",
                                                area: "",
                                                imageUrl: "",
                                                mediaId: null,
                                            },
                                        ])
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-6 text-sm font-medium text-slate-600 transition-all hover:border-orange-500 hover:bg-orange-50/50 hover:text-orange-600 cursor-pointer"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    Yeni Kat Planı Ekle
                                </button>
                            </div>
                        </section>

                        <section id="section-faq" className="scroll-mt-28 space-y-6">
                            <div className="border-t border-slate-100 pt-8 border-b pb-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-orange-500" />
                                    Sıkça Sorulan Sorular
                                </h2>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFaqs((prev) => [
                                            ...prev,
                                            { id: createRowId(), question: "", answer: "" },
                                        ])
                                    }
                                    className="text-orange-500 hover:bg-orange-500/5 px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1.5 transition-colors"
                                >
                                    <Plus width={16} height={16} /> Soru Ekle
                                </button>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4 relative group"
                                    >
                                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setFaqs((prev) =>
                                                        prev.filter((faq) => faq.id !== item.id)
                                                    )
                                                }
                                                className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                Soru
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                                                placeholder="Örn: Proje ne zaman teslim edilecek?"
                                                value={item.question}
                                                onChange={(event) =>
                                                    setFaqs((prev) =>
                                                        prev.map((faq) =>
                                                            faq.id === item.id
                                                                ? {
                                                                    ...faq,
                                                                    question:
                                                                        event.target.value,
                                                                }
                                                                : faq
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">
                                                Cevap
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400 text-sm"
                                                placeholder="Cevabı buraya yazın..."
                                                rows={3}
                                                value={item.answer}
                                                onChange={(event) =>
                                                    setFaqs((prev) =>
                                                        prev.map((faq) =>
                                                            faq.id === item.id
                                                                ? {
                                                                    ...faq,
                                                                    answer:
                                                                        event.target.value,
                                                                }
                                                                : faq
                                                        )
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}

                                {faqs.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500 text-center">
                                        Henüz soru eklenmedi.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="sticky bottom-4 z-40 mx-auto w-full">
                    <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200 p-4">
                        <div className="text-xs text-slate-500">
                            {projectId ? `Proje Kimliği: ${projectId}` : "Henüz kaydedilmedi"}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => void handleSaveAction("DRAFT")}
                                disabled={isSaving || isUploading || isHydrating}
                                className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Taslak Kaydet
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleSaveAction("PUBLISHED")}
                                disabled={isSaving || isUploading || isHydrating}
                                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckIcon className="w-4 h-4" />
                                )}
                                {isEditMode ? "Güncelle & Yayınla" : "Tamamla & Yayınla"}
                            </button>
                            {status === "PUBLISHED" && projectSlug && (
                                <Link
                                    href={`/tr/proje/${projectSlug}`}
                                    target="_blank"
                                    className="px-6 py-2.5 flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 text-sm font-semibold rounded-lg hover:bg-green-100 hover:border-green-300 hover:text-green-800 transition-all shadow-sm group"
                                    title="Projeyi Gör"
                                >
                                    <span>Projeyi Gör</span>
                                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {iconPickerTarget && (
                <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    İkon Seç
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Kütüphaneden ikon seçin veya kendi SVG dosyanızı yükleyin.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIconPickerTarget(null)}
                                className="w-9 h-9 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            >
                                <X className="w-4 h-4 mx-auto" />
                            </button>
                        </div>

                        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-orange-500 bg-slate-50">
                                    <ProjectIcon
                                        name={activeIconRow?.icon || "Building2"}
                                        className="w-5 h-5"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {activeIconRow?.title || "Özellik"}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {activeIconRow &&
                                            isCustomProjectIconDataUri(activeIconRow.icon)
                                            ? "Özel SVG"
                                            : activeIconRow?.icon || "Building2"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={() => customSvgInputRef.current?.click()}
                                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    SVG Yükle
                                </button>
                                <input
                                    ref={customSvgInputRef}
                                    type="file"
                                    accept=".svg,image/svg+xml"
                                    className="hidden"
                                    onChange={(event) => {
                                        void handleCustomSvgUpload(event);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-5 max-h-[420px] overflow-y-auto">
                            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                                {PROJECT_ICON_OPTIONS.map((iconName) => (
                                    <button
                                        key={iconName}
                                        type="button"
                                        onClick={() => {
                                            if (!iconPickerTarget) return;
                                            updateFeatureRow(
                                                iconPickerTarget.category,
                                                iconPickerTarget.id,
                                                { icon: iconName }
                                            );
                                            setIconPickerTarget(null);
                                        }}
                                        className={cn(
                                            "rounded-xl border p-3 flex flex-col items-center gap-2 hover:border-orange-400 hover:bg-orange-50/40 transition-colors",
                                            activeIconRow?.icon === iconName
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-slate-200"
                                        )}
                                    >
                                        <ProjectIcon
                                            name={iconName}
                                            className="w-5 h-5 text-orange-500"
                                        />
                                        <span className="text-[11px] text-slate-600 text-center leading-tight">
                                            {iconName}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AiFillModal
                isOpen={isAiFillModalOpen}
                onClose={() => setIsAiFillModalOpen(false)}
                onApply={handleAiFillApply}
                currentType={type}
            />

            <MediaOptimizationModal
                isOpen={mediaOptimizationState !== "hidden"}
                stage={
                    mediaOptimizationState === "completed"
                        ? "completed"
                        : "optimizing"
                }
            />

            <UnsavedChangesModal
                isOpen={isLeavePromptOpen}
                isLoading={isSaving || isUploading}
                loadingAction={leaveAction}
                onCancel={closeLeavePrompt}
                onDiscard={handleLeaveDiscard}
                onSaveDraft={() => void handleLeaveSave("DRAFT")}
                onPublish={() => void handleLeaveSave("PUBLISHED")}
            />
        </>
    );
}
