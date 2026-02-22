import Image from "next/image";
import Link from "next/link";
import { Download, MapPin } from "lucide-react";
import { S1SectionVisibility } from "../../s1/section-visibility";
import {
    S1DocumentItem,
    S1FaqItem,
    S1MapData,
    S1MapImageItem,
    S1OtherProjectItem,
} from "../../s1/types";

interface FooterAreaProps {
    documents: S1DocumentItem[];
    mapImages: S1MapImageItem[];
    map?: S1MapData;
    faqs: S1FaqItem[];
    otherProjects: S1OtherProjectItem[];
    visibility: S1SectionVisibility;
}

export const FooterArea = ({
    documents,
    mapImages,
    map,
    faqs,
    otherProjects,
    visibility,
}: FooterAreaProps) => {
    return (
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 md:px-12 lg:px-24">
            {visibility.documents ? (
                <section className="py-16">
                    <div className="flex flex-col items-center justify-between gap-8 rounded-xl bg-[#f3f4f6] p-10 md:flex-row md:p-16">
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <h4 className="text-xl font-bold text-[#374151]">
                                Proje Belgeleri
                            </h4>
                            <p className="max-w-sm text-sm font-light text-[#374151]/60">
                                Sunum dosyaları ve teknik dökümanlara erişin.
                            </p>
                        </div>
                        {documents[0] ? (
                            <Link
                                href={documents[0].url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-md bg-[#ec6c04] px-8 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#ec6c04]/90"
                            >
                                <Download className="h-5 w-5" />
                                DOWNLOAD PDF
                            </Link>
                        ) : null}
                    </div>
                </section>
            ) : null}

            {(visibility.mapImages || visibility.map) && (
                <section className="py-24">
                    <h3 className="mb-12 text-xl font-bold text-[#374151]">Location</h3>
                    {visibility.mapImages ? (
                        <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-3">
                            {mapImages.map((mapImage, idx) => (
                                <div
                                    key={mapImage.id}
                                    className={`aspect-square rounded-sm border border-gray-200 bg-gray-50 p-1 ${
                                        idx === 2 ? "hidden md:block" : ""
                                    }`}
                                >
                                    <div className="relative h-full w-full overflow-hidden">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={mapImage.image}
                                            alt={mapImage.title}
                                            fill
                                            className="object-cover grayscale opacity-80"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                    {visibility.map && map ? (
                        <div className="relative h-[400px] w-full overflow-hidden rounded-md bg-gray-200">
                            {map.embedSrc ? (
                                <iframe
                                    src={map.embedSrc}
                                    className="h-full w-full border-0 brightness-110 contrast-75 grayscale"
                                    loading="lazy"
                                    title="Location map"
                                />
                            ) : null}
                            <div className="absolute left-6 top-6 z-10 max-w-xs rounded-md bg-white p-4 shadow-sm">
                                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#374151]">
                                    {faqs[0]?.question || "Prime Location"}
                                </p>
                                <p className="text-sm text-[#374151]/70">
                                    {faqs[0]?.answer || "Konum bilgisi mevcut."}
                                </p>
                            </div>
                            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                                <MapPin
                                    className="h-12 w-12 text-[#ec6c04] drop-shadow-md"
                                    fill="currentColor"
                                    stroke="white"
                                />
                            </div>
                        </div>
                    ) : null}
                </section>
            )}

            {visibility.otherProjects ? (
                <section className="border-t border-gray-100 py-24">
                    <h3 className="mb-12 text-xl font-bold text-[#374151]">
                        Diğer Projeler
                    </h3>
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                        {otherProjects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/s5?slug=${project.slug}`}
                                className="group cursor-pointer"
                            >
                                <div className="relative mb-4 inline-block aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <h4 className="text-lg font-bold text-[#374151] transition-colors group-hover:text-[#ec6c04]">
                                        {project.title}
                                    </h4>
                                    <span className="text-xs text-[#374151]/40">
                                        {project.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-[#374151]/60">
                                    {project.location}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
};
