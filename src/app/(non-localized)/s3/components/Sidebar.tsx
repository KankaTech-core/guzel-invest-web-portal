import Image from "next/image";
import Link from "next/link";
import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1FaqItem, S1MapData, S1MapImageItem, S1OtherProjectItem } from "../../s1/types";

interface SidebarProps {
    mapImages: S1MapImageItem[];
    map?: S1MapData;
    faqs: S1FaqItem[];
    otherProjects: S1OtherProjectItem[];
    visibility: S1SectionVisibility;
}

export const Sidebar = ({
    mapImages,
    map,
    faqs,
    otherProjects,
    visibility,
}: SidebarProps) => {
    const shouldRenderSidebar =
        visibility.mapImages || visibility.map || visibility.otherProjects;

    if (!shouldRenderSidebar) {
        return null;
    }

    return (
        <div className="bg-gray-50 xl:col-span-4">
            <div className="no-scrollbar sticky top-24 flex h-[calc(100vh-6rem)] flex-col overflow-y-auto">
                {visibility.mapImages ? (
                    <div className="grid grid-cols-3 gap-0.5 border-b border-gray-200">
                        {mapImages.map((mapItem, idx) => (
                            <div
                                key={mapItem.id}
                                className="group relative aspect-square overflow-hidden bg-gray-200"
                            >
                                <Image
                                    quality={100}
                                    unoptimized
                                    src={mapItem.image}
                                    alt={mapItem.title}
                                    fill
                                    className={`object-cover ${
                                        idx === 2 ? "grayscale" : ""
                                    }`}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <span className="text-xs font-bold uppercase text-white">
                                        {mapItem.title}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                {visibility.map && map ? (
                    <div className="relative h-64 w-full bg-gray-200">
                        {map.embedSrc ? (
                            <iframe
                                src={map.embedSrc}
                                className="h-full w-full border-0 object-cover opacity-90"
                                loading="lazy"
                                title="Project map"
                            />
                        ) : null}
                        <div className="absolute bottom-4 left-4 right-4 rounded-sm border-l-4 border-orange-600 bg-white p-4 shadow-lg">
                            <h4 className="mb-1 text-sm font-bold uppercase text-[#0F172A]">
                                Lokasyon
                            </h4>
                            {map.mapsLink ? (
                                <Link
                                    href={map.mapsLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-gray-500 hover:text-orange-600"
                                >
                                    Google Maps&apos;te aç
                                </Link>
                            ) : null}
                            <div className="mt-2 flex flex-wrap gap-2">
                                {faqs.slice(0, 2).map((faq) => (
                                    <span
                                        key={faq.id}
                                        className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600"
                                    >
                                        {faq.question}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}

                {visibility.otherProjects ? (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                            Similar Opportunities
                        </h3>
                        <div className="flex flex-col gap-3">
                            {otherProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/s3?slug=${project.slug}`}
                                    className="group cursor-pointer rounded-sm border border-gray-200 bg-white p-3 shadow-sm transition-colors hover:border-orange-600/50"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <span className="text-sm font-bold text-[#0F172A]">
                                            {project.title}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-green-600">
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="flex items-end justify-between text-xs text-gray-500">
                                        <span>{project.location}</span>
                                        <span className="font-mono font-bold text-gray-900">
                                            {project.roomSummary || "-"}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <button className="w-full rounded-sm bg-gray-900 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-gray-800">
                                Schedule a Call
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
                }}
            />
        </div>
    );
};
