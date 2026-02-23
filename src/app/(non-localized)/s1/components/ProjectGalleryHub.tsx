"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { S1SectionVisibility } from "../section-visibility";
import type {
    S1CustomGalleryData,
    S1ExteriorVisualsData,
    S1FloorPlansData,
    S1InteriorVisualsData,
    S1MapImageItem,
    S1SocialFacilitiesData,
} from "../types";
import {
    ListingDetailGallery,
    type ListingDetailGalleryHandle,
    type ListingGalleryItem,
} from "@/components/public/listing-detail-gallery";
import {
    OPEN_CONNECTED_PROJECT_GALLERY_EVENT,
    type OpenConnectedProjectGalleryDetail,
} from "./project-gallery-events";

interface GalleryCategory {
    key: string;
    label: string;
    items: ListingGalleryItem[];
}

interface ProjectGalleryHubProps {
    exteriorVisuals?: S1ExteriorVisualsData;
    socialFacilities?: S1SocialFacilitiesData;
    interiorVisuals?: S1InteriorVisualsData;
    customGalleries: S1CustomGalleryData[];
    floorPlans?: S1FloorPlansData;
    mapImages: S1MapImageItem[];
    visibility: S1SectionVisibility;
}

const buildGalleryItems = (
    images: string[],
    title: string,
    section: string
): ListingGalleryItem[] =>
    images
        .map((src) => src.trim())
        .filter(Boolean)
        .map((src, index) => ({
            id: `${section}-${index + 1}`,
            src,
            alt: `${title} - Görsel ${index + 1}`,
        }));

const dedupeImages = (images: string[]) => Array.from(new Set(images));

export const ProjectGalleryHub = ({
    exteriorVisuals,
    socialFacilities,
    interiorVisuals,
    customGalleries,
    floorPlans,
    mapImages,
    visibility,
}: ProjectGalleryHubProps) => {
    const galleryRef = useRef<ListingDetailGalleryHandle | null>(null);

    const socialImages = useMemo(() => {
        if (!socialFacilities) {
            return [];
        }

        if (socialFacilities.images?.length) {
            return socialFacilities.images;
        }

        return socialFacilities.image ? [socialFacilities.image] : [];
    }, [socialFacilities]);

    const categories = useMemo<GalleryCategory[]>(() => {
        const exteriorItems = visibility.exteriorVisuals
            ? buildGalleryItems(exteriorVisuals?.images || [], "Dış Görseller", "exterior")
            : [];

        const socialItems = visibility.socialFacilities
            ? buildGalleryItems(
                  socialImages,
                  socialFacilities?.title || "Sosyal İmkanlar",
                  "social"
              )
            : [];

        const interiorItems = visibility.interiorVisuals
            ? buildGalleryItems(interiorVisuals?.images || [], "İç Görseller", "interior")
            : [];

        const mapItems = visibility.mapImages
            ? mapImages.map((item, index) => ({
                  id: item.id,
                  src: item.image,
                  alt: item.title || `Harita görseli ${index + 1}`,
              }))
            : [];

        const floorPlanItems = visibility.floorPlans
            ? (floorPlans?.plans || []).map((plan, index) => ({
                  id: plan.id,
                  src: plan.image,
                  alt: plan.title || `Kat planı ${index + 1}`,
              }))
            : [];

        const customItems = visibility.customGalleries
            ? customGalleries.map((gallery) => ({
                  key: `custom-${gallery.id}`,
                  label: gallery.title,
                  items: buildGalleryItems(gallery.images || [], gallery.title, `custom-${gallery.id}`),
              }))
            : [];

        const baseCategories: GalleryCategory[] = [
            { key: "exterior", label: "Dış", items: exteriorItems },
            { key: "interior", label: "İç", items: interiorItems },
            { key: "social", label: "Sosyal", items: socialItems },
            { key: "map", label: "Harita", items: mapItems },
            { key: "floor", label: "Kat Planı", items: floorPlanItems },
            ...customItems,
        ].filter((category) => category.items.length > 0);

        if (baseCategories.length === 0) {
            return [];
        }

        const allItems = dedupeImages(
            baseCategories.flatMap((category) => category.items.map((item) => item.src))
        ).map((src, index) => ({
            id: `all-${index + 1}`,
            src,
            alt: `Proje Galerisi - Görsel ${index + 1}`,
        }));

        return [{ key: "all", label: "Tümü", items: allItems }, ...baseCategories];
    }, [
        customGalleries,
        exteriorVisuals?.images,
        floorPlans?.plans,
        interiorVisuals?.images,
        mapImages,
        socialFacilities?.title,
        socialImages,
        visibility.customGalleries,
        visibility.exteriorVisuals,
        visibility.floorPlans,
        visibility.interiorVisuals,
        visibility.mapImages,
        visibility.socialFacilities,
    ]);

    const categoriesByKey = useMemo(
        () => new Map(categories.map((category) => [category.key, category])),
        [categories]
    );

    const [activeKey, setActiveKey] = useState<string>(categories[0]?.key || "all");
    const safeActiveKey = categoriesByKey.has(activeKey)
        ? activeKey
        : (categories[0]?.key ?? "all");

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const handleOpen = (event: Event) => {
            if (categories.length === 0) {
                return;
            }

            const customEvent = event as CustomEvent<OpenConnectedProjectGalleryDetail>;
            const requestedKey = customEvent.detail?.key?.trim() || "all";
            const resolvedKey = categoriesByKey.has(requestedKey)
                ? requestedKey
                : categories[0].key;

            setActiveKey(resolvedKey);

            window.requestAnimationFrame(() => {
                galleryRef.current?.openGallery();
            });
        };

        window.addEventListener(OPEN_CONNECTED_PROJECT_GALLERY_EVENT, handleOpen);

        return () => {
            window.removeEventListener(OPEN_CONNECTED_PROJECT_GALLERY_EVENT, handleOpen);
        };
    }, [categories, categoriesByKey]);

    const activeCategory = categoriesByKey.get(safeActiveKey) || categories[0];

    if (!activeCategory) {
        return null;
    }

    return (
        <ListingDetailGallery
            items={activeCategory.items}
            title={activeCategory.label}
            layout="hidden"
            galleryTabs={categories.map((category) => ({
                key: category.key,
                label: category.label,
            }))}
            activeGalleryTabKey={safeActiveKey}
            onGalleryTabChange={(key) => {
                if (!categoriesByKey.has(key)) {
                    return;
                }
                setActiveKey(key);
            }}
            onApiReady={(api) => {
                galleryRef.current = api;
            }}
        />
    );
};
