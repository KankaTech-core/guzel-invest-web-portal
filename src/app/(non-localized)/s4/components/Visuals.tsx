import Image from "next/image";
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
                <div className="overflow-hidden bg-[#e5e0d8]/20 py-24">
                    <div className="mx-auto max-w-[1400px] px-6">
                        <div className="mb-16 max-w-2xl">
                            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-[#ec6804]">
                                Gallery
                            </span>
                            <h3 className="text-3xl font-bold text-[#1e3a8a] md:text-4xl">
                                {exteriorVisuals.title}
                            </h3>
                        </div>
                        <div className="relative grid h-auto grid-cols-1 gap-6 md:h-[600px] md:grid-cols-12">
                            {exteriorVisuals.images[0] ? (
                                <div className="relative z-10 h-[300px] w-full md:col-span-7 md:h-full">
                                    <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={exteriorVisuals.images[0]}
                                            alt="Exterior 1"
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            ) : null}
                            <div className="relative flex h-full flex-col gap-6 md:col-span-5">
                                {exteriorVisuals.images[1] ? (
                                    <div className="relative z-20 mt-8 h-[250px] w-full md:mt-12 md:-ml-[10%] md:h-[45%] md:w-[110%]">
                                        <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                                            <Image
                                                quality={100}
                                                unoptimized
                                                src={exteriorVisuals.images[1]}
                                                alt="Exterior 2"
                                                fill
                                                className="object-cover transition-transform duration-700 hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                ) : null}
                                {exteriorVisuals.images[2] ? (
                                    <div className="relative z-10 h-[250px] w-full md:h-[45%]">
                                        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg">
                                            <Image
                                                quality={100}
                                                unoptimized
                                                src={exteriorVisuals.images[2]}
                                                alt="Exterior 3"
                                                fill
                                                className="object-cover transition-transform duration-700 hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {visibility.socialFacilities && socialFacilities ? (
                <div className="mx-auto w-full max-w-[1700px] px-6 py-24 lg:px-12">
                    <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:gap-24">
                        <div className="flex-1 space-y-8">
                            <h3 className="mb-6 text-3xl font-bold text-[#1e3a8a]">
                                {socialFacilities.title}
                            </h3>
                            <ul className="space-y-6">
                                {socialFacilities.facilities.map((fac, idx) => (
                                    <li
                                        key={`${fac.name}-${idx}`}
                                        className="flex cursor-default items-start gap-4 rounded-xl p-4 transition-colors hover:bg-[#e5e0d8]/30"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ec6804]/10 text-[#ec6804]">
                                            <ProjectIcon name={fac.icon} className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-xl font-bold text-slate-900">
                                                {fac.name}
                                            </h4>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full flex-1">
                            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl md:rounded-[3rem]">
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
                                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/80 p-6 backdrop-blur-md">
                                    <p className="text-xl italic text-[#1e3a8a]">
                                        {socialFacilities.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {visibility.interiorVisuals && interiorVisuals ? (
                <div className="bg-[#faf9f6] py-20">
                    <div className="mx-auto max-w-[1400px] px-6">
                        <h3 className="mb-12 text-center text-3xl font-bold text-[#1e3a8a] md:text-4xl">
                            {interiorVisuals.title}
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {interiorVisuals.images[0] ? (
                                <div className="group relative h-[400px] w-full overflow-hidden rounded-2xl lg:h-[500px]">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={interiorVisuals.images[0]}
                                        alt="Interior 1"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            ) : null}
                            <div className="flex flex-col gap-6 lg:h-[500px]">
                                {interiorVisuals.images[1] ? (
                                    <div className="group relative h-[240px] w-full flex-1 overflow-hidden rounded-2xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={interiorVisuals.images[1]}
                                            alt="Interior 2"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                ) : null}
                                {interiorVisuals.images[2] ? (
                                    <div className="group relative h-[240px] w-full flex-1 overflow-hidden rounded-2xl">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={interiorVisuals.images[2]}
                                            alt="Interior 3"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                ) : null}
                            </div>
                            {interiorVisuals.images[3] ? (
                                <div className="group relative h-[400px] w-full overflow-hidden rounded-2xl lg:h-[500px]">
                                    <Image
                                        quality={100}
                                        unoptimized
                                        src={interiorVisuals.images[3]}
                                        alt="Interior 4"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}

            {visibility.customGalleries
                ? customGalleries.map((gallery) => (
                      <div key={gallery.id} className="bg-white py-20">
                          <div className="mx-auto max-w-[1400px] px-6">
                              <h3 className="mb-4 text-3xl font-bold text-[#1e3a8a]">
                                  {gallery.title}
                              </h3>
                              {gallery.subtitle ? (
                                  <p className="mb-10 text-slate-500">{gallery.subtitle}</p>
                              ) : null}
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                  {gallery.images.map((image, idx) => (
                                      <div
                                          key={`${gallery.id}-${idx}`}
                                          className="relative h-64 overflow-hidden rounded-2xl"
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
                      </div>
                  ))
                : null}

            {visibility.floorPlans && floorPlans ? (
                <div className="bg-[#e5e0d8]/10 py-24">
                    <div className="mx-auto max-w-[1400px] px-6">
                        <div className="mb-16 text-center">
                            <h3 className="text-3xl font-bold text-[#1e3a8a]">
                                {floorPlans.title}
                            </h3>
                            <p className="mx-auto mt-4 max-w-xl text-slate-500">
                                {floorPlans.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                            {floorPlans.plans.map((plan, idx) => (
                                <div
                                    key={plan.id}
                                    className="rounded-3xl border border-[#e5e0d8]/50 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl"
                                >
                                    <h4 className="mb-6 text-center text-xl font-bold text-[#ec6804]">
                                        {plan.title}
                                    </h4>
                                    <div className="relative aspect-square">
                                        <Image
                                            quality={100}
                                            unoptimized
                                            src={plan.image}
                                            alt={plan.title}
                                            fill
                                            className={`object-contain opacity-80 mix-blend-multiply ${
                                                idx % 2 === 1 ? "rotate-180" : ""
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};
