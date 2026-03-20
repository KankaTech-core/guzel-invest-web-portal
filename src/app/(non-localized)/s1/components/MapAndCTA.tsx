"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    ArrowRight,
    Download,
    Handshake,
    MapPin,
    Minus,
    Plus,
    Search,
    X,
} from "lucide-react";
import { S1SectionVisibility } from "../section-visibility";
import {
    S1DocumentItem,
    S1FaqItem,
    S1MapData,
    S1MapImageItem,
    S1OtherProjectItem,
} from "../types";
import {
    ListingDetailGallery,
    type ListingGalleryItem,
} from "@/components/public/listing-detail-gallery";
import { dispatchOpenConnectedProjectGallery } from "./project-gallery-events";
import { getMapSectionLayout } from "./media-layout";
import { ProjectVideoSection } from "./ProjectVideoSection";
import { getDocumentCta } from "./document-cta";
import { buildProjectsPortfolioHref } from "./project-portfolio-link";

interface MapAndCTAProps {
    documents: S1DocumentItem[];
    mapImages: S1MapImageItem[];
    map?: S1MapData;
    faqs: S1FaqItem[];
    otherProjects: S1OtherProjectItem[];
    locale?: string;
    visibility: S1SectionVisibility;
    videoUrl?: string;
    videoTitle?: string;
}

export const MapAndCTA = ({
    documents,
    mapImages,
    map,
    faqs,
    otherProjects,
    locale = "tr",
    visibility,
    videoUrl,
    videoTitle,
}: MapAndCTAProps) => {
    const t = useTranslations("projectDetail");
    const galleryT = useTranslations("gallery");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
    const documentCta = getDocumentCta(documents);
    const mapGalleryItems: ListingGalleryItem[] = mapImages.map((item, index) => ({
        id: item.id,
        src: item.image,
        alt: item.title || t("mapImageAlt", { index: index + 1 }),
    }));
    const mapSectionLayout = getMapSectionLayout({
        hasMapContent: visibility.map,
        mapImageCount: mapGalleryItems.length,
    });
    const shouldShowDocumentsAndCta = visibility.documents || Boolean(map?.mapsLink);
    const shouldShowMapBlock = mapSectionLayout.showSection;
    const mapEmbedHeightClass = mapSectionLayout.useSplitLayout ? "h-[420px]" : "h-[520px]";

    useEffect(() => {
        if (!isDocumentsModalOpen) {
            return undefined;
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsDocumentsModalOpen(false);
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isDocumentsModalOpen]);

    const actionCards = [
        {
            icon: Search,
            title: t("exploreOtherProjects"),
            href: buildProjectsPortfolioHref(locale),
            external: false,
        },
        {
            icon: Handshake,
            title: t("talkToProjectExpert"),
            href: `/${locale}/iletisim`,
            external: false,
        },
        documentCta
            ? documentCta.type === "single"
                ? {
                    icon: Download,
                    title: documentCta.title,
                    href: documentCta.href,
                    external: true,
                }
                : {
                    icon: Download,
                    title: documentCta.title,
                    onClick: () => setIsDocumentsModalOpen(true),
                }
            : map?.mapsLink
                ? {
                    icon: MapPin,
                    title: t("openProjectOnMap"),
                    href: map.mapsLink,
                    external: true,
                }
                : null,
    ].filter(Boolean) as Array<{
        icon: typeof Search;
        title: string;
        href?: string;
        external?: boolean;
        onClick?: () => void;
    }>;

    return (
        <>
            {shouldShowDocumentsAndCta ? (
                <section className="relative overflow-hidden bg-gray-900 px-4 py-12 sm:px-6">
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:gap-10 xl:flex-row xl:items-center">
                            <div className="max-w-md flex-shrink-0">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-400">
                                    {t("projectStepEyebrow")}
                                </span>
                                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                    {t("projectStepTitlePrefix")}{" "}
                                    <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                                        {t("projectStepTitleHighlight")}
                                    </span>
                                </h2>
                                <p className="mt-2 max-w-md text-sm text-gray-400">
                                    {t("projectStepDescription")}
                                </p>
                            </div>

                            <div className="w-full min-w-0 overflow-hidden rounded-xl bg-gray-700/50 xl:max-w-[760px]">
                                <div className="grid w-full grid-cols-1 gap-px sm:grid-cols-2 xl:grid-cols-3">
                                    {actionCards.map((card) => {
                                        const CardIcon = card.icon;
                                        const actionClassName =
                                            "group flex w-full items-center justify-between gap-4 bg-gray-800 px-6 py-5 transition-colors duration-300 hover:bg-gray-800/60";

                                        const content = (
                                            <>
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 transition-colors group-hover:bg-orange-400">
                                                    <CardIcon className="h-4 w-4 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-white transition-colors group-hover:text-orange-400">
                                                    {card.title}
                                                </span>
                                                <ArrowRight className="ml-auto h-4 w-4 text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange-400 sm:ml-0" />
                                            </>
                                        );

                                        if (card.href && card.external) {
                                            return (
                                                <a
                                                    key={card.title}
                                                    href={card.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={actionClassName}
                                                >
                                                    {content}
                                                </a>
                                            );
                                        }

                                        if (card.href) {
                                            return (
                                                <Link
                                                    key={card.title}
                                                    href={card.href}
                                                    className={actionClassName}
                                                >
                                                    {content}
                                                </Link>
                                            );
                                        }

                                        return (
                                            <button
                                                key={card.title}
                                                type="button"
                                                onClick={card.onClick}
                                                className={actionClassName}
                                            >
                                                {content}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {documentCta?.type === "multiple" && isDocumentsModalOpen ? (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t("projectDocumentsAria")}
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4"
                    onClick={() => setIsDocumentsModalOpen(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {t("browseDocuments")}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {t("browseDocumentsDescription")}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDocumentsModalOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-orange-300 hover:text-orange-500"
                                aria-label={t("closeDocuments")}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-2">
                            {documents.map((document, index) => (
                                <a
                                    key={document.id}
                                    href={document.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3 transition hover:border-orange-300 hover:bg-orange-50/40"
                                >
                                    <span className="min-w-0 truncate text-sm font-semibold text-gray-800">
                                        {document.name.trim() || t("documentFallback", { index: index + 1 })}
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                                        <Download className="h-3.5 w-3.5" />
                                        {t("download")}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            {shouldShowMapBlock ? (
                <section className="bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <div
                            className={
                                mapSectionLayout.useSplitLayout
                                    ? "grid items-start gap-8 lg:grid-cols-2"
                                    : "mx-auto w-full max-w-[1100px]"
                            }
                        >
                            {mapSectionLayout.showMapCard ? (
                                <div className="overflow-hidden rounded-[1.9rem] border border-gray-200 bg-white shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
                                        <h2 className="text-2xl font-semibold text-[#111828]">
                                            {t("map")}
                                        </h2>
                                        {map?.mapsLink ? (
                                            <a
                                                href={map.mapsLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full bg-[#ff6900] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f00]"
                                            >
                                                <MapPin className="h-4 w-4" />
                                                {t("openInGoogleMaps")}
                                            </a>
                                        ) : null}
                                    </div>

                                    {map?.embedSrc ? (
                                        <div className="px-4 pb-4">
                                            <div
                                                className={`${mapEmbedHeightClass} w-full overflow-hidden rounded-[1.8rem] bg-gray-100`}
                                            >
                                                <iframe
                                                    src={map.embedSrc}
                                                    className="h-full w-full border-0"
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    title={t("projectLocation")}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 pb-4">
                                            <div
                                                className={`${mapEmbedHeightClass} flex w-full items-center justify-center rounded-[1.8rem] bg-gray-100 text-sm text-gray-500`}
                                            >
                                                {t("mapUnavailable")}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {mapSectionLayout.showMapGalleryCard ? (
                                <div className="overflow-hidden rounded-[1.9rem] border border-gray-200 bg-white shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
                                        <h3 className="text-2xl font-semibold text-[#111828]">
                                            {t("mapImages")}
                                        </h3>
                                    </div>

                                    <div className="px-4 pb-4">
                                        <div className="overflow-hidden rounded-[1.5rem]">
                                            <ListingDetailGallery
                                                items={mapGalleryItems}
                                                title={t("mapImages")}
                                                layout="carousel"
                                                galleryButtonLabel={t("mapGallery")}
                                                showViewAllAsLastSlide
                                                viewAllSlideLabel={galleryT("viewAll")}
                                                desktopHeightClass={mapEmbedHeightClass}
                                                onRequestOpenGallery={(index) =>
                                                    dispatchOpenConnectedProjectGallery({
                                                        key: "map",
                                                        index,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.video && videoUrl ? (
                <ProjectVideoSection videoUrl={videoUrl} videoTitle={videoTitle} />
            ) : null}

            {visibility.faqs ? (
                <section className="bg-white py-20 px-4 sm:px-6">
                    <div className="mx-auto max-w-7xl">
                        {/* Section Header */}
                        <div className="flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                                    {t("faqEyebrow")}
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                    {t("faqTitle")}
                                </h2>
                            </div>
                            <a
                                href={`/${locale}/iletisim`}
                                className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium"
                            >
                                {t("moreQuestions")}
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        {/* FAQ Items */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                            {faqs.map((faq, idx) => (
                                <div key={faq.id} className="border-b border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between py-5 text-left group"
                                    >
                                        <span className="text-sm font-semibold text-gray-900 pr-4 group-hover:text-orange-600 transition-colors">
                                            {faq.question}
                                        </span>
                                        <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center group-hover:border-orange-300 group-hover:text-orange-500 transition-colors">
                                            {openFaq === idx ? (
                                                <Minus className="w-4 h-4 text-orange-500" />
                                            ) : (
                                                <Plus className="w-4 h-4 text-gray-400" />
                                            )}
                                        </div>
                                    </button>
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${openFaq === idx
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-sm text-gray-400 leading-relaxed pb-5">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.otherProjects ? (
                <section className="bg-gray-50 py-24">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-12 flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {t("otherProjects")}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {otherProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/${locale}/proje/${project.slug}`}
                                    className="group overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            loading="lazy"
                                            sizes="(min-width: 768px) 33vw, 100vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1 text-xs font-bold text-orange-500 backdrop-blur">
                                            {project.status}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">
                                            {project.title}
                                        </h3>
                                        <p className="mb-4 flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin className="h-4 w-4" />
                                            {project.location}
                                        </p>
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                            <span className="text-sm font-semibold text-gray-700">
                                                {project.roomSummary || t("viewDetails")}
                                            </span>
                                            <ArrowRight className="h-5 w-5 text-gray-300 transition-colors group-hover:text-orange-500" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
