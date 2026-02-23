"use client";

import Image from "next/image";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ImageOff,
    Images,
    X,
} from "lucide-react";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

export interface ListingGalleryItem {
    id: string;
    src: string;
    alt: string;
}

export type ListingDetailGalleryLayout = "collage" | "carousel" | "hidden";

export interface ListingDetailGalleryHandle {
    openGallery: () => void;
    openAt: (index: number) => void;
}

interface ListingDetailGalleryProps {
    items: ListingGalleryItem[];
    title: string;
    isRemoved?: boolean;
    layout?: ListingDetailGalleryLayout;
    showInlineThumbnails?: boolean;
    desktopHeightClass?: string;
    className?: string;
    galleryButtonLabel?: string;
    onRequestOpenGallery?: () => void;
    galleryTabs?: Array<{ key: string; label: string }>;
    activeGalleryTabKey?: string;
    onGalleryTabChange?: (key: string) => void;
    onApiReady?: (api: ListingDetailGalleryHandle | null) => void;
}

const subscribeNoop = () => () => {};
const IMAGE_SWIPE_THRESHOLD_PX = 48;
const OVERLAY_STATE_KEY = "__listingOverlay";
const isMobileViewport = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

export function ListingDetailGallery({
    items,
    title,
    isRemoved = false,
    layout = "collage",
    showInlineThumbnails = false,
    desktopHeightClass = "h-[clamp(330px,42vw,510px)]",
    className,
    galleryButtonLabel = "Galeri",
    onRequestOpenGallery,
    galleryTabs,
    activeGalleryTabKey,
    onGalleryTabChange,
    onApiReady,
}: ListingDetailGalleryProps) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isReelOpen, setIsReelOpen] = useState(false);
    const [desktopCarouselIndex, setDesktopCarouselIndex] = useState<number | null>(
        null
    );
    const [inlineCarouselIndex, setInlineCarouselIndex] = useState(0);
    const [activeReelIndex, setActiveReelIndex] = useState(0);

    const reelScrollerRef = useRef<HTMLDivElement | null>(null);
    const initialReelIndexRef = useRef(0);
    const touchStartXRef = useRef<number | null>(null);
    const didSwipeRef = useRef(false);

    const total = items.length;
    const carouselItems = useMemo(() => items.slice(0, 4), [items]);
    const carouselTotal = carouselItems.length;
    const hasItems = total > 0;
    const canNavigate = total > 1;
    const canNavigateCarousel = carouselTotal > 1;
    const useExternalGallery = Boolean(onRequestOpenGallery);

    const activeReelCounter = useMemo(() => {
        if (!hasItems) {
            return "0 / 0";
        }
        return `${activeReelIndex + 1} / ${total}`;
    }, [activeReelIndex, hasItems, total]);
    const activeDesktopItem =
        desktopCarouselIndex !== null ? items[desktopCarouselIndex] : null;
    const desktopCarouselCounter = useMemo(() => {
        if (desktopCarouselIndex === null) {
            return "";
        }
        return `${desktopCarouselIndex + 1} / ${total}`;
    }, [desktopCarouselIndex, total]);
    const isHydrated = useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );

    const normalizeIndex = useCallback(
        (index: number) => {
            if (!hasItems) {
                return 0;
            }
            return Math.max(0, Math.min(total - 1, index));
        },
        [hasItems, total]
    );
    const coverImage = items[0];
    const secondImage = items[1] ?? items[0];
    const thirdImage = items[2] ?? items[1] ?? items[0];
    const currentCarouselInlineIndex = Math.max(
        0,
        Math.min(carouselTotal - 1, inlineCarouselIndex)
    );

    const pushOverlayState = useCallback((overlay: "gallery" | "reel") => {
        if (typeof window === "undefined") {
            return;
        }

        window.history.pushState(
            {
                ...(window.history.state ?? {}),
                [OVERLAY_STATE_KEY]: overlay,
            },
            ""
        );
    }, []);

    const consumeMobileOverlayBack = useCallback((expectedOverlay: "gallery" | "reel") => {
        if (typeof window === "undefined" || !isMobileViewport()) {
            return false;
        }

        const currentOverlay = window.history.state?.[OVERLAY_STATE_KEY];
        if (currentOverlay !== expectedOverlay) {
            return false;
        }

        window.history.back();
        return true;
    }, []);

    const openGallery = useCallback(() => {
        if (!hasItems) {
            return;
        }

        setIsGalleryOpen(true);

        if (!isMobileViewport()) {
            return;
        }

        const currentOverlay = window.history.state?.[OVERLAY_STATE_KEY];
        if (currentOverlay === "gallery" || currentOverlay === "reel") {
            return;
        }

        pushOverlayState("gallery");
    }, [hasItems, pushOverlayState]);

    const openGalleryFromPreview = useCallback(() => {
        if (!hasItems) {
            return;
        }

        if (onRequestOpenGallery) {
            onRequestOpenGallery();
            return;
        }

        openGallery();
    }, [hasItems, onRequestOpenGallery, openGallery]);

    const openReels = useCallback(
        (index: number) => {
            if (!hasItems) {
                return;
            }
            const nextIndex = normalizeIndex(index);
            initialReelIndexRef.current = nextIndex;
            setActiveReelIndex(nextIndex);

            if (isMobileViewport()) {
                const currentOverlay = window.history.state?.[OVERLAY_STATE_KEY];
                if (currentOverlay !== "gallery" && currentOverlay !== "reel") {
                    pushOverlayState("gallery");
                }
                if (window.history.state?.[OVERLAY_STATE_KEY] !== "reel") {
                    pushOverlayState("reel");
                }
                setIsGalleryOpen(true);
            }

            setIsReelOpen(true);
        },
        [hasItems, normalizeIndex, pushOverlayState]
    );

    const closeReels = useCallback(() => {
        if (consumeMobileOverlayBack("reel")) {
            return;
        }
        setIsReelOpen(false);
    }, [consumeMobileOverlayBack]);

    const closeGallery = useCallback(() => {
        if (consumeMobileOverlayBack("gallery")) {
            return;
        }
        setIsGalleryOpen(false);
    }, [consumeMobileOverlayBack]);

    const closeDesktopCarousel = () => setDesktopCarouselIndex(null);

    const openDesktopCarousel = useCallback(
        (index: number) => {
            if (!hasItems) {
                return;
            }
            setDesktopCarouselIndex(normalizeIndex(index));
        },
        [hasItems, normalizeIndex]
    );

    const openAt = useCallback(
        (index: number) => {
            if (!hasItems) {
                return;
            }

            const nextIndex = normalizeIndex(index);
            setInlineCarouselIndex(nextIndex);

            if (isMobileViewport()) {
                openReels(nextIndex);
                return;
            }

            openDesktopCarousel(nextIndex);
        },
        [hasItems, normalizeIndex, openDesktopCarousel, openReels]
    );

    const goToDesktopPrevious = useCallback(() => {
        if (!canNavigate) {
            return;
        }
        setDesktopCarouselIndex((previous) => {
            if (previous === null) {
                return previous;
            }
            return (previous - 1 + total) % total;
        });
    }, [canNavigate, total]);

    const goToDesktopNext = useCallback(() => {
        if (!canNavigate) {
            return;
        }
        setDesktopCarouselIndex((previous) => {
            if (previous === null) {
                return previous;
            }
            return (previous + 1) % total;
        });
    }, [canNavigate, total]);

    const updateInlineImageIndex = useCallback((direction: "prev" | "next") => {
        if (!canNavigateCarousel) {
            return;
        }

        setInlineCarouselIndex((previous) => {
            const maxIndex = Math.max(0, carouselTotal - 1);
            const clamped = Math.max(0, Math.min(previous, maxIndex));
            if (direction === "next") {
                return clamped >= maxIndex ? 0 : clamped + 1;
            }
            return clamped <= 0 ? maxIndex : clamped - 1;
        });
    }, [canNavigateCarousel, carouselTotal]);

    const goToReel = useCallback((index: number) => {
        const container = reelScrollerRef.current;
        if (!container) {
            return;
        }

        const nextIndex = Math.max(0, Math.min(total - 1, index));
        const nextSlide = container.querySelector<HTMLElement>(
            `[data-reel-index="${nextIndex}"]`
        );

        setActiveReelIndex(nextIndex);

        if (nextSlide) {
            nextSlide.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        container.scrollTo({
            top: nextIndex * container.clientHeight,
            behavior: "smooth",
        });
    }, [total]);

    const scrollReels = useCallback((direction: -1 | 1) => {
        goToReel(activeReelIndex + direction);
    }, [activeReelIndex, goToReel]);

    const handleMobileTouchStart = (
        event: React.TouchEvent<HTMLDivElement>
    ) => {
        didSwipeRef.current = false;
        const point = event.touches[0];
        if (!point) {
            return;
        }
        touchStartXRef.current = point.clientX;
    };

    const handleMobileTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canNavigate) {
            touchStartXRef.current = null;
            return;
        }

        const startX = touchStartXRef.current;
        const point = event.changedTouches[0];
        touchStartXRef.current = null;

        if (startX === null || !point) {
            return;
        }

        const deltaX = point.clientX - startX;
        if (Math.abs(deltaX) < IMAGE_SWIPE_THRESHOLD_PX) {
            return;
        }

        didSwipeRef.current = true;
        updateInlineImageIndex(deltaX < 0 ? "next" : "prev");
    };

    const handleMobileTouchCancel = () => {
        touchStartXRef.current = null;
        didSwipeRef.current = false;
    };

    useEffect(() => {
        if (!isReelOpen) {
            return;
        }

        const rafId = window.requestAnimationFrame(() => {
            const container = reelScrollerRef.current;
            if (!container) {
                return;
            }

            const initialIndex = Math.max(
                0,
                Math.min(total - 1, initialReelIndexRef.current)
            );
            setActiveReelIndex(initialIndex);

            const initialSlide = container.querySelector<HTMLElement>(
                `[data-reel-index="${initialIndex}"]`
            );

            if (initialSlide) {
                initialSlide.scrollIntoView({ block: "start" });
                return;
            }

            container.scrollTo({
                top: initialIndex * container.clientHeight,
                behavior: "auto",
            });
        });

        return () => {
            window.cancelAnimationFrame(rafId);
        };
    }, [isReelOpen, total]);

    useEffect(() => {
        const hasOverlay =
            isGalleryOpen || isReelOpen || desktopCarouselIndex !== null;
        if (!hasOverlay) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [desktopCarouselIndex, isGalleryOpen, isReelOpen]);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        const syncOverlayByHistoryState = (state: unknown) => {
            if (!isMobileViewport()) {
                return;
            }

            const overlayState =
                typeof state === "object" && state !== null
                    ? (state as Record<string, unknown>)[OVERLAY_STATE_KEY]
                    : null;

            if (overlayState === "reel") {
                setIsGalleryOpen(true);
                setIsReelOpen(true);
                return;
            }

            if (overlayState === "gallery") {
                setIsGalleryOpen(true);
                setIsReelOpen(false);
                return;
            }

            setIsReelOpen(false);
            setIsGalleryOpen(false);
        };

        const handlePopState = (event: PopStateEvent) => {
            syncOverlayByHistoryState(event.state);
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isHydrated]);

    useEffect(() => {
        if (!isGalleryOpen && !isReelOpen && desktopCarouselIndex === null) {
            return;
        }

        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (isReelOpen) {
                    closeReels();
                    return;
                }
                if (desktopCarouselIndex !== null) {
                    closeDesktopCarousel();
                    return;
                }
                closeGallery();
                return;
            }

            if (desktopCarouselIndex !== null && canNavigate) {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    goToDesktopPrevious();
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    goToDesktopNext();
                }
            }

            if (!isReelOpen || !canNavigate) {
                return;
            }
            if (event.key === "ArrowUp" || event.key === "PageUp") {
                event.preventDefault();
                scrollReels(-1);
            } else if (event.key === "ArrowDown" || event.key === "PageDown") {
                event.preventDefault();
                scrollReels(1);
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [
        canNavigate,
        closeGallery,
        closeReels,
        desktopCarouselIndex,
        goToDesktopNext,
        goToDesktopPrevious,
        isGalleryOpen,
        isReelOpen,
        scrollReels,
    ]);

    useEffect(() => {
        if (!onApiReady) {
            return;
        }

        onApiReady({
            openGallery,
            openAt,
        });

        return () => {
            onApiReady(null);
        };
    }, [onApiReady, openAt, openGallery]);

    const renderRemovedBadge = () => {
        if (!isRemoved) return null;

        return (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-4">
                <div className="rounded-xl border border-red-300 bg-red-600/95 px-5 py-3 text-center text-sm font-semibold text-white shadow-[0_10px_30px_rgba(220,38,38,0.35)] md:text-base">
                    Bu İlan Kaldırıldı
                </div>
            </div>
        );
    };

    if (!hasItems) {
        if (layout === "hidden") {
            return null;
        }

        return (
            <div className={className}>
                <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-100">
                    <div className="aspect-[16/10] flex flex-col items-center justify-center gap-3 text-gray-400">
                        <ImageOff className="h-10 w-10" />
                        <p className="text-sm font-medium">Bu ilan için görsel yüklenmemiş</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {layout !== "hidden" ? (
                <div className={className}>
                    <div className="md:hidden">
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ touchAction: "pan-y" }}
                                onTouchStart={handleMobileTouchStart}
                                onTouchEnd={handleMobileTouchEnd}
                                onTouchCancel={handleMobileTouchCancel}
                                onClick={() => {
                                    if (didSwipeRef.current) {
                                        didSwipeRef.current = false;
                                        return;
                                    }
                                    openGalleryFromPreview();
                                }}
                            >
                                <div
                                    className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    style={{
                                        transform: `translateX(-${currentCarouselInlineIndex * 100}%)`,
                                    }}
                                >
                                    {carouselItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="relative h-full w-full shrink-0"
                                        >
                                            <Image
                                                src={item.src}
                                                alt={item.alt || `${title} ${index + 1}`}
                                                fill
                                                priority={index === 0}
                                                className="object-cover"
                                                sizes="100vw"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {renderRemovedBadge()}

                            {canNavigateCarousel ? (
                                <div className="absolute bottom-3 right-3 z-20 flex items-center overflow-hidden rounded-lg border border-slate-200/90 bg-white/95 shadow-[0_4px_14px_rgba(15,23,42,0.18)] backdrop-blur-[2px]">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            updateInlineImageIndex("prev");
                                        }}
                                        className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                                        aria-label="Önceki görsel"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            updateInlineImageIndex("next");
                                        }}
                                        className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                                        aria-label="Sonraki görsel"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {layout === "collage" ? (
                        <div className="hidden gap-3 md:grid md:h-[clamp(330px,45vw,520px)] md:grid-cols-4">
                            <button
                                type="button"
                                onClick={openGalleryFromPreview}
                                className="relative overflow-hidden rounded-[1.8rem] border border-gray-200 bg-gray-100 text-left md:col-span-3 md:h-full"
                                aria-label="Fotoğraf galerisini aç"
                            >
                                <div className="relative aspect-[16/10] md:h-full md:aspect-auto">
                                    <Image
                                        src={coverImage.src}
                                        alt={coverImage.alt || title}
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="(min-width: 768px) 75vw, 100vw"
                                    />
                                </div>
                                {renderRemovedBadge()}
                            </button>

                            <div className="grid gap-3 md:h-full md:grid-rows-2">
                                <button
                                    type="button"
                                    onClick={openGalleryFromPreview}
                                    className="relative overflow-hidden rounded-[1.4rem] border border-gray-200 bg-gray-100 md:h-full"
                                    aria-label="Fotoğraf galerisini aç"
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

                                <div className="relative overflow-hidden rounded-[1.4rem] border border-gray-200 bg-gray-100 md:h-full">
                                    <button
                                        type="button"
                                        onClick={openGalleryFromPreview}
                                        className="relative h-full w-full text-left"
                                        aria-label="Fotoğraf galerisini aç"
                                    >
                                        <div className="relative aspect-[16/9] md:h-full md:aspect-auto">
                                            <Image
                                                src={thirdImage.src}
                                                alt={thirdImage.alt || `${title} üçüncü görsel`}
                                                fill
                                                className="object-cover"
                                                sizes="(min-width: 768px) 25vw, 100vw"
                                            />
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={openGalleryFromPreview}
                                        className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3.5 py-2 text-xs font-semibold text-[#111828] transition hover:bg-white"
                                    >
                                        <Images className="h-3.5 w-3.5" />
                                        {galleryButtonLabel}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:block">
                            <div className="relative overflow-hidden rounded-[1.8rem] border border-gray-200 bg-gray-100">
                                <button
                                    type="button"
                                    onClick={openGalleryFromPreview}
                                    className={`relative block w-full overflow-hidden text-left ${desktopHeightClass}`}
                                    aria-label="Fotoğraf galerisini aç"
                                >
                                    <div className="absolute inset-0">
                                        <div
                                            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                            style={{
                                                transform: `translateX(-${currentCarouselInlineIndex * 100}%)`,
                                            }}
                                        >
                                            {carouselItems.map((item, index) => (
                                                <div
                                                    key={`${item.id}-desktop-slide`}
                                                    className="relative h-full w-full shrink-0"
                                                >
                                                    <Image
                                                        src={item.src}
                                                        alt={item.alt || `${title} ${index + 1}`}
                                                        fill
                                                        priority={index === 0}
                                                        className="object-cover"
                                                        sizes="(min-width: 1280px) 54vw, (min-width: 768px) 70vw, 100vw"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </button>

                                {renderRemovedBadge()}

                                {canNavigateCarousel ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                updateInlineImageIndex("prev");
                                            }}
                                            className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition hover:border-white/55"
                                            aria-label="Önceki görsel"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                updateInlineImageIndex("next");
                                            }}
                                            className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition hover:border-white/55"
                                            aria-label="Sonraki görsel"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : null}

                                <button
                                    type="button"
                                    onClick={openGalleryFromPreview}
                                    className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3.5 py-2 text-xs font-semibold text-[#111828] transition hover:bg-white"
                                >
                                    <Images className="h-3.5 w-3.5" />
                                    {galleryButtonLabel}
                                </button>
                            </div>

                            {showInlineThumbnails && carouselTotal > 1 ? (
                                <div className="mt-3 grid grid-cols-4 gap-3">
                                    {carouselItems.map((item, index) => (
                                        <button
                                            key={`${item.id}-thumb`}
                                            type="button"
                                            onClick={() => setInlineCarouselIndex(index)}
                                            className={`relative aspect-[4/3] overflow-hidden rounded-xl border ${
                                                index === currentCarouselInlineIndex
                                                    ? "border-orange-500"
                                                    : "border-gray-200"
                                            } bg-gray-100`}
                                            aria-label={`Fotoğraf ${index + 1} seç`}
                                        >
                                            <Image
                                                src={item.src}
                                                alt={item.alt || `${title} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(min-width: 1024px) 12vw, 25vw"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            ) : null}

            {isHydrated && !useExternalGallery
                ? createPortal(
                    <>
                        {isGalleryOpen ? (
                            <div
                                className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-[2px]"
                                onClick={closeGallery}
                            >
                                <div
                                    className="absolute inset-x-0 bottom-0 top-[6vh] flex flex-col overflow-hidden rounded-t-[2rem] border border-gray-200 bg-[#f8fafc] md:inset-y-14 md:inset-x-[10vw] md:rounded-3xl lg:inset-x-[14vw]"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 text-gray-900">
                                        <div>
                                            <h3 className="text-lg font-semibold">Galeri</h3>
                                            <p className="text-sm text-gray-500">{total} fotoğraf</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={closeGallery}
                                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:border-gray-400 hover:text-gray-800"
                                            aria-label="Galeriyi kapat"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {galleryTabs && galleryTabs.length > 1 ? (
                                        <div className="border-b border-gray-200 px-4 py-3 sm:px-5">
                                            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                                {galleryTabs.map((tab) => (
                                                    <button
                                                        key={tab.key}
                                                        type="button"
                                                        onClick={() => onGalleryTabChange?.(tab.key)}
                                                        className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                                                            activeGalleryTabKey === tab.key
                                                                ? "border-[#111828] bg-[#111828] text-white"
                                                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                                        }`}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="overflow-y-auto px-4 pb-5 pt-4 sm:px-5">
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                            {items.map((item, index) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isMobileViewport()) {
                                                            openReels(index);
                                                            return;
                                                        }
                                                        setIsGalleryOpen(false);
                                                        openDesktopCarousel(index);
                                                    }}
                                                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-gray-100"
                                                    aria-label={`Fotoğraf ${index + 1} tam ekran aç`}
                                                >
                                                    <Image
                                                        src={item.src}
                                                        alt={item.alt || `${title} ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {desktopCarouselIndex !== null && activeDesktopItem ? (
                            <div
                                className="fixed inset-0 z-[9999] hidden items-center justify-center bg-black/95 p-4 md:flex"
                                onClick={closeDesktopCarousel}
                            >
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        closeDesktopCarousel();
                                    }}
                                    className="absolute right-5 top-5 z-[10001] flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition hover:border-white/55"
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
                                                goToDesktopPrevious();
                                            }}
                                            className="absolute left-4 top-1/2 z-[10001] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition hover:border-white/55"
                                            aria-label="Önceki görsel"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                goToDesktopNext();
                                            }}
                                            className="absolute right-4 top-1/2 z-[10001] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition hover:border-white/55"
                                            aria-label="Sonraki görsel"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                ) : null}

                                <div
                                    className="relative h-[84vh] w-[82vw] max-w-[1320px]"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <Image
                                        src={activeDesktopItem.src}
                                        alt={activeDesktopItem.alt || title}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        priority
                                    />
                                </div>

                                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/25 bg-black/45 px-4 py-1.5 text-sm font-medium text-white">
                                    {desktopCarouselCounter}
                                </p>
                            </div>
                        ) : null}

                        {isReelOpen ? (
                            <div className="fixed inset-0 z-[9999] bg-black">
                                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-24 bg-gradient-to-b from-black/70 to-transparent" />

                                <div className="absolute inset-x-0 top-4 z-30 flex items-center justify-between px-4">
                                    <p className="rounded-full border border-white/25 bg-black/45 px-3 py-1 text-xs font-semibold text-white">
                                        {activeReelCounter}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={closeReels}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition hover:border-white/50"
                                        aria-label="Tam ekran görseli kapat"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {canNavigate ? (
                                    <div className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2">
                                        <button
                                            type="button"
                                            onClick={() => scrollReels(-1)}
                                            disabled={activeReelIndex === 0}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition enabled:hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-35"
                                            aria-label="Önceki görsel"
                                        >
                                            <ChevronUp className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => scrollReels(1)}
                                            disabled={activeReelIndex === total - 1}
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition enabled:hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-35"
                                            aria-label="Sonraki görsel"
                                        >
                                            <ChevronDown className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : null}

                                <div
                                    ref={reelScrollerRef}
                                    onScroll={() => {
                                        const container = reelScrollerRef.current;
                                        if (!container) {
                                            return;
                                        }

                                        const rawIndex = Math.round(
                                            container.scrollTop /
                                            Math.max(1, container.clientHeight)
                                        );
                                        const nextIndex = Math.max(
                                            0,
                                            Math.min(total - 1, rawIndex)
                                        );
                                        if (nextIndex !== activeReelIndex) {
                                            setActiveReelIndex(nextIndex);
                                        }
                                    }}
                                    className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                                >
                                    {items.map((item, index) => (
                                        <section
                                            key={`${item.id}-reel`}
                                            data-reel-index={index}
                                            className="relative h-[100svh] snap-start snap-always"
                                        >
                                            <div className="relative h-full w-full px-2 pb-14 pt-16 md:px-6">
                                                <Image
                                                    src={item.src}
                                                    alt={item.alt || `${title} ${index + 1}`}
                                                    fill
                                                    className="object-contain"
                                                    sizes="100vw"
                                                    priority={index === activeReelIndex}
                                                />
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </>,
                    document.body
                )
                : null}
        </>
    );
}
