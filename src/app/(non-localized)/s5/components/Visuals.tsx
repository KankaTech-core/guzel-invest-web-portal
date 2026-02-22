import Image from "next/image";
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
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-24">
            {visibility.exteriorVisuals && exteriorVisuals ? (
                <section className="py-24">
                    <div className="mb-12 flex items-end justify-between">
                        <h3 className="text-xl font-bold text-[#374151]">
                            {exteriorVisuals.title}
                        </h3>
                        <span className="text-xs uppercase tracking-widest text-[#374151]/40">
                            EXTERIOR
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {exteriorVisuals.images.map((image, idx) => (
                            <div
                                key={`${image}-${idx}`}
                                className="group relative aspect-[4/5] overflow-hidden rounded-md bg-gray-100"
                            >
                                <Image
                                    quality={100}
                                    unoptimized
                                    src={image}
                                    alt={`Exterior ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {visibility.socialFacilities && socialFacilities ? (
                <section className="py-24">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        <div className="order-2 space-y-12 lg:order-1">
                            <div>
                                <h3 className="mb-4 text-xl font-bold text-[#374151]">
                                    {socialFacilities.title}
                                </h3>
                                <p className="max-w-md font-light leading-relaxed text-[#374151]/70">
                                    {socialFacilities.description}
                                </p>
                            </div>
                            <ul className="space-y-6">
                                {socialFacilities.facilities.map((facility, idx) => (
                                    <li
                                        key={`${facility.name}-${idx}`}
                                        className="group flex items-center gap-4"
                                    >
                                        <span className="h-[1px] w-8 bg-[#374151]/20 transition-colors group-hover:bg-[#ec6c04]" />
                                        <span className="text-sm font-medium tracking-wide text-[#374151]">
                                            {facility.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 h-[500px] overflow-hidden rounded-md lg:order-2">
                            {socialFacilities.image ? (
                                <Image
                                    quality={100}
                                    unoptimized
                                    src={socialFacilities.image}
                                    alt={socialFacilities.title}
                                    width={1200}
                                    height={1200}
                                    className="h-full w-full object-cover"
                                />
                            ) : null}
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.interiorVisuals && interiorVisuals ? (
                <section className="py-24">
                    <div className="mb-12 flex items-end justify-between">
                        <h3 className="text-xl font-bold text-[#374151]">
                            {interiorVisuals.title}
                        </h3>
                        <span className="text-xs uppercase tracking-widest text-[#374151]/40">
                            INTERIOR
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {interiorVisuals.images.map((image, idx) => (
                            <div
                                key={`${image}-${idx}`}
                                className="group relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100"
                            >
                                <Image
                                    quality={100}
                                    unoptimized
                                    src={image}
                                    alt={`Interior ${idx + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {visibility.customGalleries
                ? customGalleries.map((gallery) => (
                      <section key={gallery.id} className="py-20">
                          <h3 className="mb-4 text-xl font-bold text-[#374151]">
                              {gallery.title}
                          </h3>
                          {gallery.subtitle ? (
                              <p className="mb-8 text-sm text-[#374151]/60">
                                  {gallery.subtitle}
                              </p>
                          ) : null}
                          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                              {gallery.images.map((image, idx) => (
                                  <div
                                      key={`${gallery.id}-${idx}`}
                                      className="relative aspect-[4/3] overflow-hidden rounded-md bg-gray-100"
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
                <section className="border-t border-gray-100 py-24">
                    <div className="mb-16 text-center">
                        <h3 className="mb-2 text-2xl font-bold text-[#374151]">
                            {floorPlans.title}
                        </h3>
                        <p className="text-sm text-[#374151]/50">
                            {floorPlans.description}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
                        {floorPlans.plans.map((plan, idx) => (
                            <div
                                key={plan.id}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="flex w-full items-center justify-center rounded-lg bg-white p-8">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={plan.image}
                                        alt={plan.title}
                                        width={400}
                                        height={400}
                                        className={`h-auto w-full object-contain opacity-90 contrast-125 ${
                                            idx % 2 === 1 ? "rotate-90" : ""
                                        }`}
                                    />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#374151]/60">
                                    {plan.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}
        </div>
    );
};
