import assert from "node:assert/strict";
import test from "node:test";
import { getS1SectionVisibility } from "./section-visibility";
import { S1ProjectPageData } from "./types";

const baseData: S1ProjectPageData = {
    slug: "ornek-proje",
    hero: {
        badge: "Site",
        title: "Ornek Proje",
        description: "Aciklama",
        backgroundImage: "https://example.com/hero.jpg",
        ctaTitle: "Iletisim",
        ctaDescription: "Bilgi al",
        ctaButtonText: "Ara",
    },
    propertiesRibbon: [],
    customGalleries: [],
    documents: [],
    mapImages: [],
    faqs: [],
    otherProjects: [],
};

test("hides optional sections when their content is empty", () => {
    const visibility = getS1SectionVisibility(baseData);

    assert.deepEqual(visibility, {
        propertiesRibbon: false,
        summary: false,
        video: false,
        exteriorVisuals: false,
        socialFacilities: false,
        interiorVisuals: false,
        customGalleries: false,
        floorPlans: false,
        documents: false,
        mapImages: false,
        map: false,
        faqs: false,
        otherProjects: false,
    });
});

test("shows optional sections when enough content is provided", () => {
    const visibility = getS1SectionVisibility({
        ...baseData,
        propertiesRibbon: [{ icon: "Building2", label: "Tip", value: "Site" }],
        summary: {
            title: "Ozet",
            description: "Detay",
            tags: ["One Cikan"],
            deliveryDate: "2027",
        },
        videoUrl: "https://example.com/video.mp4",
        exteriorVisuals: {
            title: "Dis",
            images: ["https://example.com/exterior.jpg"],
        },
        socialFacilities: {
            title: "Sosyal",
            description: "Imkanlar",
            image: "https://example.com/social.jpg",
            facilities: [{ icon: "Waves", name: "Havuz" }],
        },
        interiorVisuals: {
            title: "Ic",
            images: ["https://example.com/interior.jpg"],
        },
        customGalleries: [
            {
                id: "g1",
                title: "1+1",
                subtitle: null,
                images: ["https://example.com/gallery.jpg"],
            },
        ],
        floorPlans: {
            title: "Plan",
            description: "Kat planlari",
            plans: [
                {
                    id: "fp1",
                    title: "2+1",
                    area: "110 m2",
                    image: "https://example.com/floor.jpg",
                },
            ],
        },
        documents: [
            {
                id: "d1",
                name: "Sunum.pdf",
                url: "https://example.com/sunum.pdf",
            },
        ],
        mapImages: [
            {
                id: "m1",
                title: "Harita",
                image: "https://example.com/map.jpg",
            },
        ],
        map: {
            embedSrc: "https://example.com/embed",
            mapsLink: "https://maps.google.com",
        },
        faqs: [{ id: "f1", question: "Soru?", answer: "Cevap." }],
        otherProjects: [
            {
                id: "p1",
                slug: "p1",
                title: "Baska Proje",
                location: "Alanya",
                status: "SATISTA",
                image: "https://example.com/p.jpg",
                roomSummary: "2+1",
            },
        ],
    });

    assert.deepEqual(visibility, {
        propertiesRibbon: true,
        summary: true,
        video: true,
        exteriorVisuals: true,
        socialFacilities: true,
        interiorVisuals: true,
        customGalleries: true,
        floorPlans: true,
        documents: true,
        mapImages: true,
        map: true,
        faqs: true,
        otherProjects: true,
    });
});
