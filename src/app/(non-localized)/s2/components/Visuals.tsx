import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import { S1SectionVisibility } from "../../s1/section-visibility";
import {
    S1CustomGalleryData,
    S1ExteriorVisualsData,
    S1FloorPlansData,
    S1InteriorVisualsData,
    S1SocialFacilitiesData,
} from "../../s1/types";

interface VisualsProps {
    exteriorVisuals?: S1ExteriorVisualsData;
    socialFacilities?: S1SocialFacilitiesData;
    interiorVisuals?: S1InteriorVisualsData;
    customGalleries: S1CustomGalleryData[];
    floorPlans?: S1FloorPlansData;
    visibility: S1SectionVisibility;
}

export const Visuals = ({
    exteriorVisuals,
    socialFacilities,
    interiorVisuals,
    customGalleries,
    floorPlans,
    visibility,
}: VisualsProps) => {
    return (
        <>
            {visibility.exteriorVisuals && exteriorVisuals ? (
                <section className="w-full overflow-hidden bg-white py-24 md:py-32">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <h3 className="mb-16 max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                            {exteriorVisuals.title}
                        </h3>
                        <div className="relative grid min-h-[600px] grid-cols-1 gap-6 md:grid-cols-12">
                            {exteriorVisuals.images[0] ? (
                                <div className="relative z-10 h-[500px] w-full md:col-span-7">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={exteriorVisuals.images[0]}
                                        alt="Exterior 1"
                                        fill
                                        className="rounded object-cover shadow-2xl"
                                    />
                                </div>
                            ) : null}
                            {exteriorVisuals.images[1] ? (
                                <div className="relative z-20 h-[450px] w-full pl-4 pt-8 md:col-span-6 md:col-start-6 md:-mt-32 md:pl-0 md:pt-0">
                                    <div className="relative h-full w-full rounded border-8 border-white shadow-2xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={exteriorVisuals.images[1]}
                                            alt="Exterior 2"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            ) : null}
                            {exteriorVisuals.images[2] ? (
                                <div className="relative z-30 hidden h-[300px] w-full md:col-span-4 md:col-start-2 md:-mt-24 md:block">
                                    <div className="relative h-full w-full rounded border-8 border-white shadow-xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={exteriorVisuals.images[2]}
                                            alt="Exterior 3"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.socialFacilities && socialFacilities ? (
                <section className="w-full bg-[#f8f7f5] py-24">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <div className="flex h-full flex-col gap-12 md:flex-row">
                            <div className="flex-1">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                                    {socialFacilities.facilities.map((facility, idx) => (
                                        <div key={`${facility.name}-${idx}`} className="flex flex-col gap-3">
                                            <div className="text-orange-500">
                                                <ProjectIcon
                                                    name={facility.icon}
                                                    className="h-10 w-10 font-light"
                                                />
                                            </div>
                                            <h4 className="text-lg font-bold uppercase tracking-widest text-gray-900">
                                                {facility.name}
                                            </h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex h-[600px] flex-1 gap-6">
                                {socialFacilities.image ? (
                                    <div className="relative h-full flex-1">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={socialFacilities.image}
                                            alt="Facilities"
                                            fill
                                            className="rounded-sm object-cover grayscale transition-all duration-500 hover:grayscale-0"
                                        />
                                    </div>
                                ) : null}
                                <div className="hidden items-end pb-8 md:flex">
                                    <h2
                                        className="text-6xl font-black uppercase tracking-tighter text-gray-300 md:text-8xl"
                                        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                                    >
                                        {socialFacilities.title}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.interiorVisuals && interiorVisuals ? (
                <section className="w-full bg-white py-24 md:py-32">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
                            <h3 className="whitespace-pre-line text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                                {interiorVisuals.title}
                            </h3>
                            <p className="max-w-md text-right text-gray-500 md:text-left">
                                Modern yaşamın gerekliliklerini sunan iç mekan tasarımları.
                            </p>
                        </div>
                        <div className="relative grid min-h-[600px] grid-cols-1 gap-6 md:grid-cols-12">
                            {interiorVisuals.images[0] ? (
                                <div className="relative z-10 h-[550px] w-full md:col-span-8 md:col-start-5">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={interiorVisuals.images[0]}
                                        alt="Interior 1"
                                        fill
                                        className="rounded object-cover shadow-2xl"
                                    />
                                </div>
                            ) : null}
                            {interiorVisuals.images[1] ? (
                                <div className="relative z-20 h-[400px] w-full pr-4 pt-8 md:col-span-5 md:col-start-2 md:-mt-48 md:pr-0 md:pt-0">
                                    <div className="relative h-full w-full rounded border-8 border-white shadow-2xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={interiorVisuals.images[1]}
                                            alt="Interior 2"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.customGalleries
                ? customGalleries.map((gallery) => (
                      <section key={gallery.id} className="w-full bg-white py-20">
                          <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                              <h3 className="mb-4 text-4xl font-bold text-gray-900">{gallery.title}</h3>
                              {gallery.subtitle ? (
                                  <p className="mb-10 text-gray-500">{gallery.subtitle}</p>
                              ) : null}
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                  {gallery.images.map((image, idx) => (
                                      <div
                                          key={`${gallery.id}-${idx}`}
                                          className="relative aspect-[4/3] overflow-hidden rounded"
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
                          </div>
                      </section>
                  ))
                : null}

            {visibility.floorPlans && floorPlans ? (
                <section className="w-full bg-gray-50 py-24">
                    <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20">
                        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                            <div className="relative flex h-[500px] w-full items-center justify-center">
                                {floorPlans.plans[0]?.image ? (
                                    <div className="absolute left-0 top-10 z-10 h-3/4 w-3/4 rounded border border-gray-100 bg-white p-4 shadow-xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={floorPlans.plans[0].image}
                                            alt={floorPlans.plans[0].title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : null}
                                {floorPlans.plans[1]?.image ? (
                                    <div className="absolute bottom-10 right-0 z-20 h-3/4 w-3/4 rounded border border-gray-100 bg-white p-4 shadow-xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={floorPlans.plans[1].image}
                                            alt={floorPlans.plans[1].title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : null}
                            </div>
                            <div className="flex flex-col gap-8">
                                <h2 className="text-5xl font-bold text-gray-900">
                                    {floorPlans.title}
                                </h2>
                                <p className="text-lg font-light leading-relaxed text-gray-600">
                                    {floorPlans.description}
                                </p>
                                <div className="flex flex-col gap-4">
                                    {floorPlans.plans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className="flex items-center justify-between border-b border-gray-300 py-3"
                                        >
                                            <span className="font-medium text-gray-800">
                                                {plan.title}
                                            </span>
                                            {plan.area ? (
                                                <span className="text-gray-500">{plan.area}</span>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 flex w-fit items-center gap-2 rounded font-bold uppercase tracking-widest text-orange-500 transition-all hover:gap-4">
                                    Tüm Planları İncele <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
