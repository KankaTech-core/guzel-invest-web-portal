import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText, MapPin } from "lucide-react";
import { S1SectionVisibility } from "../../s1/section-visibility";
import {
    S1DocumentItem,
    S1FaqItem,
    S1MapData,
    S1MapImageItem,
    S1OtherProjectItem,
} from "../../s1/types";

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
                <div className="bg-[#e5e0d8] py-20">
                    <div className="mx-auto max-w-[1000px] px-6 text-center">
                        <h3 className="mb-8 text-2xl font-bold text-[#1e3a8a] md:text-3xl">
                            Proje Belgeleri
                        </h3>
                        <div className="flex flex-col justify-center gap-6 sm:flex-row">
                            {documents.slice(0, 2).map((doc, idx) => (
                                <Link
                                    key={doc.id}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center justify-center gap-3 rounded-full px-8 py-4 font-bold shadow-md transition-all ${
                                        idx === 0
                                            ? "bg-white text-[#1e3a8a] hover:bg-gray-50"
                                            : "bg-[#ec6804] text-white shadow-orange-500/20 hover:bg-orange-700"
                                    }`}
                                >
                                    {idx === 0 ? (
                                        <Download className="h-6 w-6" />
                                    ) : (
                                        <FileText className="h-6 w-6" />
                                    )}
                                    {doc.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            {(visibility.mapImages || visibility.map) && (
                <div className="bg-white py-24">
                    <div className="mx-auto max-w-[1400px] px-6">
                        <h3 className="mb-12 text-3xl font-bold text-[#1e3a8a]">
                            Prime Location
                        </h3>

                        {visibility.mapImages ? (
                            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                                {mapImages.map((mapImage, idx) => (
                                    <div
                                        key={mapImage.id}
                                        className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
                                    >
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={mapImage.image}
                                            alt={mapImage.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-end bg-black/30 p-6">
                                            <span className="text-lg font-bold text-white">
                                                {mapImage.title || `Harita ${idx + 1}`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {visibility.map && map ? (
                            <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-inner">
                                {map.embedSrc ? (
                                    <iframe
                                        src={map.embedSrc}
                                        className="h-full w-full border-0 contrast-75"
                                        loading="lazy"
                                        title="Project location map"
                                    />
                                ) : null}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-bounce rounded-full bg-white px-6 py-3 shadow-2xl">
                                        <span className="flex items-center gap-3 font-bold text-slate-900">
                                            <MapPin className="h-6 w-6 text-[#ec6804]" />
                                            {faqs[0]?.question || "Proje Lokasyonu"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {visibility.otherProjects ? (
                <div className="bg-[#faf9f6] py-24">
                    <div className="mx-auto max-w-[1400px] px-6">
                        <h3 className="mb-12 text-3xl font-bold text-[#1e3a8a]">
                            You might also like
                        </h3>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {otherProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/s4?slug=${project.slug}`}
                                    className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h4 className="mb-2 text-xl font-bold text-slate-900">
                                            {project.title}
                                        </h4>
                                        <p className="mb-4 text-sm text-slate-500">
                                            {project.location}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-[#ec6804]">
                                                {project.roomSummary || project.status}
                                            </span>
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e5e0d8]/50 transition-colors group-hover:bg-[#ec6804] group-hover:text-white">
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            <footer className="border-t border-gray-100 bg-white py-10">
                <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-6 md:flex-row">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Mediterranean Estates
                    </h2>
                    <div className="flex gap-6 text-sm font-medium text-slate-600">
                        <a className="cursor-pointer transition-colors hover:text-[#ec6804]">
                            Privacy Policy
                        </a>
                        <a className="cursor-pointer transition-colors hover:text-[#ec6804]">
                            Terms of Service
                        </a>
                        <a className="cursor-pointer transition-colors hover:text-[#ec6804]">
                            Contact
                        </a>
                    </div>
                    <p className="text-sm text-slate-400">© 2026 Güzel Invest.</p>
                </div>
            </footer>
        </>
    );
};
