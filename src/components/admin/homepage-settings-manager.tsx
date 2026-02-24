"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { cn, getMediaUrl } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ManagedSectionKey = "projects" | "listings";

interface HomepageManagedItem {
    id: string;
    slug: string;
    sku: string | null;
    title: string;
    imageUrl: string | null;
    slot: number | null;
}

interface HomepageManagedSection {
    selected: HomepageManagedItem[];
    available: HomepageManagedItem[];
    limit: number;
}

interface HomepageSettingsPayload {
    video: {
        rawInput: string;
        watchUrl: string;
        autoplayEmbedUrl: string;
        popupEmbedUrl: string;
        videoId: string;
    };
    projects: HomepageManagedSection;
    listings: HomepageManagedSection;
}

const SECTION_LABELS: Record<ManagedSectionKey, string> = {
    projects: "Proje",
    listings: "İlan",
};

const SECTION_URLS: Record<ManagedSectionKey, (id: string) => string> = {
    projects: (id) => `/admin/projeler/${id}`,
    listings: (id) => `/admin/ilanlar/${id}`,
};

export function HomepageSettingsManager() {
    const [data, setData] = useState<HomepageSettingsPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [videoInput, setVideoInput] = useState("");
    const [isVideoSaving, setIsVideoSaving] = useState(false);
    const [savingSection, setSavingSection] = useState<ManagedSectionKey | null>(null);
    const [pendingProjectAddId, setPendingProjectAddId] = useState("");
    const [pendingListingAddId, setPendingListingAddId] = useState("");

    const loadData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/homepage", {
                cache: "no-store",
            });
            const payload = (await response.json().catch(() => null)) as
                | HomepageSettingsPayload
                | { error?: string }
                | null;

            if (!response.ok || !payload || !("video" in payload)) {
                throw new Error(
                    (payload && "error" in payload && payload.error) ||
                    "Ana sayfa ayarları alınamadı."
                );
            }

            setData(payload);
            setVideoInput(payload.video.rawInput || "");
        } catch (loadError) {
            const message =
                loadError instanceof Error
                    ? loadError.message
                    : "Ana sayfa ayarları alınamadı.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const updateSection = async (section: ManagedSectionKey, ids: string[]) => {
        setSavingSection(section);
        setError(null);

        try {
            const payload =
                section === "projects"
                    ? { projectIds: ids }
                    : { listingIds: ids };

            const response = await fetch("/api/admin/homepage", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const nextData = (await response.json().catch(() => null)) as
                | HomepageSettingsPayload
                | { error?: string }
                | null;

            if (!response.ok || !nextData || !("video" in nextData)) {
                throw new Error(
                    (nextData && "error" in nextData && nextData.error) ||
                    "Ana sayfa seçimi güncellenemedi."
                );
            }

            setData(nextData);
            setPendingProjectAddId("");
            setPendingListingAddId("");
        } catch (updateError) {
            const message =
                updateError instanceof Error
                    ? updateError.message
                    : "Ana sayfa seçimi güncellenemedi.";
            setError(message);
        } finally {
            setSavingSection(null);
        }
    };

    const updateVideo = async () => {
        setIsVideoSaving(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/homepage", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ videoUrl: videoInput }),
            });

            const payload = (await response.json().catch(() => null)) as
                | HomepageSettingsPayload
                | { error?: string }
                | null;

            if (!response.ok || !payload || !("video" in payload)) {
                throw new Error(
                    (payload && "error" in payload && payload.error) ||
                    "Video ayarı güncellenemedi."
                );
            }

            setData(payload);
            setVideoInput(payload.video.rawInput || "");
        } catch (updateError) {
            const message =
                updateError instanceof Error
                    ? updateError.message
                    : "Video ayarı güncellenemedi.";
            setError(message);
        } finally {
            setIsVideoSaving(false);
        }
    };

    const handleDragEnd = (sectionKey: ManagedSectionKey, event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            if (!data) return;
            const selected = data[sectionKey].selected;
            const oldIndex = selected.findIndex((item) => item.id === active.id);
            const newIndex = selected.findIndex((item) => item.id === over.id);

            const reordered = arrayMove(selected, oldIndex, newIndex);
            const ids = reordered.map((entry) => entry.id);

            void updateSection(sectionKey, ids);
        }
    };

    const removeItem = (section: ManagedSectionKey, id: string) => {
        if (!data) return;

        const selected = data[section].selected;
        if (selected.length <= 1) {
            setError(
                section === "projects"
                    ? "Ana sayfada en az 1 proje kalmalıdır."
                    : "Ana sayfada en az 1 ilan kalmalıdır."
            );
            return;
        }

        const ids = selected
            .filter((entry) => entry.id !== id)
            .map((entry) => entry.id);

        void updateSection(section, ids);
    };

    const addItem = (section: ManagedSectionKey) => {
        if (!data) return;

        const selected = data[section].selected;
        const pendingId =
            section === "projects" ? pendingProjectAddId : pendingListingAddId;

        if (!pendingId) {
            return;
        }

        if (selected.length >= data[section].limit) {
            setError(`En fazla ${data[section].limit} ${SECTION_LABELS[section]} seçilebilir.`);
            return;
        }

        const ids = [...selected.map((entry) => entry.id), pendingId];
        void updateSection(section, ids);
    };

    const hasVideoChanges = useMemo(() => {
        if (!data) return false;
        return videoInput.trim() !== (data.video.rawInput || "").trim();
    }, [data, videoInput]);

    if (isLoading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
                Ana sayfa ayarları yükleniyor...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {error || "Ana sayfa ayarları yüklenemedi."}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Hero Video</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Ana sayfada oynatılan videoyu YouTube URL ya da iframe kodu ile güncelle.
                </p>

                <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-black">
                        <div className="aspect-video">
                            <iframe
                                className="h-full w-full"
                                src={data.video.popupEmbedUrl}
                                title="Ana sayfa hero videosu"
                                frameBorder="0"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Video URL / iframe kodu
                        </label>
                        <textarea
                            value={videoInput}
                            onChange={(event) => setVideoInput(event.target.value)}
                            className="min-h-[150px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <a
                            href={data.video.watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex text-sm text-orange-600 hover:text-orange-700"
                        >
                            Mevcut videoyu YouTube uzerinde ac
                        </a>
                        <div>
                            <button
                                type="button"
                                onClick={updateVideo}
                                disabled={isVideoSaving || !hasVideoChanges}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                                    isVideoSaving || !hasVideoChanges
                                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                        : "bg-orange-500 text-white hover:bg-orange-600"
                                )}
                            >
                                {isVideoSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Video Ayarını Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Ana Sayfa Projeleri</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Ana sayfadaki proje kartlarını sırala, kaldır veya yeni proje ekle.
                    </p>
                    <ManagedSection
                        sectionKey="projects"
                        section={data.projects}
                        pendingAddId={pendingProjectAddId}
                        setPendingAddId={setPendingProjectAddId}
                        isSaving={savingSection === "projects"}
                        onDragEnd={handleDragEnd}
                        onRemove={removeItem}
                        onAdd={addItem}
                    />
                </section>

                <section className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Ana Sayfa İlanları</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Ana sayfadaki ilan kartlarını sırala, kaldır veya yeni ilan ekle.
                    </p>
                    <ManagedSection
                        sectionKey="listings"
                        section={data.listings}
                        pendingAddId={pendingListingAddId}
                        setPendingAddId={setPendingListingAddId}
                        isSaving={savingSection === "listings"}
                        onDragEnd={handleDragEnd}
                        onRemove={removeItem}
                        onAdd={addItem}
                    />
                </section>
            </div>
        </div>
    );
}

interface ManagedSectionProps {
    sectionKey: ManagedSectionKey;
    section: HomepageManagedSection;
    pendingAddId: string;
    setPendingAddId: (value: string) => void;
    isSaving: boolean;
    onDragEnd: (sectionKey: ManagedSectionKey, event: DragEndEvent) => void;
    onRemove: (sectionKey: ManagedSectionKey, id: string) => void;
    onAdd: (sectionKey: ManagedSectionKey) => void;
}

function SortableItem({
    item,
    sectionKey,
    isSaving,
    isRemoveDisabled,
    onRemove
}: {
    item: HomepageManagedItem;
    sectionKey: ManagedSectionKey;
    isSaving: boolean;
    isRemoveDisabled: boolean;
    onRemove: (sectionKey: ManagedSectionKey, id: string) => void;
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
    };

    const itemLabel = item.sku ? `${item.title} (SKU: ${item.sku})` : item.title || item.slug;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-3 py-3 lg:flex-row lg:items-center shadow-sm",
                isDragging && "opacity-50 shadow-md ring-2 ring-orange-500 scale-[1.02]"
            )}
        >
            <div className="flex items-center gap-3 flex-1">
                <button
                    type="button"
                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 focus:outline-none"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-5 w-5" />
                </button>
                <div className="flex-shrink-0 h-12 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
                    {item.imageUrl ? (
                        <img
                            src={getMediaUrl(item.imageUrl)}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                    )}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-900">{itemLabel}</p>
                    <p className="text-xs text-gray-500">/{item.slug}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                <button
                    type="button"
                    onClick={() => onRemove(sectionKey, item.id)}
                    disabled={isSaving || isRemoveDisabled}
                    className={cn(
                        "inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium",
                        isSaving || isRemoveDisabled
                            ? "cursor-not-allowed border-red-100 text-red-300 bg-red-50/50"
                            : "border-red-200 text-red-600 hover:bg-red-50"
                    )}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Kaldır
                </button>
                <Link
                    href={SECTION_URLS[sectionKey](item.id)}
                    className="inline-flex items-center rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 bg-white"
                >
                    Düzenle
                </Link>
            </div>
        </div>
    );
}

function ManagedSection({
    sectionKey,
    section,
    pendingAddId,
    setPendingAddId,
    isSaving,
    onDragEnd,
    onRemove,
    onAdd,
}: ManagedSectionProps) {
    const canAddMore = section.selected.length < section.limit;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="mt-5 space-y-4">
            <div className="space-y-2 relative">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => onDragEnd(sectionKey, event)}
                >
                    <SortableContext
                        items={section.selected.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {section.selected.map((item) => (
                            <SortableItem
                                key={item.id}
                                item={item}
                                sectionKey={sectionKey}
                                isSaving={isSaving}
                                isRemoveDisabled={section.selected.length <= 1}
                                onRemove={onRemove}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-4 mt-6 bg-gray-50">
                <p className="mb-2 text-sm font-medium text-gray-700">
                    Yeni {SECTION_LABELS[sectionKey]} Ekle
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                    <div className="flex-1">
                        <Select
                            value={pendingAddId || null}
                            onChange={(val) => setPendingAddId(val as string)}
                            placeholder="Seçim yap..."
                            searchable={true}
                            searchPlaceholder="Ara..."
                            placement="top"
                            options={section.available.map((item) => {
                                const label = item.sku ? `${item.title} (SKU: ${item.sku})` : item.title || item.slug;
                                return {
                                    value: item.id,
                                    label: label,
                                };
                            })}
                            className={cn(
                                (!canAddMore || isSaving) &&
                                "pointer-events-none opacity-60"
                            )}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => onAdd(sectionKey)}
                        disabled={!canAddMore || isSaving || !pendingAddId}
                        className={cn(
                            "inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
                            !canAddMore || isSaving || !pendingAddId
                                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-500/20"
                        )}
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Ekle
                    </button>
                </div>
                {!canAddMore ? (
                    <p className="mt-2 text-xs text-gray-500">
                        Maksimum {section.limit} {SECTION_LABELS[sectionKey].toLowerCase()} seçilebilir.
                    </p>
                ) : null}
            </div>
        </div>
    );
}
