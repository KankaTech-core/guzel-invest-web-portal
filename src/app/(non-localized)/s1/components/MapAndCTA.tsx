"use client";

import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Download,
    Handshake,
    MapPin,
    Search,
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
    const mapGalleryItems: ListingGalleryItem[] = mapImages.map((item, index) => ({
        id: item.id,
        src: item.image,
        alt: item.title || `Harita görseli ${index + 1}`,
    }));
    const mapSectionLayout = getMapSectionLayout({
        hasMapContent: visibility.map,
        mapImageCount: mapGalleryItems.length,
    });
    const shouldShowDocumentsAndCta = visibility.documents || Boolean(map?.mapsLink);
    const shouldShowMapBlock = mapSectionLayout.showSection;
    const mapEmbedHeightClass = mapSectionLayout.useSplitLayout ? "h-[420px]" : "h-[520px]";
    const actionCards = [
        {
            icon: Search,
            title: "Diğer Projeleri Keşfet",
            href: `/${locale}/projeler`,
            external: false,
        },
        {
            icon: Handshake,
            title: "Proje Uzmanıyla Görüş",
            href: `/${locale}/iletisim`,
            external: false,
        },
        documents[0]
            ? {
                icon: Download,
                title: "Proje Sunumunu İndir",
                href: documents[0].url,
                external: true,
            }
            : map?.mapsLink
                ? {
                    icon: MapPin,
                    title: "Projeyi Haritada Aç",
                    href: map.mapsLink,
                    external: true,
                }
                : null,
    ].filter(Boolean) as Array<{
        icon: typeof Search;
        title: string;
        href: string;
        external: boolean;
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
                                    Proje Adımı
                                </span>
                                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                    Bu Projeyi{" "}
                                    <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                                        Detaylı İnceleyin
                                    </span>
                                </h2>
                                <p className="mt-2 max-w-md text-sm text-gray-400">
                                    Belgelere ulaşın, benzer projeleri karşılaştırın ve uzman
                                    ekibimizle bir sonraki adımı planlayın.
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

                                        if (card.external) {
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

                                        return (
                                            <Link
                                                key={card.title}
                                                href={card.href}
                                                className={actionClassName}
                                            >
                                                {content}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {documents.length > 1 ? (
                                    <div className="flex flex-wrap items-center gap-2 border-t border-gray-700 bg-gray-800 px-4 py-3">
                                        {documents.slice(1, 4).map((document) => (
                                            <Link
                                                key={document.id}
                                                href={document.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-full border border-gray-600 px-3 py-1.5 text-xs font-semibold text-gray-200 transition hover:border-orange-400 hover:text-orange-300"
                                            >
                                                {document.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
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
                                            Harita
                                        </h2>
                                        {map?.mapsLink ? (
                                            <a
                                                href={map.mapsLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-full bg-[#ff6900] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f00]"
                                            >
                                                <MapPin className="h-4 w-4" />
                                                Google Maps&apos;te Aç
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
                                                    title="Proje konumu"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 pb-4">
                                            <div
                                                className={`${mapEmbedHeightClass} flex w-full items-center justify-center rounded-[1.8rem] bg-gray-100 text-sm text-gray-500`}
                                            >
                                                Harita konumu mevcut değil
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {mapSectionLayout.showMapGalleryCard ? (
                                <div className="overflow-hidden rounded-[1.9rem] border border-gray-200 bg-white shadow-sm">
                                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
                                        <h3 className="text-2xl font-semibold text-[#111828]">
                                            Harita Görselleri
                                        </h3>
                                    </div>

                                    <div className="px-4 pb-4">
                                        <ListingDetailGallery
                                            items={mapGalleryItems}
                                            title="Harita Görselleri"
                                            layout="carousel"
                                            galleryButtonLabel="Harita Galerisi"
                                            desktopHeightClass={mapEmbedHeightClass}
                                            onRequestOpenGallery={() =>
                                                dispatchOpenConnectedProjectGallery({ key: "map" })
                                            }
                                        />
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
                <section className="bg-white py-16">
                    <div className="mx-auto max-w-5xl px-4">
                        <h2 className="mb-8 text-3xl font-bold text-gray-900">
                            Sıkça Sorulan Sorular
                        </h2>
                        <div className="space-y-3">
                            {faqs.map((faq) => (
                                <details
                                    key={faq.id}
                                    className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4"
                                >
                                    <summary className="cursor-pointer list-none font-semibold text-gray-900">
                                        {faq.question}
                                    </summary>
                                    <p className="mt-3 leading-relaxed text-gray-600">
                                        {faq.answer}
                                    </p>
                                </details>
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
                                Diğer Projeler
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
                                            quality={100}
                                            unoptimized
                                            src={project.image}
                                            alt={project.title}
                                            fill
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
                                                {project.roomSummary || "Detayları Gör"}
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
