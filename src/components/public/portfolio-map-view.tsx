"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type TouchEvent as ReactTouchEvent,
} from "react";
import {
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    SlidersHorizontal,
    X,
} from "lucide-react";
import {
    cn,
    formatArea,
    formatPrice,
    getMediaUrl,
    getPropertyTypeLabel,
    getSaleTypeLabel,
    truncateText,
} from "@/lib/utils";
import type { MapListing as LeafletMapListing } from "@/components/admin/listings-leaflet-map";

type ListingStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";
type SaleType = "SALE" | "RENT";

interface ListingTranslation {
    locale: string;
    title: string;
    description: string;
}

interface ListingMedia {
    id?: string;
    url: string;
}

interface Listing {
    id: string;
    slug: string;
    type: string;
    saleType: SaleType;
    city: string;
    district: string;
    neighborhood: string | null;
    latitude: number | string | null;
    longitude: number | string | null;
    status: ListingStatusValue;
    price: number | string;
    currency: string;
    area: number;
    rooms: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    citizenshipEligible: boolean;
    residenceEligible: boolean;
    translations: ListingTranslation[];
    media: ListingMedia[];
}

interface LocationsPayload {
    cities?: string[];
    districts?: string[];
    neighborhoods?: string[];
}

interface FiltersState {
    types: string[];
    saleType?: SaleType;
    city: string;
    district: string;
    neighborhood: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    rooms: string[];
}

interface DropdownOption {
    value: string;
    label: string;
}

interface InlineDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
}

interface InlineRangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
}

const PRICE_MIN = 0;
const PRICE_MAX = 2000000;
const PRICE_STEP = 10000;
const AREA_MIN = 0;
const AREA_MAX = 500;
const AREA_STEP = 5;
const IMAGE_SWIPE_THRESHOLD_PX = 48;

const propertyTypes = [
    { value: "APARTMENT", label: "Daire" },
    { value: "VILLA", label: "Villa" },
    { value: "PENTHOUSE", label: "Penthouse" },
    { value: "LAND", label: "Arsa" },
    { value: "COMMERCIAL", label: "Ticari" },
    { value: "OFFICE", label: "Ofis" },
    { value: "SHOP", label: "Dükkan" },
    { value: "FARM", label: "Çiftlik" },
] as const;

const saleTypes = [
    { value: "SALE", label: "Satılık" },
    { value: "RENT", label: "Kiralık" },
] as const;

const roomOptions = [
    "1+0",
    "1+1",
    "2+1",
    "3+1",
    "4+1",
    "5+1",
    "6+1",
    "7+1",
    "8+1",
    "8+",
] as const;

const STATUS_UI: Record<
    ListingStatusValue,
    {
        label: string;
        badge: string;
        markerBg: string;
        markerText: string;
        markerRing: string;
    }
> = {
    DRAFT: {
        label: "Taslak",
        badge: "bg-amber-100 text-amber-700",
        markerBg: "#FBBF24",
        markerText: "#422006",
        markerRing: "rgba(251,191,36,0.5)",
    },
    PUBLISHED: {
        label: "Yayında",
        badge: "bg-emerald-100 text-emerald-700",
        markerBg: "#10B981",
        markerText: "#FFFFFF",
        markerRing: "rgba(16,185,129,0.45)",
    },
    REMOVED: {
        label: "Kaldırıldı",
        badge: "bg-rose-100 text-rose-700",
        markerBg: "#F43F5E",
        markerText: "#FFFFFF",
        markerRing: "rgba(244,63,94,0.45)",
    },
    ARCHIVED: {
        label: "Arşiv",
        badge: "bg-gray-100 text-gray-600",
        markerBg: "#9CA3AF",
        markerText: "#FFFFFF",
        markerRing: "rgba(156,163,175,0.45)",
    },
};

const FILTER_QUERY_KEYS = [
    "type",
    "saleType",
    "city",
    "district",
    "neighborhood",
    "minPrice",
    "maxPrice",
    "minArea",
    "maxArea",
    "rooms",
] as const;

const LeafletMap = dynamic(() => import("@/components/admin/listings-leaflet-map"), {
    ssr: false,
});

function InlineDropdown({
    options,
    value,
    onChange,
    placeholder,
    disabled = false,
}: InlineDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return (
        <div ref={rootRef} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((previous) => !previous)}
                className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm outline-none transition ring-orange-500 focus:ring-2",
                    disabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : "cursor-pointer border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                )}
            >
                <span className={selectedOption ? "" : "text-gray-400"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-gray-400 transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && !disabled && (
                <div className="absolute left-0 right-0 z-40 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_14px_32px_rgba(15,23,42,0.16)]">
                    <ul className="max-h-64 overflow-auto py-1">
                        {options.map((option) => {
                            const isActive = option.value === value;
                            return (
                                <li key={option.value}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition",
                                            isActive
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <span>{option.label}</span>
                                        {isActive && <Check className="h-4 w-4" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

function InlineRangeSlider({
    min,
    max,
    step,
    value,
    onChange,
}: InlineRangeSliderProps) {
    const getPercent = (inputValue: number) =>
        ((inputValue - min) / (max - min)) * 100;

    const minPercent = getPercent(value[0]);
    const maxPercent = getPercent(value[1]);

    const handleMinChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextMin = Math.min(Number(event.target.value), value[1] - step);
        onChange([nextMin, value[1]]);
    };

    const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextMax = Math.max(Number(event.target.value), value[0] + step);
        onChange([value[0], nextMax]);
    };

    return (
        <div className="relative h-6">
            <div className="slider-track-base" />
            <div
                className="slider-track-range"
                style={{
                    left: `${minPercent}%`,
                    width: `${maxPercent - minPercent}%`,
                }}
            />

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleMinChange}
                className="slider-input"
                style={{ zIndex: value[0] > max - (max - min) / 10 ? 35 : 30 }}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[1]}
                onChange={handleMaxChange}
                className="slider-input"
                style={{ zIndex: value[1] < min + (max - min) / 10 ? 35 : 30 }}
            />
        </div>
    );
}

export function PortfolioMapView({ locale }: { locale: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchKey = searchParams.toString();

    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>(
        {}
    );
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
    const swipeStartXRef = useRef<Record<string, number>>({});
    const [filters, setFilters] = useState<FiltersState>(() =>
        readInitialFilters(new URLSearchParams(searchKey))
    );

    useEffect(() => {
        setFilters(readInitialFilters(new URLSearchParams(searchKey)));
    }, [searchKey]);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        let active = true;

        const loadCities = async () => {
            try {
                const response = await fetch("/api/public/locations", {
                    cache: "force-cache",
                });
                if (!response.ok) return;

                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;
                setAvailableCities(payload.cities || []);
            } catch {
                // no-op
            }
        };

        void loadCities();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!filters.city) {
            setAvailableDistricts([]);
            setAvailableNeighborhoods([]);
            return;
        }

        let active = true;

        const loadDistricts = async () => {
            try {
                const response = await fetch(
                    `/api/public/locations?city=${encodeURIComponent(filters.city)}`,
                    {
                        cache: "force-cache",
                    }
                );
                if (!response.ok) return;

                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;

                const districts = payload.districts || [];
                setAvailableDistricts(districts);

                setFilters((previous) => {
                    if (previous.city !== filters.city) return previous;
                    if (!previous.district || districts.includes(previous.district)) {
                        return previous;
                    }

                    return {
                        ...previous,
                        district: "",
                        neighborhood: "",
                    };
                });
            } catch {
                // no-op
            }
        };

        void loadDistricts();
        return () => {
            active = false;
        };
    }, [filters.city]);

    useEffect(() => {
        if (!filters.city || !filters.district) {
            setAvailableNeighborhoods([]);
            return;
        }

        let active = true;

        const loadNeighborhoods = async () => {
            try {
                const response = await fetch(
                    `/api/public/locations?city=${encodeURIComponent(filters.city)}&district=${encodeURIComponent(filters.district)}`,
                    {
                        cache: "force-cache",
                    }
                );
                if (!response.ok) return;

                const payload = (await response.json()) as LocationsPayload;
                if (!active) return;

                const neighborhoods = payload.neighborhoods || [];
                setAvailableNeighborhoods(neighborhoods);

                setFilters((previous) => {
                    if (
                        previous.city !== filters.city ||
                        previous.district !== filters.district
                    ) {
                        return previous;
                    }

                    if (
                        !previous.neighborhood ||
                        neighborhoods.includes(previous.neighborhood)
                    ) {
                        return previous;
                    }

                    return {
                        ...previous,
                        neighborhood: "",
                    };
                });
            } catch {
                // no-op
            }
        };

        void loadNeighborhoods();
        return () => {
            active = false;
        };
    }, [filters.city, filters.district]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadListings() {
            setIsLoading(true);
            setError("");

            try {
                const params = new URLSearchParams(searchKey);
                params.set("locale", locale);

                const response = await fetch(`/api/public/listings?${params.toString()}`, {
                    signal: controller.signal,
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch listings");
                }

                const payload = (await response.json()) as { listings?: Listing[] };
                setListings(payload.listings || []);
            } catch (fetchError) {
                if ((fetchError as Error).name === "AbortError") return;
                setError("İlanlar yüklenirken bir hata oluştu.");
                setListings([]);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadListings();
        return () => {
            controller.abort();
        };
    }, [locale, searchKey]);

    const portfolioHref = useMemo(() => {
        if (!searchKey) return `/${locale}/portfoy`;
        return `/${locale}/portfoy?${searchKey}`;
    }, [locale, searchKey]);

    const cityOptions = useMemo(
        () =>
            filters.city && !availableCities.includes(filters.city)
                ? [filters.city, ...availableCities]
                : availableCities,
        [availableCities, filters.city]
    );

    const districtOptions = useMemo(
        () =>
            filters.district && !availableDistricts.includes(filters.district)
                ? [filters.district, ...availableDistricts]
                : availableDistricts,
        [availableDistricts, filters.district]
    );

    const neighborhoodOptions = useMemo(
        () =>
            filters.neighborhood &&
                !availableNeighborhoods.includes(filters.neighborhood)
                ? [filters.neighborhood, ...availableNeighborhoods]
                : availableNeighborhoods,
        [availableNeighborhoods, filters.neighborhood]
    );

    const priceRange = useMemo<[number, number]>(
        () =>
            normalizeRange(
                filters.minPrice,
                filters.maxPrice,
                PRICE_MIN,
                PRICE_MAX
            ),
        [filters.minPrice, filters.maxPrice]
    );

    const areaRange = useMemo<[number, number]>(
        () => normalizeRange(filters.minArea, filters.maxArea, AREA_MIN, AREA_MAX),
        [filters.minArea, filters.maxArea]
    );

    const visibleListings = useMemo(
        () => listings.filter((listing) => listing.status === "PUBLISHED"),
        [listings]
    );

    const mapListings = useMemo<LeafletMapListing[]>(() => {
        return visibleListings.flatMap((listing) => {
            const latitude = normalizeCoordinate(listing.latitude);
            const longitude = normalizeCoordinate(listing.longitude);
            if (latitude === null || longitude === null) return [];

            return [
                {
                    id: listing.id,
                    price: listing.price,
                    currency: listing.currency,
                    status: listing.status,
                    latitude,
                    longitude,
                },
            ];
        });
    }, [visibleListings]);

    useEffect(() => {
        if (!activeId) return;
        const exists = visibleListings.some((listing) => listing.id === activeId);
        if (!exists) setActiveId(null);
    }, [activeId, visibleListings]);

    const activeListing =
        visibleListings.find((listing) => listing.id === activeId) ?? null;
    const galleryMedia = activeListing ? activeListing.media.slice(0, 4) : [];
    const maxImageIndex = Math.max(0, galleryMedia.length - 1);
    const activeImageIndex = activeListing
        ? Math.min(activeImageIndexes[activeListing.id] ?? 0, maxImageIndex)
        : 0;

    const toggleType = (type: string) => {
        setFilters((previous) => ({
            ...previous,
            types: previous.types.includes(type)
                ? previous.types.filter((item) => item !== type)
                : [...previous.types, type],
        }));
    };

    const toggleRoom = (room: string) => {
        setFilters((previous) => ({
            ...previous,
            rooms: previous.rooms.includes(room)
                ? previous.rooms.filter((item) => item !== room)
                : [...previous.rooms, room],
        }));
    };

    const updateImageIndex = (
        listingId: string,
        mediaLength: number,
        direction: "prev" | "next"
    ) => {
        if (mediaLength <= 1) return;

        setActiveImageIndexes((previous) => {
            const currentIndex = previous[listingId] ?? 0;
            const maxIndex = Math.max(0, mediaLength - 1);
            const clampedCurrentIndex = Math.min(currentIndex, maxIndex);
            const nextIndex =
                direction === "next"
                    ? clampedCurrentIndex >= maxIndex
                        ? 0
                        : clampedCurrentIndex + 1
                    : clampedCurrentIndex <= 0
                        ? maxIndex
                        : clampedCurrentIndex - 1;

            return {
                ...previous,
                [listingId]: nextIndex,
            };
        });
    };

    const handleImageTouchStart = (
        listingId: string,
        event: ReactTouchEvent<HTMLDivElement>
    ) => {
        const point = event.touches[0];
        if (!point) return;
        swipeStartXRef.current[listingId] = point.clientX;
    };

    const handleImageTouchEnd = (
        listingId: string,
        mediaLength: number,
        event: ReactTouchEvent<HTMLDivElement>
    ) => {
        if (mediaLength <= 1) return;

        const startX = swipeStartXRef.current[listingId];
        const point = event.changedTouches[0];
        if (startX === undefined || !point) return;

        const deltaX = point.clientX - startX;
        delete swipeStartXRef.current[listingId];

        if (Math.abs(deltaX) < IMAGE_SWIPE_THRESHOLD_PX) return;

        updateImageIndex(listingId, mediaLength, deltaX < 0 ? "next" : "prev");
    };

    const handleImageTouchCancel = (listingId: string) => {
        delete swipeStartXRef.current[listingId];
    };

    const handleMinPriceInput = (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseNumber(event.target.value);
        setFilters((previous) => {
            if (rawValue === undefined) return { ...previous, minPrice: undefined };
            const bounded = clampNumber(rawValue, PRICE_MIN, PRICE_MAX);
            const maxValue = previous.maxPrice ?? PRICE_MAX;
            return { ...previous, minPrice: Math.min(bounded, maxValue) };
        });
    };

    const handleMaxPriceInput = (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseNumber(event.target.value);
        setFilters((previous) => {
            if (rawValue === undefined) return { ...previous, maxPrice: undefined };
            const bounded = clampNumber(rawValue, PRICE_MIN, PRICE_MAX);
            const minValue = previous.minPrice ?? PRICE_MIN;
            return { ...previous, maxPrice: Math.max(bounded, minValue) };
        });
    };

    const handleMinAreaInput = (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseNumber(event.target.value);
        setFilters((previous) => {
            if (rawValue === undefined) return { ...previous, minArea: undefined };
            const bounded = clampNumber(rawValue, AREA_MIN, AREA_MAX);
            const maxValue = previous.maxArea ?? AREA_MAX;
            return { ...previous, minArea: Math.min(bounded, maxValue) };
        });
    };

    const handleMaxAreaInput = (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = parseNumber(event.target.value);
        setFilters((previous) => {
            if (rawValue === undefined) return { ...previous, maxArea: undefined };
            const bounded = clampNumber(rawValue, AREA_MIN, AREA_MAX);
            const minValue = previous.minArea ?? AREA_MIN;
            return { ...previous, maxArea: Math.max(bounded, minValue) };
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchKey);
        FILTER_QUERY_KEYS.forEach((key) => params.delete(key));

        filters.types.forEach((type) => params.append("type", type));
        filters.rooms.forEach((room) => params.append("rooms", room));

        if (filters.saleType) params.set("saleType", filters.saleType);
        if (filters.city) params.set("city", filters.city);
        if (filters.district) params.set("district", filters.district);
        if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
        if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
        if (filters.minArea !== undefined) params.set("minArea", String(filters.minArea));
        if (filters.maxArea !== undefined) params.set("maxArea", String(filters.maxArea));

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
        setIsFilterOpen(false);
    };

    const resetFilters = () => {
        setFilters(readInitialFilters(new URLSearchParams()));
        const params = new URLSearchParams(searchKey);
        FILTER_QUERY_KEYS.forEach((key) => params.delete(key));
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
        setIsFilterOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[90]">
            <section className="relative isolate h-full w-full overflow-hidden bg-slate-100">
                <LeafletMap
                    listings={mapListings}
                    activeId={activeId}
                    onSelect={setActiveId}
                    statusUi={STATUS_UI}
                    className="h-full w-full"
                />

                <div className="absolute left-4 top-4 z-[1200]">
                    <Link href={portfolioHref} className="btn btn-secondary btn-sm shadow-lg">
                        Portföye Dön
                    </Link>
                </div>

                <div className="absolute right-4 top-4 z-[1200]">
                    <button
                        type="button"
                        onClick={() => setIsFilterOpen(true)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/95 px-3 text-sm font-semibold text-gray-700 shadow-lg backdrop-blur transition hover:bg-white"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtre
                    </button>
                </div>

                {activeListing && (
                    <div className="absolute bottom-4 left-1/2 z-[1250] w-[92%] max-w-[980px] -translate-x-1/2">
                        <article className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-orange-200 hover:shadow-lg">
                            <button
                                type="button"
                                onClick={() => setActiveId(null)}
                                className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-500 shadow-sm transition hover:bg-white md:hidden"
                                aria-label="İlan kartını kapat"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_200px]">
                                <div className="relative min-h-[220px] overflow-hidden bg-gray-100">
                                    {galleryMedia.length > 0 ? (
                                        <div
                                            className="absolute inset-0 overflow-hidden"
                                            style={{ touchAction: "pan-y" }}
                                            onTouchStart={(event) =>
                                                handleImageTouchStart(activeListing.id, event)
                                            }
                                            onTouchEnd={(event) =>
                                                handleImageTouchEnd(
                                                    activeListing.id,
                                                    galleryMedia.length,
                                                    event
                                                )
                                            }
                                            onTouchCancel={() =>
                                                handleImageTouchCancel(activeListing.id)
                                            }
                                        >
                                            <div
                                                className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                                style={{
                                                    transform: `translateX(-${activeImageIndex * 100}%)`,
                                                }}
                                            >
                                                {galleryMedia.map((media, mediaIndex) => (
                                                    <div
                                                        key={
                                                            media.id ||
                                                            `${activeListing.id}-media-${mediaIndex}`
                                                        }
                                                        className="relative h-full w-full shrink-0"
                                                    >
                                                        <Image
                                                            src={getMediaUrl(media.url)}
                                                            alt=""
                                                            fill
                                                            className="object-cover"
                                                            sizes="(max-width: 768px) 100vw, 300px"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-400">
                                            Görsel yok
                                        </div>
                                    )}

                                    {galleryMedia.length > 1 && (
                                        <div className="absolute bottom-3 right-3 z-10 flex items-center overflow-hidden rounded-lg border border-slate-200/90 bg-white/95 shadow-[0_4px_14px_rgba(15,23,42,0.18)] backdrop-blur-[2px]">
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    updateImageIndex(
                                                        activeListing.id,
                                                        galleryMedia.length,
                                                        "prev"
                                                    );
                                                }}
                                                className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                                                aria-label="Önceki görsel"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    updateImageIndex(
                                                        activeListing.id,
                                                        galleryMedia.length,
                                                        "next"
                                                    );
                                                }}
                                                className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-100"
                                                aria-label="Sonraki görsel"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={`/${locale}/ilan/${activeListing.slug}`}
                                    className="contents"
                                >
                                    <div className="flex cursor-pointer flex-col justify-between border-r border-gray-100 p-5">
                                        <div>
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                                    {getPropertyTypeLabel(activeListing.type, locale)}
                                                </span>
                                                <span className="rounded bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                                                    {getSaleTypeLabel(activeListing.saleType, locale)}
                                                </span>
                                                {activeListing.citizenshipEligible && (
                                                    <span className="rounded bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                                                        Vatandaşlık
                                                    </span>
                                                )}
                                                {activeListing.residenceEligible && (
                                                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                                                        İkamet
                                                    </span>
                                                )}
                                            </div>

                                            <h2 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-orange-500">
                                                {getListingTitle(activeListing, locale)}
                                            </h2>

                                            <p className="mb-3 flex items-center gap-1 text-sm text-gray-400">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {buildLocationLabel(activeListing) || "Konum belirtilmedi"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {truncateText(
                                                    getListingDescription(activeListing, locale),
                                                    190
                                                )}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatArea(activeListing.area).replace(" m²", "")}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    m<sup>2</sup>
                                                </span>
                                            </div>

                                            {(activeListing.rooms || activeListing.bedrooms) && (
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {activeListing.rooms || activeListing.bedrooms}
                                                    </span>
                                                    <span className="text-xs text-gray-400">oda</span>
                                                </div>
                                            )}

                                            {activeListing.bathrooms && (
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {activeListing.bathrooms}
                                                    </span>
                                                    <span className="text-xs text-gray-400">banyo</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex cursor-pointer items-center justify-between gap-3 bg-gray-50 p-5 md:flex-col md:items-stretch md:justify-between">
                                        <div className="min-w-0 text-left md:text-right">
                                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                                                {formatPrice(
                                                    activeListing.price,
                                                    activeListing.currency
                                                )}
                                            </p>
                                            {activeListing.saleType === "RENT" && (
                                                <p className="text-xs text-gray-400">/ ay</p>
                                            )}
                                        </div>

                                        <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 md:mt-4 md:w-full md:gap-2 md:px-5 md:py-2.5 md:text-sm">
                                            İncele
                                            <span aria-hidden="true">{"->"}</span>
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </article>
                    </div>
                )}

                {!isLoading && mapListings.length === 0 && !error && (
                    <div className="absolute bottom-4 left-1/2 z-[1250] w-[92%] max-w-xl -translate-x-1/2">
                        <div className="rounded-xl border border-white/60 bg-white/90 px-4 py-3 text-sm text-gray-600 shadow">
                            Haritada gösterilecek koordinatlı ilan bulunamadı.
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 z-[1300] flex items-center justify-center bg-slate-900/20 backdrop-blur-[1px]">
                        <div className="rounded-xl border border-white/60 bg-white/92 px-5 py-3 shadow-lg">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                İlanlar yükleniyor...
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-x-4 bottom-4 z-[1300] sm:inset-x-auto sm:left-1/2 sm:w-[92%] sm:max-w-xl sm:-translate-x-1/2">
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow">
                            {error}
                        </div>
                    </div>
                )}
            </section>

            <div
                className={cn(
                    "fixed inset-0 z-[2000]",
                    isFilterOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                <button
                    type="button"
                    aria-label="Filtre panelini kapat"
                    onClick={() => setIsFilterOpen(false)}
                    className={cn(
                        "absolute inset-0 bg-slate-900/45 transition-opacity duration-300",
                        isFilterOpen ? "opacity-100" : "opacity-0"
                    )}
                />

                <aside
                    aria-modal="true"
                    role="dialog"
                    className={cn(
                        "absolute inset-x-0 bottom-0 flex max-h-[82vh] flex-col overflow-hidden rounded-t-2xl border-t border-gray-200 bg-white shadow-[0_-14px_30px_rgba(15,23,42,0.24)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:inset-x-auto md:bottom-auto md:right-0 md:top-0 md:h-full md:max-h-none md:w-full md:max-w-[340px] md:rounded-none md:border-l md:border-t-0 md:shadow-2xl",
                        isFilterOpen
                            ? "translate-y-0 md:translate-x-0"
                            : "translate-y-full md:translate-x-full md:translate-y-0"
                    )}
                >
                    <div className="border-b border-gray-200 px-5 pb-4 pt-2 md:py-4">
                        <span className="mx-auto mb-2 block h-1.5 w-12 rounded-full bg-gray-300 md:hidden" />
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-900">Filtreler</h2>
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                                aria-label="Kapat"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                        <div className="mb-6">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Satış Tipi
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {saleTypes.map((item) => {
                                    const isActive = filters.saleType === item.value;
                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() =>
                                                setFilters((previous) => ({
                                                    ...previous,
                                                    saleType: isActive
                                                        ? undefined
                                                        : item.value,
                                                }))
                                            }
                                            className={cn(
                                                "rounded-lg border px-3 py-2 text-sm font-medium transition",
                                                isActive
                                                    ? "border-orange-500 bg-orange-50 text-orange-700"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Emlak Tipi
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {propertyTypes.map((item) => {
                                    const isActive = filters.types.includes(item.value);
                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => toggleType(item.value)}
                                            className={cn(
                                                "rounded-lg border px-3 py-2 text-sm font-medium transition",
                                                isActive
                                                    ? "border-orange-500 bg-orange-50 text-orange-700"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                            )}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Konum
                            </h3>
                            <div className="space-y-2">
                                <InlineDropdown
                                    options={[
                                        { value: "", label: "Tüm Şehirler" },
                                        ...cityOptions.map((city) => ({
                                            value: city,
                                            label: city,
                                        })),
                                    ]}
                                    value={filters.city}
                                    onChange={(city) =>
                                        setFilters((previous) => ({
                                            ...previous,
                                            city,
                                            district: "",
                                            neighborhood: "",
                                        }))
                                    }
                                    placeholder="Şehir seçin"
                                />

                                <InlineDropdown
                                    options={[
                                        { value: "", label: "Tüm İlçeler" },
                                        ...districtOptions.map((district) => ({
                                            value: district,
                                            label: district,
                                        })),
                                    ]}
                                    value={filters.district}
                                    onChange={(district) =>
                                        setFilters((previous) => ({
                                            ...previous,
                                            district,
                                            neighborhood: "",
                                        }))
                                    }
                                    placeholder="İlçe seçin"
                                    disabled={!filters.city}
                                />

                                <InlineDropdown
                                    options={[
                                        { value: "", label: "Tüm Mahalleler" },
                                        ...neighborhoodOptions.map((neighborhood) => ({
                                            value: neighborhood,
                                            label: neighborhood,
                                        })),
                                    ]}
                                    value={filters.neighborhood}
                                    onChange={(neighborhood) =>
                                        setFilters((previous) => ({
                                            ...previous,
                                            neighborhood,
                                        }))
                                    }
                                    placeholder="Mahalle seçin"
                                    disabled={!filters.city || !filters.district}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Fiyat Aralığı
                            </h3>
                            <InlineRangeSlider
                                min={PRICE_MIN}
                                max={PRICE_MAX}
                                step={PRICE_STEP}
                                value={priceRange}
                                onChange={([minValue, maxValue]) =>
                                    setFilters((previous) => ({
                                        ...previous,
                                        minPrice: minValue,
                                        maxPrice: maxValue,
                                    }))
                                }
                            />
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={filters.minPrice ?? ""}
                                    onChange={handleMinPriceInput}
                                    placeholder="Min"
                                    min={PRICE_MIN}
                                    max={PRICE_MAX}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                                />
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={filters.maxPrice ?? ""}
                                    onChange={handleMaxPriceInput}
                                    placeholder="Max"
                                    min={PRICE_MIN}
                                    max={PRICE_MAX}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                m² Aralığı
                            </h3>
                            <InlineRangeSlider
                                min={AREA_MIN}
                                max={AREA_MAX}
                                step={AREA_STEP}
                                value={areaRange}
                                onChange={([minValue, maxValue]) =>
                                    setFilters((previous) => ({
                                        ...previous,
                                        minArea: minValue,
                                        maxArea: maxValue,
                                    }))
                                }
                            />
                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={filters.minArea ?? ""}
                                    onChange={handleMinAreaInput}
                                    placeholder="Min"
                                    min={AREA_MIN}
                                    max={AREA_MAX}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                                />
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={filters.maxArea ?? ""}
                                    onChange={handleMaxAreaInput}
                                    placeholder="Max"
                                    min={AREA_MIN}
                                    max={AREA_MAX}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Oda Sayısı
                            </h3>
                            <div className="grid grid-cols-4 gap-1.5">
                                {roomOptions.map((room) => {
                                    const isActive = filters.rooms.includes(room);
                                    return (
                                        <button
                                            key={room}
                                            type="button"
                                            onClick={() => toggleRoom(room)}
                                            className={cn(
                                                "rounded-md px-2 py-1.5 text-xs font-medium transition",
                                                isActive
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            )}
                                        >
                                            {room}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-gray-200 px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-4 md:py-4">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex w-1/2 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Temizle
                        </button>
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="inline-flex w-1/2 items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Uygula
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function parseNumber(value: string | null) {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function clampNumber(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

function normalizeRange(
    minValue: number | undefined,
    maxValue: number | undefined,
    minLimit: number,
    maxLimit: number
): [number, number] {
    const normalizedMin = clampNumber(minValue ?? minLimit, minLimit, maxLimit);
    const normalizedMax = clampNumber(maxValue ?? maxLimit, minLimit, maxLimit);

    if (normalizedMin <= normalizedMax) {
        return [normalizedMin, normalizedMax];
    }

    return [normalizedMax, normalizedMax];
}

function parseMultiParam(params: URLSearchParams, key: string) {
    return params
        .getAll(key)
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean);
}

function readInitialFilters(searchParams: URLSearchParams): FiltersState {
    const validTypeValues = new Set<string>(propertyTypes.map((type) => type.value));
    const validSaleTypeValues = new Set<string>(saleTypes.map((item) => item.value));
    const validRoomValues = new Set(roomOptions);

    const rawTypes = parseMultiParam(searchParams, "type");
    const rawSaleType = searchParams.get("saleType")?.toUpperCase();
    const rawRooms = parseMultiParam(searchParams, "rooms");

    return {
        types: rawTypes.filter((value) => validTypeValues.has(value)),
        saleType:
            rawSaleType && validSaleTypeValues.has(rawSaleType)
                ? (rawSaleType as SaleType)
                : undefined,
        city: searchParams.get("city") || "",
        district: searchParams.get("district") || "",
        neighborhood: searchParams.get("neighborhood") || "",
        minPrice: parseNumber(searchParams.get("minPrice")),
        maxPrice: parseNumber(searchParams.get("maxPrice")),
        minArea: parseNumber(searchParams.get("minArea")),
        maxArea: parseNumber(searchParams.get("maxArea")),
        rooms: rawRooms.filter((room): room is (typeof roomOptions)[number] =>
            validRoomValues.has(room as (typeof roomOptions)[number])
        ),
    };
}

function buildLocationLabel(listing: Listing) {
    return [listing.neighborhood, listing.district, listing.city]
        .filter(Boolean)
        .join(", ");
}

function getListingTitle(listing: Listing, locale: string) {
    const requested = listing.translations.find(
        (translation) => translation.locale === locale
    );
    const fallback = listing.translations.find(
        (translation) => translation.locale === "tr"
    );
    return requested?.title || fallback?.title || "Başlık belirtilmedi";
}

function getListingDescription(listing: Listing, locale: string) {
    const requested = listing.translations.find(
        (translation) => translation.locale === locale
    );
    const fallback = listing.translations.find(
        (translation) => translation.locale === "tr"
    );
    return requested?.description || fallback?.description || "Açıklama bulunamadı.";
}

function normalizeCoordinate(value: Listing["latitude"]): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }
    const parsed = Number.parseFloat(String(value).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
}
