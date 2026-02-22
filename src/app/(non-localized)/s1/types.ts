export interface S1HeroData {
    badge: string;
    title: string;
    description: string;
    backgroundImage: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonText: string;
    ctaHref?: string;
}

export interface S1RibbonItem {
    icon: string;
    label: string;
    value?: string | null;
}

export interface S1SummaryData {
    title: string;
    description: string;
    tags: string[];
    deliveryDate?: string | null;
}

export interface S1ExteriorVisualsData {
    title: string;
    images: string[];
}

export interface S1SocialFacilityItem {
    icon: string;
    name: string;
}

export interface S1SocialFacilitiesData {
    title: string;
    description: string;
    image?: string;
    facilities: S1SocialFacilityItem[];
}

export interface S1InteriorVisualsData {
    title: string;
    images: string[];
}

export interface S1CustomGalleryData {
    id: string;
    title: string;
    subtitle?: string | null;
    images: string[];
}

export interface S1FloorPlanItem {
    id: string;
    title: string;
    area?: string | null;
    image: string;
}

export interface S1FloorPlansData {
    title: string;
    description: string;
    plans: S1FloorPlanItem[];
}

export interface S1DocumentItem {
    id: string;
    name: string;
    url: string;
}

export interface S1MapImageItem {
    id: string;
    title: string;
    image: string;
}

export interface S1MapData {
    embedSrc?: string;
    mapsLink?: string;
}

export interface S1FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface S1OtherProjectItem {
    id: string;
    slug: string;
    title: string;
    location: string;
    status: string;
    image: string;
    roomSummary?: string;
}

export interface S1ProjectPageData {
    slug: string;
    hero: S1HeroData;
    propertiesRibbon: S1RibbonItem[];
    summary?: S1SummaryData;
    videoUrl?: string;
    exteriorVisuals?: S1ExteriorVisualsData;
    socialFacilities?: S1SocialFacilitiesData;
    interiorVisuals?: S1InteriorVisualsData;
    customGalleries: S1CustomGalleryData[];
    floorPlans?: S1FloorPlansData;
    documents: S1DocumentItem[];
    mapImages: S1MapImageItem[];
    map?: S1MapData;
    faqs: S1FaqItem[];
    otherProjects: S1OtherProjectItem[];
}
