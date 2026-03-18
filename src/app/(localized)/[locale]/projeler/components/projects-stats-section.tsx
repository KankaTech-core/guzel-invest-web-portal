import { Building2, Rocket, ShieldCheck, Users } from "lucide-react";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";
import { getProjectsPageCopy } from "../copy";

const ICONS = [ShieldCheck, Building2, Users, Rocket] as const;

export function ProjectsStatsSection({ locale }: { locale: string }) {
    const copy = getProjectsPageCopy(locale);

    return (
        <ScrollRevealSection className="bg-white pt-12 pb-20 sm:pt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="reveal-stagger grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                    {copy.stats.map((stat, index) => {
                        const Icon = ICONS[index];
                        return (
                            <div
                                key={stat.label}
                                className="reveal flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-8 text-center shadow-sm"
                            >
                                <Icon className="mb-3 h-8 w-8 text-orange-500" />
                                <p className="mb-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ScrollRevealSection>
    );
}
