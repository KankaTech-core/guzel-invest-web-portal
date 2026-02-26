"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
import { dispatchOpenConnectedProjectGallery } from "./project-gallery-events";
import { hasSocialGalleryImages } from "./media-layout";

interface VisualsProps {
    exteriorVisuals?: S1ExteriorVisualsData;
    socialFacilities?: S1SocialFacilitiesData;
    interiorVisuals?: S1InteriorVisualsData;
    customGalleries: S1CustomGalleryData[];
    floorPlans?: S1FloorPlansData;
    visibility: S1SectionVisibility;
}

const BIG_SECTION_TITLE_CLASS =
    "text-[clamp(1.9rem,4.2vw,3.65rem)] font-black uppercase leading-[1.1] tracking-[-0.01em] text-gray-900";

const buildGalleryItems = (
    images: string[],
    title: string,
    section: string
): ListingGalleryItem[] =>
    images.map((src, index) => ({
        id: `${section}-${index + 1}`,
        src,
        alt: `${title} - Görsel ${index + 1}`,
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
    items,
    onImageClick,
    cardWidthPercent,
    gap,
    currentIndex,
    reverse = false,
}: {
    items: ListingGalleryItem[];
    onImageClick?: () => void;
    cardWidthPercent: number;
    gap: number;
    currentIndex: number;
    reverse?: boolean;
}) {
    const translateValue = reverse
        ? `translateX(calc(${currentIndex} * (${cardWidthPercent}% + ${gap}px)))`
        : `translateX(calc(-${currentIndex} * (${cardWidthPercent}% + ${gap}px)))`;

    return (
        <div
            className={`flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${reverse ? "flex-row-reverse" : ""}`}
            style={{
                transform: translateValue,
                gap: `${gap}px`,
            }}
        >
            {items.map((item, index) => (
                <button
                    key={item.id}
                    type="button"
                    onClick={onImageClick}
                    className="relative shrink-0 cursor-pointer overflow-hidden rounded-[1.6rem] border border-gray-200 bg-gray-100"
                    style={{ width: `${cardWidthPercent}%` }}
                    aria-label={`Görsel ${index + 1}`}
                >
                    <div className="relative aspect-[16/9]">
                        <Image
                            src={item.src}
                            alt={item.alt || `Görsel ${index + 1}`}
                            fill
                            priority={index === 0}
                            className="object-cover"
                            sizes="(min-width: 1280px) 50vw, (min-width: 768px) 65vw, 100vw"
                        />
                    </div>
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
    totalCount,
    onViewAllClick,
}: {
    title: string;
    items: ListingGalleryItem[];
    bgClass: string;
    onImageClick: () => void;
    reverse?: boolean;
    totalCount: number;
    onViewAllClick: () => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = items.length;
    const canNavigate = total > 1;
    const showViewAll = totalCount > 4;

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev <= 0 ? total - 1 : prev - 1));
    }, [total]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev >= total - 1 ? 0 : prev + 1));
    }, [total]);

    const cardWidthPercent = 75;
    const gap = 20;

    const navButtons = canNavigate ? (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={goToPrev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                aria-label="Önceki görsel"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                type="button"
                onClick={goToNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                aria-label="Sonraki görsel"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
            <span className="ml-1 text-sm text-gray-400">
                {currentIndex + 1} / {total}
            </span>
            {showViewAll && (
                <button
                    type="button"
                    onClick={onViewAllClick}
                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                    Galeriyi Gör (+{totalCount - 4} görsel)
                </button>
            )}
        </div>
    ) : null;

    const titleColumn = (
        <div className="hidden w-[300px] shrink-0 md:flex md:flex-col md:gap-6">
            <h2 className={BIG_SECTION_TITLE_CLASS}>{title}</h2>
            {navButtons}
        </div>
    );

    const carouselWrapperClass = reverse
        ? "-ml-4 min-w-0 flex-1 overflow-hidden md:-ml-[calc((100vw-80rem)/2+1rem)]"
        : "-mr-4 min-w-0 flex-1 overflow-hidden md:-mr-[calc((100vw-80rem)/2+1rem)]";

    const carouselColumn = (
        <div className={carouselWrapperClass}>
            <PeekingCarouselStrip
                items={items}
                onImageClick={onImageClick}
                cardWidthPercent={cardWidthPercent}
                gap={gap}
                currentIndex={currentIndex}
                reverse={reverse}
            />
        </div>
    );

    return (
        <section className={`${bgClass} py-16`}>
            {/* Mobile: title above */}
            <div className="mx-auto max-w-7xl px-4 md:hidden">
                <h2 className={`mb-6 ${BIG_SECTION_TITLE_CLASS}`}>{title}</h2>
            </div>

            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center gap-16">
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
                        onClick={goToPrev}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400"
                        aria-label="Önceki görsel"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={goToNext}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:border-gray-400"
                        aria-label="Sonraki görsel"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="ml-1 text-sm text-gray-400">
                        {currentIndex + 1} / {total}
                    </span>
                    {showViewAll && (
                        <button
                            type="button"
                            onClick={onViewAllClick}
                            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
                        >
                            Galeriyi Gör (+{totalCount - 4} görsel)
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
                "Dış Görseller",
                "project-exterior"
            ),
        [exteriorVisuals?.images]
    );

    const exteriorDisplayItems = useMemo(
        () => exteriorGalleryItems.slice(0, 4),
        [exteriorGalleryItems]
    );

    const exteriorTotalCount = exteriorGalleryItems.length;

    const socialGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                socialImages,
                socialFacilities?.title || "Sosyal İmkanlar",
                "project-social"
            ),
        [socialFacilities?.title, socialImages]
    );
    const shouldShowSocialGallery = hasSocialGalleryImages(socialImages);

    const interiorGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                interiorVisuals?.images || [],
                "İç Görseller",
                "project-interior"
            ),
        [interiorVisuals?.images]
    );

    const interiorDisplayItems = useMemo(
        () => interiorGalleryItems.slice(0, 4),
        [interiorGalleryItems]
    );

    const interiorTotalCount = interiorGalleryItems.length;

    return (
        <>
            {visibility.socialFacilities && socialFacilities ? (
                <section className="bg-gray-50 py-24">
                    <div
                        className={
                            shouldShowSocialGallery
                                ? "mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center"
                                : "mx-auto max-w-7xl px-4"
                        }
                    >
                        <div className={shouldShowSocialGallery ? "" : "mx-auto w-full max-w-5xl"}>
                            {shouldShowSocialGallery ? null : (
                                <h3 className="mb-10 text-center text-3xl font-black uppercase leading-[1.08] tracking-[-0.01em] text-gray-900">
                                    {socialFacilities.title}
                                </h3>
                            )}

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

                        {shouldShowSocialGallery ? (
                            <div className="flex items-stretch gap-4">
                                <div className="min-w-0 flex-1">
                                    <ListingDetailGallery
                                        items={socialGalleryItems}
                                        title={socialFacilities.title}
                                        layout="carousel"
                                        galleryButtonLabel="Sosyal Galeri"
                                        onRequestOpenGallery={() =>
                                            dispatchOpenConnectedProjectGallery({ key: "social" })
                                        }
                                    />
                                    <h3 className={`mt-4 md:hidden ${BIG_SECTION_TITLE_CLASS}`}>
                                        {socialFacilities.title}
                                    </h3>
                                </div>
                                <div className="hidden items-center md:flex">
                                    <h3
                                        className="text-[clamp(1.65rem,3.3vw,2.95rem)] font-black uppercase leading-[1.08] tracking-[-0.01em] text-gray-300"
                                        style={{
                                            writingMode: "vertical-rl",
                                            textOrientation: "mixed",
                                        }}
                                    >
                                        {socialFacilities.title}
                                    </h3>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </section>
            ) : null}

            {visibility.exteriorVisuals && exteriorVisuals && exteriorGalleryItems.length > 0 ? (
                <PeekingVisualSection
                    title="Dış Görseller"
                    items={exteriorDisplayItems}
                    bgClass="bg-white"
                    totalCount={exteriorTotalCount}
                    onViewAllClick={() =>
                        dispatchOpenConnectedProjectGallery({ key: "exterior" })
                    }
                    onImageClick={() =>
                        dispatchOpenConnectedProjectGallery({ key: "exterior" })
                    }
                />
            ) : null}

            {visibility.interiorVisuals && interiorVisuals && interiorGalleryItems.length > 0 ? (
                <PeekingVisualSection
                    title="İç Görseller"
                    items={interiorDisplayItems}
                    bgClass="bg-gray-50"
                    reverse
                    totalCount={interiorTotalCount}
                    onViewAllClick={() =>
                        dispatchOpenConnectedProjectGallery({ key: "interior" })
                    }
                    onImageClick={() =>
                        dispatchOpenConnectedProjectGallery({ key: "interior" })
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
                                    gallery.title,
                                    `custom-${gallery.id}`
                                )}
                                title={gallery.title}
                                layout="carousel"
                                onRequestOpenGallery={() =>
                                    dispatchOpenConnectedProjectGallery({
                                        key: `custom-${gallery.id}`,
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
                            {floorPlans.plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="rounded-3xl border border-gray-100 bg-gray-50 p-6"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatchOpenConnectedProjectGallery({
                                                key: "floor",
                                            })
                                        }
                                        className="relative mb-4 block h-64 w-full cursor-pointer overflow-hidden rounded-xl group"
                                        title={`${plan.title} planını aç`}
                                        aria-label={`${plan.title} planını aç`}
                                    >
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={plan.image}
                                            alt={plan.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                        />
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
                            ))}
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
                                Tüm Planları İncele
                            </button>
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
