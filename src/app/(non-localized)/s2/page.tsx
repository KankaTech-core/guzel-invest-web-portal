import { HeroSection } from "./components/HeroSection";
import { ProjectInfo } from "./components/ProjectInfo";
import { Visuals } from "./components/Visuals";
import { MapAndCTA } from "./components/MapAndCTA";
import SPRouteNavigator from "@/components/single-project/SPRouteNavigator";
import SPLayout from "@/components/single-project/SPLayout";
import { getS1ProjectPageData } from "../s1/data";
import { getS1SectionVisibility } from "../s1/section-visibility";

interface PageProps {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const readQueryValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

export const dynamic = "force-dynamic";

export default async function SingleProjectPageS2({ searchParams }: PageProps) {
    const params = (await searchParams) || {};
    const slug = readQueryValue(params.slug);
    const locale = readQueryValue(params.locale);

    const projectData = await getS1ProjectPageData({
        slug: slug?.trim() || undefined,
        locale: locale?.trim() || "tr",
    });

    if (!projectData) {
        return (
            <SPLayout>
                <main className="min-h-screen bg-white px-4 py-20 text-gray-900">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
                        <h1 className="text-2xl font-bold">Proje bulunamadı</h1>
                        <p className="mt-3 text-sm text-gray-500">
                            Seçilen proje henüz yayında olmayabilir veya `slug` değeri yanlış
                            olabilir.
                        </p>
                    </div>
                    <SPRouteNavigator />
                </main>
            </SPLayout>
        );
    }

    const visibility = getS1SectionVisibility(projectData);

    return (
        <SPLayout>
            <main className="flex min-h-screen flex-col overflow-x-clip bg-white font-sans text-gray-900 selection:bg-orange-500/30">
                <HeroSection hero={projectData.hero} />
                <ProjectInfo
                    propertiesRibbon={projectData.propertiesRibbon}
                    summary={projectData.summary}
                    videoUrl={projectData.videoUrl}
                    firstDocumentUrl={projectData.documents[0]?.url}
                    visibility={visibility}
                />
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
                    visibility={visibility}
                />
                <SPRouteNavigator />
            </main>
        </SPLayout>
    );
}
