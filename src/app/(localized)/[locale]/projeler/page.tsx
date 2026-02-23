import { ProjectsHeroSection } from "./components/projects-hero-section";
import { ProjectsStatsSection } from "./components/projects-stats-section";
import { ProjectsWhyUsSection } from "./components/projects-why-us-section";
import { ProjectsListSection } from "./components/projects-list-section";
import { ProjectsFaqSection } from "./components/projects-faq-section";
import { ProjectsCtaSection } from "./components/projects-cta-section";

type PageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata() {

    return {
        title: "Projelerimiz | Güzel İnşaat",
        description: "Alanya'nın en seçkin noktalarında modern mimariyi keşfedin.",
    };
}

export default async function ProjectsPage({ params }: PageProps) {
    const { locale } = await params;

    // In a real app we'd fetch these using t() from strictly typed i18n
    // but building the design for now with hardcoded Turkish per the design provided

    return (
        <main className="overflow-x-hidden bg-white pt-16 pb-20">
            <ProjectsHeroSection />
            <ProjectsStatsSection />
            <ProjectsWhyUsSection />
            <ProjectsListSection locale={locale} />
            <ProjectsCtaSection locale={locale} />
            <ProjectsFaqSection />
        </main>
    );
}
