"use client";

import Image from "next/image";
import {
    ChevronLeft,
    ChevronRight,
    ImageOff,
    Images,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export interface ListingGalleryItem {
    id: string;
    src: string;
    alt: string;
}

interface ListingDetailGalleryProps {
    items: ListingGalleryItem[];
    title: string;
}

export function ListingDetailGallery({ items, title }: ListingDetailGalleryProps) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const total = items.length;
    const hasItems = total > 0;
    const canNavigate = total > 1;

    const coverImage = items[0];
    const secondImage = items[1] ?? items[0];
    const activeLightboxItem =
        lightboxIndex !== null ? items[lightboxIndex] : null;

    const lightboxCounterLabel = useMemo(() => {
        if (lightboxIndex === null) {
            return "";
        }
        return `${lightboxIndex + 1} / ${total}`;
    }, [lightboxIndex, total]);

    const openLightbox = (index: number) => {
        if (!hasItems) {
            return;
        }
        setLightboxIndex(index);
    };

    const closeLightbox = () => setLightboxIndex(null);

    const goToPrevious = () => {
        if (!canNavigate || lightboxIndex === null) {
            return;
        }
        setLightboxIndex((previous) => {
            if (previous === null) {
                return previous;
            }
            return (previous - 1 + total) % total;
        });
    };

    const goToNext = () => {
        if (!canNavigate || lightboxIndex === null) {
            return;
        }
        setLightboxIndex((previous) => {
            if (previous === null) {
                return previous;
            }
            return (previous + 1) % total;
        });
    };

    const portalTarget =
        typeof window !== "undefined" ? document.body : null;

    useEffect(() => {
        const hasOverlay = isGalleryOpen || lightboxIndex !== null;
        if (!hasOverlay) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isGalleryOpen, lightboxIndex]);

    useEffect(() => {
        if (!isGalleryOpen && lightboxIndex === null) {
            return;
        }

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (lightboxIndex !== null) {
                    setLightboxIndex(null);
                    return;
                }
                setIsGalleryOpen(false);
                return;
            }

            if (lightboxIndex === null || !canNavigate) {
                return;
            }

            if (event.key === "ArrowLeft") {
                setLightboxIndex((previous) => {
                    if (previous === null) {
                        return previous;
                    }
                    return (previous - 1 + total) % total;
                });
            } else if (event.key === "ArrowRight") {
                setLightboxIndex((previous) => {
                    if (previous === null) {
                        return previous;
                    }
                    return (previous + 1) % total;
                });
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [canNavigate, isGalleryOpen, lightboxIndex, total]);

    if (!hasItems) {
        return (
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-100">
                <div className="aspect-[16/10] flex flex-col items-center justify-center gap-3 text-gray-400">
                    <ImageOff className="h-10 w-10" />
                    <p className="text-sm font-medium">Bu ilan için görsel yüklenmemiş</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-3 md:h-[clamp(330px,45vw,520px)] md:grid-cols-4">
                <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    className="group relative overflow-hidden rounded-[1.8rem] border border-gray-200 bg-gray-100 text-left md:col-span-3 md:h-full"
                    aria-label="Kapak görselini tam ekran aç"
                >
                    <div className="relative aspect-[16/10] md:h-full md:aspect-auto">
                        <Image
                            src={coverImage.src}
                            alt={coverImage.alt || title}
                            fill
                            priority
                            className="object-cover transition duration-500 group-hover:scale-[1.015]"
                            sizes="(min-width: 768px) 75vw, 100vw"
                        />
                    </div>
                </button>

                <div className="grid gap-3 md:h-full md:grid-rows-2">
                    <button
                        type="button"
                        onClick={() => openLightbox(Math.min(1, total - 1))}
                        className="relative overflow-hidden rounded-[1.4rem] border border-gray-200 bg-gray-100 md:h-full"
                        aria-label="İkinci görseli tam ekran aç"
                    >
                        <div className="relative aspect-[16/9] md:h-full md:aspect-auto">
                            <Image
                                src={secondImage.src}
                                alt={secondImage.alt || `${title} ikinci görsel`}
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 25vw, 100vw"
                            />
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsGalleryOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-[1.4rem] border border-gray-900 bg-gray-900 px-4 py-4 text-base font-semibold text-white transition hover:bg-black md:h-full"
                    >
                        <Images className="h-4 w-4" />
                        Galeri
                    </button>
                </div>
            </div>

            {portalTarget
                ? createPortal(
                    <>
                        {isGalleryOpen ? (
                            <div
                                className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm"
                                onClick={() => setIsGalleryOpen(false)}
                            >
                                <div
                                    className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 text-gray-900">
                                        <div>
                                            <h3 className="text-lg font-semibold">Galeri</h3>
                                            <p className="text-sm text-gray-500">{total} fotoğraf</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsGalleryOpen(false)}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-gray-400 hover:text-gray-800"
                                            aria-label="Galeriyi kapat"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto p-4 sm:p-5">
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                            {items.map((item, index) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => openLightbox(index)}
                                                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                                                    aria-label={`Fotoğraf ${index + 1} tam ekran aç`}
                                                >
                                                    <Image
                                                        src={item.src}
                                                        alt={item.alt || `${title} ${index + 1}`}
                                                        fill
                                                        className="object-cover transition duration-300 hover:scale-[1.03]"
                                                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {lightboxIndex !== null && activeLightboxItem ? (
                            <div
                                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3"
                                onClick={closeLightbox}
                            >
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        closeLightbox();
                                    }}
                                    className="absolute right-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:border-white/40"
                                    aria-label="Tam ekran görseli kapat"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                {canNavigate ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                goToPrevious();
                                            }}
                                            aria-label="Önceki fotoğraf"
                                            className="absolute left-3 top-1/2 z-[10000] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:border-white/60"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                goToNext();
                                            }}
                                            aria-label="Sonraki fotoğraf"
                                            className="absolute right-3 top-1/2 z-[10000] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white transition hover:border-white/60"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                ) : null}

                                <div
                                    className="relative h-[88vh] w-[95vw] max-w-[1800px]"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <Image
                                        src={activeLightboxItem.src}
                                        alt={activeLightboxItem.alt || title}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        priority
                                    />
                                </div>

                                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-sm font-medium text-white">
                                    {lightboxCounterLabel}
                                </p>
                            </div>
                        ) : null}
                    </>,
                    portalTarget
                )
                : null}
        </>
    );
}
