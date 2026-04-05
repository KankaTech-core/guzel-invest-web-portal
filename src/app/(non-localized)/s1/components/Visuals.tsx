"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, ZoomIn, Images } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { S1SectionVisibility } from "../section-visibility";
import {
    S1CustomGalleryData,
    S1ExteriorVisualsData,
    S1FloorPlansData,
    S1InteriorVisualsData,
    S1SocialFacilitiesData,
} from "../types";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import {
    ListingDetailGallery,
    type ListingGalleryItem,
} from "@/components/public/listing-detail-gallery";
import { buildViewAllLabelClassName } from "@/components/public/view-all-label-classes";
import { dispatchOpenConnectedProjectGallery } from "./project-gallery-events";
import { hasSocialGalleryImages } from "./media-layout";
import { getPeekingCarouselTranslatePx } from "./peeking-carousel-math";
import {
    buildPeekingPreviewItems,
    type PeekingPreviewCard,
} from "./peeking-preview-items";

interface VisualsProps {
    exteriorVisuals?: S1ExteriorVisualsData;
    socialFacilities?: S1SocialFacilitiesData;
    interiorVisuals?: S1InteriorVisualsData;
    customGalleries: S1CustomGalleryData[];
    floorPlans?: S1FloorPlansData;
    visibility: S1SectionVisibility;
}

const BIG_SECTION_TITLE_CLASS =
    "text-[clamp(1.9rem,4.2vw,3.65rem)] font-black uppercase leading-[0.95] tracking-[-0.01em] text-gray-900 whitespace-pre-line";

const buildGalleryItems = (
    images: string[],
    section: string,
    buildAlt: (index: number) => string
): ListingGalleryItem[] =>
    images.map((src, index) => ({
        id: `${section}-${index + 1}`,
        src,
        alt: buildAlt(index + 1),
    }));

const pickSymmetricGridClass = (itemCount: number) => {
    if (itemCount <= 4) {
        return "grid-cols-2 sm:grid-cols-2";
    }

    if (itemCount <= 6) {
        return "grid-cols-2 sm:grid-cols-3";
    }

    return "grid-cols-2 sm:grid-cols-4";
};

/* ─────────── Peeking Card Carousel ─────────── */


function PeekingCarouselStrip({
    cards,
    onImageClick,
    onViewAllClick,
    cardWidthPercent,
    viewAllCardWidthPercent,
    gap,
    translatePx,
    reverse = false,
}: {
    cards: PeekingPreviewCard[];
    onImageClick?: (index: number) => void;
    onViewAllClick?: () => void;
    cardWidthPercent: number;
    viewAllCardWidthPercent: number;
    gap: number;
    translatePx: number;
    reverse?: boolean;
}) {
    const t = useTranslations("gallery");
    const translateValue = reverse
        ? `translateX(${translatePx}px)`
        : `translateX(-${translatePx}px)`;

    return (
        <div
            className={`flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${reverse ? "flex-row-reverse" : ""}`}
            style={{
                transform: translateValue,
                gap: `${gap}px`,
            }}
        >
            {cards.map((card, index) => (
                <button
                    key={card.type === "image" ? card.item.id : card.id}
                    type="button"
                    onClick={
                        card.type === "image"
                            ? () => onImageClick?.(index)
                            : onViewAllClick
                    }
                    className="relative shrink-0 cursor-pointer overflow-hidden rounded-[1.6rem] border border-gray-200 bg-gray-100"
                    style={{
                        width: `${card.type === "view-all" ? viewAllCardWidthPercent : cardWidthPercent}%`,
                    }}
                    aria-label={
                        card.type === "image"
                            ? t("imageAltShort", { index: index + 1 })
                            : t("openAllImages")
                    }
                >
                    {card.type === "image" ? (
                        <div className="relative aspect-[16/9]">
                            <Image
                                src={card.item.src}
                                alt={card.item.alt || t("imageAltShort", { index: index + 1 })}
                                fill
                                loading="lazy"
                                className="object-cover"
                                sizes="(min-width: 1280px) 50vw, (min-width: 768px) 65vw, 100vw"
                            />
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                            <Images className="h-8 w-8" />
                            <span
                                className={buildViewAllLabelClassName("text-lg font-semibold", {
                                    hideOnMobile: true,
                                })}
                            >
                                {card.label}
                            </span>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}

/* ── Section wrapper for peeking visual sections ── */

function PeekingVisualSection({
    title,
    items,
    bgClass,
    onImageClick,
    reverse = false,
    onViewAllClick,
    titleAlign = "left",
}: {
    title: string;
    items: ListingGalleryItem[];
    bgClass: string;
    onImageClick: (index: number) => void;
    reverse?: boolean;
    onViewAllClick: () => void;
    titleAlign?: "left" | "right";
}) {
    const t = useTranslations("gallery");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselViewportWidth, setCarouselViewportWidth] = useState(0);
    const touchStartXRef = useRef<number | null>(null);
    const carouselViewportRef = useRef<HTMLDivElement | null>(null);
    const previewCards = useMemo(
        () => buildPeekingPreviewItems(items, t("viewAll")),
        [items, t]
    );
    const total = previewCards.length;
    const canNavigate = total > 1;
    const showViewAll = true;
    const SWIPE_THRESHOLD_PX = 42;

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? total - 1 : prev - 1));
    }, [total]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev >= total - 1 ? 0 : prev + 1));
    }, [total]);

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canNavigate) return;
        const touch = event.changedTouches[0];
        touchStartXRef.current = touch ? touch.clientX : null;
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canNavigate) return;
        const startX = touchStartXRef.current;
        const touch = event.changedTouches[0];
        touchStartXRef.current = null;

        if (startX === null || !touch) return;

        const deltaX = touch.clientX - startX;
        if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

        if (deltaX < 0) {
            if (reverse) {
                goToPrev();
                return;
            }
            goToNext();
            return;
        }
        if (reverse) {
            goToNext();
            return;
        }
        goToPrev();
    };

    const handleTouchCancel = () => {
        touchStartXRef.current = null;
    };

    const cardWidthPercent = 75;
    const viewAllCardWidthPercent = cardWidthPercent / 4;
    const gap = 20;
    const previewCardWidthsPercent = useMemo(
        () =>
            previewCards.map((card) =>
                card.type === "view-all" ? viewAllCardWidthPercent : cardWidthPercent
            ),
        [cardWidthPercent, previewCards, viewAllCardWidthPercent]
    );
    const translatePx = useMemo(
        () =>
            getPeekingCarouselTranslatePx({
                currentIndex,
                viewportWidthPx: carouselViewportWidth,
                cardWidthPercent,
                gapPx: gap,
                itemWidthsPercent: previewCardWidthsPercent,
            }),
        [
            cardWidthPercent,
            currentIndex,
            gap,
            carouselViewportWidth,
            previewCardWidthsPercent,
        ]
    );

    useEffect(() => {
        const viewport = carouselViewportRef.current;
        if (!viewport) {
            return;
        }

        const syncWidth = () => {
            setCarouselViewportWidth(viewport.clientWidth);
        };

        syncWidth();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", syncWidth);
            return () => {
                window.removeEventListener("resize", syncWidth);
            };
        }

        const observer = new ResizeObserver(syncWidth);
        observer.observe(viewport);

        return () => {
            observer.disconnect();
        };
    }, []);

    const navButtons = canNavigate ? (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={reverse ? goToNext : goToPrev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                aria-label={reverse ? t("nextImage") : t("previousImage")}
            >
                {reverse ? <ChevronLeft className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
                type="button"
                onClick={reverse ? goToPrev : goToNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                aria-label={reverse ? t("previousImage") : t("nextImage")}
            >
                {reverse ? <ChevronRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
            {showViewAll && (
                <button
                    type="button"
                    onClick={onViewAllClick}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                    aria-label={t("openGallery")}
                >
                    <Images className="h-5 w-5" />
                </button>
            )}
        </div>
    ) : null;

    const titleColumn = (
        <div className="hidden w-[380px] shrink-0 md:flex md:flex-col md:gap-6">
            <h2
                className={`${BIG_SECTION_TITLE_CLASS} ${titleAlign === "right" ? "text-right" : ""}`}
            >
                {title}
            </h2>
            {navButtons}
        </div>
    );

    const carouselWrapperClass = reverse
        ? "-ml-4 min-w-0 flex-1 overflow-hidden md:-ml-[calc((100vw-80rem)/2+1rem)]"
        : "-mr-4 min-w-0 flex-1 overflow-hidden md:-mr-[calc((100vw-80rem)/2+1rem)]";

    const carouselColumn = (
        <div ref={carouselViewportRef} className={carouselWrapperClass}>
            <PeekingCarouselStrip
                cards={previewCards}
                onImageClick={onImageClick}
                onViewAllClick={onViewAllClick}
                cardWidthPercent={cardWidthPercent}
                viewAllCardWidthPercent={viewAllCardWidthPercent}
                gap={gap}
                translatePx={translatePx}
                reverse={reverse}
            />
        </div>
    );

    return (
        <section className={`${bgClass} overflow-hidden py-16`}>
            {/* Mobile: title above */}
            <div className="mx-auto max-w-7xl px-4 md:hidden">
                <h2
                    className={`mb-6 ${BIG_SECTION_TITLE_CLASS} ${titleAlign === "right" ? "text-right" : ""}`}
                >
                    {title}
                </h2>
            </div>

            <div className="mx-auto max-w-7xl px-4">
                <div
                    className="flex items-center gap-16"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                >
                    {reverse ? (
                        <>
                            {carouselColumn}
                            {titleColumn}
                        </>
                    ) : (
                        <>
                            {titleColumn}
                            {carouselColumn}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile arrows */}
            {canNavigate ? (
                <div className="mx-auto mt-4 flex max-w-7xl items-center gap-3 px-4 md:hidden">
                    <button
                        type="button"
                        onClick={reverse ? goToNext : goToPrev}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400"
                        aria-label={reverse ? t("nextImage") : t("previousImage")}
                    >
                        {reverse ? <ChevronLeft className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </button>
                    <button
                        type="button"
                        onClick={reverse ? goToPrev : goToNext}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400"
                        aria-label={reverse ? t("previousImage") : t("nextImage")}
                    >
                        {reverse ? <ChevronRight className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                    {showViewAll && (
                        <button
                            type="button"
                            onClick={onViewAllClick}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400"
                            aria-label={t("openGallery")}
                        >
                            <Images className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ) : null}
        </section>
    );
}

export const Visuals = ({
    exteriorVisuals,
    socialFacilities,
    interiorVisuals,
    customGalleries,
    floorPlans,
    visibility,
}: VisualsProps) => {
    const t = useTranslations("projectDetail");
    const galleryT = useTranslations("gallery");
    const socialImages = useMemo(() => {
        if (!socialFacilities) {
            return [];
        }

        if (socialFacilities.images?.length) {
            return socialFacilities.images;
        }

        return socialFacilities.image ? [socialFacilities.image] : [];
    }, [socialFacilities]);

    const exteriorGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                exteriorVisuals?.images || [],
                "project-exterior",
                (index) => t("galleryImageAlt", { index })
            ),
        [exteriorVisuals?.images, t]
    );

    const exteriorDisplayItems = useMemo(
        () => exteriorGalleryItems.slice(0, 4),
        [exteriorGalleryItems]
    );

    const socialGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                socialImages,
                "project-social",
                (index) => t("galleryImageAlt", { index })
            ),
        [socialImages, t]
    );
    const shouldShowSocialGallery = hasSocialGalleryImages(socialImages);

    const interiorGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                interiorVisuals?.images || [],
                "project-interior",
                (index) => t("galleryImageAlt", { index })
            ),
        [interiorVisuals?.images, t]
    );

    const interiorDisplayItems = useMemo(
        () => interiorGalleryItems.slice(0, 4),
        [interiorGalleryItems]
    );

    return (
        <>
            {visibility.socialFacilities && socialFacilities ? (
                <section className="bg-gray-50 py-24">
                    <div className="mx-auto max-w-7xl px-4">
                        <h3 className="mb-8 text-left text-3xl font-black uppercase leading-[1.08] tracking-[-0.01em] text-gray-900">
                            {socialFacilities.title}
                        </h3>
                        <div
                            className={
                                shouldShowSocialGallery
                                    ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center"
                                    : ""
                            }
                        >
                            {shouldShowSocialGallery ? (
                                <div className="order-1 min-w-0">
                                    <div className="overflow-hidden rounded-3xl">
                                        <ListingDetailGallery
                                            items={socialGalleryItems}
                                            title={socialFacilities.title}
                                            layout="carousel"
                                            galleryButtonLabel={t("socialGallery")}
                                            showViewAllAsLastSlide
                                            viewAllSlideLabel={galleryT("viewAll")}
                                            onRequestOpenGallery={(index) =>
                                                dispatchOpenConnectedProjectGallery({
                                                    key: "social",
                                                    index,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            ) : null}

                            <div
                                className={shouldShowSocialGallery ? "order-2" : "mx-auto w-full max-w-5xl"}
                            >
                                <div
                                    className={`grid gap-7 ${pickSymmetricGridClass(socialFacilities.facilities.length)}`}
                                >
                                    {socialFacilities.facilities.map((facility, idx) => (
                                        <div key={`${facility.name}-${idx}`} className="group text-center">
                                            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-gray-100 bg-gray-50 shadow-sm transition-all group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                                                <ProjectIcon name={facility.icon} className="h-8 w-8" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">{facility.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.exteriorVisuals && exteriorVisuals && exteriorGalleryItems.length > 0 ? (
                <PeekingVisualSection
                    title={t("exteriorImages")}
                    items={exteriorDisplayItems}
                    bgClass="bg-white"
                    titleAlign="right"
                    onViewAllClick={() =>
                        dispatchOpenConnectedProjectGallery({ key: "exterior" })
                    }
                    onImageClick={(index) =>
                        dispatchOpenConnectedProjectGallery({
                            key: "exterior",
                            index,
                        })
                    }
                />
            ) : null}

            {visibility.interiorVisuals && interiorVisuals && interiorGalleryItems.length > 0 ? (
                <PeekingVisualSection
                    title={t("interiorImages")}
                    items={interiorDisplayItems}
                    bgClass="bg-gray-50"
                    reverse
                    onViewAllClick={() =>
                        dispatchOpenConnectedProjectGallery({ key: "interior" })
                    }
                    onImageClick={(index) =>
                        dispatchOpenConnectedProjectGallery({
                            key: "interior",
                            index,
                        })
                    }
                />
            ) : null}

            {visibility.customGalleries
                ? customGalleries.map((gallery) => (
                    <section key={gallery.id} className="bg-white py-16">
                        <div className="mx-auto max-w-7xl px-4">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {gallery.title}
                                </h2>
                                {gallery.subtitle ? (
                                    <p className="mt-2 text-sm text-gray-500">
                                        {gallery.subtitle}
                                    </p>
                                ) : null}
                            </div>

                            <ListingDetailGallery
                                items={buildGalleryItems(
                                    gallery.images,
                                    `custom-${gallery.id}`,
                                    (index) => t("galleryImageAlt", { index })
                                )}
                                title={gallery.title}
                                layout="carousel"
                                onRequestOpenGallery={(index) =>
                                    dispatchOpenConnectedProjectGallery({
                                        key: `custom-${gallery.id}`,
                                        index,
                                    })
                                }
                            />
                        </div>
                    </section>
                ))
                : null}

            {visibility.floorPlans && floorPlans ? (
                <section className="bg-white py-24">
                    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 lg:flex-row">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3">
                            {floorPlans.plans.map((plan, planIndex) => {
                                const galleryOffset = floorPlans.plans
                                    .slice(0, planIndex)
                                    .reduce((sum, p) => sum + p.images.length, 0);
                                return (
                                    <div
                                        key={plan.id}
                                        className="rounded-3xl border border-gray-100 bg-gray-50 p-6"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatchOpenConnectedProjectGallery({
                                                    key: "floor",
                                                    index: galleryOffset,
                                                })
                                            }
                                            className="relative mb-4 block h-64 w-full cursor-pointer overflow-hidden rounded-xl group"
                                            title={t("openFloorPlan", { title: plan.title })}
                                            aria-label={t("openFloorPlan", { title: plan.title })}
                                        >
                                            <Image
                                                src={plan.images[0]}
                                                alt={plan.title}
                                                fill
                                                loading="lazy"
                                                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                                            />
                                            {plan.images.length > 1 && (
                                                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
                                                    <Images className="h-3.5 w-3.5" />
                                                    {plan.images.length}
                                                </span>
                                            )}
                                        </button>
                                        <div className="flex items-center justify-between gap-4 text-gray-900">
                                            <span className="font-bold">{plan.title}</span>
                                            {plan.area ? (
                                                <span className="text-sm text-gray-500">
                                                    {plan.area}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex flex-col justify-center lg:w-1/3">
                            <h2 className="mb-6 text-4xl font-black text-gray-900">
                                {floorPlans.title}
                            </h2>
                            <p className="mb-8 leading-relaxed text-gray-600">
                                {floorPlans.description}
                            </p>
                            <button
                                type="button"
                                onClick={() =>
                                    dispatchOpenConnectedProjectGallery({ key: "floor" })
                                }
                                className="flex items-center justify-center gap-3 rounded-xl bg-gray-900 py-4 font-bold text-white transition-colors hover:bg-gray-800"
                            >
                                <ZoomIn className="h-5 w-5" />
                                {t("browseAllFloorPlans")}
                            </button>
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
