"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useVersion } from "@/contexts/VersionContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { LastUnitsCornerRibbon } from "@/components/public/last-units-corner-ribbon";
import { HomepagePopupForm } from "@/components/public/homepage-popup-form";
import { shouldShowLastUnitsRibbon } from "@/lib/last-units-ribbon";
import {
    formatPrice,
    getMediaUrl,
    getPropertyTypeLabel,
    getSaleTypeLabel,
    cn,
} from "@/lib/utils";
import { resolveHomepageHeroVideo } from "@/lib/homepage-video";
import {
    Building2,
    Handshake,
    TrendingUp,
    BarChart3,
    CircleDollarSign,
    Globe,
    Settings,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    Search,
    ChevronDown,
    Check,
    ArrowRight,
    Plus,
    Minus,
    ToggleLeft,
    ToggleRight,
    Play,
    X,
} from "lucide-react";

/* ─── data ─── */
const propertyTypes = [
    { value: "APARTMENT", label: "Konut" },
    { value: "LAND", label: "Arsa" },
    { value: "COMMERCIAL", label: "Ticari" },
    { value: "PENTHOUSE", label: "Özel Statü" },
] as const;

const fixedCity = "Antalya" as const;
const fixedDistrict = "Alanya" as const;

const alanyaNeighborhoodOptions = [
    "Akçatı",
    "Akdam",
    "Alacami",
    "Alara",
    "Aliefendi",
    "Asmaca",
    "Avsallar",
    "Bademağacı",
    "Basırlı",
    "Başköy",
    "Bayır",
    "Bayırkozağacı",
    "Bektaş",
    "Beldibi",
    "Beyreli",
    "Bıçakcı",
    "Bucak",
    "Burçaklar",
    "Büyükhasbahçe",
    "Cikcilli",
    "Cumhuriyet",
    "Çakallar",
    "Çamlıca",
    "Çarşı",
    "Çıplaklı",
    "Değirmendere",
    "Demirtaş",
    "Deretürbelinas",
    "Dinek",
    "Elikesik",
    "Emişbeleni",
    "Fakırcalı",
    "Gözübüyük",
    "Gözüküçüklü",
    "Gümüşgöze",
    "Gümüşkavak",
    "Güneyköy",
    "Güzelbağ Fatih",
    "Güzelbağ Zafer",
    "Hacet",
    "Hacıkerimler",
    "Hacımehmetli",
    "Hisariçi",
    "Hocalar",
    "İmamlı",
    "İncekum",
    "İsbatlı",
    "İshaklı",
    "Kadıpaşa",
    "Karakocalı",
    "Karamanlar",
    "Karapınar",
    "Kargıcak",
    "Kayabaşı",
    "Kellerpınarı",
    "Kestel",
    "Keşefli",
    "Kızılcaşehir",
    "Kocaoğlanlı",
    "Kuzyaka",
    "Küçükhasbahçe",
    "Mahmutlar",
    "Mahmutseydi",
    "Oba",
    "Obaalacami",
    "Okurcalar",
    "Orhanköy",
    "Öteköy",
    "Özvadi",
    "Paşaköy",
    "Payallar",
    "Saburlar",
    "Sapadere",
    "Saray",
    "Seki",
    "Soğukpınar",
    "Sugözü",
    "Süleymanlar",
    "Şekerhane",
    "Şıhlar",
    "Taşbaşı",
    "Telatiye",
    "Tepe",
    "Tırılar",
    "Tophane",
    "Toslak",
    "Tosmur",
    "Türkler",
    "Türktaş",
    "Uğrak",
    "Uğurlu",
    "Ulugüney",
    "Uzunöz",
    "Üzümlü",
    "Yalçı",
    "Yasırali",
    "Yaylakonak",
    "Yaylalı",
    "Yenice",
    "Yeniköy",
    "Yeşilöz",
] as const;

const categories = [
    { type: "APARTMENT", label: "Konut", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=280&fit=crop" },
    { type: "LAND", label: "Arsa", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=280&fit=crop" },
    { type: "COMMERCIAL", label: "Ticari", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=280&fit=crop" },
    { type: "PENTHOUSE", label: "Özel Statü", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=280&fit=crop" },
];

const services = [
    { icon: Handshake, titleKey: "service1Title", descKey: "service1Desc" },
    { icon: BarChart3, titleKey: "service2Title", descKey: "service2Desc" },
    { icon: CircleDollarSign, titleKey: "service3Title", descKey: "service3Desc" },
    { icon: Globe, titleKey: "service4Title", descKey: "service4Desc" },
    { icon: Settings, titleKey: "service5Title", descKey: "service5Desc" },
    { icon: ShieldCheck, titleKey: "service6Title", descKey: "service6Desc" },
];

const testimonials = [
    {
        name: "Ahmet & Elif Yılmaz",
        type: "Villa · Kargıcak",
        quote: "Güzel Invest ile hayalimizi gerçeğe dönüştürdük, sürecin her adımında yanımızdaydılar.",
        image: "/images/testimonials/testimonial-1.png",
    },
    {
        name: "Mehmet Karaca",
        type: "Yatırım · Mahmutlar",
        quote: "Profesyonel yaklaşımları ve pazar bilgileri sayesinde doğru yatırım kararını verdim.",
        image: "/images/testimonials/testimonial-2.png",
    },
    {
        name: "Demir Ailesi",
        type: "Konut · Oba",
        quote: "Aile olarak huzurla yaşayacağımız yuvamızı bulduk, tüm ekibe teşekkürler.",
        image: "/images/testimonials/testimonial-3.png",
    },
    {
        name: "Canan & Emre Aksoy",
        type: "Daire · Tosmur",
        quote: "İlk evimizi alırken bizi adım adım yönlendirdiler, hiçbir sorumuzu cevapsız bırakmadılar.",
        image: "/images/testimonials/testimonial-4.png",
    },
    {
        name: "Klaus Müller",
        type: "Vatandaşlık · Kestel",
        quote: "Türk vatandaşlığı sürecimi sorunsuz tamamladık, mülk yatırımımdan çok memnunum.",
        image: "/images/testimonials/testimonial-5.png",
    },
];

interface HomepageHeroListing {
    id: string;
    slug: string;
    slot?: number;
    saleType: string;
    type: string;
    district: string;
    rooms: string | null;
    area: number;
    seaView: boolean;
    price: string;
    currency: string;
    title: string;
    images: string[];
}

interface HomepageProject {
    id: string;
    slug: string;
    district: string;
    projectType: string | null;
    deliveryDate: string | null;
    hasLastUnitsBanner: boolean;
    title: string;
    images: string[];
}

type HomepageHeroVideo = ReturnType<typeof resolveHomepageHeroVideo>;

const HERO_FALLBACK: HomepageHeroListing = {
    id: "fallback",
    slug: "",
    saleType: "SALE",
    type: "VILLA",
    district: "Kargıcak",
    rooms: "4+1",
    area: 320,
    seaView: true,
    price: "485000",
    currency: "EUR",
    images: [],
    title: "Kargıcak Premium Villa",
};

const PROJECT_FALLBACK: HomepageProject = {
    id: "project-fallback",
    slug: "",
    district: "Alanya",
    projectType: "Konut Projesi",
    deliveryDate: null,
    hasLastUnitsBanner: false,
    title: "Alanya Yeni Yaşam Projesi",
    images: [],
};

const HERO_VIDEO_FALLBACK = resolveHomepageHeroVideo(null);

/* ─── page ─── */
export default function HomePage() {
    const t = useTranslations();
    const th = useTranslations("homepage");
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    /* filter state */
    const [saleType, setSaleType] = useState<"SALE" | "RENT">("SALE");
    const [propertyType, setPropertyType] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [openDropdown, setOpenDropdown] = useState<"propertyType" | "neighborhood" | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [heroListings, setHeroListings] = useState<HomepageHeroListing[]>([HERO_FALLBACK]);
    const [heroSlideIndex, setHeroSlideIndex] = useState(0);
    const [heroProjects, setHeroProjects] = useState<HomepageProject[]>([PROJECT_FALLBACK]);
    const [projectSlideIndex, setProjectSlideIndex] = useState(0);
    const [heroVideo, setHeroVideo] = useState<HomepageHeroVideo>(HERO_VIDEO_FALLBACK);
    const [isHeroVideoModalOpen, setIsHeroVideoModalOpen] = useState(false);
    const { version: searchVersion } = useVersion();
    const bannerRef = useRef<HTMLFormElement>(null);
    const testimonialRef = useRef<HTMLDivElement>(null);
    const heroSwipeStartXRef = useRef<number | null>(null);
    const city = fixedCity;
    const district = fixedDistrict;

    /* scroll-reveal refs */
    const heroRevealRef = useScrollReveal<HTMLDivElement>({ threshold: 0.05, rootMargin: "0px" });
    const searchBannerRevealRef = useScrollReveal<HTMLDivElement>();
    const categoriesRevealRef = useScrollReveal<HTMLElement>();
    const servicesRevealRef = useScrollReveal<HTMLElement>();
    const highlightRevealRef = useScrollReveal<HTMLElement>();
    const testimonialsRevealRef = useScrollReveal<HTMLElement>();
    const ctaRevealRef = useScrollReveal<HTMLElement>();
    const blogRevealRef = useScrollReveal<HTMLElement>();
    const faqRevealRef = useScrollReveal<HTMLElement>();
    const selectedPropertyType = propertyTypes.find((propertyTypeOption) => propertyTypeOption.value === propertyType);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!bannerRef.current) {
                return;
            }

            if (!bannerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadHomepageHeroListing = async () => {
            try {
                const response = await fetch(
                    `/api/public/listings/homepage-hero?locale=${locale}`,
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    }
                );
                if (!response.ok) return;

                const data = await response.json();
                if (!isMounted) return;

                const incomingListings = Array.isArray(data?.listings)
                    ? data.listings
                    : [];
                setHeroListings(
                    incomingListings.length > 0 ? incomingListings : [HERO_FALLBACK]
                );
                setHeroSlideIndex(0);
            } catch {
                if (isMounted) {
                    setHeroListings([HERO_FALLBACK]);
                    setHeroSlideIndex(0);
                }
            }
        };

        loadHomepageHeroListing();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [locale]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadHomepageVideo = async () => {
            try {
                const response = await fetch("/api/public/homepage/settings", {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!response.ok) return;

                const data = (await response.json()) as {
                    video?: {
                        rawInput?: string;
                    };
                };
                if (!isMounted) return;

                const rawInput = data?.video?.rawInput || null;
                setHeroVideo(resolveHomepageHeroVideo(rawInput));
            } catch {
                if (isMounted) {
                    setHeroVideo(HERO_VIDEO_FALLBACK);
                }
            }
        };

        loadHomepageVideo();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        if (!isHeroVideoModalOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsHeroVideoModalOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isHeroVideoModalOpen]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadHomepageProjects = async () => {
            try {
                const response = await fetch(
                    `/api/public/projects?locale=${locale}&homepage=1`,
                    {
                        signal: controller.signal,
                        cache: "no-store",
                    }
                );
                if (!response.ok) return;

                const data = await response.json() as {
                    projects?: Array<{
                        id: string;
                        slug: string;
                        district?: string | null;
                        projectType?: string | null;
                        deliveryDate?: string | null;
                        hasLastUnitsBanner?: boolean | null;
                        translations?: Array<{
                            locale?: string;
                            title?: string | null;
                        }>;
                        media?: Array<{
                            url?: string | null;
                            category?: string | null;
                            type?: string | null;
                        }>;
                    }>;
                };
                if (!isMounted) return;

                const incomingProjects = Array.isArray(data?.projects)
                    ? data.projects
                    : [];

                const normalizedProjects = incomingProjects
                    .map((project) => {
                        const translations = Array.isArray(project.translations)
                            ? project.translations
                            : [];
                        const selectedTranslation =
                            translations.find((item) => item?.locale === locale) ||
                            translations.find((item) => item?.locale === "tr") ||
                            translations[0];
                        const title = selectedTranslation?.title?.trim();
                        const media = Array.isArray(project.media) ? project.media : [];
                        const exteriorImageUrls = media
                            .filter((item) => item?.type === "IMAGE" && item?.category === "EXTERIOR")
                            .map((item) => item?.url?.trim())
                            .filter((url): url is string => Boolean(url));
                        const fallbackImageUrls = media
                            .filter((item) =>
                                item?.type === "IMAGE" &&
                                item?.category !== "DOCUMENT" &&
                                item?.category !== "MAP"
                            )
                            .map((item) => item?.url?.trim())
                            .filter((url): url is string => Boolean(url));
                        const imageUrls =
                            exteriorImageUrls.length > 0
                                ? exteriorImageUrls
                                : fallbackImageUrls;

                        return {
                            id: project.id,
                            slug: project.slug,
                            district: project.district || "Alanya",
                            projectType: project.projectType || null,
                            deliveryDate: project.deliveryDate || null,
                            hasLastUnitsBanner: Boolean(project.hasLastUnitsBanner),
                            title: title || "Yeni Proje",
                            images: imageUrls,
                        } satisfies HomepageProject;
                    })
                    .filter((project) => Boolean(project.id) && Boolean(project.slug));

                setHeroProjects(
                    normalizedProjects.length > 0
                        ? normalizedProjects
                        : [PROJECT_FALLBACK]
                );
                setProjectSlideIndex(0);
            } catch {
                if (isMounted) {
                    setHeroProjects([PROJECT_FALLBACK]);
                    setProjectSlideIndex(0);
                }
            }
        };

        loadHomepageProjects();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [locale]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set("saleType", saleType);
        if (propertyType) params.set("type", propertyType);
        params.set("city", city);
        params.set("district", district);
        if (neighborhood) params.set("neighborhood", neighborhood);
        setOpenDropdown(null);
        router.push(`/${locale}/portfoy?${params.toString()}`);
    };

    const safeHeroListings =
        heroListings.length > 0 ? heroListings : [HERO_FALLBACK];
    const getHeroImageUrl = (listing: HomepageHeroListing, index = 0) =>
        listing.images[index]
            ? getMediaUrl(listing.images[index])
            : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=500&fit=crop";
    const getHeroListingHref = (listing: HomepageHeroListing) =>
        listing.slug ? `/${locale}/ilan/${listing.slug}` : null;
    const getHeroFeatureParts = (listing: HomepageHeroListing) =>
        [
            listing.rooms,
            listing.area > 0 ? `${listing.area}m²` : null,
            listing.seaView
                ? locale === "tr"
                    ? "Deniz Manzaralı"
                    : "Sea View"
                : listing.district,
        ].filter((item): item is string => Boolean(item));
    const safeHeroProjects =
        heroProjects.length > 0 ? heroProjects : [PROJECT_FALLBACK];
    const getProjectImageUrl = (project: HomepageProject, index = 0) =>
        project.images[index]
            ? getMediaUrl(project.images[index])
            : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&h=900&fit=crop";
    const getProjectHref = (project: HomepageProject) =>
        project.slug ? `/${locale}/proje/${project.slug}` : null;
    const canNavigateHero = safeHeroListings.length > 1;
    const canNavigateProject = safeHeroProjects.length > 1;
    const HERO_SWIPE_THRESHOLD_PX = 42;

    const goToNextHeroSlide = () => {
        if (!canNavigateHero) return;
        setHeroSlideIndex((prev) => (prev + 1) % safeHeroListings.length);
    };

    const goToPrevHeroSlide = () => {
        if (!canNavigateHero) return;
        setHeroSlideIndex(
            (prev) => (prev - 1 + safeHeroListings.length) % safeHeroListings.length
        );
    };

    const goToNextProjectSlide = () => {
        if (!canNavigateProject) return;
        setProjectSlideIndex((prev) => (prev + 1) % safeHeroProjects.length);
    };

    const goToPrevProjectSlide = () => {
        if (!canNavigateProject) return;
        setProjectSlideIndex(
            (prev) => (prev - 1 + safeHeroProjects.length) % safeHeroProjects.length
        );
    };

    const handleHeroTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canNavigateHero) return;
        const touch = event.changedTouches[0];
        heroSwipeStartXRef.current = touch ? touch.clientX : null;
    };

    const handleHeroTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canNavigateHero) return;
        const startX = heroSwipeStartXRef.current;
        const touch = event.changedTouches[0];
        heroSwipeStartXRef.current = null;

        if (startX === null || !touch) return;

        const deltaX = touch.clientX - startX;
        if (Math.abs(deltaX) < HERO_SWIPE_THRESHOLD_PX) return;

        if (deltaX < 0) {
            goToNextHeroSlide();
            return;
        }
        goToPrevHeroSlide();
    };

    const handleHeroTouchCancel = () => {
        heroSwipeStartXRef.current = null;
    };

    const renderCompactSearchBanner = (className = "") => (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleSearch();
            }}
            className={`relative z-50 rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`.trim()}
        >
            <div className="grid grid-cols-2">
                <button
                    type="button"
                    onClick={() => {
                        setSaleType("SALE");
                        setOpenDropdown(null);
                    }}
                    className={`py-3 text-center text-xs font-semibold tracking-wide transition-colors first:rounded-tl-2xl ${saleType === "SALE"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                >
                    {th("filterSale")}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setSaleType("RENT");
                        setOpenDropdown(null);
                    }}
                    className={`py-3 text-center text-xs font-semibold tracking-wide transition-colors last:rounded-tr-2xl ${saleType === "RENT"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                >
                    {th("filterRent")}
                </button>
            </div>

            <div className="grid grid-cols-[7fr_3fr] gap-2 p-2 border-t border-gray-100">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setOpenDropdown(openDropdown === "propertyType" ? null : "propertyType")}
                        className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 text-left text-sm font-medium text-gray-900 transition-colors hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                        <span className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-orange-500" />
                            {selectedPropertyType ? selectedPropertyType.label : th("filterAllTypes")}
                        </span>
                        <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${openDropdown === "propertyType" ? "rotate-180" : ""}`}
                        />
                    </button>

                    {openDropdown === "propertyType" && (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-gray-200/50 animate-in fade-in zoom-in-95 duration-100 origin-top">
                            <div className="grid grid-cols-2 gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPropertyType("");
                                        setOpenDropdown(null);
                                    }}
                                    className={`col-span-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${propertyType === ""
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                >
                                    <span>{th("filterAllTypes")}</span>
                                    {propertyType === "" ? <Check className="h-4 w-4" /> : null}
                                </button>
                                {propertyTypes.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setPropertyType(opt.value);
                                            setOpenDropdown(null);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${propertyType === opt.value
                                            ? "bg-orange-50 text-orange-600"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        <span>{opt.label}</span>
                                        {propertyType === opt.value ? <Check className="h-4 w-4" /> : null}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition-all hover:bg-black hover:shadow-xl hover:-translate-y-0.5"
                >
                    <Search className="h-4 w-4" />
                    {th("filterSearch")}
                </button>
            </div>
        </form>
    );

    return (
        <main className="min-h-screen">
            {/* ════════════════════════════════════════════
                HERO SECTION (Updated to Variant /2 Design)
            ════════════════════════════════════════════ */}
            <section className="pt-28 pb-16 px-8 bg-white">
                <div ref={heroRevealRef} className="max-w-7xl mx-auto">
                    {/* Hero Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Main Content */}
                        <div className="lg:col-span-5 pt-8">
                            <div className="reveal flex items-center justify-center lg:justify-start gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm mb-6 lg:mb-6 w-fit mx-auto lg:mx-0">
                                <Globe className="w-4 h-4" />
                                Alanya Satış & Yatırım Merkezi
                            </div>

                            <h1 className="reveal text-5xl md:text-6xl leading-tight text-gray-900 mb-6 font-semibold text-center lg:text-left">
                                Güzel Şehre<br />
                                <span className="text-orange-500">Güzel</span> Projeler
                            </h1>

                            <p className="reveal text-lg text-gray-500 mb-8 leading-relaxed max-w-md text-center lg:text-left mx-auto lg:mx-0">
                                2001'den bu yana Alanya'da güvenilir gayrimenkul platformu. Satılık, kiralık mülkler ve profesyonel danışmanlık hizmetleriyle yanınızdayız.
                            </p>

                            {/* Mobile Buttons - After subtitle */}
                            <div className="reveal flex lg:hidden items-center gap-4 mb-8">
                                <Link
                                    href={`/${locale}/portfoy`}
                                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    {th("ctaPortfolio")}
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => window.dispatchEvent(new Event("open-homepage-popup"))}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm"
                                >
                                    <span className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors">
                                        <Building2 className="w-4 h-4" />
                                    </span>
                                    {th("ctaMap")}
                                </button>
                            </div>

                            {/* Mobile Image Slider - Taller Aspect Ratio */}
                            <div className="lg:hidden mb-8">
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl relative">
                                    <div
                                        className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                        style={{
                                            transform: `translateX(-${heroSlideIndex * 100}%)`,
                                            touchAction: "pan-y",
                                        }}
                                        onTouchStart={handleHeroTouchStart}
                                        onTouchEnd={handleHeroTouchEnd}
                                        onTouchCancel={handleHeroTouchCancel}
                                    >
                                        {safeHeroListings.map((listing, index) => {
                                            const heroImageUrl = getHeroImageUrl(listing, 0);
                                            const heroListingHref = getHeroListingHref(listing);
                                            const isSale = listing.saleType === "SALE";

                                            return (
                                                <div
                                                    key={`${listing.id}-${listing.slot ?? index}`}
                                                    className="relative h-full w-full shrink-0 px-1"
                                                >
                                                    {/* Card Container */}
                                                    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-lg">
                                                        {/* Image Section - Fill Parent */}
                                                        <div className="relative h-full w-full overflow-hidden">
                                                            {heroListingHref ? (
                                                                <Link
                                                                    href={heroListingHref}
                                                                    className="absolute inset-0 z-10"
                                                                    title={listing.title}
                                                                />
                                                            ) : null}
                                                            <img
                                                                src={heroImageUrl}
                                                                alt={listing.title || "Featured Property"}
                                                                className="h-full w-full object-cover"
                                                            />

                                                            {/* Overlay Content (Badges + Text) */}
                                                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">

                                                                {/* Badges Row - Smaller Text */}
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className={`px-2.5 py-0.5 text-[10px] font-medium text-white uppercase tracking-wider rounded-md ${isSale ? "bg-orange-500" : "bg-blue-600"
                                                                        }`}>
                                                                        {getSaleTypeLabel(listing.saleType, locale)}
                                                                    </span>
                                                                    <span className="px-2.5 py-0.5 text-[10px] font-medium text-white bg-white/20 backdrop-blur-md rounded-md">
                                                                        {getPropertyTypeLabel(listing.type, locale)}
                                                                    </span>
                                                                </div>

                                                                {/* Title - Smaller Text */}
                                                                <h3 className="text-xl font-medium text-white mb-2 uppercase tracking-wide leading-tight line-clamp-2">
                                                                    {listing.title}
                                                                </h3>

                                                                {/* Bottom Row: Info + Price - Smaller Text */}
                                                                <div className="flex items-end justify-between w-full">
                                                                    {/* Info: 4+1 · 220m² · Alanya */}
                                                                    <div className="flex items-center text-white/90 text-xs font-normal">
                                                                        {getHeroFeatureParts(listing).join(" · ")}
                                                                    </div>

                                                                    {/* Price */}
                                                                    <div className="text-xl font-medium text-white tracking-tight">
                                                                        {formatPrice(listing.price, listing.currency)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Mobile Navigation Dots */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                                        {safeHeroListings.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHeroSlideIndex(index); }}
                                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === heroSlideIndex ? "w-4 bg-white" : "bg-white/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Search Banner */}
                            <div className="lg:hidden mb-8">
                                {renderCompactSearchBanner()}
                            </div>

                            {/* Desktop Buttons */}
                            <div className="reveal hidden lg:flex items-center gap-4">
                                <Link
                                    href={`/${locale}/portfoy`}
                                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    {th("ctaPortfolio")}
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => window.dispatchEvent(new Event("open-homepage-popup"))}
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm"
                                >
                                    <span className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 transition-colors">
                                        <Building2 className="w-4 h-4" />
                                    </span>
                                    {th("ctaMap")}
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="reveal flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
                                <div>
                                    <p className="text-3xl font-semibold text-gray-900">300+</p>
                                    <p className="text-sm text-gray-500">Mutlu Müşteri</p>
                                </div>
                                <div className="w-px h-12 bg-gray-200" />
                                <div>
                                    <p className="text-3xl font-semibold text-gray-900">20+</p>
                                    <p className="text-sm text-gray-500">Yıllık Tecrübe</p>
                                </div>
                                <div className="w-px h-12 bg-gray-200" />
                                <div>
                                    <p className="text-3xl font-semibold text-gray-900">150+</p>
                                    <p className="text-sm text-gray-500">Aktif İlan</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image Grid - Desktop Only */}
                        <div className="reveal-scale hidden lg:grid grid-cols-12 gap-4 lg:col-span-7">
                            {/* Main large image - Project Swiper */}
                            <div className="col-span-12 lg:col-span-8 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40 relative group">
                                <div
                                    className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    style={{
                                        transform: `translateX(-${projectSlideIndex * 100}%)`,
                                    }}
                                >
                                    {safeHeroProjects.map((project, index) => {
                                        const projectImageUrl = getProjectImageUrl(project, 0);
                                        const projectHref = getProjectHref(project);

                                        return (
                                            <div
                                                key={`${project.id}-${index}`}
                                                className="relative h-full w-full shrink-0"
                                            >
                                                {projectHref ? (
                                                    <Link
                                                        href={projectHref}
                                                        className="absolute inset-0 z-10"
                                                        title={project.title}
                                                    />
                                                ) : null}
                                                <img
                                                    src={projectImageUrl}
                                                    alt={project.title || "Featured Project"}
                                                    className="w-full h-full object-cover"
                                                />
                                                {shouldShowLastUnitsRibbon({
                                                    isProject: true,
                                                    hasLastUnitsBanner: project.hasLastUnitsBanner,
                                                }) ? (
                                                    <LastUnitsCornerRibbon />
                                                ) : null}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex justify-between items-end pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <div className="text-white pointer-events-auto pb-2 font-light">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="px-3 py-1 text-xs font-light text-white uppercase tracking-wider rounded-md bg-orange-500">
                                                Proje
                                            </span>
                                            {safeHeroProjects[projectSlideIndex]?.projectType ? (
                                                <span className="px-3 py-1 text-xs font-light text-white bg-white/20 backdrop-blur-md rounded-md">
                                                    {safeHeroProjects[projectSlideIndex]?.projectType}
                                                </span>
                                            ) : null}
                                        </div>

                                        <h3 className="text-3xl mb-2 font-light leading-tight">
                                            {safeHeroProjects[projectSlideIndex]?.title}
                                        </h3>

                                        <div className="flex items-center gap-2 text-white/90 text-base font-normal">
                                            <span>{safeHeroProjects[projectSlideIndex]?.district}</span>
                                            {safeHeroProjects[projectSlideIndex]?.deliveryDate ? (
                                                <>
                                                    <div className="w-1 h-1 rounded-full bg-white/50" />
                                                    <span>Teslim: {safeHeroProjects[projectSlideIndex]?.deliveryDate}</span>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pointer-events-auto pb-2">
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrevProjectSlide(); }}
                                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNextProjectSlide(); }}
                                            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Side content - Top: Listing carousel, Bottom: YouTube short */}
                            <div className="hidden lg:grid col-span-4 grid-rows-2 gap-4 h-full">
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40 bg-gray-900 min-h-0">
                                    <div
                                        className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                        style={{
                                            transform: `translateX(-${heroSlideIndex * 100}%)`,
                                        }}
                                    >
                                        {safeHeroListings.map((listing, index) => {
                                            const heroImageUrl = getHeroImageUrl(listing, 0);
                                            const heroListingHref = getHeroListingHref(listing);

                                            return (
                                                <div
                                                    key={`${listing.id}-${listing.slot ?? index}`}
                                                    className="relative h-full w-full shrink-0"
                                                >
                                                    {heroListingHref ? (
                                                        <Link
                                                            href={heroListingHref}
                                                            className="absolute inset-0 z-10"
                                                            title={listing.title}
                                                        />
                                                    ) : null}
                                                    <img
                                                        src={heroImageUrl}
                                                        alt={listing.title || "Featured Listing"}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 z-20 p-4 pointer-events-none">
                                        <div className="pointer-events-auto">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 text-[10px] font-medium text-white uppercase tracking-wider rounded-md ${safeHeroListings[heroSlideIndex]?.saleType === "SALE" ? "bg-orange-500" : "bg-blue-600"}`}>
                                                    {getSaleTypeLabel(safeHeroListings[heroSlideIndex]?.saleType, locale)}
                                                </span>
                                                <span className="px-2 py-0.5 text-[10px] font-medium text-white bg-white/20 backdrop-blur-md rounded-md">
                                                    {getPropertyTypeLabel(safeHeroListings[heroSlideIndex]?.type, locale)}
                                                </span>
                                            </div>
                                            <h4 className="text-base font-medium text-white leading-tight line-clamp-2">
                                                {safeHeroListings[heroSlideIndex]?.title}
                                            </h4>
                                        </div>
                                        <div className="pointer-events-auto mt-3 flex items-center justify-between">
                                            <div className="flex gap-1.5">
                                                {safeHeroListings.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHeroSlideIndex(index); }}
                                                        className={cn(
                                                            "h-1.5 rounded-full transition-all duration-300",
                                                            index === heroSlideIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrevHeroSlide(); }}
                                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNextHeroSlide(); }}
                                                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40 bg-black min-h-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsHeroVideoModalOpen(true)}
                                        className="group absolute inset-0 block h-full w-full cursor-pointer overflow-hidden"
                                    >
                                        <iframe
                                            className="pointer-events-none absolute inset-0 h-full w-full origin-center scale-[2.3] transform-gpu"
                                            src={heroVideo.autoplayEmbedUrl}
                                            title="Hero video player"
                                            frameBorder="0"
                                            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                        ></iframe>
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-black/60">
                                            <Play className="h-3.5 w-3.5" />
                                            Videoyu Büyüt
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {isHeroVideoModalOpen ? (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4"
                    onClick={() => setIsHeroVideoModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-5xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setIsHeroVideoModalOpen(false)}
                            className="absolute -top-12 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-colors hover:bg-black/80"
                            aria-label="Videoyu kapat"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
                            <div className="aspect-video w-full">
                                <iframe
                                    className="h-full w-full object-cover"
                                    src={heroVideo.popupEmbedUrl}
                                    title="Hero expanded video player"
                                    frameBorder="0"
                                    allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Search Banner - Below Hero (Desktop) */}
            <div ref={searchBannerRevealRef} className="hidden lg:block relative z-30 mt-8 px-4 mb-20">
                <div className="reveal-scale max-w-7xl mx-auto bg-white rounded-[36px] shadow-xl shadow-gray-200/50">
                    <form
                        ref={bannerRef}
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSearch();
                        }}
                    >
                        <div className="grid grid-cols-2 border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => {
                                    setSaleType("SALE");
                                    setOpenDropdown(null);
                                }}
                                className={`rounded-tl-[36px] py-4 text-center text-sm font-semibold tracking-wide transition-colors ${saleType === "SALE"
                                    ? "cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                                    : "cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                    }`}
                            >
                                {th("filterSale")}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSaleType("RENT");
                                    setOpenDropdown(null);
                                }}
                                className={`rounded-tr-[36px] py-4 text-center text-sm font-semibold tracking-wide transition-colors ${saleType === "RENT"
                                    ? "cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                                    : "cursor-pointer bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                    }`}
                            >
                                {th("filterRent")}
                            </button>
                        </div>

                        <div className="grid divide-y divide-gray-200 md:grid-cols-2 md:divide-y-0 md:divide-x xl:grid-cols-[1fr_0.8fr_0.8fr_1.1fr_auto]">
                            <label className="rounded-bl-[36px] px-6 py-5">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                    {th("filterPropertyType")}
                                </span>
                                <div className="relative mt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenDropdown(openDropdown === "propertyType" ? null : "propertyType")
                                        }
                                        className="flex h-10 w-full items-center justify-between border-b border-gray-300 bg-transparent text-left text-[15px] font-medium text-gray-800 transition-colors hover:border-orange-400 focus-visible:border-orange-500 focus-visible:outline-none"
                                    >
                                        <span>{selectedPropertyType ? selectedPropertyType.label : th("filterAllTypes")}</span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-orange-500 transition-transform ${openDropdown === "propertyType" ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    {openDropdown === "propertyType" ? (
                                        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[70] max-h-64 overflow-y-auto rounded-3xl border border-gray-200 bg-white p-1.5 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.7)]">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPropertyType("");
                                                    setOpenDropdown(null);
                                                }}
                                                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-colors ${propertyType === ""
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span>{th("filterAllTypes")}</span>
                                                {propertyType === "" ? <Check className="h-4 w-4" /> : null}
                                            </button>
                                            {propertyTypes.map((propertyTypeOption) => (
                                                <button
                                                    key={propertyTypeOption.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setPropertyType(propertyTypeOption.value);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-colors ${propertyType === propertyTypeOption.value
                                                        ? "bg-orange-50 text-orange-600"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span>{propertyTypeOption.label}</span>
                                                    {propertyType === propertyTypeOption.value ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : null}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </label>

                            <label className="px-6 py-5">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                    {th("filterCity")}
                                </span>
                                <div className="mt-3 flex h-10 cursor-default items-center rounded-2xl border border-gray-100 bg-gray-50 px-3 text-[15px] font-medium text-gray-700">
                                    <span>{city}</span>
                                </div>
                            </label>

                            <label className="px-6 py-5">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                    {th("filterDistrict")}
                                </span>
                                <div className="mt-3 flex h-10 cursor-default items-center rounded-2xl border border-gray-100 bg-gray-50 px-3 text-[15px] font-medium text-gray-700">
                                    <span>{district}</span>
                                </div>
                            </label>

                            <label className="px-6 py-5">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                                    {th("filterNeighborhood")}
                                </span>
                                <div className="relative mt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenDropdown(openDropdown === "neighborhood" ? null : "neighborhood")
                                        }
                                        className="flex h-10 w-full items-center justify-between border-b border-gray-300 bg-transparent text-left text-[15px] font-medium text-gray-800 transition-colors hover:border-orange-400 focus-visible:border-orange-500 focus-visible:outline-none"
                                    >
                                        <span>{neighborhood || th("filterAllNeighborhoods")}</span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-orange-500 transition-transform ${openDropdown === "neighborhood" ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    {openDropdown === "neighborhood" ? (
                                        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-[70] max-h-64 overflow-y-auto rounded-3xl border border-gray-200 bg-white p-1.5 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.7)]">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setNeighborhood("");
                                                    setOpenDropdown(null);
                                                }}
                                                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-colors ${neighborhood === ""
                                                    ? "bg-orange-50 text-orange-600"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span>{th("filterAllNeighborhoods")}</span>
                                                {neighborhood === "" ? <Check className="h-4 w-4" /> : null}
                                            </button>
                                            {alanyaNeighborhoodOptions.map((neighborhoodOption) => (
                                                <button
                                                    key={neighborhoodOption}
                                                    type="button"
                                                    onClick={() => {
                                                        setNeighborhood(neighborhoodOption);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-colors ${neighborhood === neighborhoodOption
                                                        ? "bg-orange-50 text-orange-600"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <span>{neighborhoodOption}</span>
                                                    {neighborhood === neighborhoodOption ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : null}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            </label>

                            <button
                                type="submit"
                                className="flex min-h-[92px] items-center justify-center gap-2 rounded-br-[36px] bg-gray-900 px-8 text-sm font-semibold text-white transition-colors hover:bg-black"
                            >
                                <Search className="h-4 w-4" />
                                {th("filterSearch")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ════════════════════════════════════════════
                CATEGORIES SECTION
            ════════════════════════════════════════════ */}
            <section ref={categoriesRevealRef} className="py-16 px-4 sm:px-6 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="reveal flex items-center justify-between mb-8">
                        <div>
                            <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">
                                {th("categoriesLabel")}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900 mt-1">
                                {th("categoriesTitle")}
                            </h2>
                        </div>
                        <Link
                            href={`/${locale}/portfoy`}
                            className="text-sm text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1"
                        >
                            {th("categoriesAll")}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Category Cards Grid */}
                    <div className="reveal-stagger grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.type}
                                href={`/${locale}/portfoy?type=${cat.type}`}
                                className="reveal group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
                            >
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                                        {cat.label}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                                        <span>{th("categoriesAll")}</span>
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SERVICES – NEDEN GÜZEL INVEST
            ════════════════════════════════════════════ */}
            <section ref={servicesRevealRef} className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
                {/* Orange blob background – right side */}
                <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.07] pointer-events-none">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#FF6B00" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.4C93.5,8.4,82.2,21.1,71.4,32.1C60.6,43.1,50.3,52.4,39,60.6C27.7,68.8,15.4,75.9,2.4,71.7C-10.5,67.6,-24.1,52.1,-37.2,40.1C-50.3,28.1,-63,19.6,-68.8,7.9C-74.6,-3.8,-73.5,-18.7,-64.2,-29.6C-54.9,-40.5,-37.4,-47.4,-23.5,-54.8C-9.6,-62.2,0.7,-70.1,12.7,-72.3C24.7,-74.5,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section Header – Left-aligned for fintech clarity */}
                    <div className="reveal flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
                        <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                                {th("servicesLabel")}
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                {th("servicesTitle")}
                            </h2>
                        </div>
                        <Link
                            href={`/${locale}/iletisim`}
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium"
                        >
                            {t("common.learnMore")}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Asymmetric layout: Featured card + grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* ── LEFT: Featured Service Card ── */}
                        {(() => {
                            const featured = services[0];
                            const FeaturedIcon = featured.icon;
                            return (
                                <div className="reveal lg:col-span-5 group relative bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 overflow-hidden">
                                    {/* Orange left accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl z-10" />

                                    {/* Featured image */}
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=400&fit=crop"
                                            alt="Satılık & Kiralık Gayrimenkul"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    <div className="p-8 pl-10 -mt-6 relative">
                                        {/* Number */}
                                        <span className="text-[11px] font-bold text-gray-200 group-hover:text-orange-200 transition-colors">
                                            01
                                        </span>

                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-xl bg-orange-500 border border-orange-500 flex items-center justify-center mt-4 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                                            <FeaturedIcon className="w-6 h-6 text-white transition-colors duration-300" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                                            {th(featured.titleKey)}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-sm">
                                            {th(featured.descKey)}
                                        </p>

                                        {/* Trust data point */}
                                        <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">20+</p>
                                                    <p className="text-[10px] text-gray-400">{th("statExperienceUnit")}</p>
                                                </div>
                                            </div>
                                            <div className="w-px h-8 bg-gray-100" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                                    <Building2 className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">300+</p>
                                                    <p className="text-[10px] text-gray-400">{th("statListings")}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hover CTA */}
                                        <div className="mt-6 flex items-center gap-1.5 text-orange-500 text-sm font-medium opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-2 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
                                            {t("common.learnMore")}
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* ── RIGHT: Remaining 5 services in gap-px grid ── */}
                        <div className="lg:col-span-7 rounded-xl overflow-hidden border border-gray-100">
                            <div className="reveal-stagger grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
                                {services.slice(1).map((svc, idx) => {
                                    const Icon = svc.icon;
                                    const num = String(idx + 2).padStart(2, "0");
                                    const isLast = idx === services.length - 2;
                                    return (
                                        <div
                                            key={idx}
                                            className={`reveal group relative bg-white p-6 cursor-pointer hover:bg-orange-50/50 hover:-translate-y-0.5 transition-all duration-300 ${isLast ? "sm:col-span-2" : ""
                                                }`}
                                        >
                                            {/* Left accent bar on hover */}
                                            <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-orange-500 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />
                                            {/* Top row: number + icon */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-10 h-10 rounded-lg bg-orange-500 border border-orange-500 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                                                    <Icon className="w-4.5 h-4.5 text-white transition-colors duration-300" />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-200 group-hover:text-orange-300 transition-colors">
                                                    {num}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-semibold text-gray-900 text-sm mb-1.5 group-hover:text-orange-600 transition-colors">
                                                {th(svc.titleKey)}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                {th(svc.descKey)}
                                            </p>

                                            {/* Hover arrow */}
                                            <div className="mt-3 flex items-center gap-1 text-orange-500 text-xs font-medium opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
                                                {t("common.learnMore")}
                                                <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                HIGHLIGHT – NEDEN ALANYA
            ════════════════════════════════════════════ */}
            <section ref={highlightRevealRef} className="py-16 px-4 sm:px-6 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="reveal">
                            <span className="text-xs text-orange-400 font-semibold uppercase tracking-wide">
                                Lokasyon Analizi
                            </span>
                            <h2 className="text-3xl font-bold text-white mt-3 mb-6">
                                Neden Alanya?
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                Alanya, güçlü turizm ekonomisi, yıl boyu yaşam imkanı ve uluslararası
                                talep dengesiyle gayrimenkul yatırımında istikrarlı bir değer artışı
                                sunar. Hem oturum hem de yatırım hedefleri için yüksek potansiyele
                                sahip bir bölgedir.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { value: "300+", label: "Güneşli gün/yıl" },
                                    { value: "25°C", label: "Ortalama sıcaklık" },
                                    { value: "2.8K €", label: "m² ortalama fiyat" },
                                    { value: "15%", label: "Yıllık değer artışı" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-gray-800 rounded-lg p-4">
                                        <p className="text-2xl font-bold text-orange-500">{stat.value}</p>
                                        <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={`/${locale}/iletisim`}
                                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                            >
                                Detaylı Rapor İndir
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="reveal relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=675&fit=crop"
                                    alt="Alanya Panorama"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            Yatırım Getirisi
                                        </p>
                                        <p className="text-xs text-gray-500">Son 5 yıl: +78%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                TESTIMONIALS – SİZDEN GELENLER
            ════════════════════════════════════════════ */}
            <section ref={testimonialsRevealRef} className="py-20 px-4 sm:px-6 bg-white relative overflow-hidden">
                {/* Orange blob background – left side, smoother round shape */}
                <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.07] pointer-events-none scale-x-[-1]">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#FF6B00" d="M42.7,-73.2C55.9,-67.1,67.3,-57.8,76.5,-46.3C85.7,-34.8,92.7,-21.1,91.8,-7.6C90.9,5.9,82.1,19.2,72.4,30.3C62.7,41.4,52.1,50.3,40.7,58.3C29.3,66.3,17.1,73.4,4.2,74.7C-8.7,76,-22.3,71.5,-34.5,64.8C-46.7,58.1,-57.5,49.2,-66.2,38.6C-74.9,28,-81.5,15.7,-82.9,2.8C-84.3,-10.1,-80.5,-23.6,-72.7,-34.8C-64.9,-46,-53.1,-54.9,-40.8,-61.6C-28.5,-68.3,-15.7,-72.8,-0.9,-75.6C13.9,-78.4,29.5,-79.3,42.7,-73.2Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Section Header */}
                    <div className="reveal flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
                        <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                                Müşteri Deneyimleri
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                Sizden Gelenler
                            </h2>
                        </div>
                        {/* Navigation Arrows */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (testimonialRef.current) {
                                        testimonialRef.current.scrollBy({ left: -380, behavior: "smooth" });
                                    }
                                }}
                                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (testimonialRef.current) {
                                        testimonialRef.current.scrollBy({ left: 380, behavior: "smooth" });
                                    }
                                }}
                                className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div
                        ref={testimonialRef}
                        className="reveal flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {testimonials.map((item, idx) => (
                            <div
                                key={idx}
                                className="group flex-shrink-0 w-[340px] snap-start rounded-xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 bg-white flex flex-col"
                            >
                                {/* Photo */}
                                <div className="h-56 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    {/* Quote */}
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        &ldquo;{item.quote}&rdquo;
                                    </p>

                                    {/* Divider + Info */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{item.type}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                CTA – YATIRIMA HEMEN BAŞLA
            ════════════════════════════════════════════ */}
            <section ref={ctaRevealRef} className="py-12 px-4 sm:px-6 bg-gray-900 relative overflow-hidden">
                {/* Subtle grid background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

                <div className="reveal max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    {/* Left – Title */}
                    <div className="flex-shrink-0">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-400">
                            Harekete Geçin
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                            Yatırıma{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                                Hemen Başlayın
                            </span>
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm max-w-md">
                            Alanya&apos;daki fırsatları keşfedin, uzman ekibimizle tanışın.
                        </p>
                    </div>

                    {/* Right – Action links */}
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-px bg-gray-700/50 rounded-xl overflow-hidden flex-shrink-0">
                        {
                            [
                                { icon: Search, title: "Portföyü Keşfet", href: `/${locale}/portfoy` },
                                { icon: Handshake, title: "İletişime Geç", href: `/${locale}/iletisim` },
                                { icon: Building2, title: "Satış Yap", href: `/${locale}/iletisim` },
                            ].map((card, idx) => {
                                const CardIcon = card.icon;
                                return (
                                    <Link
                                        key={idx}
                                        href={card.href}
                                        className="group w-full sm:w-auto bg-gray-800 px-6 py-5 flex items-center justify-between sm:justify-start gap-4 hover:bg-gray-800/60 transition-colors duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center group-hover:bg-orange-400 transition-colors">
                                            <CardIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors whitespace-nowrap">
                                            {card.title}
                                        </span>
                                        <ArrowRight className="ml-auto sm:ml-0 w-4 h-4 text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300" />
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                BLOG – SON MAKALELER
            ════════════════════════════════════════════ */}
            <section ref={blogRevealRef} className="py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="reveal flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
                        <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                                Blog
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                Son Makaleler
                            </h2>
                        </div>
                        <Link
                            href={`/${locale}/blog`}
                            className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium"
                        >
                            Tüm Makaleleri Gör
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Articles Grid */}
                    <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
                                date: "5 Şubat 2025",
                                title: "2025'te Alanya'da Gayrimenkul Yatırımı: Neler Beklenmeli?",
                                summary: "Alanya gayrimenkul piyasasının 2025 trendleri, bölgesel fiyat analizleri ve yatırımcılar için fırsat noktalarını ele aldık.",
                            },
                            {
                                image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop",
                                date: "18 Ocak 2025",
                                title: "Yabancıların Türkiye'de Mülk Satın Alma Rehberi",
                                summary: "Tapu işlemlerinden vatandaşlık başvurusuna kadar yabancı yatırımcıların bilmesi gereken tüm adımlar.",
                            },
                            {
                                image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
                                date: "3 Ocak 2025",
                                title: "Kargıcak vs Mahmutlar: Hangi Bölge Daha Karlı?",
                                summary: "İki popüler Alanya bölgesinin kira getirisi, değer artışı ve yaşam kalitesi karşılaştırması.",
                            },
                        ].map((article, idx) => (
                            <Link
                                key={idx}
                                href={`/${locale}/blog`}
                                className="reveal group rounded-xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 bg-white"
                            >
                                {/* Image */}
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <span className="text-[11px] text-gray-400 font-medium">
                                        {article.date}
                                    </span>
                                    <h3 className="text-base font-semibold text-gray-900 mt-2 mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                                        {article.summary}
                                    </p>
                                    <div className="mt-4 flex items-center gap-1.5 text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                        Devamını Oku
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile CTA */}
                    <div className="mt-8 text-center sm:hidden">
                        <Link
                            href={`/${locale}/blog`}
                            className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold"
                        >
                            Tüm Makaleleri Gör
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                FAQ – SIKÇA SORULAN SORULAR
            ════════════════════════════════════════════ */}
            <section ref={faqRevealRef} className="py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="reveal flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
                        <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                                SSS
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                Sıkça Sorulan Sorular
                            </h2>
                        </div>
                        <Link
                            href={`/${locale}/iletisim`}
                            className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium"
                        >
                            Daha Fazla Soru?
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* FAQ Items */}
                    <div className="reveal-stagger grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                        {[
                            {
                                q: "Yabancı uyruklu kişiler Türkiye'de mülk satın alabilir mi?",
                                a: "Evet, birçok ülke vatandaşı Türkiye'de gayrimenkul satın alabilir. Askeri bölgeler dışında kalan alanlarda mülk edinme hakkına sahipsiniz. Ekibimiz tüm süreçte size rehberlik eder.",
                            },
                            {
                                q: "Satın alma süreci ne kadar sürer?",
                                a: "Tapu işlemleri genellikle 3-7 iş günü içinde tamamlanır. Tüm belgelerin hazırlanması ve onaylanması dahil süreç ortalama 2-4 hafta sürmektedir.",
                            },
                            {
                                q: "Gayrimenkul yatırımıyla Türk vatandaşlığı alınabilir mi?",
                                a: "Evet, 400.000 USD ve üzeri değerinde gayrimenkul yatırımı yaparak Türk vatandaşlığına başvurabilirsiniz. Mülkü 3 yıl boyunca satmama taahhüdü gerekmektedir.",
                            },
                            {
                                q: "Mülk yönetimi hizmeti sunuyor musunuz?",
                                a: "Evet, satın aldığınız mülkün kiralanması, bakımı ve aidat takibi gibi tüm yönetim süreçlerini sizin adınıza profesyonelce yürütüyoruz.",
                            },
                            {
                                q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
                                a: "Banka havalesi, EFT ve uluslararası transfer kabul ediyoruz. Taksitli ödeme seçenekleri sunan projelerimiz de mevcuttur.",
                            },
                            {
                                q: "Alanya'da en çok tercih edilen bölgeler hangileri?",
                                a: "Mahmutlar, Kargıcak, Kestel, Oba ve Tosmur en popüler bölgeler arasındadır. Her bölge farklı avantajlar sunar; ekibimiz ihtiyaçlarınıza en uygun lokasyonu belirlemenize yardımcı olur.",
                            },
                        ].map((faq, idx) => (
                            <div
                                key={idx}
                                className="reveal border-b border-gray-100"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between py-5 text-left group"
                                >
                                    <span className="text-sm font-semibold text-gray-900 pr-4 group-hover:text-orange-600 transition-colors">
                                        {faq.q}
                                    </span>
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center group-hover:border-orange-300 group-hover:text-orange-500 transition-colors">
                                        {openFaq === idx ? (
                                            <Minus className="w-4 h-4 text-orange-500" />
                                        ) : (
                                            <Plus className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </button>
                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${openFaq === idx ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-sm text-gray-400 leading-relaxed pb-5">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <HomepagePopupForm locale={locale} />
        </main >
    );
}
