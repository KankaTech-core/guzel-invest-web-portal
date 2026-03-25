"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { LastUnitsCornerRibbon } from "@/components/public/last-units-corner-ribbon";
import {
    HomepageArticlesSection,
    type HomepageArticlePreview,
} from "@/components/public/homepage-articles-section";
import { shouldShowLastUnitsRibbon } from "@/lib/last-units-ribbon";
import {
    getMediaUrl,
    getProjectCategoryLabel,
    getPropertyTypeLabel,
    getSaleTypeLabel,
    cn,
} from "@/lib/utils";
import {
    dispatchHomepagePopupOpen,
    pushGTMEvent,
} from "@/lib/gtm-events";
import { resolveHomepageHeroVideo } from "@/lib/homepage-video";
import {
    getNextHomepageProjectSlideIndex,
    getPrevHomepageProjectSlideIndex,
} from "@/lib/homepage-project-carousel";
import { getHomepageCopy } from "@/lib/public-copy";
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
    Play,
    X,
} from "lucide-react";

/* ─── data ─── */
const searchTypeQueryMap: Record<string, string[]> = {
    RESIDENTIAL: ["APARTMENT", "VILLA", "PENTHOUSE"],
    COMMERCIAL_CLUSTER: ["COMMERCIAL", "OFFICE", "SHOP"],
};

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

const resolveEmbeddableTestimonialVideo = (value: string): string | null => {
    const input = value.trim();
    if (!input) return null;

    if (
        input.includes("youtube.com/embed/") ||
        input.includes("player.vimeo.com/video/")
    ) {
        return input;
    }

    const youtubeMatch = input.match(
        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );
    if (youtubeMatch && youtubeMatch[2].length === 11) {
        return `https://www.youtube.com/embed/${youtubeMatch[2]}`;
    }

    const vimeoMatch = input.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return null;
};

function TestimonialMedia({
    image,
    video,
    name,
}: {
    image: string;
    video: string | null;
    name: string;
}) {
    if (!video) {
        return (
            <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 640px) 85vw, 340px"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        );
    }

    const embedUrl = resolveEmbeddableTestimonialVideo(video);
    if (embedUrl) {
        return (
            <iframe
                src={embedUrl}
                title={`${name} referans videosu`}
                className="h-full w-full border-0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        );
    }

    return (
        <StyledVideoPlayer
            src={video}
            title={`${name} referans videosu`}
            autoPlay={false}
            loop={false}
            mutedByDefault={true}
            unmuteOnPlay={true}
            playButtonPlacement="center"
            toggleOnVideoClick={true}
            showPlayButtonOnlyWhenPaused={true}
        />
    );
}

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

type HomepageHeroListingSlide =
    | {
        kind: "listing";
        listing: HomepageHeroListing;
    }
    | {
        kind: "portfolio";
    };

type HomepageProjectSlide =
    | {
        kind: "project";
        project: HomepageProject;
    }
    | {
        kind: "portfolio";
    };

type HomepageMobileCarouselSlide =
    | {
        kind: "project";
        project: HomepageProject;
    }
    | {
        kind: "listing";
        listing: HomepageHeroListing;
    }
    | {
        kind: "portfolio";
    };

type HomepageHeroVideo = ReturnType<typeof resolveHomepageHeroVideo>;

const HERO_VIDEO_FALLBACK = resolveHomepageHeroVideo(null);
const HomepagePopupForm = dynamic(() =>
    import("@/components/public/homepage-popup-form").then(
        (module) => module.HomepagePopupForm
    )
);
const StyledVideoPlayer = dynamic(() =>
    import("@/components/public/styled-video-player").then(
        (module) => module.StyledVideoPlayer
    )
);

/* ─── page ─── */
export default function HomePage() {
    const t = useTranslations();
    const th = useTranslations("homepage");
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const copy = getHomepageCopy(locale);
    const propertyTypes = copy.propertyTypes;
    const categories = copy.categories.items;
    const serviceIconMap = {
        Handshake,
        BarChart3,
        CircleDollarSign,
        Globe,
        Settings,
        ShieldCheck,
    } as const;
    const services = copy.services.items.map((item) => ({
        ...item,
        icon: serviceIconMap[item.icon as keyof typeof serviceIconMap],
    }));
    const testimonialsFallback = copy.testimonials.items;
    const projectFallback = copy.projectFallback;
    const heroFallback: HomepageHeroListing = {
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
        title: copy.hero.featuredListingAlt,
    };
    const homepageProjectFallback: HomepageProject = {
        id: "project-fallback",
        slug: "",
        district: projectFallback.district,
        projectType: projectFallback.projectType,
        deliveryDate: null,
        hasLastUnitsBanner: false,
        title: projectFallback.title,
        images: [],
    };

    /* filter state */
    const [saleType, setSaleType] = useState<"SALE" | "RENT">("SALE");
    const [propertyType, setPropertyType] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [openDropdown, setOpenDropdown] = useState<"propertyType" | "neighborhood" | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [heroListings, setHeroListings] = useState<HomepageHeroListing[]>([heroFallback]);
    const [heroSlideIndex, setHeroSlideIndex] = useState(0);
    const [heroProjects, setHeroProjects] = useState<HomepageProject[]>([homepageProjectFallback]);
    const [projectSlideIndex, setProjectSlideIndex] = useState(0);
    const [mobileCarouselSlideIndex, setMobileCarouselSlideIndex] = useState(0);
    const [heroVideo, setHeroVideo] = useState<HomepageHeroVideo>(HERO_VIDEO_FALLBACK);
    const [heroAutoplayReadyUrl, setHeroAutoplayReadyUrl] = useState<string | null>(null);
    const [isHeroVideoModalOpen, setIsHeroVideoModalOpen] = useState(false);
    const [testimonials, setTestimonials] = useState(testimonialsFallback);
    const [articles, setArticles] = useState<HomepageArticlePreview[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchSticky, setIsMobileSearchSticky] = useState(false);
    const desktopBannerRef = useRef<HTMLFormElement>(null);
    const mobileInlineBannerRef = useRef<HTMLFormElement>(null);
    const mobileStickyBannerRef = useRef<HTMLFormElement>(null);
    const testimonialRef = useRef<HTMLDivElement>(null);
    const mobileCarouselSwipeStartXRef = useRef<number | null>(null);
    const heroSectionRef = useRef<HTMLElement>(null);
    const mobileSearchAnchorRef = useRef<HTMLDivElement>(null);
    const hasSeenMobileSearchBannerRef = useRef(false);
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
    const faqRevealRef = useScrollReveal<HTMLElement>();
    const selectedPropertyType = propertyTypes.find((propertyTypeOption) => propertyTypeOption.value === propertyType);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const bannerRoots = [
                desktopBannerRef.current,
                mobileInlineBannerRef.current,
                mobileStickyBannerRef.current,
            ].filter((root): root is HTMLFormElement => Boolean(root));

            if (bannerRoots.length === 0) {
                return;
            }

            const isClickInsideAnyBanner = bannerRoots.some((root) =>
                root.contains(target)
            );
            if (!isClickInsideAnyBanner) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleMobileMenuStateChange = (event: Event) => {
            const detail = (event as CustomEvent<{ isOpen?: boolean }>).detail;
            setIsMobileMenuOpen(Boolean(detail?.isOpen));
        };

        window.addEventListener(
            "mobile-nav-state-change",
            handleMobileMenuStateChange as EventListener
        );

        return () => {
            window.removeEventListener(
                "mobile-nav-state-change",
                handleMobileMenuStateChange as EventListener
            );
        };
    }, []);

    useEffect(() => {
        let isTicking = false;
        const MOBILE_BREAKPOINT_PX = 1024;
        const STICKY_TOP_OFFSET_PX = 80;

        const updateStickyState = () => {
            isTicking = false;

            if (window.innerWidth >= MOBILE_BREAKPOINT_PX || isMobileMenuOpen) {
                setIsMobileSearchSticky(false);
                return;
            }

            const searchAnchor = mobileSearchAnchorRef.current;
            const heroSection = heroSectionRef.current;

            if (!searchAnchor || !heroSection) {
                setIsMobileSearchSticky(false);
                return;
            }

            const searchAnchorRect = searchAnchor.getBoundingClientRect();
            const heroRect = heroSection.getBoundingClientRect();
            const isBannerInViewport =
                searchAnchorRect.top < window.innerHeight &&
                searchAnchorRect.bottom > 0;

            if (isBannerInViewport) {
                hasSeenMobileSearchBannerRef.current = true;
            }

            if (!hasSeenMobileSearchBannerRef.current) {
                setIsMobileSearchSticky(false);
                return;
            }

            const shouldStick =
                searchAnchorRect.bottom <= STICKY_TOP_OFFSET_PX && heroRect.top < 0;
            setIsMobileSearchSticky(shouldStick);
        };

        const requestStickyUpdate = () => {
            if (isTicking) {
                return;
            }
            isTicking = true;
            window.requestAnimationFrame(updateStickyState);
        };

        updateStickyState();
        window.addEventListener("scroll", requestStickyUpdate, { passive: true });
        window.addEventListener("resize", requestStickyUpdate);

        return () => {
            window.removeEventListener("scroll", requestStickyUpdate);
            window.removeEventListener("resize", requestStickyUpdate);
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const fallbackListing: HomepageHeroListing = {
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
            title: copy.hero.featuredListingAlt,
        };

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
                    incomingListings.length > 0 ? incomingListings : [fallbackListing]
                );
                setHeroSlideIndex(0);
                setMobileCarouselSlideIndex(0);
            } catch {
                if (isMounted) {
                    setHeroListings([fallbackListing]);
                    setHeroSlideIndex(0);
                    setMobileCarouselSlideIndex(0);
                }
            }
        };

        loadHomepageHeroListing();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [copy.hero.featuredListingAlt, locale]);

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
        if (heroVideo.source !== "youtube" || !heroVideo.autoplayEmbedUrl) {
            return;
        }

        // Keep first paint lightweight, then start autoplaying the embed.
        const targetAutoplayUrl = heroVideo.autoplayEmbedUrl;
        const timer = window.setTimeout(() => {
            setHeroAutoplayReadyUrl(targetAutoplayUrl);
        }, 1200);

        return () => {
            window.clearTimeout(timer);
        };
    }, [heroVideo.source, heroVideo.autoplayEmbedUrl]);

    const shouldAutoplayHeroPreview =
        heroVideo.source === "youtube" &&
        Boolean(heroVideo.autoplayEmbedUrl) &&
        heroVideo.autoplayEmbedUrl === heroAutoplayReadyUrl;

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadHomepageArticles = async () => {
            try {
                const response = await fetch(`/api/public/articles?locale=${locale}`, {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!response.ok) return;

                const data = (await response.json()) as {
                    articles?: HomepageArticlePreview[];
                };
                if (!isMounted) return;

                setArticles(Array.isArray(data?.articles) ? data.articles : []);
            } catch {
                if (isMounted) {
                    setArticles([]);
                }
            }
        };

        loadHomepageArticles();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const loadTestimonials = async () => {
            try {
                const response = await fetch("/api/public/testimonials", {
                    signal: controller.signal,
                    cache: "no-store",
                });
                if (!response.ok) return;

                const data = (await response.json()) as {
                    testimonials?: Array<{
                        id: string;
                        name: string | null;
                        quote: string | null;
                        serviceName: string | null;
                        imageUrl: string | null;
                        videoUrl?: string | null;
                    }>;
                };
                if (!isMounted) return;

                const incoming = data?.testimonials;
                if (incoming && incoming.length > 0) {
                    setTestimonials(
                        incoming.map((t) => ({
                            name: t.name ?? "",
                            type: t.serviceName ?? "",
                            quote: t.quote ?? "",
                            image: t.imageUrl
                                ? getMediaUrl(t.imageUrl)
                                : "/images/testimonials/testimonial-1.png",
                            video: t.videoUrl ? getMediaUrl(t.videoUrl) : null,
                        }))
                    );
                }
            } catch {
                // Keep fallback data on error
            }
        };

        loadTestimonials();

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
        const fallbackProject: HomepageProject = {
            id: "project-fallback",
            slug: "",
            district: projectFallback.district,
            projectType: projectFallback.projectType,
            deliveryDate: null,
            hasLastUnitsBanner: false,
            title: projectFallback.title,
            images: [],
        };

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
                        : [fallbackProject]
                );
                setProjectSlideIndex(0);
                setMobileCarouselSlideIndex(0);
            } catch {
                if (isMounted) {
                    setHeroProjects([fallbackProject]);
                    setProjectSlideIndex(0);
                    setMobileCarouselSlideIndex(0);
                }
            }
        };

        loadHomepageProjects();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [locale, projectFallback.district, projectFallback.projectType, projectFallback.title]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        params.set("saleType", saleType);

        const searchTypes = propertyType
            ? (searchTypeQueryMap[propertyType] || [propertyType])
            : [];
        searchTypes.forEach((typeValue) => params.append("type", typeValue));

        params.set("city", city);
        params.set("district", district);
        if (neighborhood) params.set("neighborhood", neighborhood);
        setOpenDropdown(null);
        router.push(`/${locale}/portfoy?${params.toString()}`);
    };

    const trackPortfolioClick = (ctaLocation: string) => {
        pushGTMEvent("portfolio_cta_click", {
            cta_location: ctaLocation,
            locale,
            destination_path: `/${locale}/portfoy`,
        });
    };

    const submitHomepageSearch = (searchSurface: string) => {
        pushGTMEvent("hero_search_submit", {
            search_surface: searchSurface,
            locale,
            sale_type: saleType,
            property_type: propertyType || "ALL",
            city,
            district,
            neighborhood: neighborhood || "ALL",
        });
        handleSearch();
    };

    const safeHeroListings =
        heroListings.length > 0 ? heroListings : [heroFallback];
    const getHeroImageUrl = (listing: HomepageHeroListing, index = 0) =>
        listing.images[index]
            ? getMediaUrl(listing.images[index])
            : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=500&fit=crop";
    const getHeroListingHref = (listing: HomepageHeroListing) =>
        listing.slug ? `/${locale}/ilan/${listing.slug}` : null;
    const heroSlides: HomepageHeroListingSlide[] = [
        ...safeHeroListings.map((listing) => ({
            kind: "listing" as const,
            listing,
        })),
        { kind: "portfolio" },
    ];
    const totalHeroSlides = heroSlides.length;
    const normalizedHeroSlideIndex = Math.min(heroSlideIndex, totalHeroSlides - 1);
    const activeHeroSlide = heroSlides[normalizedHeroSlideIndex];
    const activeHeroListing =
        activeHeroSlide?.kind === "listing" ? activeHeroSlide.listing : null;
    const safeHeroProjects =
        heroProjects.length > 0 ? heroProjects : [homepageProjectFallback];
    const getProjectImageUrl = (project: HomepageProject, index = 0) =>
        project.images[index]
            ? getMediaUrl(project.images[index])
            : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&h=900&fit=crop";
    const getProjectHref = (project: HomepageProject) =>
        project.slug ? `/${locale}/proje/${project.slug}` : null;
    const projectSlides: HomepageProjectSlide[] = [
        ...safeHeroProjects.map((project) => ({
            kind: "project" as const,
            project,
        })),
        { kind: "portfolio" },
    ];
    const totalProjectSlides = projectSlides.length;
    const normalizedProjectSlideIndex = Math.min(
        projectSlideIndex,
        totalProjectSlides - 1
    );
    const activeProjectSlide = projectSlides[normalizedProjectSlideIndex];
    const activeProject =
        activeProjectSlide?.kind === "project"
            ? activeProjectSlide.project
            : null;
    const mobileCarouselSlides: HomepageMobileCarouselSlide[] = [
        ...safeHeroProjects.map((project) => ({
            kind: "project" as const,
            project,
        })),
        ...safeHeroListings.map((listing) => ({
            kind: "listing" as const,
            listing,
        })),
        { kind: "portfolio" },
    ];
    const totalMobileCarouselSlides = mobileCarouselSlides.length;
    const normalizedMobileCarouselSlideIndex = Math.min(
        mobileCarouselSlideIndex,
        totalMobileCarouselSlides - 1
    );
    const canNavigateHero = totalHeroSlides > 1;
    const canNavigateProject = totalProjectSlides > 1;
    const canNavigateMobileCarousel = totalMobileCarouselSlides > 1;
    const isHeroSlideAtStart = normalizedHeroSlideIndex <= 0;
    const isHeroSlideAtEnd = normalizedHeroSlideIndex >= totalHeroSlides - 1;
    const isProjectSlideAtStart = normalizedProjectSlideIndex <= 0;
    const isProjectSlideAtEnd =
        normalizedProjectSlideIndex >= totalProjectSlides - 1;
    const isMobileCarouselSlideAtStart = normalizedMobileCarouselSlideIndex <= 0;
    const isMobileCarouselSlideAtEnd =
        normalizedMobileCarouselSlideIndex >= totalMobileCarouselSlides - 1;
    const HERO_SWIPE_THRESHOLD_PX = 42;

    const goToNextHeroSlide = () => {
        if (!canNavigateHero) return;
        setHeroSlideIndex((prev) =>
            getNextHomepageProjectSlideIndex(prev, totalHeroSlides)
        );
    };

    const goToPrevHeroSlide = () => {
        if (!canNavigateHero) return;
        setHeroSlideIndex((prev) =>
            getPrevHomepageProjectSlideIndex(prev, totalHeroSlides)
        );
    };

    const goToNextProjectSlide = () => {
        if (!canNavigateProject) return;
        setProjectSlideIndex((prev) =>
            getNextHomepageProjectSlideIndex(prev, totalProjectSlides)
        );
    };

    const goToPrevProjectSlide = () => {
        if (!canNavigateProject) return;
        setProjectSlideIndex((prev) =>
            getPrevHomepageProjectSlideIndex(prev, totalProjectSlides)
        );
    };

    const goToNextMobileCarouselSlide = () => {
        if (!canNavigateMobileCarousel) return;
        setMobileCarouselSlideIndex((prev) =>
            getNextHomepageProjectSlideIndex(prev, totalMobileCarouselSlides)
        );
    };

    const goToPrevMobileCarouselSlide = () => {
        if (!canNavigateMobileCarousel) return;
        setMobileCarouselSlideIndex((prev) =>
            getPrevHomepageProjectSlideIndex(prev, totalMobileCarouselSlides)
        );
    };

    const handleMobileCarouselTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canNavigateMobileCarousel) return;
        const touch = event.changedTouches[0];
        mobileCarouselSwipeStartXRef.current = touch ? touch.clientX : null;
    };

    const handleMobileCarouselTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (!canNavigateMobileCarousel) return;
        const startX = mobileCarouselSwipeStartXRef.current;
        const touch = event.changedTouches[0];
        mobileCarouselSwipeStartXRef.current = null;

        if (startX === null || !touch) return;

        const deltaX = touch.clientX - startX;
        if (Math.abs(deltaX) < HERO_SWIPE_THRESHOLD_PX) return;

        if (deltaX < 0) {
            goToNextMobileCarouselSlide();
            return;
        }
        goToPrevMobileCarouselSlide();
    };

    const handleMobileCarouselTouchCancel = () => {
        mobileCarouselSwipeStartXRef.current = null;
    };

    const renderCompactSearchBanner = (
        className = "",
        dropdownDirection: "up" | "down" = "down",
        formRef?: { current: HTMLFormElement | null },
        searchSurface: string = "hero_mobile_inline"
    ) => (
        <form
            ref={formRef}
            onSubmit={(event) => {
                event.preventDefault();
                submitHomepageSearch(searchSurface);
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
                        <div
                            className={cn(
                                "absolute left-0 right-0 z-[100] max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-gray-200/50 animate-in fade-in zoom-in-95 duration-100",
                                dropdownDirection === "up"
                                    ? "bottom-[calc(100%+8px)] origin-bottom"
                                    : "top-[calc(100%+8px)] origin-top"
                            )}
                        >
                            <div className="grid grid-cols-1 gap-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPropertyType("");
                                        setOpenDropdown(null);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${propertyType === ""
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
            <section ref={heroSectionRef} className="pt-[4.5rem] sm:pt-20 lg:pt-28 pb-16 px-8 bg-white">
                <div ref={heroRevealRef} className="max-w-7xl mx-auto">
                    {/* Hero Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Main Content */}
                        <div className="lg:col-span-5 pt-2 sm:pt-4 lg:pt-8">
                            <div className="reveal hidden lg:flex items-center justify-center lg:justify-start gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm mb-6 lg:mb-6 w-fit mx-auto lg:mx-0">
                                <Globe className="w-4 h-4" />
                                {copy.hero.badge}
                            </div>

                            <h1 className="reveal text-5xl md:text-6xl leading-tight text-gray-900 mb-6 font-semibold text-center lg:text-left">
                                {copy.hero.title}<br />
                                <span className="text-orange-500">{copy.hero.titleHighlight}</span> {copy.hero.titleEnd}
                            </h1>

                            <p className="reveal text-lg text-gray-500 mb-8 leading-relaxed max-w-md text-center lg:text-left mx-auto lg:mx-0">
                                {copy.hero.subtitle}
                            </p>

                            {/* Mobile Mixed Slider (Projects + Listings) */}
                            <div className="lg:hidden mb-8">
                                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl relative">
                                    <div
                                        className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                        style={{
                                            transform: `translateX(-${normalizedMobileCarouselSlideIndex * 100}%)`,
                                            touchAction: "pan-y",
                                        }}
                                        onTouchStart={handleMobileCarouselTouchStart}
                                        onTouchEnd={handleMobileCarouselTouchEnd}
                                        onTouchCancel={handleMobileCarouselTouchCancel}
                                    >
                                        {mobileCarouselSlides.map((slide, index) => {
                                            if (slide.kind === "portfolio") {
                                                return (
                                                    <div
                                                        key={`portfolio-${index}`}
                                                        className="relative h-full w-full shrink-0 px-1"
                                                    >
                                                        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-lg">
                                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.35),transparent_58%)]" />
                                                            <div className="relative z-10 flex h-full items-center justify-center">
                                                                <Link
                                                                    href={`/${locale}/portfoy`}
                                                                    onClick={() =>
                                                                        trackPortfolioClick("hero_mobile_portfolio_slide")
                                                                    }
                                                                    className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/35"
                                                                >
                                                                    {copy.hero.portfolioCta}
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            if (slide.kind === "listing") {
                                                const listing = slide.listing;
                                                const heroImageUrl = getHeroImageUrl(listing, 0);
                                                const heroListingHref = getHeroListingHref(listing);

                                                return (
                                                    <div
                                                        key={`${listing.id}-${listing.slot ?? index}`}
                                                        className="relative h-full w-full shrink-0 px-1"
                                                    >
                                                        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-lg">
                                                            <div className="relative h-full w-full overflow-hidden">
                                                                {heroListingHref ? (
                                                                    <Link
                                                                        href={heroListingHref}
                                                                        className="absolute inset-0 z-10"
                                                                        title={listing.title}
                                                                    />
                                                                ) : null}
                                                                <Image
                                                                    src={heroImageUrl}
                                                                    alt={listing.title || copy.hero.featuredListingAlt}
                                                                    fill
                                                                    sizes="(max-width: 1023px) calc(100vw - 4rem), 100vw"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">
                                                                    <div className="mb-2 flex items-center gap-2">
                                                                        <span className={`rounded-md px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white ${listing.saleType === "SALE" ? "bg-orange-500" : "bg-blue-600"}`}>
                                                                            {getSaleTypeLabel(listing.saleType, locale)}
                                                                        </span>
                                                                        <span className="rounded-md bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                                                                            {getPropertyTypeLabel(listing.type, locale)}
                                                                        </span>
                                                                    </div>

                                                                    <h3 className="mb-2 line-clamp-2 text-xl font-medium uppercase tracking-wide leading-tight text-white">
                                                                        {listing.title}
                                                                    </h3>

                                                                    <div className="flex items-center gap-2 text-xs font-normal text-white/90">
                                                                        <span>{listing.district}</span>
                                                                        {listing.rooms ? (
                                                                            <>
                                                                                <span className="inline-block h-1 w-1 rounded-full bg-white/60" />
                                                                                <span>{listing.rooms}</span>
                                                                            </>
                                                                        ) : null}
                                                                        <div className="ml-auto flex gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(event) => {
                                                                                    event.preventDefault();
                                                                                    event.stopPropagation();
                                                                                    goToPrevMobileCarouselSlide();
                                                                                }}
                                                                                disabled={isMobileCarouselSlideAtStart}
                                                                                className={cn(
                                                                                    "h-8 w-8 rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors",
                                                                                    isMobileCarouselSlideAtStart
                                                                                        ? "cursor-not-allowed opacity-45"
                                                                                        : "hover:bg-white/35"
                                                                                )}
                                                                            >
                                                                                <ChevronLeft className="mx-auto h-4 w-4" />
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(event) => {
                                                                                    event.preventDefault();
                                                                                    event.stopPropagation();
                                                                                    goToNextMobileCarouselSlide();
                                                                                }}
                                                                                disabled={isMobileCarouselSlideAtEnd}
                                                                                className={cn(
                                                                                    "h-8 w-8 rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors",
                                                                                    isMobileCarouselSlideAtEnd
                                                                                        ? "cursor-not-allowed opacity-45"
                                                                                        : "hover:bg-white/35"
                                                                                )}
                                                                            >
                                                                                <ChevronRight className="mx-auto h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const project = slide.project;
                                            const projectImageUrl = getProjectImageUrl(project, 0);
                                            const projectHref = getProjectHref(project);

                                            return (
                                                <div
                                                    key={`${project.id}-${index}`}
                                                    className="relative h-full w-full shrink-0 px-1"
                                                >
                                                    {/* Card Container */}
                                                    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-lg">
                                                        {/* Image Section - Fill Parent */}
                                                        <div className="relative h-full w-full overflow-hidden">
                                                            {projectHref ? (
                                                                <Link
                                                                    href={projectHref}
                                                                    className="absolute inset-0 z-10"
                                                                    title={project.title}
                                                                />
                                                            ) : null}
                                                            <Image
                                                                src={projectImageUrl}
                                                                alt={project.title || copy.hero.featuredProjectAlt}
                                                                fill
                                                                sizes="(max-width: 1023px) calc(100vw - 4rem), 100vw"
                                                                priority={index === 0}
                                                                className="h-full w-full object-cover"
                                                            />
                                                            {shouldShowLastUnitsRibbon({
                                                                isProject: true,
                                                                hasLastUnitsBanner: project.hasLastUnitsBanner,
                                                            }) ? (
                                                                <LastUnitsCornerRibbon />
                                                            ) : null}

                                                            {/* Overlay Content (Badges + Text) */}
                                                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5">
                                                                {/* Badges Row - Smaller Text */}
                                                                <div className="mb-2 flex items-center gap-2">
                                                                    <span className="rounded-md bg-orange-500 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                                                                        {copy.hero.projectSlideLabel}
                                                                    </span>
                                                                    {project.projectType ? (
                                                                        <span className="rounded-md bg-white/20 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                                                                            {getProjectCategoryLabel(project.projectType, locale)}
                                                                        </span>
                                                                    ) : null}
                                                                </div>

                                                                {/* Title - Smaller Text */}
                                                                <h3 className="mb-2 line-clamp-2 text-xl font-medium uppercase tracking-wide leading-tight text-white">
                                                                    {project.title}
                                                                </h3>

                                                                {/* Bottom row */}
                                                                <div className="flex items-center gap-2 text-xs font-normal text-white/90">
                                                                    <span>{project.district}</span>
                                                                    {project.deliveryDate ? (
                                                                        <>
                                                                            <span className="inline-block h-1 w-1 rounded-full bg-white/60" />
                                                                            <span>{copy.hero.projectDeliveryPrefix}: {project.deliveryDate}</span>
                                                                        </>
                                                                    ) : null}
                                                                    <div className="ml-auto flex gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(event) => {
                                                                                event.preventDefault();
                                                                                event.stopPropagation();
                                                                                goToPrevMobileCarouselSlide();
                                                                            }}
                                                                            disabled={isMobileCarouselSlideAtStart}
                                                                            className={cn(
                                                                                "h-8 w-8 rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors",
                                                                                isMobileCarouselSlideAtStart
                                                                                    ? "cursor-not-allowed opacity-45"
                                                                                    : "hover:bg-white/35"
                                                                            )}
                                                                        >
                                                                            <ChevronLeft className="mx-auto h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(event) => {
                                                                                event.preventDefault();
                                                                                event.stopPropagation();
                                                                                goToNextMobileCarouselSlide();
                                                                            }}
                                                                            disabled={isMobileCarouselSlideAtEnd}
                                                                            className={cn(
                                                                                "h-8 w-8 rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors",
                                                                                isMobileCarouselSlideAtEnd
                                                                                    ? "cursor-not-allowed opacity-45"
                                                                                    : "hover:bg-white/35"
                                                                            )}
                                                                        >
                                                                            <ChevronRight className="mx-auto h-4 w-4" />
                                                                        </button>
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
                                        {mobileCarouselSlides.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileCarouselSlideIndex(index); }}
                                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === normalizedMobileCarouselSlideIndex ? "w-4 bg-white" : "bg-white/50"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Search Banner */}
                            <div
                                ref={mobileSearchAnchorRef}
                                className={cn(
                                    "lg:hidden mb-8 transition-opacity duration-200",
                                    isMobileMenuOpen ? "hidden" : "block",
                                    isMobileSearchSticky ? "pointer-events-none opacity-0" : "opacity-100"
                                )}
                            >
                                {renderCompactSearchBanner(
                                    "",
                                    "down",
                                    mobileInlineBannerRef,
                                    "hero_mobile_inline"
                                )}
                            </div>

                            {/* Desktop Buttons */}
                            <div className="reveal hidden lg:flex items-center gap-4">
                                <Link
                                    href={`/${locale}/portfoy`}
                                    onClick={() => trackPortfolioClick("hero_desktop_primary")}
                                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    {th("ctaPortfolio")}
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatchHomepagePopupOpen("hero_desktop_secondary")
                                    }
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
                                {copy.hero.stats.map((stat, index) => (
                                    <div key={stat.label} className="contents">
                                        <div>
                                            <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                        </div>
                                        {index < copy.hero.stats.length - 1 ? (
                                            <div className="w-px h-12 bg-gray-200" />
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image Grid - Desktop Only */}
                        <div className="reveal-scale hidden lg:grid grid-cols-12 gap-4 lg:col-span-7">
                            {/* Main large image - Project Swiper */}
                            <div className="col-span-12 lg:col-span-8 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40 relative group">
                                <div
                                    className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    style={{
                                        transform: `translateX(-${normalizedProjectSlideIndex * 100}%)`,
                                    }}
                                >
                                    {projectSlides.map((slide, index) => {
                                        if (slide.kind === "portfolio") {
                                            return (
                                                <div
                                                    key={`portfolio-${index}`}
                                                    className="relative h-full w-full shrink-0"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.35),transparent_58%)]" />
                                                    <div className="relative z-10 flex h-full items-center justify-center">
                                                        <Link
                                                            href={`/${locale}/portfoy`}
                                                            onClick={() =>
                                                                trackPortfolioClick("hero_desktop_project_portfolio_slide")
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/25 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/35"
                                                        >
                                                            {copy.hero.portfolioCta}
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        const project = slide.project;
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
                                                <Image
                                                    src={projectImageUrl}
                                                    alt={project.title || copy.hero.featuredProjectAlt}
                                                    fill
                                                    sizes="(min-width: 1280px) 853px, (min-width: 1024px) 66vw, 100vw"
                                                    priority={index === 0}
                                                    className="h-full w-full object-cover"
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
                                        {activeProject ? (
                                            <>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="px-3 py-1 text-xs font-light text-white uppercase tracking-wider rounded-md bg-orange-500">
                                                        {copy.hero.projectSlideLabel}
                                                    </span>
                                                    {activeProject.projectType ? (
                                                        <span className="px-3 py-1 text-xs font-light text-white bg-white/20 backdrop-blur-md rounded-md">
                                                            {getProjectCategoryLabel(activeProject.projectType, locale)}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                <h3 className="text-3xl mb-2 font-light leading-tight">
                                                    {activeProject.title}
                                                </h3>

                                                <div className="flex items-center gap-2 text-white/90 text-base font-normal">
                                                    <span>{activeProject.district}</span>
                                                    {activeProject.deliveryDate ? (
                                                        <>
                                                            <div className="w-1 h-1 rounded-full bg-white/50" />
                                                            <span>{copy.hero.projectDeliveryPrefix}: {activeProject.deliveryDate}</span>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </>
                                        ) : null}
                                    </div>

                                    <div className="flex gap-2 pointer-events-auto pb-2">
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrevProjectSlide(); }}
                                            disabled={isProjectSlideAtStart}
                                            className={cn(
                                                "w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-colors",
                                                isProjectSlideAtStart
                                                    ? "cursor-not-allowed opacity-45"
                                                    : "hover:bg-white/30"
                                            )}
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNextProjectSlide(); }}
                                            disabled={isProjectSlideAtEnd}
                                            className={cn(
                                                "w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-colors",
                                                isProjectSlideAtEnd
                                                    ? "cursor-not-allowed opacity-45"
                                                    : "hover:bg-white/30"
                                            )}
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
                                            transform: `translateX(-${normalizedHeroSlideIndex * 100}%)`,
                                        }}
                                    >
                                        {heroSlides.map((slide, index) => {
                                            if (slide.kind === "portfolio") {
                                                return (
                                                    <div
                                                        key={`hero-portfolio-${index}`}
                                                        className="relative h-full w-full shrink-0"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.35),transparent_58%)]" />
                                                        <div className="relative z-10 flex h-full items-center justify-center">
                                                            <Link
                                                                href={`/${locale}/portfoy`}
                                                                onClick={() =>
                                                                    trackPortfolioClick("hero_desktop_listing_portfolio_slide")
                                                                }
                                                                className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/25 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/35"
                                                            >
                                                                {copy.hero.portfolioCta}
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Link>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            const listing = slide.listing;
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
                                                <Image
                                                    src={heroImageUrl}
                                                    alt={listing.title || copy.hero.featuredListingAlt}
                                                        fill
                                                        sizes="(min-width: 1280px) 427px, (min-width: 1024px) 33vw, 100vw"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 z-20 p-4 pointer-events-none">
                                        <div className="pointer-events-auto">
                                            {activeHeroListing ? (
                                                <>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`px-2 py-0.5 text-[10px] font-medium text-white uppercase tracking-wider rounded-md ${activeHeroListing.saleType === "SALE" ? "bg-orange-500" : "bg-blue-600"}`}>
                                                            {getSaleTypeLabel(activeHeroListing.saleType, locale)}
                                                        </span>
                                                        <span className="px-2 py-0.5 text-[10px] font-medium text-white bg-white/20 backdrop-blur-md rounded-md">
                                                            {getPropertyTypeLabel(activeHeroListing.type, locale)}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-base font-medium text-white leading-tight line-clamp-2">
                                                        {activeHeroListing.title}
                                                    </h4>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="pointer-events-auto mt-3 flex items-center justify-between">
                                            <div className="flex gap-1.5">
                                                {heroSlides.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHeroSlideIndex(index); }}
                                                        className={cn(
                                                            "h-1.5 rounded-full transition-all duration-300",
                                                            index === normalizedHeroSlideIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToPrevHeroSlide(); }}
                                                    disabled={isHeroSlideAtStart}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-colors",
                                                        isHeroSlideAtStart
                                                            ? "cursor-not-allowed opacity-45"
                                                            : "hover:bg-white/30"
                                                    )}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); goToNextHeroSlide(); }}
                                                    disabled={isHeroSlideAtEnd}
                                                    className={cn(
                                                        "w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-colors",
                                                        isHeroSlideAtEnd
                                                            ? "cursor-not-allowed opacity-45"
                                                            : "hover:bg-white/30"
                                                    )}
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
                                        {heroVideo.source === "youtube" && shouldAutoplayHeroPreview && heroVideo.autoplayEmbedUrl ? (
                                            <iframe
                                                className="pointer-events-none absolute inset-0 h-full w-full origin-center scale-[2.3] transform-gpu"
                                                src={heroVideo.autoplayEmbedUrl}
                                                title="Hero video player"
                                                frameBorder="0"
                                                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            ></iframe>
                                        ) : heroVideo.source === "youtube" && heroVideo.thumbnailUrl ? (
                                            <Image
                                                src={heroVideo.thumbnailUrl}
                                                alt="Hero video preview"
                                                fill
                                                sizes="(min-width: 1280px) 40vw, (min-width: 1024px) 50vw, 100vw"
                                                priority
                                                className="pointer-events-none absolute inset-0 h-full w-full origin-center scale-[2.3] transform-gpu object-cover"
                                            />
                                        ) : heroVideo.source === "youtube" && heroVideo.autoplayEmbedUrl ? (
                                            <iframe
                                                className="pointer-events-none absolute inset-0 h-full w-full origin-center scale-[2.3] transform-gpu"
                                                src={heroVideo.autoplayEmbedUrl}
                                                title="Hero video player"
                                                frameBorder="0"
                                                allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <video
                                                className="pointer-events-none absolute inset-0 h-full w-full origin-center scale-[2.3] transform-gpu object-cover"
                                                src={heroVideo.playbackUrl}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                preload="metadata"
                                            />
                                        )}
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                        <div className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-black/60">
                                            <Play className="h-3.5 w-3.5" />
                                            {th("enlargeVideo")}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div
                className={cn(
                    "fixed inset-x-0 bottom-3 z-[60] px-3 pb-[env(safe-area-inset-bottom)] transition-all duration-300 ease-out lg:hidden",
                    !isMobileMenuOpen && isMobileSearchSticky
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-[calc(100%+1.5rem)] opacity-0"
                )}
            >
                <div className="mx-auto max-w-xl">
                    {renderCompactSearchBanner(
                        "shadow-xl shadow-gray-300/40",
                        "up",
                        mobileStickyBannerRef,
                        "hero_mobile_sticky"
                    )}
                </div>
            </div>

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
                                {heroVideo.source === "youtube" && heroVideo.popupEmbedUrl ? (
                                    <iframe
                                        className="h-full w-full object-cover"
                                        src={heroVideo.popupEmbedUrl}
                                        title="Hero expanded video player"
                                        frameBorder="0"
                                        allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <StyledVideoPlayer
                                        src={heroVideo.playbackUrl}
                                        title="Hero expanded video player"
                                        autoPlay
                                        loop
                                        mutedByDefault={false}
                                        playButtonPlacement="corner"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Search Banner - Below Hero (Desktop) */}
            <div ref={searchBannerRevealRef} className="hidden lg:block relative z-30 mt-8 px-4 mb-20">
                <div className="reveal-scale max-w-7xl mx-auto bg-white rounded-[36px] shadow-xl shadow-gray-200/50">
                    <form
                        ref={desktopBannerRef}
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitHomepageSearch("hero_desktop");
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
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <Image
                                        src={cat.image}
                                        alt={cat.label}
                                        fill
                                        sizes="(max-width: 1023px) 50vw, (max-width: 1279px) 25vw, 320px"
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                                <Link
                                    href={`/${locale}/iletisim`}
                                    className="reveal lg:col-span-5 group relative block bg-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Orange left accent */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl z-10" />

                                    {/* Featured image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=400&fit=crop"
                                            alt={featured.title}
                                            fill
                                            sizes="(min-width: 1280px) 533px, (min-width: 1024px) 40vw, 100vw"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                                            {featured.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-sm">
                                            {featured.description}
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
                                </Link>
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
                                        <Link
                                            key={idx}
                                            href={`/${locale}/iletisim`}
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
                                                {svc.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-xs text-gray-400 leading-relaxed">
                                                {svc.description}
                                            </p>

                                            {/* Hover arrow */}
                                            <div className="mt-3 flex items-center gap-1 text-orange-500 text-xs font-medium opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
                                                {t("common.learnMore")}
                                                <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </Link>
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
                                {copy.highlights.label}
                            </span>
                            <h2 className="text-3xl font-bold text-white mt-3 mb-6">
                                {copy.highlights.title}
                            </h2>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                {copy.highlights.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {copy.highlights.stats.map((stat) => (
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
                                {copy.highlights.cta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="reveal relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=675&fit=crop"
                                    alt="Alanya Panorama"
                                    fill
                                    sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {copy.highlights.roiLabel}
                                        </p>
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
                                {copy.testimonials.label}
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                {copy.testimonials.title}
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
                                <div className="relative h-56 overflow-hidden">
                                    <TestimonialMedia
                                        image={item.image}
                                        video={item.video}
                                        name={item.name}
                                    />
                                </div>

                                {/* Content */}
                                {(item.quote || item.name || item.type) && (
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    {/* Quote */}
                                    {item.quote && (
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        &ldquo;{item.quote}&rdquo;
                                    </p>
                                    )}

                                    {/* Divider + Info */}
                                    {(item.name || item.type) && (
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div>
                                            {item.name && <p className="text-sm font-semibold text-gray-900">{item.name}</p>}
                                            {item.type && <p className="text-[11px] text-gray-400 mt-0.5">{item.type}</p>}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    )}
                                </div>
                                )}
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
                            {copy.cta.label}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                            {copy.cta.title}{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                                {copy.cta.titleHighlight}
                            </span>
                        </h2>
                        <p className="text-gray-400 mt-2 text-sm max-w-md">
                            {copy.cta.description}
                        </p>
                    </div>

                    {/* Right – Action links */}
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-px bg-gray-700/50 rounded-xl overflow-hidden flex-shrink-0">
                        {
                            [
                                {
                                    icon: Search,
                                    title: copy.cta.portfolio,
                                    href: `/${locale}/portfoy`,
                                    onClick: () => trackPortfolioClick("homepage_cta_portfolio"),
                                },
                                { icon: Handshake, title: copy.cta.contact, href: `/${locale}/iletisim` },
                                {
                                    icon: Building2,
                                    title: copy.cta.sell,
                                    onClick: () => dispatchHomepagePopupOpen("homepage_cta_sell"),
                                },
                            ].map((card, idx) => {
                                const CardIcon = card.icon;
                                const cardContent = (
                                    <>
                                        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center group-hover:bg-orange-400 transition-colors">
                                            <CardIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors whitespace-nowrap">
                                            {card.title}
                                        </span>
                                        <ArrowRight className="ml-auto sm:ml-0 w-4 h-4 text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all duration-300" />
                                    </>
                                );

                                if ("onClick" in card) {
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={card.onClick}
                                            className="group w-full sm:w-auto bg-gray-800 px-6 py-5 flex items-center justify-between sm:justify-start gap-4 hover:bg-gray-800/60 transition-colors duration-300"
                                        >
                                            {cardContent}
                                        </button>
                                    );
                                }

                                return (
                                    <Link
                                        key={idx}
                                        href={card.href}
                                        onClick={card.onClick}
                                        className="group w-full sm:w-auto bg-gray-800 px-6 py-5 flex items-center justify-between sm:justify-start gap-4 hover:bg-gray-800/60 transition-colors duration-300"
                                    >
                                        {cardContent}
                                    </Link>
                                );
                            })
                        }
                    </div>
                </div>
            </section>

            <HomepageArticlesSection locale={locale} articles={articles} />

            {/* ════════════════════════════════════════════
                FAQ – SIKÇA SORULAN SORULAR
            ════════════════════════════════════════════ */}
            <section ref={faqRevealRef} className="py-20 px-4 sm:px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="reveal flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
                        <div>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                                {copy.faq.label}
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-2">
                                {copy.faq.title}
                            </h2>
                        </div>
                        <Link
                            href={`/${locale}/iletisim`}
                            className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium"
                        >
                            {copy.faq.moreQuestions}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* FAQ Items */}
                    <div className="reveal-stagger grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                        {copy.faq.items.map((faq, idx) => (
                            <div
                                key={idx}
                                className="reveal is-visible border-b border-gray-100"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between py-5 text-left group"
                                >
                                    <span className="text-sm font-semibold text-gray-900 pr-4 group-hover:text-orange-600 transition-colors">
                                        {faq.question}
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
                                            {faq.answer}
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
