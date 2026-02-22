import { HeroSection, PropertiesRibbon } from "./components/HeroSection";
import { ProjectSummary } from "./components/ProjectSummary";
import { MainVisuals } from "./components/MainVisuals";
import { Sidebar } from "./components/Sidebar";
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

export default async function SingleProjectPageS3({ searchParams }: PageProps) {
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
            <div className="mx-auto my-0 flex min-h-screen w-full max-w-[1440px] flex-col overflow-x-clip bg-white font-sans text-[#0F172A] antialiased shadow-2xl sm:mb-8">
                <HeroSection hero={projectData.hero} />
                <PropertiesRibbon
                    propertiesRibbon={projectData.propertiesRibbon}
                    visibility={visibility}
                />
                <main className="grid grid-cols-1 gap-0 divide-gray-200 bg-[#f8f7f5] xl:grid-cols-12 xl:divide-x">
                    <div className="flex flex-col gap-0 divide-y divide-gray-200 xl:col-span-8">
                        <ProjectSummary
                            summary={projectData.summary}
                            firstDocumentUrl={projectData.documents[0]?.url}
                            visibility={visibility}
                        />
                        <MainVisuals
                            videoUrl={projectData.videoUrl}
                            exteriorVisuals={projectData.exteriorVisuals}
                            socialFacilities={projectData.socialFacilities}
                            interiorVisuals={projectData.interiorVisuals}
                            customGalleries={projectData.customGalleries}
                            floorPlans={projectData.floorPlans}
                            documents={projectData.documents}
                            visibility={visibility}
                        />
                    </div>
                    <Sidebar
                        mapImages={projectData.mapImages}
                        map={projectData.map}
                        faqs={projectData.faqs}
                        otherProjects={projectData.otherProjects}
                        visibility={visibility}
                    />
                </main>
                <SPRouteNavigator />
            </div>
        </SPLayout>
    );
}
