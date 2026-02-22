import Link from "next/link";
import { BuildingIcon } from "lucide-react";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1RibbonItem, S1SummaryData } from "../../s1/types";

interface ProjectInfoProps {
    propertiesRibbon: S1RibbonItem[];
    summary?: S1SummaryData;
    videoUrl?: string;
    firstDocumentUrl?: string;
    visibility: S1SectionVisibility;
}

export const ProjectInfo = ({
    propertiesRibbon,
    summary,
    videoUrl,
    firstDocumentUrl,
    visibility,
}: ProjectInfoProps) => {
    const locationValue =
        propertiesRibbon.find((item) => item.label.toLowerCase().includes("konum"))
            ?.value || "Konum bilgisi eklenecek";
    const statusValue = summary?.deliveryDate
        ? `Teslim: ${summary.deliveryDate}`
        : "Yayında";

    return (
        <>
            {visibility.propertiesRibbon ? (
                <section className="w-full border-b border-gray-100 bg-white py-12">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <div className="grid grid-cols-2 items-center justify-items-center gap-8 md:grid-cols-5">
                            {propertiesRibbon.slice(0, 5).map((prop, idx) => (
                                <div
                                    key={`${prop.icon}-${prop.label}-${idx}`}
                                    className="group flex cursor-default flex-col items-center gap-3"
                                >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 text-gray-800 transition-colors group-hover:border-orange-500 group-hover:text-orange-500">
                                        <ProjectIcon
                                            name={prop.icon}
                                            className="h-8 w-8 font-light"
                                        />
                                    </div>
                                    <span className="text-center text-sm font-medium uppercase tracking-widest text-gray-500">
                                        {prop.value || prop.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.summary && summary ? (
                <section className="w-full bg-white py-24 md:py-32">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-24">
                            <div className="flex flex-1 flex-col gap-8">
                                <div className="flex h-20 w-20 items-center justify-center rounded bg-gray-900 text-white">
                                    <BuildingIcon className="h-10 w-10" />
                                </div>
                                <div>
                                    <h2 className="mb-6 whitespace-pre-line text-5xl font-bold leading-none tracking-tight text-gray-900 md:text-7xl">
                                        {summary.title}
                                    </h2>
                                    {summary.description ? (
                                        <p className="max-w-2xl text-xl font-light leading-relaxed text-gray-500 md:text-2xl">
                                            {summary.description}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex w-full flex-col gap-8 lg:min-w-[400px] lg:w-auto">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between border-b border-gray-200 py-4">
                                        <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
                                            Lokasyon
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {locationValue}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 py-4">
                                        <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
                                            Durum
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            {statusValue}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                                    <a
                                        href="#contact"
                                        className="flex h-14 flex-1 items-center justify-center rounded bg-orange-500 px-8 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-orange-600"
                                    >
                                        İletişime Geç
                                    </a>
                                    {firstDocumentUrl ? (
                                        <Link
                                            href={firstDocumentUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex h-14 flex-1 items-center justify-center rounded border border-orange-500 px-8 text-sm font-bold uppercase tracking-wide text-orange-500 transition-all hover:bg-orange-500 hover:text-white"
                                        >
                                            Broşür İndir
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.video && videoUrl ? (
                <section className="w-full bg-gray-50 py-12">
                    <div className="mx-auto max-w-[1600px] px-4 md:px-8">
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-900">
                            <video
                                controls
                                preload="metadata"
                                className="h-full w-full object-cover"
                                src={videoUrl}
                            />
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
