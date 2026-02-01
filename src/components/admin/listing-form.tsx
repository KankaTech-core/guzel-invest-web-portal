"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Save,
    Send,
    Archive,
    ArrowLeft,
    Building2,
    MapPin,
    Home,
    Languages,
    Image as ImageIcon,
    Sparkles,
    Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TagInput } from "./tag-input";
import { AiFillModal, ParsedData } from "./ai-fill-modal";

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

interface ListingData {
    id?: string;
    slug?: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    type: string;
    saleType: string;
    city: string;
    district: string;
    neighborhood: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    price: number;
    currency: string;
    area: number;
    rooms: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
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
    // Relations
    translations: ListingTranslation[];
    media?: Media[];
    tags?: TagData[];
}

interface ListingFormProps {
    listing?: ListingData;
    isNew?: boolean;
}

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

const LOCALES = [
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
];

const TABS = [
    { id: "details", label: "Detaylar", icon: Building2 },
    { id: "location", label: "Konum", icon: MapPin },
    { id: "features", label: "Özellikler", icon: Home },
    { id: "tags", label: "Etiketler", icon: Tag },
    { id: "translations", label: "Çeviriler", icon: Languages },
    { id: "media", label: "Medya", icon: ImageIcon },
];

// Property types that show residential-specific fields
const RESIDENTIAL_TYPES = ["APARTMENT", "VILLA", "PENTHOUSE"];
const LAND_TYPES = ["LAND"];
const COMMERCIAL_TYPES = ["COMMERCIAL", "SHOP", "OFFICE"];
const FARM_TYPES = ["FARM"];

const defaultTranslations: ListingTranslation[] = LOCALES.map((locale) => ({
    locale: locale.code,
    title: "",
    description: "",
    features: [],
}));

const defaultListing: ListingData = {
    status: "DRAFT",
    type: "APARTMENT",
    saleType: "SALE",
    city: "Alanya",
    district: "",
    neighborhood: null,
    address: null,
    latitude: null,
    longitude: null,
    price: 0,
    currency: "EUR",
    area: 0,
    rooms: null,
    bedrooms: null,
    bathrooms: null,
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
    translations: defaultTranslations,
    media: [],
    tags: [],
};

export function ListingForm({ listing, isNew = false }: ListingFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("details");
    const [activeLocale, setActiveLocale] = useState("tr");
    const [formData, setFormData] = useState<ListingData>(
        listing || defaultListing
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingMedia, setPendingMedia] = useState<PendingMedia[]>([]);
    const [isAiFillOpen, setIsAiFillOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<TagData[]>(listing?.tags || []);
    const mediaBaseUrl = `${process.env.NEXT_PUBLIC_MINIO_URL || "http://localhost:9000"}/guzel-invest/`;
    const resolveMediaUrl = (path: string) =>
        path.startsWith("http") ? path : `${mediaBaseUrl}${path}`;

    // Check property type categories
    const isResidential = RESIDENTIAL_TYPES.includes(formData.type);
    const isLand = LAND_TYPES.includes(formData.type);
    const isCommercial = COMMERCIAL_TYPES.includes(formData.type);
    const isFarm = FARM_TYPES.includes(formData.type);

    // Handle AI fill data
    const handleAiFillApply = (data: ParsedData) => {
        setFormData((prev) => {
            const updated = { ...prev };

            // Map AI data to form fields
            if (data.type) updated.type = String(data.type);
            if (data.saleType) updated.saleType = String(data.saleType);
            if (data.price) updated.price = Number(data.price);
            if (data.currency) updated.currency = String(data.currency);
            if (data.area) updated.area = Number(data.area);
            if (data.rooms !== undefined) updated.rooms = Number(data.rooms) || null;
            if (data.bedrooms !== undefined) updated.bedrooms = Number(data.bedrooms) || null;
            if (data.bathrooms !== undefined) updated.bathrooms = Number(data.bathrooms) || null;
            if (data.floor !== undefined) updated.floor = Number(data.floor) || null;
            if (data.totalFloors !== undefined) updated.totalFloors = Number(data.totalFloors) || null;
            if (data.buildYear !== undefined) updated.buildYear = Number(data.buildYear) || null;
            if (data.heating) updated.heating = String(data.heating);
            if (data.city) updated.city = String(data.city);
            if (data.district) updated.district = String(data.district);
            if (data.neighborhood) updated.neighborhood = String(data.neighborhood);
            if (data.latitude !== undefined) updated.latitude = Number(data.latitude) || null;
            if (data.longitude !== undefined) updated.longitude = Number(data.longitude) || null;

            // Boolean features
            if (typeof data.furnished === 'boolean') updated.furnished = data.furnished;
            if (typeof data.balcony === 'boolean') updated.balcony = data.balcony;
            if (typeof data.garden === 'boolean') updated.garden = data.garden;
            if (typeof data.pool === 'boolean') updated.pool = data.pool;
            if (typeof data.parking === 'boolean') updated.parking = data.parking;
            if (typeof data.elevator === 'boolean') updated.elevator = data.elevator;
            if (typeof data.security === 'boolean') updated.security = data.security;
            if (typeof data.seaView === 'boolean') updated.seaView = data.seaView;

            // Land-specific
            if (data.parcelNo) updated.parcelNo = String(data.parcelNo);
            if (data.emsal !== undefined) updated.emsal = Number(data.emsal) || null;
            if (data.zoningStatus) updated.zoningStatus = String(data.zoningStatus);

            // Commercial-specific
            if (data.groundFloorArea !== undefined) updated.groundFloorArea = Number(data.groundFloorArea) || null;
            if (data.basementArea !== undefined) updated.basementArea = Number(data.basementArea) || null;

            // Farm-specific
            if (typeof data.hasWaterSource === 'boolean') updated.hasWaterSource = data.hasWaterSource;
            if (typeof data.hasFruitTrees === 'boolean') updated.hasFruitTrees = data.hasFruitTrees;
            if (data.existingStructure) updated.existingStructure = String(data.existingStructure);

            // Eligibility
            if (typeof data.citizenshipEligible === 'boolean') updated.citizenshipEligible = data.citizenshipEligible;
            if (typeof data.residenceEligible === 'boolean') updated.residenceEligible = data.residenceEligible;

            // Update Turkish translation with title and description
            if (data.title || data.description) {
                updated.translations = updated.translations.map((t) => {
                    if (t.locale === 'tr') {
                        return {
                            ...t,
                            title: data.title ? String(data.title) : t.title,
                            description: data.description ? String(data.description) : t.description,
                            features: Array.isArray(data.features) ? data.features.map(String) : t.features,
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

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "number"
                        ? parseFloat(value) || 0
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

    const createPendingId = () =>
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const revokePendingMedia = (items: PendingMedia[]) => {
        items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };

    const uploadMediaFiles = async (listingId: string, files: File[]) => {
        if (files.length === 0) return [];
        setIsUploading(true);
        setError(null);

        try {
            const payload = new FormData();
            files.forEach((file) => payload.append("files", file));

            const response = await fetch(`/api/admin/listings/${listingId}/media`, {
                method: "POST",
                body: payload,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Medya yükleme başarısız");
            }

            const data = await response.json();
            const uploadedMedia = data.media || [];

            setFormData((prev) => ({
                ...prev,
                media: [...(prev.media || []), ...uploadedMedia],
            }));

            return uploadedMedia;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Medya yükleme hatası");
            return [];
        } finally {
            setIsUploading(false);
        }
    };

    const handleMediaSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        event.target.value = "";

        if (!formData.id) {
            const pendingItems = files.map((file) => ({
                id: createPendingId(),
                file,
                previewUrl: URL.createObjectURL(file),
            }));
            setPendingMedia((prev) => [...prev, ...pendingItems]);
            return;
        }

        await uploadMediaFiles(formData.id, files);
    };

    const handleSubmit = async (publish: boolean = false) => {
        setIsSaving(true);
        setError(null);

        try {
            const hasListing = Boolean(formData.id);
            const endpoint = hasListing
                ? `/api/admin/listings/${formData.id}`
                : "/api/admin/listings";
            const method = hasListing ? "PATCH" : "POST";

            const body = {
                ...formData,
                status: publish ? "PUBLISHED" : formData.status,
                tags: selectedTags,
            };

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Kayıt başarısız");
            }

            const savedListing = await response.json();
            const listingId = savedListing?.id || formData.id;

            if (!formData.id && listingId) {
                setFormData((prev) => ({
                    ...prev,
                    id: listingId,
                    slug: savedListing.slug,
                    status: savedListing.status || prev.status,
                }));
            }

            if (listingId && pendingMedia.length > 0) {
                const uploaded = await uploadMediaFiles(
                    listingId,
                    pendingMedia.map((item) => item.file)
                );

                if (uploaded.length === 0) {
                    return;
                }

                revokePendingMedia(pendingMedia);
                setPendingMedia([]);
            }

            router.push("/admin/ilanlar");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Bir hata oluştu");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
        setFormData((prev) => ({ ...prev, status: newStatus }));
    };

    const currentTranslation =
        formData.translations.find((t) => t.locale === activeLocale) ||
        formData.translations[0];

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
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
                                : currentTranslation?.title || "İsimsiz İlan"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAiFillOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI ile Doldur
                    </button>
                    {!isNew && (
                        <span
                            className={cn(
                                "px-3 py-1 rounded-full text-sm font-medium",
                                formData.status === "PUBLISHED"
                                    ? "bg-green-100 text-green-700"
                                    : formData.status === "DRAFT"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-600"
                            )}
                        >
                            {formData.status === "PUBLISHED"
                                ? "Yayında"
                                : formData.status === "DRAFT"
                                    ? "Taslak"
                                    : "Arşiv"}
                        </span>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex border-b border-gray-100">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px",
                                activeTab === tab.id
                                    ? "border-orange-500 text-orange-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Details Tab */}
                    {activeTab === "details" && (
                        <div className="space-y-8">
                            {/* Core Fields - Always Visible */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mülk Tipi
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="input"
                                    >
                                        {PROPERTY_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Satış Tipi
                                    </label>
                                    <select
                                        name="saleType"
                                        value={formData.saleType}
                                        onChange={handleInputChange}
                                        className="input"
                                    >
                                        {SALE_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
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
                                            className="input flex-1"
                                            placeholder="0"
                                        />
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleInputChange}
                                            className="input w-24"
                                        >
                                            <option value="EUR">€</option>
                                            <option value="USD">$</option>
                                            <option value="TRY">₺</option>
                                            <option value="GBP">£</option>
                                        </select>
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
                                <>
                                    <div className="border-t border-gray-100 pt-6">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                            Konut Detayları
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Oda Sayısı
                                                </label>
                                                <input
                                                    type="number"
                                                    name="rooms"
                                                    value={formData.rooms || ""}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                    placeholder="3+1"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Yatak Odası
                                                </label>
                                                <input
                                                    type="number"
                                                    name="bedrooms"
                                                    value={formData.bedrooms || ""}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                    placeholder="3"
                                                />
                                            </div>

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

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Kat
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        name="floor"
                                                        value={formData.floor || ""}
                                                        onChange={handleInputChange}
                                                        className="input flex-1"
                                                        placeholder="Bulunduğu Kat"
                                                    />
                                                    <input
                                                        type="number"
                                                        name="totalFloors"
                                                        value={formData.totalFloors || ""}
                                                        onChange={handleInputChange}
                                                        className="input flex-1"
                                                        placeholder="Toplam Kat"
                                                    />
                                                </div>
                                            </div>

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

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Isıtma
                                                </label>
                                                <select
                                                    name="heating"
                                                    value={formData.heating || ""}
                                                    onChange={handleInputChange}
                                                    className="input"
                                                >
                                                    <option value="">Seçiniz</option>
                                                    <option value="central">Merkezi</option>
                                                    <option value="individual">Bireysel</option>
                                                    <option value="floor">Yerden Isıtma</option>
                                                    <option value="ac">Klima</option>
                                                    <option value="none">Yok</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                İmar Durumu
                                            </label>
                                            <select
                                                name="zoningStatus"
                                                value={formData.zoningStatus || ""}
                                                onChange={handleInputChange}
                                                className="input"
                                            >
                                                <option value="">Seçiniz</option>
                                                <option value="imarlı">İmarlı</option>
                                                <option value="imarsız">İmarsız</option>
                                                <option value="tarla">Tarla</option>
                                                <option value="konut">Konut İmarlı</option>
                                                <option value="ticari">Ticari İmarlı</option>
                                            </select>
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

                            {/* Eligibility Section - Always Visible */}
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Uygunluk Durumu
                                </h3>
                                <div className="flex flex-wrap gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="citizenshipEligible"
                                            checked={formData.citizenshipEligible}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">Vatandaşlığa Uygun</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="residenceEligible"
                                            checked={formData.residenceEligible}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-700">İkametgaha Uygun</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Location Tab */}
                    {activeTab === "location" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Şehir
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="Alanya"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İlçe
                                </label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="Mahmutlar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mahalle
                                </label>
                                <input
                                    type="text"
                                    name="neighborhood"
                                    value={formData.neighborhood || ""}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder="Mahalle adı"
                                />
                            </div>

                            <div className="md:col-span-2">
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
                    )}

                    {/* Features Tab */}
                    {activeTab === "features" && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[
                                { name: "furnished", label: "Eşyalı" },
                                { name: "balcony", label: "Balkon" },
                                { name: "garden", label: "Bahçe" },
                                { name: "pool", label: "Havuz" },
                                { name: "parking", label: "Otopark" },
                                { name: "elevator", label: "Asansör" },
                                { name: "security", label: "Güvenlik" },
                                { name: "seaView", label: "Deniz Manzarası" },
                            ].map((feature) => (
                                <label
                                    key={feature.name}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                                        formData[feature.name as keyof ListingData]
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    <input
                                        type="checkbox"
                                        name={feature.name}
                                        checked={
                                            formData[feature.name as keyof ListingData] as boolean
                                        }
                                        onChange={handleInputChange}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {feature.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Tags Tab */}
                    {activeTab === "tags" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                                    İlan Etiketleri
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Bu ilana etiketler ekleyerek kategorize edebilir ve filtrelenebilir hale getirebilirsiniz.
                                </p>
                                <TagInput
                                    selectedTags={selectedTags}
                                    onTagsChange={setSelectedTags}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "translations" && (
                        <div>
                            {/* Locale Tabs */}
                            <div className="flex gap-2 mb-6">
                                {LOCALES.map((locale) => (
                                    <button
                                        key={locale.code}
                                        onClick={() => setActiveLocale(locale.code)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                            activeLocale === locale.code
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        )}
                                    >
                                        <span>{locale.flag}</span>
                                        {locale.label}
                                    </button>
                                ))}
                            </div>

                            {/* Translation Form */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Başlık ({LOCALES.find((l) => l.code === activeLocale)?.label})
                                    </label>
                                    <input
                                        type="text"
                                        value={currentTranslation?.title || ""}
                                        onChange={(e) =>
                                            handleTranslationChange(
                                                activeLocale,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        className="input"
                                        placeholder="İlan başlığı"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Açıklama ({LOCALES.find((l) => l.code === activeLocale)?.label})
                                    </label>
                                    <textarea
                                        value={currentTranslation?.description || ""}
                                        onChange={(e) =>
                                            handleTranslationChange(
                                                activeLocale,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="input min-h-[200px]"
                                        placeholder="İlan açıklaması"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === "media" && (
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="btn btn-outline btn-md cursor-pointer">
                                    <ImageIcon className="w-4 h-4" />
                                    Görsel Yükle
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleMediaSelect}
                                        disabled={isUploading || isSaving}
                                        className="sr-only"
                                    />
                                </label>
                                <span className="text-sm text-gray-500">
                                    {isUploading
                                        ? "Görseller yükleniyor..."
                                        : "WebP optimizasyonu otomatik yapılır."}
                                </span>
                            </div>

                            {pendingMedia.length > 0 && !formData.id && (
                                <p className="text-xs text-gray-500">
                                    Seçtiğiniz görseller, ilanı kaydettikten sonra
                                    yüklenir ve WebP'ye dönüştürülür.
                                </p>
                            )}

                            {formData.media && formData.media.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.media.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "relative aspect-square rounded-lg overflow-hidden border-2",
                                                item.isCover
                                                    ? "border-orange-500"
                                                    : "border-transparent"
                                            )}
                                        >
                                            <img
                                                src={resolveMediaUrl(item.url)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            {item.isCover && (
                                                <span className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded">
                                                    Kapak
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {pendingMedia.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {pendingMedia.map((item) => (
                                        <div
                                            key={item.id}
                                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-orange-200 bg-orange-50"
                                        >
                                            <img
                                                src={item.previewUrl}
                                                alt=""
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-white/80 text-gray-700 text-xs rounded">
                                                Yüklenmeyi bekliyor
                                            </span>
                                        </div>
                                    ))}
                                </div>
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
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                    {!isNew && formData.status !== "ARCHIVED" && (
                        <button
                            onClick={() => handleStatusChange("ARCHIVED")}
                            className="btn btn-ghost btn-md text-gray-500"
                        >
                            <Archive className="w-4 h-4" />
                            Arşivle
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={isSaving || isUploading}
                        className="btn btn-outline btn-md"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Kaydediliyor..." : "Taslak Kaydet"}
                    </button>
                    <button
                        onClick={() => handleSubmit(true)}
                        disabled={isSaving || isUploading}
                        className="btn btn-primary btn-md"
                    >
                        <Send className="w-4 h-4" />
                        {isSaving ? "Yayınlanıyor..." : "Yayınla"}
                    </button>
                </div>
            </div>

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
