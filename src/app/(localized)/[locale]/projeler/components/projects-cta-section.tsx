import { MoveRight } from "lucide-react";
import Link from "next/link";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";
import { getProjectsPageCopy } from "../copy";

export function ProjectsCtaSection({ locale }: { locale: string }) {
    const copy = getProjectsPageCopy(locale);

    return (
        <ScrollRevealSection className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="reveal relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 p-12 text-center md:p-20">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-orange-500/20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/40 via-transparent to-transparent" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">{copy.ctaTitle}</h2>
                        <p className="mb-10 mx-auto max-w-2xl text-lg text-gray-300">{copy.ctaText}</p>
                        <Link
                            href={`/${locale}/iletisim`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            {copy.ctaButton}
                            <MoveRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </ScrollRevealSection>
    );
}
