import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1HeroData, S1RibbonItem } from "../../s1/types";

interface HeroSectionProps {
    hero: S1HeroData;
}

interface PropertiesRibbonProps {
    propertiesRibbon: S1RibbonItem[];
    visibility: S1SectionVisibility;
}

const FALLBACK_HERO_IMAGE =
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2800&q=80";

export const HeroSection = ({ hero }: HeroSectionProps) => {
    return (
        <section className="grid min-h-[500px] grid-cols-1 border-b border-gray-200 lg:grid-cols-2">
            <div className="relative flex flex-col justify-center bg-white p-8 lg:p-16">
                <div className="mb-6">
                    <span className="mb-4 inline-block rounded-sm border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
                        {hero.badge}
                    </span>
                    <h1 className="mb-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#0F172A] lg:text-6xl">
                        {hero.title}
                    </h1>
                    {hero.description ? (
                        <p className="max-w-md text-lg font-medium text-gray-500 lg:text-xl">
                            {hero.description}
                        </p>
                    ) : null}
                </div>
                <div className="mt-4 flex flex-col gap-4 pb-12 sm:flex-row">
                    {hero.ctaHref ? (
                        <Link
                            href={hero.ctaHref}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-12 items-center justify-center gap-2 rounded-sm bg-orange-600 px-8 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-700"
                        >
                            <span>{hero.ctaButtonText}</span>
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    ) : (
                        <button className="flex h-12 items-center justify-center gap-2 rounded-sm bg-orange-600 px-8 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-700">
                            <span>{hero.ctaButtonText}</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    )}
                    <button className="flex h-12 items-center justify-center gap-2 rounded-sm border border-gray-200 bg-gray-100 px-8 text-sm font-bold uppercase tracking-wide text-gray-900 transition-colors hover:bg-gray-200">
                        {hero.ctaTitle}
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 flex w-full items-center justify-between border-t border-gray-100 bg-gray-50 px-8 py-3 font-mono text-xs text-gray-500 lg:px-16">
                    <span className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        LIVE
                    </span>
                    <span>{hero.ctaDescription}</span>
                </div>
            </div>
            <div className="relative h-64 bg-gray-200 lg:h-auto">
                <Image
                    quality={100}
                    unoptimized
                    src={hero.backgroundImage || FALLBACK_HERO_IMAGE}
                    alt={hero.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
            </div>
        </section>
    );
};

export const PropertiesRibbon = ({
    propertiesRibbon,
    visibility,
}: PropertiesRibbonProps) => {
    if (!visibility.propertiesRibbon) return null;

    return (
        <div className="overflow-x-auto border-b border-gray-200 bg-white">
            <div className="flex min-w-max divide-x divide-gray-200">
                {propertiesRibbon.map((prop, idx) => (
                    <div
                        key={`${prop.icon}-${prop.label}-${idx}`}
                        className="group flex flex-1 cursor-default items-center gap-4 px-8 py-5 transition-colors hover:bg-gray-50"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-100 text-gray-400 transition-colors group-hover:bg-orange-50 group-hover:text-orange-600">
                            <ProjectIcon name={prop.icon} className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                {prop.label}
                            </span>
                            <span className="text-lg font-bold text-[#0F172A]">
                                {prop.value || prop.label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
