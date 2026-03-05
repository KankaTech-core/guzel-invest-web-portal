import Image from "next/image";
import Link from "next/link";
import { S1HeroData } from "../types";
import { HeroContactForm } from "./HeroContactForm";

const FALLBACK_HERO_IMAGE =
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2800&q=80";

interface HeroSectionProps {
    hero: S1HeroData;
    projectSlug?: string;
    locale?: string;
}

export const HeroSection = ({ hero, projectSlug, locale }: HeroSectionProps) => {
    const backgroundImage = hero.backgroundImage || FALLBACK_HERO_IMAGE;

    return (
        <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
            <Image
                src={backgroundImage}
                alt={hero.title || "Proje kapak görseli"}
                fill
                priority
                className="object-cover"
                sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/75" />
            <div className="absolute bottom-10 left-6 right-6 z-10 text-white md:bottom-12 md:left-12 md:right-auto">
                {hero.badge ? (
                    <span className="mb-4 inline-block rounded-full bg-orange-500 px-4 py-1 text-xs font-bold tracking-widest shadow-sm">
                        {hero.badge}
                    </span>
                ) : null}
                <h1 className="mb-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl lg:text-7xl">
                    {hero.title}
                </h1>
                {hero.description ? (
                    <p className="max-w-xl text-base text-slate-200 drop-shadow-sm md:text-lg">
                        {hero.description}
                    </p>
                ) : null}
            </div>

            {projectSlug ? (
                <div className="absolute bottom-10 right-10 z-20 hidden w-[420px] rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl lg:block">
                    <HeroContactForm projectSlug={projectSlug} locale={locale} />
                </div>
            ) : (
                <div className="absolute bottom-12 right-12 z-20 hidden max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl lg:block">
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
            )}
        </section>
    );
};
