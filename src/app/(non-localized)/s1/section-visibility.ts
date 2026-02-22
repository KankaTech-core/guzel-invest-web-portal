import { S1ProjectPageData } from "./types";

export interface S1SectionVisibility {
    propertiesRibbon: boolean;
    summary: boolean;
    video: boolean;
    exteriorVisuals: boolean;
    socialFacilities: boolean;
    interiorVisuals: boolean;
    customGalleries: boolean;
    floorPlans: boolean;
    documents: boolean;
    mapImages: boolean;
    map: boolean;
    faqs: boolean;
    otherProjects: boolean;
}

export function getS1SectionVisibility(
    data: S1ProjectPageData
): S1SectionVisibility {
    return {
        propertiesRibbon: data.propertiesRibbon.length > 0,
        summary: Boolean(data.summary),
        video: Boolean(data.videoUrl),
        exteriorVisuals: Boolean(data.exteriorVisuals?.images.length),
        socialFacilities: Boolean(data.socialFacilities?.facilities.length),
        interiorVisuals: Boolean(data.interiorVisuals?.images.length),
        customGalleries: data.customGalleries.length > 0,
        floorPlans: Boolean(data.floorPlans?.plans.length),
        documents: data.documents.length > 0,
        mapImages: data.mapImages.length > 0,
        map: Boolean(data.map?.embedSrc || data.map?.mapsLink),
        faqs: data.faqs.length > 0,
        otherProjects: data.otherProjects.length > 0,
    };
}
