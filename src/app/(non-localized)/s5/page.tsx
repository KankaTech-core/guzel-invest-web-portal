import { HeroSection } from "./components/HeroSection";
import { ProjectSummary } from "./components/ProjectSummary";
import { Visuals } from "./components/Visuals";
import { FooterArea } from "./components/FooterArea";
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

export default async function SingleProjectPageS5({ searchParams }: PageProps) {
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
            <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fdfdfd] font-sans text-[#374151] antialiased selection:bg-[#ec6c04]/20 selection:text-[#ec6c04]">
                <HeroSection
                    hero={projectData.hero}
                    propertiesRibbon={projectData.propertiesRibbon}
                    visibility={visibility}
                />
                <ProjectSummary
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
                <FooterArea
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
