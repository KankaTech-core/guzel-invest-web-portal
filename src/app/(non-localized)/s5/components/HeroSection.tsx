import { ArrowRight } from "lucide-react";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { S1SectionVisibility } from "../../s1/section-visibility";
import { S1HeroData, S1RibbonItem } from "../../s1/types";

interface HeroSectionProps {
    hero: S1HeroData;
    propertiesRibbon: S1RibbonItem[];
    visibility: S1SectionVisibility;
}

const FALLBACK_HERO_IMAGE =
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2800&q=80";

export const HeroSection = ({
    hero,
    propertiesRibbon,
    visibility,
}: HeroSectionProps) => {
    return (
        <>
            <section className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 pb-12 pt-24 text-center md:px-12 lg:px-24">
                <span className="mb-3 text-sm font-medium uppercase tracking-widest text-gray-700/60">
                    {hero.badge}
                </span>
                <h1 className="mb-8 text-4xl font-bold tracking-tight text-[#374151] md:text-5xl lg:text-6xl">
                    {hero.title}
                </h1>
                <div className="relative mb-8 h-[60vh] w-full overflow-hidden rounded-md md:h-[70vh]">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url('${hero.backgroundImage || FALLBACK_HERO_IMAGE}')`,
                        }}
                    />
                </div>
                <a className="group inline-flex cursor-pointer items-center gap-2 border-b border-transparent pb-0.5 text-sm font-bold tracking-wide text-[#ec6c04] transition-colors hover:border-[#ec6c04]">
                    {hero.ctaButtonText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
            </section>

            {visibility.propertiesRibbon ? (
                <section className="mx-auto w-full max-w-[1440px] border-b border-gray-100 px-6 py-16 md:px-12 lg:px-24">
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 md:gap-x-24">
                        {propertiesRibbon.map((prop, idx) => (
                            <div
                                key={`${prop.icon}-${prop.label}-${idx}`}
                                className="group flex flex-col items-center gap-3"
                            >
                                <ProjectIcon
                                    name={prop.icon}
                                    className="h-8 w-8 font-light text-gray-700/80"
                                />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#374151]/60">
                                    {prop.value || prop.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}
        </>
    );
};
