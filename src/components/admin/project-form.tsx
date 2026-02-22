"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ChangeEvent } from "react";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { PROJECT_ICON_OPTIONS } from "@/lib/project-icon-catalog";
import { getMediaUrl } from "@/lib/utils";

type ProjectStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type FeatureCategory = "GENERAL" | "SOCIAL";

interface ExistingProjectTranslation {
    locale: string;
    title: string;
    description: string;
    features: string[];
}

interface ExistingProjectFeature {
    id?: string;
    icon: string;
    category: string;
    order: number;
    translations: { locale: string; title: string }[];
}

interface ExistingCustomGallery {
    id?: string;
    order: number;
    translations: { locale: string; title: string; subtitle?: string | null }[];
    media?: { id: string }[];
}

interface ExistingProjectUnit {
    id?: string;
    rooms: string;
    area?: number | null;
    price?: number | null;
    translations: { locale: string; title?: string | null }[];
    media?: { id: string }[];
}

interface ExistingFloorPlan {
    id?: string;
    imageUrl: string;
    area?: string | null;
    translations: { locale: string; title: string }[];
}

interface ExistingFaq {
    id?: string;
    order: number;
    translations: { locale: string; question: string; answer: string }[];
}

interface ExistingProjectDocument {
    id: string;
    url: string;
    category: string | null;
    type: string;
}

interface ExistingProjectData {
    id?: string;
    slug?: string;
    status: ProjectStatusValue;
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
    projectType: string | null;
    deliveryDate: string | null;
    price: number;
    area: number;
    translations: ExistingProjectTranslation[];
    projectFeatures: ExistingProjectFeature[];
    customGalleries: ExistingCustomGallery[];
    projectUnits: ExistingProjectUnit[];
    floorPlans: ExistingFloorPlan[];
    faqs: ExistingFaq[];
    exteriorMediaIds: string[];
    interiorMediaIds: string[];
    mapMediaIds: string[];
    documentMediaIds: string[];
    documents?: ExistingProjectDocument[];
}

interface ProjectFormProps {
    project?: ExistingProjectData;
    isNew?: boolean;
}

interface FeatureFormItem {
    icon: string;
    category: FeatureCategory;
    title: string;
    order: number;
}

interface CustomGalleryFormItem {
    title: string;
    subtitle: string;
    order: number;
    mediaIdsRaw: string;
}

interface UnitFormItem {
    title: string;
    rooms: string;
    areaRaw: string;
    priceRaw: string;
    mediaIdsRaw: string;
}

interface FloorPlanFormItem {
    title: string;
    imageUrl: string;
    area: string;
}

interface FaqFormItem {
    question: string;
    answer: string;
    order: number;
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
] as const;

const STATUS_OPTIONS: { value: ProjectStatusValue; label: string }[] = [
    { value: "DRAFT", label: "Taslak" },
    { value: "PUBLISHED", label: "Yayında" },
    { value: "ARCHIVED", label: "Arşiv" },
];

const getTrTranslation = <T extends { locale: string }>(items: T[]) =>
    items.find((item) => item.locale === "tr") || items[0];

const parseMediaIds = (value: string): string[] =>
    value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const mergeMediaIdRawValues = (currentValue: string, nextIds: string[]) => {
    const merged = Array.from(new Set([...parseMediaIds(currentValue), ...nextIds]));
    return merged.join(", ");
};

const parseNumber = (value: string): number | null => {
    const normalized = value.trim().replace(/\./g, "").replace(",", ".");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
};

export function ProjectForm({ project, isNew = false }: ProjectFormProps) {
    const router = useRouter();

    const trTranslation = useMemo(
        () =>
            project?.translations?.find((item) => item.locale === "tr") || {
                locale: "tr",
                title: "",
                description: "",
                features: [],
            },
        [project]
    );

    const [status, setStatus] = useState<ProjectStatusValue>(
        project?.status || "DRAFT"
    );
    const [type, setType] = useState(project?.type || "APARTMENT");
    const [title, setTitle] = useState(trTranslation.title || "");
    const [description, setDescription] = useState(trTranslation.description || "");
    const [featureBullets, setFeatureBullets] = useState(
        (trTranslation.features || []).join("\n")
    );
    const [company, setCompany] = useState(project?.company || "Güzel Invest");
    const [city, setCity] = useState(project?.city || "Antalya");
    const [district, setDistrict] = useState(project?.district || "Alanya");
    const [neighborhood, setNeighborhood] = useState(project?.neighborhood || "");
    const [address, setAddress] = useState(project?.address || "");
    const [googleMapsLink, setGoogleMapsLink] = useState(project?.googleMapsLink || "");
    const [latitude, setLatitude] = useState(
        project?.latitude !== null && project?.latitude !== undefined
            ? String(project.latitude)
            : ""
    );
    const [longitude, setLongitude] = useState(
        project?.longitude !== null && project?.longitude !== undefined
            ? String(project.longitude)
            : ""
    );
    const [projectType, setProjectType] = useState(project?.projectType || "");
    const [deliveryDate, setDeliveryDate] = useState(project?.deliveryDate || "");
    const [price, setPrice] = useState(
        project?.price !== null && project?.price !== undefined
            ? String(project.price)
            : "0"
    );
    const [area, setArea] = useState(
        project?.area !== null && project?.area !== undefined
            ? String(project.area)
            : "0"
    );

    const [projectFeatures, setProjectFeatures] = useState<FeatureFormItem[]>(
        (project?.projectFeatures || []).map((item, index) => ({
            icon: item.icon || "",
            category:
                item.category === "SOCIAL" ? "SOCIAL" : ("GENERAL" as FeatureCategory),
            title: getTrTranslation(item.translations)?.title || "",
            order: item.order ?? index,
        }))
    );

    const [customGalleries, setCustomGalleries] = useState<CustomGalleryFormItem[]>(
        (project?.customGalleries || []).map((item, index) => ({
            title: getTrTranslation(item.translations)?.title || "",
            subtitle: getTrTranslation(item.translations)?.subtitle || "",
            order: item.order ?? index,
            mediaIdsRaw: (item.media || []).map((media) => media.id).join(", "),
        }))
    );

    const [projectUnits, setProjectUnits] = useState<UnitFormItem[]>(
        (project?.projectUnits || []).map((item) => ({
            title: getTrTranslation(item.translations)?.title || "",
            rooms: item.rooms || "",
            areaRaw:
                item.area !== null && item.area !== undefined ? String(item.area) : "",
            priceRaw:
                item.price !== null && item.price !== undefined
                    ? String(item.price)
                    : "",
            mediaIdsRaw: (item.media || []).map((media) => media.id).join(", "),
        }))
    );

    const [floorPlans, setFloorPlans] = useState<FloorPlanFormItem[]>(
        (project?.floorPlans || []).map((item) => ({
            title: getTrTranslation(item.translations)?.title || "",
            imageUrl: item.imageUrl || "",
            area: item.area || "",
        }))
    );

    const [faqs, setFaqs] = useState<FaqFormItem[]>(
        (project?.faqs || []).map((item, index) => ({
            question: getTrTranslation(item.translations)?.question || "",
            answer: getTrTranslation(item.translations)?.answer || "",
            order: item.order ?? index,
        }))
    );
    const [exteriorMediaIdsRaw, setExteriorMediaIdsRaw] = useState(
        (project?.exteriorMediaIds || []).join(", ")
    );
    const [interiorMediaIdsRaw, setInteriorMediaIdsRaw] = useState(
        (project?.interiorMediaIds || []).join(", ")
    );
    const [mapMediaIdsRaw, setMapMediaIdsRaw] = useState(
        (project?.mapMediaIds || []).join(", ")
    );
    const [documentMediaIdsRaw, setDocumentMediaIdsRaw] = useState(
        (project?.documentMediaIds || []).join(", ")
    );
    const [documents, setDocuments] = useState<ExistingProjectDocument[]>(
        project?.documents || []
    );
    const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);
    const [documentUploadError, setDocumentUploadError] = useState("");
    const [documentUploadSuccess, setDocumentUploadSuccess] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const submitLabel = isSaving
        ? "Kaydediliyor..."
        : isNew
            ? "Projeyi Oluştur"
            : "Projeyi Güncelle";

    const addProjectFeature = () => {
        setProjectFeatures((prev) => [
            ...prev,
            {
                icon: "",
                category: "GENERAL",
                title: "",
                order: prev.length,
            },
        ]);
    };

    const addCustomGallery = () => {
        setCustomGalleries((prev) => [
            ...prev,
            {
                title: "",
                subtitle: "",
                order: prev.length,
                mediaIdsRaw: "",
            },
        ]);
    };

    const addProjectUnit = () => {
        setProjectUnits((prev) => [
            ...prev,
            {
                title: "",
                rooms: "",
                areaRaw: "",
                priceRaw: "",
                mediaIdsRaw: "",
            },
        ]);
    };

    const addFloorPlan = () => {
        setFloorPlans((prev) => [
            ...prev,
            {
                title: "",
                imageUrl: "",
                area: "",
            },
        ]);
    };

    const addFaq = () => {
        setFaqs((prev) => [
            ...prev,
            {
                question: "",
                answer: "",
                order: prev.length,
            },
        ]);
    };

    const handleDocumentUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";

        if (files.length === 0) return;

        if (!project?.id) {
            setDocumentUploadError(
                "Belge yüklemek için önce projeyi oluşturup kaydetmeniz gerekiyor."
            );
            return;
        }

        setDocumentUploadError("");
        setDocumentUploadSuccess("");
        setIsUploadingDocuments(true);

        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            const response = await fetch(
                `/api/admin/projects/${project.id}/documents`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            if (!response.ok) {
                setDocumentUploadError(
                    data?.error || data?.details || "Belge yükleme işlemi başarısız oldu."
                );
                return;
            }

            const uploadedDocuments = Array.isArray(data?.documents)
                ? (data.documents as ExistingProjectDocument[])
                : [];

            if (uploadedDocuments.length > 0) {
                const uploadedIds = uploadedDocuments.map((item) => item.id);
                setDocumentMediaIdsRaw((previous) =>
                    mergeMediaIdRawValues(previous, uploadedIds)
                );
                setDocuments((previous) => {
                    const nextById = new Map(previous.map((item) => [item.id, item]));
                    uploadedDocuments.forEach((item) => nextById.set(item.id, item));
                    return Array.from(nextById.values());
                });
            }

            setDocumentUploadSuccess(
                `${uploadedDocuments.length} belge başarıyla yüklendi.`
            );
        } catch {
            setDocumentUploadError("Belge yüklenirken beklenmeyen bir hata oluştu.");
        } finally {
            setIsUploadingDocuments(false);
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const parsedLatitude = parseNumber(latitude);
        const parsedLongitude = parseNumber(longitude);
        const parsedPrice = parseNumber(price) ?? 0;
        const parsedArea = parseNumber(area) ?? 0;

        if (!title.trim()) {
            setError("Türkçe proje başlığı zorunludur.");
            return;
        }

        if (!city.trim() || !district.trim()) {
            setError("Şehir ve ilçe zorunludur.");
            return;
        }

        const payload = {
            status,
            type,
            saleType: "SALE",
            company,
            city: city.trim(),
            district: district.trim(),
            neighborhood: neighborhood.trim() || null,
            address: address.trim() || null,
            googleMapsLink: googleMapsLink.trim() || null,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
            projectType: projectType.trim() || null,
            deliveryDate: deliveryDate.trim() || null,
            price: parsedPrice,
            area: Math.trunc(parsedArea),
            translations: [
                {
                    locale: "tr",
                    title: title.trim(),
                    description: description.trim(),
                    features: featureBullets
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                },
            ],
            projectFeatures: projectFeatures
                .map((item, index) => ({
                    icon: item.icon.trim(),
                    category: item.category,
                    order: index,
                    translations: [
                        {
                            locale: "tr",
                            title: item.title.trim(),
                        },
                    ],
                }))
                .filter((item) => item.icon || item.translations[0].title),
            customGalleries: customGalleries
                .map((item, index) => ({
                    order: index,
                    mediaIds: parseMediaIds(item.mediaIdsRaw),
                    translations: [
                        {
                            locale: "tr",
                            title: item.title.trim(),
                            subtitle: item.subtitle.trim() || null,
                        },
                    ],
                }))
                .filter((item) => item.translations[0].title),
            projectUnits: projectUnits
                .map((item) => ({
                    rooms: item.rooms.trim(),
                    area: parseNumber(item.areaRaw),
                    price: parseNumber(item.priceRaw),
                    mediaIds: parseMediaIds(item.mediaIdsRaw),
                    translations: [
                        {
                            locale: "tr",
                            title: item.title.trim() || null,
                        },
                    ],
                }))
                .filter((item) => item.rooms),
            floorPlans: floorPlans
                .map((item) => ({
                    imageUrl: item.imageUrl.trim(),
                    area: item.area.trim() || null,
                    translations: [
                        {
                            locale: "tr",
                            title: item.title.trim(),
                        },
                    ],
                }))
                .filter((item) => item.imageUrl && item.translations[0].title),
            faqs: faqs
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
                        item.translations[0].question && item.translations[0].answer
                ),
            exteriorMediaIds: parseMediaIds(exteriorMediaIdsRaw),
            interiorMediaIds: parseMediaIds(interiorMediaIdsRaw),
            mapMediaIds: parseMediaIds(mapMediaIdsRaw),
            documentMediaIds: parseMediaIds(documentMediaIdsRaw),
        };

        try {
            setIsSaving(true);
            const endpoint = isNew
                ? "/api/admin/projects"
                : `/api/admin/projects/${project?.id}`;
            const method = isNew ? "POST" : "PATCH";

            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data?.error || "Proje kaydedilemedi.");
                return;
            }

            setSuccess(isNew ? "Proje oluşturuldu." : "Proje güncellendi.");

            if (isNew && data?.id) {
                router.push(`/admin/projeler/${data.id}`);
                router.refresh();
                return;
            }

            router.refresh();
        } catch {
            setError("Beklenmeyen bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!project?.id) return;
        const confirmed = window.confirm(
            "Bu projeyi silmek istediğinize emin misiniz?"
        );
        if (!confirmed) return;

        setError("");
        setSuccess("");
        setIsSaving(true);

        try {
            const response = await fetch(`/api/admin/projects/${project.id}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data?.error || "Proje silinemedi.");
                return;
            }

            router.push("/admin/projeler");
            router.refresh();
        } catch {
            setError("Beklenmeyen bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/projeler"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Projelere Dön
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isNew ? "Yeni Proje" : "Proje Düzenle"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Tek proje sayfası verisini bu formdan yönetebilirsiniz.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isNew && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            disabled={isSaving}
                        >
                            <Trash2 className="h-4 w-4" />
                            Sil
                        </button>
                    )}
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {submitLabel}
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                </div>
            )}

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-base font-semibold text-gray-900">Temel Bilgiler</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Durum</span>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as ProjectStatusValue)
                            }
                        >
                            {STATUS_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Proje Kategori Tipi</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={projectType}
                            onChange={(event) => setProjectType(event.target.value)}
                            placeholder="Site, AVM, Residence..."
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Property Type</span>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={type}
                            onChange={(event) => setType(event.target.value)}
                        >
                            {PROPERTY_TYPES.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Firma</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
                        />
                    </label>
                    <label className="text-sm md:col-span-2">
                        <span className="mb-1 block text-gray-600">Başlık (TR)</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />
                    </label>
                    <label className="text-sm md:col-span-2">
                        <span className="mb-1 block text-gray-600">Açıklama (TR)</span>
                        <textarea
                            className="h-28 w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                    </label>
                    <label className="text-sm md:col-span-2">
                        <span className="mb-1 block text-gray-600">
                            Etiketler / Bullet'lar (satır başına 1)
                        </span>
                        <textarea
                            className="h-24 w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={featureBullets}
                            onChange={(event) => setFeatureBullets(event.target.value)}
                            placeholder="Öne Çıkan&#10;Lüks Konut"
                        />
                    </label>
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-base font-semibold text-gray-900">Konum ve Metrikler</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Şehir</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            required
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">İlçe</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={district}
                            onChange={(event) => setDistrict(event.target.value)}
                            required
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Mahalle</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={neighborhood}
                            onChange={(event) => setNeighborhood(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Teslim Tarihi</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={deliveryDate}
                            onChange={(event) => setDeliveryDate(event.target.value)}
                            placeholder="Aralık 2027"
                        />
                    </label>
                    <label className="text-sm md:col-span-2">
                        <span className="mb-1 block text-gray-600">Adres</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                        />
                    </label>
                    <label className="text-sm md:col-span-2">
                        <span className="mb-1 block text-gray-600">Google Maps Link</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={googleMapsLink}
                            onChange={(event) => setGoogleMapsLink(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Latitude</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={latitude}
                            onChange={(event) => setLatitude(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Longitude</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={longitude}
                            onChange={(event) => setLongitude(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Kart Fiyatı (opsiyonel)</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={price}
                            onChange={(event) => setPrice(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">Kart m² (opsiyonel)</span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={area}
                            onChange={(event) => setArea(event.target.value)}
                        />
                    </label>
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">
                        Proje Özellikleri (Genel + Sosyal)
                    </h2>
                    <button
                        type="button"
                        onClick={addProjectFeature}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4" /> Ekle
                    </button>
                </div>
                <div className="mt-4 space-y-3">
                    {projectFeatures.length === 0 && (
                        <p className="text-sm text-gray-500">Henüz özellik eklenmedi.</p>
                    )}
                    {projectFeatures.map((item, index) => (
                        <div
                            key={`feature-${index}`}
                            className="grid gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-4"
                        >
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Icon adı"
                                value={item.icon}
                                onChange={(event) =>
                                    setProjectFeatures((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, icon: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                                list={`project-icon-options-${index}`}
                            />
                            <datalist id={`project-icon-options-${index}`}>
                                {PROJECT_ICON_OPTIONS.map((iconName) => (
                                    <option key={iconName} value={iconName} />
                                ))}
                            </datalist>
                            <select
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                value={item.category}
                                onChange={(event) =>
                                    setProjectFeatures((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? {
                                                    ...entry,
                                                    category: event.target.value as FeatureCategory,
                                                }
                                                : entry
                                        )
                                    )
                                }
                            >
                                <option value="GENERAL">GENERAL</option>
                                <option value="SOCIAL">SOCIAL</option>
                            </select>
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2"
                                placeholder="Metin (TR)"
                                value={item.title}
                                onChange={(event) =>
                                    setProjectFeatures((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, title: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setProjectFeatures((prev) =>
                                        prev.filter((_, entryIndex) => entryIndex !== index)
                                    )
                                }
                                className="inline-flex w-max items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" /> Sil
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Özel Galeriler</h2>
                    <button
                        type="button"
                        onClick={addCustomGallery}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4" /> Ekle
                    </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    Media ID alanına virgülle ayırarak mevcut media kayıtlarını bağlayabilirsiniz.
                </p>
                <div className="mt-4 space-y-3">
                    {customGalleries.map((item, index) => (
                        <div
                            key={`gallery-${index}`}
                            className="grid gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-2"
                        >
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Başlık (TR)"
                                value={item.title}
                                onChange={(event) =>
                                    setCustomGalleries((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, title: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Alt başlık"
                                value={item.subtitle}
                                onChange={(event) =>
                                    setCustomGalleries((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, subtitle: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2"
                                placeholder="mediaId1, mediaId2"
                                value={item.mediaIdsRaw}
                                onChange={(event) =>
                                    setCustomGalleries((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, mediaIdsRaw: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setCustomGalleries((prev) =>
                                        prev.filter((_, entryIndex) => entryIndex !== index)
                                    )
                                }
                                className="inline-flex w-max items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" /> Sil
                            </button>
                        </div>
                    ))}
                    {customGalleries.length === 0 && (
                        <p className="text-sm text-gray-500">Henüz özel galeri eklenmedi.</p>
                    )}
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="text-base font-semibold text-gray-900">
                    Proje Medya Kategorileri
                </h2>
                <p className="mt-2 text-xs text-gray-500">
                    Bu alanlar ana section galerilerini belirler. Her satıra ilgili media ID
                    listesini virgülle girin.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">
                            Dış Görseller (EXTERIOR)
                        </span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="mediaId1, mediaId2"
                            value={exteriorMediaIdsRaw}
                            onChange={(event) => setExteriorMediaIdsRaw(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">
                            İç Görseller (INTERIOR)
                        </span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="mediaId1, mediaId2"
                            value={interiorMediaIdsRaw}
                            onChange={(event) => setInteriorMediaIdsRaw(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">
                            Harita Görselleri (MAP)
                        </span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="mediaId1, mediaId2"
                            value={mapMediaIdsRaw}
                            onChange={(event) => setMapMediaIdsRaw(event.target.value)}
                        />
                    </label>
                    <label className="text-sm">
                        <span className="mb-1 block text-gray-600">
                            Belgeler (DOCUMENT)
                        </span>
                        <input
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="mediaId1, mediaId2"
                            value={documentMediaIdsRaw}
                            onChange={(event) => setDocumentMediaIdsRaw(event.target.value)}
                        />
                    </label>
                </div>
                <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Belge Yükleme
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF, DOC, DOCX, PPT, PPTX dosyalarını yükleyebilirsiniz.
                            </p>
                        </div>
                        <label
                            className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                                !project?.id || isUploadingDocuments
                                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                    : "cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                            }`}
                        >
                            {isUploadingDocuments ? "Yükleniyor..." : "Belge Yükle"}
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                disabled={!project?.id || isUploadingDocuments}
                                onChange={handleDocumentUpload}
                            />
                        </label>
                    </div>
                    {!project?.id && (
                        <p className="mt-2 text-xs text-amber-700">
                            Önce projeyi oluşturun, sonra belge yükleyebilirsiniz.
                        </p>
                    )}
                    {documentUploadError && (
                        <p className="mt-2 text-xs text-red-600">{documentUploadError}</p>
                    )}
                    {documentUploadSuccess && (
                        <p className="mt-2 text-xs text-emerald-600">{documentUploadSuccess}</p>
                    )}
                    {documents.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {documents.map((document) => (
                                <div
                                    key={document.id}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs"
                                >
                                    <span className="font-mono text-gray-500">{document.id}</span>
                                    <a
                                        href={getMediaUrl(document.url)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-orange-600 hover:text-orange-700"
                                    >
                                        Dosyayı Aç
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Proje İçi Daireler</h2>
                    <button
                        type="button"
                        onClick={addProjectUnit}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4" /> Ekle
                    </button>
                </div>
                <div className="mt-4 space-y-3">
                    {projectUnits.map((item, index) => (
                        <div
                            key={`unit-${index}`}
                            className="grid gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-2"
                        >
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Başlık (TR)"
                                value={item.title}
                                onChange={(event) =>
                                    setProjectUnits((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, title: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Oda (örn. 2+1)"
                                value={item.rooms}
                                onChange={(event) =>
                                    setProjectUnits((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, rooms: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Alan (m²)"
                                value={item.areaRaw}
                                onChange={(event) =>
                                    setProjectUnits((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, areaRaw: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Fiyat (opsiyonel)"
                                value={item.priceRaw}
                                onChange={(event) =>
                                    setProjectUnits((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, priceRaw: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2"
                                placeholder="mediaId1, mediaId2"
                                value={item.mediaIdsRaw}
                                onChange={(event) =>
                                    setProjectUnits((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, mediaIdsRaw: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setProjectUnits((prev) =>
                                        prev.filter((_, entryIndex) => entryIndex !== index)
                                    )
                                }
                                className="inline-flex w-max items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" /> Sil
                            </button>
                        </div>
                    ))}
                    {projectUnits.length === 0 && (
                        <p className="text-sm text-gray-500">Henüz proje içi daire eklenmedi.</p>
                    )}
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Kat Planları</h2>
                    <button
                        type="button"
                        onClick={addFloorPlan}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4" /> Ekle
                    </button>
                </div>
                <div className="mt-4 space-y-3">
                    {floorPlans.map((item, index) => (
                        <div
                            key={`floor-${index}`}
                            className="grid gap-3 rounded-lg border border-gray-200 p-3 md:grid-cols-2"
                        >
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Başlık (TR)"
                                value={item.title}
                                onChange={(event) =>
                                    setFloorPlans((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, title: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Alan (örn. 110 m²)"
                                value={item.area}
                                onChange={(event) =>
                                    setFloorPlans((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, area: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2"
                                placeholder="Görsel URL"
                                value={item.imageUrl}
                                onChange={(event) =>
                                    setFloorPlans((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, imageUrl: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setFloorPlans((prev) =>
                                        prev.filter((_, entryIndex) => entryIndex !== index)
                                    )
                                }
                                className="inline-flex w-max items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" /> Sil
                            </button>
                        </div>
                    ))}
                    {floorPlans.length === 0 && (
                        <p className="text-sm text-gray-500">Henüz kat planı eklenmedi.</p>
                    )}
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Sıkça Sorulan Sorular</h2>
                    <button
                        type="button"
                        onClick={addFaq}
                        className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4" /> Ekle
                    </button>
                </div>
                <div className="mt-4 space-y-3">
                    {faqs.map((item, index) => (
                        <div
                            key={`faq-${index}`}
                            className="grid gap-3 rounded-lg border border-gray-200 p-3"
                        >
                            <input
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Soru"
                                value={item.question}
                                onChange={(event) =>
                                    setFaqs((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, question: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <textarea
                                className="h-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                placeholder="Cevap"
                                value={item.answer}
                                onChange={(event) =>
                                    setFaqs((prev) =>
                                        prev.map((entry, entryIndex) =>
                                            entryIndex === index
                                                ? { ...entry, answer: event.target.value }
                                                : entry
                                        )
                                    )
                                }
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setFaqs((prev) =>
                                        prev.filter((_, entryIndex) => entryIndex !== index)
                                    )
                                }
                                className="inline-flex w-max items-center gap-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" /> Sil
                            </button>
                        </div>
                    ))}
                    {faqs.length === 0 && (
                        <p className="text-sm text-gray-500">Henüz SSS eklenmedi.</p>
                    )}
                </div>
            </section>
        </form>
    );
}
