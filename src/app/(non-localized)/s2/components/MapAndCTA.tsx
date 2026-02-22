import Image from "next/image";
import Link from "next/link";
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
                <section className="w-full bg-gray-900 py-16">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                                    CTA + Belgeler
                                </h2>
                                <p className="font-light text-gray-400">
                                    Proje hakkında daha detaylı bilgi ve teknik şartnameler.
                                </p>
                            </div>
                            <div className="grid w-full gap-3 md:w-auto md:min-w-[460px] md:grid-cols-2">
                                {documents.slice(0, 2).map((doc) => (
                                    <Link
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex h-12 items-center justify-center rounded bg-orange-500 px-6 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                                    >
                                        {doc.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.mapImages ? (
                <section className="w-full bg-white py-24">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
                            Harita Görselleri
                        </h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {mapImages.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative aspect-square rounded border border-gray-100 bg-gray-100 p-2"
                                >
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.map && map ? (
                <section className="relative h-[500px] w-full bg-gray-200">
                    {map.embedSrc ? (
                        <iframe
                            allowFullScreen
                            loading="lazy"
                            src={map.embedSrc}
                            style={{
                                border: 0,
                                filter: "grayscale(100%) contrast(1.1)",
                                width: "100%",
                                height: "100%",
                            }}
                            title="Proje harita konumu"
                        />
                    ) : (
                        <div className="h-full w-full" />
                    )}
                    <div className="absolute left-8 top-8 hidden max-w-sm rounded bg-white p-6 shadow-xl md:block">
                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                            Lokasyon Avantajları
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {faqs.slice(0, 3).map((faq) => (
                                <li key={faq.id} className="flex items-center gap-2">
                                    {faq.question}
                                </li>
                            ))}
                            {faqs.length === 0 ? (
                                <li className="flex items-center gap-2">
                                    Proje merkezi noktalara yakın konumdadır.
                                </li>
                            ) : null}
                        </ul>
                    </div>
                </section>
            ) : null}

            {visibility.otherProjects ? (
                <section className="w-full border-t border-gray-100 bg-white py-24">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <div className="mb-12 flex items-end justify-between">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                                Diğer Projeler
                            </h2>
                            <a
                                className="border-b border-gray-900 pb-1 text-sm font-bold uppercase tracking-widest text-gray-900 transition-colors hover:border-orange-500 hover:text-orange-500"
                                href="#"
                            >
                                Tümünü Gör
                            </a>
                        </div>
                        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                            {otherProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/s2?slug=${project.slug}`}
                                    className="group cursor-pointer"
                                >
                                    <div className="mb-4 overflow-hidden rounded">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={project.image}
                                            alt={project.title}
                                            width={600}
                                            height={400}
                                            className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="mb-1 text-xl font-bold text-gray-900">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm font-light text-gray-500">
                                        {project.location} —{" "}
                                        <span className="font-medium text-orange-500">
                                            {project.status}
                                        </span>
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
