import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HeroSection } from "@/app/(non-localized)/s1/components/HeroSection";
import { ProjectContactSection } from "@/app/(non-localized)/s1/components/ProjectContactSection";
import { ProjectFeaturesSection } from "@/app/(non-localized)/s1/components/ProjectFeaturesSection";
import { getS1ProjectPageData } from "@/app/(non-localized)/s1/data";
import { getS1SectionVisibility } from "@/app/(non-localized)/s1/section-visibility";

const Visuals = nextDynamic(() =>
    import("@/app/(non-localized)/s1/components/Visuals").then(
        (module) => module.Visuals
    )
);
const MapAndCTA = nextDynamic(() =>
    import("@/app/(non-localized)/s1/components/MapAndCTA").then(
        (module) => module.MapAndCTA
    )
);
const ProjectGalleryHub = nextDynamic(() =>
    import("@/app/(non-localized)/s1/components/ProjectGalleryHub").then(
        (module) => module.ProjectGalleryHub
    )
);

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
            <HeroSection hero={projectData.hero} projectSlug={slug} locale={resolvedLocale} />
            <div className="block lg:hidden">
                <ProjectContactSection locale={resolvedLocale} projectSlug={slug} />
            </div>
            {visibility.propertiesRibbon ? (
                <ProjectFeaturesSection items={projectData.propertiesRibbon} />
            ) : null}
            <Suspense fallback={null}>
                <Visuals
                    exteriorVisuals={projectData.exteriorVisuals}
                    socialFacilities={projectData.socialFacilities}
                    interiorVisuals={projectData.interiorVisuals}
                    customGalleries={projectData.customGalleries}
                    floorPlans={projectData.floorPlans}
                    visibility={visibility}
                />
            </Suspense>
            <Suspense fallback={null}>
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
            </Suspense>
            <Suspense fallback={null}>
                <ProjectGalleryHub
                    exteriorVisuals={projectData.exteriorVisuals}
                    socialFacilities={projectData.socialFacilities}
                    interiorVisuals={projectData.interiorVisuals}
                    customGalleries={projectData.customGalleries}
                    floorPlans={projectData.floorPlans}
                    mapImages={projectData.mapImages}
                    visibility={visibility}
                />
            </Suspense>
        </div>
    );
}
