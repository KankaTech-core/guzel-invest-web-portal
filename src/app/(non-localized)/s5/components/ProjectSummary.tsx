import Link from "next/link";
import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1SummaryData } from "../../s1/types";

interface ProjectSummaryProps {
    summary?: S1SummaryData;
    videoUrl?: string;
    firstDocumentUrl?: string;
    visibility: S1SectionVisibility;
}

export const ProjectSummary = ({
    summary,
    videoUrl,
    firstDocumentUrl,
    visibility,
}: ProjectSummaryProps) => {
    return (
        <>
            {visibility.summary && summary ? (
                <section className="mx-auto w-full max-w-[1200px] px-6 py-24 md:px-12 lg:px-24">
                    <div className="flex flex-col items-end justify-between gap-12 md:flex-row">
                        <div className="flex-1">
                            <h2 className="mb-6 text-2xl font-bold text-[#374151]">
                                {summary.title}
                            </h2>
                            {summary.description ? (
                                <p className="text-lg font-light leading-relaxed text-[#374151]/80">
                                    {summary.description}
                                </p>
                            ) : null}
                        </div>
                        <div className="flex w-full shrink-0 flex-col gap-4 sm:flex-row md:w-auto">
                            <button className="w-full rounded-md bg-[#ec6c04] px-8 py-3 text-center text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#ec6c04]/90 sm:w-auto">
                                INQUIRE NOW
                            </button>
                            {firstDocumentUrl ? (
                                <Link
                                    href={firstDocumentUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full rounded-md border border-[#374151]/20 bg-transparent px-8 py-3 text-center text-sm font-bold tracking-wide text-[#374151] transition-colors hover:border-[#374151] sm:w-auto"
                                >
                                    DOWNLOAD BROCHURE
                                </Link>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.video && videoUrl ? (
                <section className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-12 lg:px-24">
                    <div className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100">
                        <video
                            controls
                            preload="metadata"
                            className="h-full w-full object-cover"
                            src={videoUrl}
                        />
                    </div>
                </section>
            ) : null}
        </>
    );
};
