import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";

export function ProjectsHeroSection() {
    return (
        <ScrollRevealSection
            as="section"
            className="relative isolate min-h-[430px] overflow-hidden bg-white sm:min-h-[520px]"
            threshold={0.05}
            rootMargin="0px"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9GAcpIIQUszVUgzVGbHSCxuCnsb7ysV4VezsUGBYNUms34ZIn8fvxYFfiIp7Er7qQzMHjWT1YwEkRlZldIsxHElthq3HgFZTVJ16LN6nrC4-bluQJlTu41JKSIaFxV4fJ2NiBGBxDE0iL1va4Qe8EwdnOTh0Hr75q3AOPv9ImDrW72-zxL6k6bO6s-eCCbKrKb--bRNZY77XwBv2kk3l1l9t_IcPHMNK5YrAodYiOKDSmgguITMjAA1admw3hkp3pKZKQq5vcDS0a"
                    alt="Projelerimiz için modern mimari arka plan görseli"
                    className="h-full w-full object-cover object-center opacity-80"
                />
            </div>

            {/* Elegant Light Overlays */}
            <div className="absolute inset-0 z-0 bg-black/20 backdrop-blur-[1px]" />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/35 via-black/25 to-black/45" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-black/35 to-black/50" />

            <div className="container-custom relative z-10 flex min-h-[430px] flex-col items-center justify-center text-center sm:min-h-[520px]">
                <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)] sm:text-7xl">
                    Projelerimiz
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-lg">
                    Güzel İnşaat ile hayalinizdeki yaşama ve güvenli yatırıma bir adım
                    daha yaklaşın. Alanya&apos;nın en seçkin noktalarında modern mimariyi
                    keşfedin.
                </p>
            </div>
        </ScrollRevealSection>
    );
}
