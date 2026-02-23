"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useMemo } from "react";
import { S1SectionVisibility } from "../section-visibility";
import {
    S1CustomGalleryData,
    S1ExteriorVisualsData,
    S1FloorPlansData,
    S1InteriorVisualsData,
    S1SocialFacilitiesData,
} from "../types";
import { ProjectIcon } from "@/components/single-project/ProjectIcon";
import {
    ListingDetailGallery,
    type ListingGalleryItem,
} from "@/components/public/listing-detail-gallery";
import { dispatchOpenConnectedProjectGallery } from "./project-gallery-events";

interface VisualsProps {
    exteriorVisuals?: S1ExteriorVisualsData;
    socialFacilities?: S1SocialFacilitiesData;
    interiorVisuals?: S1InteriorVisualsData;
    customGalleries: S1CustomGalleryData[];
    floorPlans?: S1FloorPlansData;
    visibility: S1SectionVisibility;
}

const BIG_SECTION_TITLE_CLASS =
    "text-[clamp(1.9rem,4.2vw,3.65rem)] font-black uppercase leading-[1.1] tracking-[-0.01em] text-gray-900";

const buildGalleryItems = (
    images: string[],
    title: string,
    section: string
): ListingGalleryItem[] =>
    images.map((src, index) => ({
        id: `${section}-${index + 1}`,
        src,
        alt: `${title} - Görsel ${index + 1}`,
    }));

const pickSymmetricGridClass = (itemCount: number) => {
    if (itemCount <= 4) {
        return "grid-cols-2 sm:grid-cols-2";
    }

    if (itemCount <= 6) {
        return "grid-cols-2 sm:grid-cols-3";
    }

    return "grid-cols-2 sm:grid-cols-4";
};

export const Visuals = ({
    exteriorVisuals,
    socialFacilities,
    interiorVisuals,
    customGalleries,
    floorPlans,
    visibility,
}: VisualsProps) => {
    const socialImages = useMemo(() => {
        if (!socialFacilities) {
            return [];
        }

        if (socialFacilities.images?.length) {
            return socialFacilities.images;
        }

        return socialFacilities.image ? [socialFacilities.image] : [];
    }, [socialFacilities]);

    const exteriorGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                exteriorVisuals?.images || [],
                "Dış Görseller",
                "project-exterior"
            ),
        [exteriorVisuals?.images]
    );

    const socialGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                socialImages,
                socialFacilities?.title || "Sosyal İmkanlar",
                "project-social"
            ),
        [socialFacilities?.title, socialImages]
    );

    const interiorGalleryItems = useMemo(
        () =>
            buildGalleryItems(
                interiorVisuals?.images || [],
                "İç Görseller",
                "project-interior"
            ),
        [interiorVisuals?.images]
    );

    return (
        <>
            {visibility.exteriorVisuals && exteriorVisuals ? (
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,360px)]">
                            <ListingDetailGallery
                                items={exteriorGalleryItems}
                                title="Dış Görseller"
                                layout="carousel"
                                galleryButtonLabel="Dış Galeri"
                                onRequestOpenGallery={() =>
                                    dispatchOpenConnectedProjectGallery({ key: "exterior" })
                                }
                            />

                            <div className="space-y-5">
                                <h2 className={BIG_SECTION_TITLE_CLASS}>Dış Görseller</h2>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.socialFacilities && socialFacilities ? (
                <section className="bg-white py-24">
                    <div className="mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
                        <div>
                            <div className={`grid gap-7 ${pickSymmetricGridClass(
                                socialFacilities.facilities.length
                            )}`}>
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
                        </div>

                        <div className="flex items-stretch gap-4">
                            <div className="min-w-0 flex-1">
                                <ListingDetailGallery
                                    items={socialGalleryItems}
                                    title={socialFacilities.title}
                                    layout="carousel"
                                    galleryButtonLabel="Sosyal Galeri"
                                    onRequestOpenGallery={() =>
                                        dispatchOpenConnectedProjectGallery({ key: "social" })
                                    }
                                />
                                <h3 className={`mt-4 md:hidden ${BIG_SECTION_TITLE_CLASS}`}>
                                    {socialFacilities.title}
                                </h3>
                            </div>
                            <div className="hidden items-center md:flex">
                                <h3
                                    className="text-[clamp(1.65rem,3.3vw,2.95rem)] font-black uppercase leading-[1.08] tracking-[-0.01em] text-gray-300"
                                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                                >
                                    {socialFacilities.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                </section>
            ) : null}

            {visibility.interiorVisuals && interiorVisuals ? (
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(240px,360px)]">
                            <ListingDetailGallery
                                items={interiorGalleryItems}
                                title="İç Görseller"
                                layout="carousel"
                                galleryButtonLabel="İç Galeri"
                                onRequestOpenGallery={() =>
                                    dispatchOpenConnectedProjectGallery({ key: "interior" })
                                }
                            />

                            <div className="space-y-5">
                                <h2 className={BIG_SECTION_TITLE_CLASS}>İç Görseller</h2>
                            </div>
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

                              <ListingDetailGallery
                                  items={buildGalleryItems(
                                      gallery.images,
                                      gallery.title,
                                      `custom-${gallery.id}`
                                  )}
                                  title={gallery.title}
                                  layout="carousel"
                                  onRequestOpenGallery={() =>
                                      dispatchOpenConnectedProjectGallery({
                                          key: `custom-${gallery.id}`,
                                      })
                                  }
                              />
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
                            <button
                                type="button"
                                onClick={() =>
                                    dispatchOpenConnectedProjectGallery({ key: "floor" })
                                }
                                className="flex items-center justify-center gap-3 rounded-xl bg-gray-900 py-4 font-bold text-white transition-colors hover:bg-gray-800"
                            >
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
