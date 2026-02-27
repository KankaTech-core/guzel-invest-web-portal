import { notFound } from "next/navigation";
import { HeroSection } from "@/app/(non-localized)/s1/components/HeroSection";
import { Visuals } from "@/app/(non-localized)/s1/components/Visuals";
import { MapAndCTA } from "@/app/(non-localized)/s1/components/MapAndCTA";
import { ProjectGalleryHub } from "@/app/(non-localized)/s1/components/ProjectGalleryHub";
import { ProjectContactSection } from "@/app/(non-localized)/s1/components/ProjectContactSection";
import { ProjectFeaturesSection } from "@/app/(non-localized)/s1/components/ProjectFeaturesSection";
import { getS1ProjectPageData } from "@/app/(non-localized)/s1/data";
import { getS1SectionVisibility } from "@/app/(non-localized)/s1/section-visibility";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const resolvedLocale = locale.trim() || "tr";

    const projectData = await getS1ProjectPageData({
        slug: slug.trim(),
        locale: resolvedLocale,
    });

    if (!projectData) {
        notFound();
    }

    const visibility = getS1SectionVisibility(projectData);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-500/30">
            <HeroSection hero={projectData.hero} />
            <ProjectContactSection locale={resolvedLocale} projectSlug={slug} />
            {visibility.propertiesRibbon ? (
                <ProjectFeaturesSection items={projectData.propertiesRibbon} />
            ) : null}
            <Visuals
                exteriorVisuals={projectData.exteriorVisuals}
                socialFacilities={projectData.socialFacilities}
                interiorVisuals={projectData.interiorVisuals}
                customGalleries={projectData.customGalleries}
                floorPlans={projectData.floorPlans}
                visibility={visibility}
            />
            <MapAndCTA
                documents={projectData.documents}
                mapImages={projectData.mapImages}
                map={projectData.map}
                faqs={projectData.faqs}
                otherProjects={projectData.otherProjects}
                locale={resolvedLocale}
                visibility={visibility}
                videoUrl={projectData.videoUrl}
                videoTitle={projectData.videoTitle}
            />
            <ProjectGalleryHub
                exteriorVisuals={projectData.exteriorVisuals}
                socialFacilities={projectData.socialFacilities}
                interiorVisuals={projectData.interiorVisuals}
                customGalleries={projectData.customGalleries}
                floorPlans={projectData.floorPlans}
                mapImages={projectData.mapImages}
                visibility={visibility}
            />
        </div>
    );
}
