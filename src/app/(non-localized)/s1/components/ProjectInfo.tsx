"use client";

import Link from "next/link";
import { Download, Images, Phone } from "lucide-react";
import { S1SectionVisibility } from "../section-visibility";
import { S1RibbonItem, S1SummaryData } from "../types";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { dispatchOpenConnectedProjectGallery } from "./project-gallery-events";

interface ProjectInfoProps {
    propertiesRibbon: S1RibbonItem[];
    summary?: S1SummaryData;
    videoUrl?: string;
    firstDocumentUrl?: string;
    showProjectGalleryButton?: boolean;
    visibility: S1SectionVisibility;
}

export const ProjectInfo = ({
    propertiesRibbon,
    summary,
    videoUrl,
    firstDocumentUrl,
    showProjectGalleryButton = false,
    visibility,
}: ProjectInfoProps) => {
    return (
        <>
            {visibility.propertiesRibbon ? (
                <section className="border-b border-gray-100 bg-white py-8">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex flex-wrap justify-between gap-6 md:gap-4">
                            {propertiesRibbon.map((prop) => (
                                <div
                                    key={`${prop.icon}-${prop.label}-${prop.value || "x"}`}
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                                        <ProjectIcon
                                            name={prop.icon}
                                            className="h-6 w-6 text-orange-500"
                                        />
                                    </div>
                                    <div>
                                        {prop.value ? (
                                            <p className="text-[10px] font-bold uppercase text-gray-400">
                                                {prop.label}
                                            </p>
                                        ) : null}
                                        <p className="font-bold text-gray-900">
                                            {prop.value || prop.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.summary && summary ? (
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex flex-col items-center gap-12 rounded-[24px] border border-gray-100 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)] lg:flex-row">
                            {summary.logoUrl ? (
                                <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={summary.logoUrl}
                                        alt={`${summary.title} logosu`}
                                        className="h-full w-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            ) : null}
                            <div className="flex-1">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                                    {summary.title}
                                </h2>
                                {summary.description ? (
                                    <p className="leading-relaxed text-gray-600">
                                        {summary.description}
                                    </p>
                                ) : null}
                            </div>
                            <div className="flex w-full flex-col gap-4 lg:w-64">
                                {summary.deliveryDate ? (
                                    <div className="mb-2 rounded-xl bg-gray-50 p-4 text-center">
                                        <p className="text-xs font-bold uppercase text-gray-400">
                                            Teslim Tarihi
                                        </p>
                                        <p className="text-xl font-bold text-orange-500">
                                            {summary.deliveryDate}
                                        </p>
                                    </div>
                                ) : null}
                                <a
                                    href="#contact"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white transition-all hover:bg-orange-600"
                                >
                                    <Phone className="h-5 w-5" />
                                    İletişim
                                </a>
                                {firstDocumentUrl ? (
                                    <Link
                                        href={firstDocumentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-orange-500 py-3.5 font-bold text-orange-500 transition-all hover:bg-orange-50"
                                    >
                                        <Download className="h-5 w-5" />
                                        Sunum İndir
                                    </Link>
                                ) : null}
                                {showProjectGalleryButton ? (
                                    <button
                                        type="button"
                                        onClick={() => dispatchOpenConnectedProjectGallery({ key: "all" })}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#111828] py-3.5 font-bold text-[#111828] transition-all hover:bg-gray-100"
                                    >
                                        <Images className="h-5 w-5" />
                                        Galeriye Bak
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.video && videoUrl ? (
                <section className="bg-white py-16">
                    <div className="mx-auto max-w-5xl px-4">
                        <div className="aspect-video overflow-hidden rounded-3xl border border-gray-100 bg-gray-100">
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
