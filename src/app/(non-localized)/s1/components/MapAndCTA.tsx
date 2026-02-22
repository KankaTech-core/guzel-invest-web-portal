import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Download,
    FileText,
    MapPin,
    ExternalLink,
} from "lucide-react";
import { S1SectionVisibility } from "../section-visibility";
import {
    S1DocumentItem,
    S1FaqItem,
    S1MapData,
    S1MapImageItem,
    S1OtherProjectItem,
} from "../types";

interface MapAndCTAProps {
    documents: S1DocumentItem[];
    mapImages: S1MapImageItem[];
    map?: S1MapData;
    faqs: S1FaqItem[];
    otherProjects: S1OtherProjectItem[];
    visibility: S1SectionVisibility;
}

export const MapAndCTA = ({
    documents,
    mapImages,
    map,
    faqs,
    otherProjects,
    visibility,
}: MapAndCTAProps) => {
    return (
        <>
            {visibility.documents ? (
                <section className="bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex flex-col gap-6 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm md:p-10">
                            <div className="flex items-center gap-5">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10">
                                    <FileText className="h-7 w-7 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Proje Belgeleri
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Sunum dosyası, teknik dökümanlar ve ek içerikler.
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {documents.map((document) => (
                                    <Link
                                        key={document.id}
                                        href={document.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:bg-orange-50"
                                    >
                                        <span className="line-clamp-1 pr-3">{document.name}</span>
                                        <Download className="h-4 w-4 shrink-0 text-orange-500" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.mapImages ? (
                <section className="bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <h2 className="mb-8 text-3xl font-bold text-gray-900">
                            Harita Görselleri
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {mapImages.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-100"
                                >
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 flex items-end bg-black/20 p-6">
                                        <p className="text-lg font-bold text-white">{item.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.map && map ? (
                <section className="relative min-h-[420px] w-full bg-gray-100">
                    {map.embedSrc ? (
                        <iframe
                            src={map.embedSrc}
                            className="h-[480px] w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Proje konumu"
                        />
                    ) : (
                        <div className="h-[480px] w-full" />
                    )}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="pointer-events-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Proje Lokasyonu</h4>
                                    {map.mapsLink ? (
                                        <Link
                                            href={map.mapsLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500"
                                        >
                                            Google Haritalar&apos;da Aç
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </Link>
                                    ) : (
                                        <p className="mt-1 text-sm text-gray-500">
                                            Konum bilgisi mevcut.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
                                    href={`/s1?slug=${project.slug}`}
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
