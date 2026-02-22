import Link from "next/link";
import { S1HeroData } from "../types";

const FALLBACK_HERO_IMAGE =
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2800&q=80";

interface HeroSectionProps {
    hero: S1HeroData;
}

export const HeroSection = ({ hero }: HeroSectionProps) => {
    const backgroundImage = hero.backgroundImage || FALLBACK_HERO_IMAGE;

    return (
        <section className="relative h-[85vh] min-h-[520px] w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.12), rgba(0,0,0,0.72)), url('${backgroundImage}')`,
                }}
            />
            <div className="absolute bottom-10 left-6 right-6 text-white md:bottom-12 md:left-12 md:right-auto">
                <span className="mb-4 inline-block rounded-full bg-orange-500 px-4 py-1 text-xs font-bold uppercase tracking-widest">
                    {hero.badge}
                </span>
                <h1 className="mb-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
                    {hero.title}
                </h1>
                {hero.description ? (
                    <p className="max-w-xl text-base text-slate-200 md:text-lg">
                        {hero.description}
                    </p>
                ) : null}
            </div>
            <div className="absolute bottom-12 right-12 hidden max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl lg:block">
                <h3 className="mb-2 text-xl font-bold text-white">{hero.ctaTitle}</h3>
                <p className="mb-6 text-sm text-slate-300">{hero.ctaDescription}</p>
                {hero.ctaHref ? (
                    <Link
                        href={hero.ctaHref}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full rounded-lg bg-white py-3 text-center font-bold text-orange-500 transition-colors hover:bg-slate-100"
                    >
                        {hero.ctaButtonText}
                    </Link>
                ) : (
                    <button className="w-full rounded-lg bg-white py-3 font-bold text-orange-500 transition-colors hover:bg-slate-100">
                        {hero.ctaButtonText}
                    </button>
                )}
            </div>
        </section>
    );
};
