import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { S1SectionVisibility } from "../../s1/section-visibility";
import {
    S1CustomGalleryData,
    S1DocumentItem,
    S1ExteriorVisualsData,
    S1FloorPlansData,
    S1InteriorVisualsData,
    S1SocialFacilitiesData,
} from "../../s1/types";

interface MainVisualsProps {
    videoUrl?: string;
    exteriorVisuals?: S1ExteriorVisualsData;
    socialFacilities?: S1SocialFacilitiesData;
    interiorVisuals?: S1InteriorVisualsData;
    customGalleries: S1CustomGalleryData[];
    floorPlans?: S1FloorPlansData;
    documents: S1DocumentItem[];
    visibility: S1SectionVisibility;
}

export const MainVisuals = ({
    videoUrl,
    exteriorVisuals,
    socialFacilities,
    interiorVisuals,
    customGalleries,
    floorPlans,
    documents,
    visibility,
}: MainVisualsProps) => {
    return (
        <>
            {visibility.video && videoUrl ? (
                <section className="relative aspect-video w-full overflow-hidden bg-gray-900">
                    <video
                        controls
                        preload="metadata"
                        className="h-full w-full object-cover opacity-80"
                        src={videoUrl}
                    />
                </section>
            ) : null}

            {visibility.exteriorVisuals && exteriorVisuals ? (
                <section className="bg-white p-8 lg:p-12">
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-xl font-bold uppercase tracking-tight text-[#0F172A]">
                            {exteriorVisuals.title}
                        </h3>
                        <span className="flex cursor-pointer items-center gap-1 text-sm font-bold text-orange-500 hover:underline">
                            View All <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {exteriorVisuals.images[0] ? (
                            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-gray-100 md:col-span-2">
                                <Image
                                    quality={100}
                                    unoptimized
                                    src={exteriorVisuals.images[0]}
                                    alt="Exterior 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : null}
                        <div className="flex flex-col gap-4">
                            {exteriorVisuals.images[1] ? (
                                <div className="relative flex-1 overflow-hidden rounded-sm bg-gray-100">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={exteriorVisuals.images[1]}
                                        alt="Exterior 2"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : null}
                            {exteriorVisuals.images[2] ? (
                                <div className="relative flex-1 overflow-hidden rounded-sm bg-gray-100">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={exteriorVisuals.images[2]}
                                        alt="Exterior 3"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.socialFacilities && socialFacilities ? (
                <section className="grid grid-cols-1 bg-gray-50 lg:grid-cols-2">
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                        <h3 className="mb-6 text-xl font-bold uppercase tracking-tight text-[#0F172A]">
                            {socialFacilities.title}
                        </h3>
                        <div className="divide-y divide-gray-100 rounded-sm border border-gray-200 bg-white">
                            {socialFacilities.facilities.map((facility, idx) => (
                                <div
                                    key={`${facility.name}-${idx}`}
                                    className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50"
                                >
                                    <div className="rounded-sm bg-orange-50 p-2 text-orange-600">
                                        <ProjectIcon
                                            name={facility.icon}
                                            className="h-6 w-6"
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-[#0F172A]">
                                        {facility.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative min-h-[300px] lg:min-h-auto">
                        {socialFacilities.image ? (
                            <Image
                                quality={100}
                                unoptimized
                                src={socialFacilities.image}
                                alt={socialFacilities.title}
                                fill
                                className="object-cover"
                            />
                        ) : null}
                    </div>
                </section>
            ) : null}

            {visibility.interiorVisuals && interiorVisuals ? (
                <section className="bg-white p-8 lg:p-12">
                    <h3 className="mb-8 text-xl font-bold uppercase tracking-tight text-[#0F172A]">
                        {interiorVisuals.title}
                    </h3>
                    <div className="overflow-hidden rounded-sm border border-gray-200 bg-gray-200">
                        <div className="grid grid-cols-1 gap-0.5 md:grid-cols-3">
                            {interiorVisuals.images.map((image, idx) => (
                                <div
                                    key={`${image}-${idx}`}
                                    className="relative h-64 bg-gray-100 md:h-80"
                                >
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={image}
                                        alt={`Interior ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.customGalleries
                ? customGalleries.map((gallery) => (
                      <section key={gallery.id} className="bg-white p-8 lg:p-12">
                          <h3 className="mb-4 text-xl font-bold uppercase tracking-tight text-[#0F172A]">
                              {gallery.title}
                          </h3>
                          {gallery.subtitle ? (
                              <p className="mb-6 text-sm text-gray-500">{gallery.subtitle}</p>
                          ) : null}
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              {gallery.images.map((image, idx) => (
                                  <div
                                      key={`${gallery.id}-${idx}`}
                                      className="relative h-60 overflow-hidden rounded-sm bg-gray-100"
                                  >
                                      <Image
                                          quality={100}
                                          unoptimized
                                          src={image}
                                          alt={gallery.title}
                                          fill
                                          className="object-cover"
                                      />
                                  </div>
                              ))}
                          </div>
                      </section>
                  ))
                : null}

            {visibility.floorPlans && floorPlans ? (
                <section className="bg-gray-50 p-8 lg:p-12">
                    <h3 className="mb-8 text-xl font-bold uppercase tracking-tight text-[#0F172A]">
                        {floorPlans.title}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {floorPlans.plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <h4 className="text-lg font-bold text-[#0F172A]">
                                        {plan.title}
                                    </h4>
                                    {plan.area ? (
                                        <span className="rounded-sm bg-orange-50 px-2 py-1 text-xs font-bold uppercase text-orange-600">
                                            {plan.area}
                                        </span>
                                    ) : null}
                                </div>
                                <div className="relative flex aspect-square items-center justify-center border border-dashed border-gray-200 bg-gray-50 p-4">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={plan.image}
                                        alt={plan.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {visibility.documents ? (
                <section className="flex flex-col items-center justify-between gap-6 bg-[#0F172A] p-8 text-white md:flex-row lg:p-12">
                    <div>
                        <h3 className="mb-2 text-2xl font-bold">Project Documents</h3>
                        <p className="max-w-md text-sm text-gray-400">
                            Access project presentations and technical documentation.
                        </p>
                    </div>
                    <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
                        {documents.slice(0, 2).map((doc) => (
                            <a
                                key={doc.id}
                                href={doc.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-orange-600 px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-orange-700 sm:w-auto"
                            >
                                <FileText className="h-5 w-5" />
                                <span>{doc.name}</span>
                            </a>
                        ))}
                    </div>
                </section>
            ) : null}
        </>
    );
};
