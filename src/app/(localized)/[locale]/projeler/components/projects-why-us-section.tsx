import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";
import { getProjectsPageCopy } from "../copy";

export function ProjectsWhyUsSection({ locale }: { locale: string }) {
    const copy = getProjectsPageCopy(locale);

    return (
        <ScrollRevealSection className="bg-gray-50 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid items-start gap-12 md:grid-cols-2">
                    <div className="reveal space-y-4">
                        <div className="mb-2 flex items-center gap-3 text-orange-500">
                            <span className="h-px w-8 bg-orange-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">{copy.whyUsEyebrowLeft}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{copy.whyUsTitle}</h3>
                        <p className="text-lg leading-relaxed text-gray-600">{copy.whyUsIntro}</p>
                    </div>

                    <div className="reveal space-y-4">
                        <div className="mb-2 flex items-center gap-3 text-orange-500">
                            <span className="h-px w-8 bg-orange-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">{copy.whyUsEyebrowRight}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{copy.locationTitle}</h3>
                        <p className="text-lg leading-relaxed text-gray-600">{copy.locationIntro}</p>
                    </div>
                </div>
            </div>
        </ScrollRevealSection>
    );
}
