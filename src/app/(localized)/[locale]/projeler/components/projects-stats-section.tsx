import { ShieldCheck, Building2, Users, Rocket } from "lucide-react";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";

const stats = [
    { icon: ShieldCheck, label: "Yıllık Tecrübe", value: "25+" },
    { icon: Building2, label: "Tamamlanan Konut", value: "500+" },
    { icon: Users, label: "Mutlu Aile", value: "1000+" },
    { icon: Rocket, label: "Aktif Proje", value: "15+" },
] as const;

export function ProjectsStatsSection() {
    return (
        <ScrollRevealSection className="bg-white pt-12 pb-20 sm:pt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="reveal-stagger grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="reveal flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50 p-8 text-center shadow-sm"
                        >
                            <stat.icon className="mb-3 h-8 w-8 text-orange-500" />
                            <p className="mb-1 text-3xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                            <p className="font-medium text-gray-500 text-sm">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollRevealSection>
    );
}
