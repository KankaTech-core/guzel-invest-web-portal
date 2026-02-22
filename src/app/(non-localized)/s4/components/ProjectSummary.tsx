import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1SummaryData } from "../../s1/types";

interface ProjectSummaryProps {
    summary?: S1SummaryData;
    videoUrl?: string;
    visibility: S1SectionVisibility;
}

export const ProjectSummary = ({
    summary,
    videoUrl,
    visibility,
}: ProjectSummaryProps) => {
    if (!visibility.summary || !summary) return null;

    return (
        <div className="mx-auto w-full max-w-[1700px] px-6 py-20 lg:px-12 lg:py-32">
            <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
                <div className="flex-1 space-y-8">
                    <h2 className="text-4xl font-bold leading-tight text-[#1e3a8a] lg:text-5xl">
                        {summary.title}{" "}
                        {summary.deliveryDate ? (
                            <span className="italic text-[#ec6804]">
                                ({summary.deliveryDate})
                            </span>
                        ) : null}
                    </h2>
                    {summary.description ? (
                        <p className="text-lg leading-relaxed text-slate-600">
                            {summary.description}
                        </p>
                    ) : null}
                    <div className="pt-4">
                        <button className="rounded-full bg-[#ec6804] px-10 py-4 font-bold text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-105 hover:bg-orange-700">
                            Inquire Now
                        </button>
                    </div>
                </div>

                {visibility.video && videoUrl ? (
                    <div className="w-full flex-1">
                        <div className="group relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
                            <video
                                controls
                                preload="metadata"
                                className="h-full w-full object-cover"
                                src={videoUrl}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
