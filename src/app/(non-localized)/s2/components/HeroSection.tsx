import { S1HeroData } from "../../s1/types";

const FALLBACK_HERO_IMAGE =
    "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=2800&q=80";

interface HeroSectionProps {
    hero: S1HeroData;
}

export const HeroSection = ({ hero }: HeroSectionProps) => {
    const words = hero.title.split(" ");
    const firstWord = words[0] || hero.title;
    const rest = words.slice(1).join(" ");

    return (
        <header className="relative flex h-[calc(100vh-72px)] min-h-[600px] w-full items-end justify-start overflow-hidden bg-gray-900">
            <div className="absolute inset-0 z-0">
                <div
                    className="h-full w-full bg-cover bg-center brightness-[0.75]"
                    style={{
                        backgroundImage: `url('${hero.backgroundImage || FALLBACK_HERO_IMAGE}')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 md:px-12 md:pb-24 lg:px-20">
                <div className="flex max-w-4xl flex-col gap-2">
                    <span className="mb-2 block border-l-4 border-orange-500 pl-2 text-xl font-light uppercase tracking-[0.2em] text-white/90 md:text-2xl">
                        {hero.badge}
                    </span>
                    <h1 className="text-6xl font-black leading-[0.85] tracking-tight text-white md:text-8xl lg:text-[140px]">
                        {firstWord}
                        {rest ? (
                            <>
                                <br />
                                <span className="text-orange-500">{rest}</span>
                            </>
                        ) : null}
                    </h1>
                </div>
            </div>
        </header>
    );
};
