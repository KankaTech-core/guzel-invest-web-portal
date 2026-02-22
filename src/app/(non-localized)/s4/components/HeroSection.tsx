import { ArrowRight, Verified } from "lucide-react";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1HeroData, S1RibbonItem } from "../../s1/types";

interface HeroSectionProps {
    hero: S1HeroData;
    propertiesRibbon: S1RibbonItem[];
    visibility: S1SectionVisibility;
}

const FALLBACK_HERO_IMAGE =
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=2800&q=80";

export const HeroSection = ({
    hero,
    propertiesRibbon,
    visibility,
}: HeroSectionProps) => {
    return (
        <>
            <div className="group relative h-screen min-h-[700px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] ease-out group-hover:scale-105"
                    style={{
                        backgroundImage: `url('${hero.backgroundImage || FALLBACK_HERO_IMAGE}')`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>

                <div className="pointer-events-none absolute inset-0 mx-auto flex w-full max-w-[1400px] flex-col justify-end px-8 pb-20 md:px-16">
                    <div className="pointer-events-auto animate-fade-in-up">
                        <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold tracking-wider text-white backdrop-blur-md">
                            {hero.badge}
                        </span>
                        <h1 className="mb-6 whitespace-pre-line text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl">
                            {hero.title}
                        </h1>
                    </div>
                </div>

                <div className="pointer-events-auto absolute bottom-8 right-8 z-10 w-full max-w-sm rounded-2xl border border-white/50 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 md:bottom-12 md:right-12">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#ec6804]">
                                {hero.ctaTitle}
                            </p>
                            <p className="text-2xl font-bold text-slate-900">
                                {hero.ctaDescription}
                            </p>
                        </div>
                        <Verified className="h-8 w-8 text-[#ec6804]" />
                    </div>
                    <button className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-[#ec6804] px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-700">
                        {hero.ctaButtonText}
                        <ArrowRight className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>

            {visibility.propertiesRibbon ? (
                <div className="border-b border-[#e5e0d8] bg-[#e5e0d8]/30">
                    <div className="mx-auto max-w-[1400px] px-6 py-10">
                        <div className="flex flex-wrap justify-center gap-8 md:justify-between md:gap-4">
                            {propertiesRibbon.map((prop, idx) => (
                                <div
                                    key={`${prop.icon}-${prop.label}-${idx}`}
                                    className="group flex min-w-[100px] flex-col items-center gap-3"
                                >
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#ec6804] shadow-sm transition-colors group-hover:bg-[#ec6804] group-hover:text-white">
                                        <ProjectIcon name={prop.icon} className="h-8 w-8" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-900">
                                            {prop.value || prop.label}
                                        </p>
                                        <p className="text-sm text-slate-500">{prop.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};
