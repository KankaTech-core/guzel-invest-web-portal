import Link from "next/link";
import { Download, Info } from "lucide-react";
import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1SummaryData } from "../../s1/types";

interface ProjectSummaryProps {
    summary?: S1SummaryData;
    firstDocumentUrl?: string;
    visibility: S1SectionVisibility;
}

export const ProjectSummary = ({
    summary,
    firstDocumentUrl,
    visibility,
}: ProjectSummaryProps) => {
    if (!visibility.summary || !summary) return null;

    return (
        <section className="bg-white p-8 lg:p-12">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
                <div className="flex-1">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#0F172A] text-xl font-bold text-white">
                            {summary.title.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#0F172A]">
                                {summary.title}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {summary.deliveryDate || "Proje Özeti"}
                            </p>
                        </div>
                    </div>
                    {summary.description ? (
                        <p className="mb-6 leading-relaxed text-gray-600">
                            {summary.description}
                        </p>
                    ) : null}
                    {summary.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {summary.tags.map((tag, idx) => (
                                <span
                                    key={`${tag}-${idx}`}
                                    className="rounded-sm border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
                <div className="flex w-full min-w-[200px] flex-col gap-3 md:w-auto">
                    <a
                        href="#contact"
                        className="group flex w-full items-center justify-between rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#0F172A] transition-colors hover:bg-gray-50"
                    >
                        <span>Request Info</span>
                        <Info className="h-5 w-5 text-gray-400 transition-colors group-hover:text-orange-600" />
                    </a>
                    {firstDocumentUrl ? (
                        <Link
                            href={firstDocumentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex w-full items-center justify-between rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm font-bold uppercase tracking-wide text-[#0F172A] transition-colors hover:bg-gray-50"
                        >
                            <span>Download PDF</span>
                            <Download className="h-5 w-5 text-gray-400 transition-colors group-hover:text-orange-600" />
                        </Link>
                    ) : null}
                </div>
            </div>
        </section>
    );
};
