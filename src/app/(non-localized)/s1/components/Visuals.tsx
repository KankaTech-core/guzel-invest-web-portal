import Image from "next/image";
import { ArrowRight, ZoomIn } from "lucide-react";
import { S1SectionVisibility } from "../section-visibility";
import {
    S1CustomGalleryData,
    S1ExteriorVisualsData,
    S1FloorPlansData,
    S1InteriorVisualsData,
    S1SocialFacilitiesData,
} from "../types";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";

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
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <h2 className="mb-8 text-3xl font-bold text-gray-900">
                            {exteriorVisuals.title}
                        </h2>
                        <div className="grid auto-rows-[200px] grid-cols-2 gap-4">
                            {exteriorVisuals.images.map((image, idx) => (
                                <div
                                    key={`${image}-${idx}`}
                                    className={`relative overflow-hidden rounded-2xl bg-gray-200 ${
                                        idx === 0 ? "row-span-2" : ""
                                    }`}
                                >
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={image}
                                        alt="Proje dış görseli"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.socialFacilities && socialFacilities ? (
                <section className="overflow-hidden bg-white py-24">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-4 lg:flex-row">
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:w-1/2">
                            {socialFacilities.facilities.map((facility, idx) => (
                                <div
                                    key={`${facility.name}-${idx}`}
                                    className="group text-center"
                                >
                                    <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-gray-100 bg-gray-50 shadow-sm transition-all group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                                        <ProjectIcon
                                            name={facility.icon}
                                            className="h-8 w-8"
                                        />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                        {facility.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="relative lg:w-1/2">
                            {socialFacilities.image ? (
                                <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={socialFacilities.image}
                                        alt={socialFacilities.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : null}
                            <div className="left-4 mt-6 max-w-xs rounded-3xl bg-orange-500 p-8 text-white shadow-lg sm:absolute sm:-bottom-6 sm:left-6 sm:mt-0">
                                <h3 className="mb-2 text-2xl font-black">
                                    {socialFacilities.title}
                                </h3>
                                <p className="text-sm text-white/90">
                                    {socialFacilities.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.interiorVisuals && interiorVisuals ? (
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="mb-8 flex items-end justify-between gap-4">
                            <h2 className="text-3xl font-bold text-gray-900">
                                {interiorVisuals.title}
                            </h2>
                            {interiorVisuals.images.length > 3 ? (
                                <p className="flex items-center gap-2 font-bold text-orange-500">
                                    Tümünü Gör <ArrowRight className="h-5 w-5" />
                                </p>
                            ) : null}
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {interiorVisuals.images.map((image, idx) => (
                                <div
                                    key={`${image}-${idx}`}
                                    className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${
                                        idx === 1
                                            ? "md:mt-12"
                                            : idx === 2
                                              ? "md:mt-24"
                                              : ""
                                    }`}
                                >
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={image}
                                        alt="Proje iç görseli"
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
                      <section key={gallery.id} className="bg-white py-16">
                          <div className="mx-auto max-w-7xl px-4">
                              <div className="mb-8">
                                  <h2 className="text-3xl font-bold text-gray-900">
                                      {gallery.title}
                                  </h2>
                                  {gallery.subtitle ? (
                                      <p className="mt-2 text-sm text-gray-500">
                                          {gallery.subtitle}
                                      </p>
                                  ) : null}
                              </div>
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                  {gallery.images.map((image, idx) => (
                                      <div
                                          key={`${gallery.id}-${image}-${idx}`}
                                          className="relative aspect-[4/3] overflow-hidden rounded-2xl"
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
                <section className="bg-white py-24">
                    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 lg:flex-row">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3">
                            {floorPlans.plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="rounded-3xl border border-gray-100 bg-gray-50 p-6"
                                >
                                    <div className="relative mb-4 h-64 w-full overflow-hidden rounded-xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={plan.image}
                                            alt={plan.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between gap-4 text-gray-900">
                                        <span className="font-bold">{plan.title}</span>
                                        {plan.area ? (
                                            <span className="text-sm text-gray-500">
                                                {plan.area}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center lg:w-1/3">
                            <h2 className="mb-6 text-4xl font-black text-gray-900">
                                {floorPlans.title}
                            </h2>
                            <p className="mb-8 leading-relaxed text-gray-600">
                                {floorPlans.description}
                            </p>
                            <button className="flex items-center justify-center gap-3 rounded-xl bg-gray-900 py-4 font-bold text-white transition-colors hover:bg-gray-800">
                                <ZoomIn className="h-5 w-5" />
                                Tüm Planları İncele
                            </button>
                        </div>
                    </div>
                </section>
            ) : null}
        </>
    );
};
