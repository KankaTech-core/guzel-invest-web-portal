"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type TouchEvent as ReactTouchEvent,
} from "react";
import {
    ArrowUpDown,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
import {
    formatArea,
    formatPrice,
    getMediaUrl,
    getPropertyTypeLabel,
    getSaleTypeLabel,
} from "@/lib/utils";
import {
    getFriendlyFetchErrorMessage,
    isAbortFetchError,
    parseApiErrorMessage,
} from "@/lib/fetch-error";

interface PortfolioClientProps {
    locale: string;
}

interface ListingTranslation {
    locale: string;
    title: string;
    description: string;
}

interface ListingMedia {
    id?: string;
    url: string;
    isCover: boolean;
}

interface ListingTag {
    id: string;
    tag: {
        name: string;
        color: string;
    };
}

interface Listing {
    id: string;
    slug: string;
    type: string;
    saleType: string;
    price: number | string;
    currency: string;
    city: string;
    district: string;
    neighborhood: string | null;
    area: number;
    rooms: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    citizenshipEligible: boolean;
    residenceEligible: boolean;
    updatedAt: string;
    translations: ListingTranslation[];
    media: ListingMedia[];
    tags: ListingTag[];
    _count?: {
        media: number;
    };
}

interface LocationsPayload {
    cities?: string[];
    districts?: string[];
    neighborhoods?: string[];
}

type SortOption = "newest" | "priceAsc" | "priceDesc" | "areaDesc";

interface FiltersState {
    types: string[];
    saleType?: string;
    city: string;
    district: string;
    neighborhood: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    rooms: string[];
    sort: SortOption;
}

type MobilePanel = "filter" | "sort";

const REFRESH_INTERVAL_MS = 5000;
const DEFAULT_SORT: SortOption = "newest";
const PRICE_MIN = 0;
const PRICE_MAX = 2000000;
const PRICE_STEP = 10000;
const AREA_MIN = 0;
const AREA_MAX = 500;
const AREA_STEP = 5;
const IMAGE_SWIPE_THRESHOLD_PX = 48;
const MOBILE_DRAWER_ANIMATION_MS = 280;
const DESCRIPTION_PREVIEW_WORD_COUNT = 35;

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

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "En Yeni" },
    { value: "priceAsc", label: "Fiyat (Artan)" },
    { value: "priceDesc", label: "Fiyat (Azalan)" },
    { value: "areaDesc", label: "m² (Büyükten Küçüğe)" },
];

interface InlineRangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
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
    widthClassName?: string;
}

function InlineDropdown({
    options,
    value,
    onChange,
    placeholder,
    disabled = false,
    widthClassName = "w-full",
}: InlineDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

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
        <div ref={rootRef} className={`relative ${widthClassName}`}>
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((previous) => !previous)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm outline-none transition ring-orange-500 focus:ring-2 ${
                    disabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : "cursor-pointer border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                }`}
            >
                <span className={selectedOption ? "" : "text-gray-400"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
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
                                        className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm transition ${
                                            isActive
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <span>{option.label}</span>
                                        {isActive ? <Check className="h-4 w-4" /> : null}
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

function parseNumber(value: string | null) {
    if (!value) {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMultiParam(params: URLSearchParams, key: string) {
    const values = params.getAll(key);

    return values
        .flatMap((value) => value.split(","))
        .map((value) => value.trim())
        .filter(Boolean);
}

function readInitialFilters(searchParams: URLSearchParams): FiltersState {
    const validTypeValues = new Set<string>(propertyTypes.map((type) => type.value));
    const validSaleTypeValues = new Set<string>(saleTypes.map((type) => type.value));
    const validRoomValues = new Set(roomOptions);

    const rawTypes = parseMultiParam(searchParams, "type");
    const rawSaleType = searchParams.get("saleType")?.toUpperCase();
    const rawCity = searchParams.get("city") || "";
    const rawDistrict = searchParams.get("district") || "";
    const rawNeighborhood = searchParams.get("neighborhood") || "";
    const rawRooms = parseMultiParam(searchParams, "rooms");
    const rawSort = searchParams.get("sort") as SortOption | null;

    const selectedTypes = rawTypes.filter((value) => validTypeValues.has(value));
    const selectedSaleType = rawSaleType && validSaleTypeValues.has(rawSaleType)
        ? rawSaleType
        : undefined;

    const selectedRooms = rawRooms.filter((value): value is (typeof roomOptions)[number] =>
        validRoomValues.has(value as (typeof roomOptions)[number])
    );

    const selectedSort = sortOptions.some((option) => option.value === rawSort)
        ? (rawSort as SortOption)
        : DEFAULT_SORT;

    return {
        types: selectedTypes,
        saleType: selectedSaleType,
        city: rawCity,
        district: rawDistrict,
        neighborhood: rawNeighborhood,
        minPrice: parseNumber(searchParams.get("minPrice")),
        maxPrice: parseNumber(searchParams.get("maxPrice")),
        minArea: parseNumber(searchParams.get("minArea")),
        maxArea: parseNumber(searchParams.get("maxArea")),
        rooms: selectedRooms,
        sort: selectedSort,
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

function getWordCount(text: string) {
    const normalizedText = text.trim();
    if (!normalizedText) {
        return 0;
    }

    return normalizedText.split(/\s+/).length;
}

function truncateWords(text: string, maxWords: number) {
    const normalizedText = text.trim();
    if (!normalizedText) {
        return text;
    }

    const words = normalizedText.split(/\s+/);
    if (words.length <= maxWords) {
        return text;
    }

    return `${words.slice(0, maxWords).join(" ")}...`;
}

export function PortfolioClient({ locale }: PortfolioClientProps) {
    const searchParams = useSearchParams();
    const searchParamsKey = searchParams.toString();
    const mapHref = useMemo(
        () =>
            searchParamsKey
                ? `/${locale}/harita?${searchParamsKey}`
                : `/${locale}/harita`,
        [locale, searchParamsKey]
    );

    const [filters, setFilters] = useState<FiltersState>(() =>
        readInitialFilters(new URLSearchParams(searchParamsKey))
    );

    const [listings, setListings] = useState<Listing[]>([]);
    const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
    const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
    const [activeMobilePanel, setActiveMobilePanel] = useState<MobilePanel | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);

    const abortRef = useRef<AbortController | null>(null);
    const snapshotRef = useRef("");
    const hasInitializedRef = useRef(false);
    const swipeStartXRef = useRef<Record<string, number>>({});
    const mobileDrawerOpenTimerRef = useRef<number | null>(null);
    const mobileDrawerCloseTimerRef = useRef<number | null>(null);

    useEffect(() => {
        const nextFilters = readInitialFilters(new URLSearchParams(searchParamsKey));
        setFilters(nextFilters);
    }, [searchParamsKey]);

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
            filters.neighborhood && !availableNeighborhoods.includes(filters.neighborhood)
                ? [filters.neighborhood, ...availableNeighborhoods]
                : availableNeighborhoods,
        [availableNeighborhoods, filters.neighborhood]
    );

    useEffect(() => {
        let active = true;

        const loadCities = async () => {
            try {
                const response = await fetch("/api/public/locations", {
                    cache: "force-cache",
                });

                if (!response.ok) {
                    return;
                }

                const payload = (await response.json()) as LocationsPayload;
                if (!active) {
                    return;
                }

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

                if (!response.ok) {
                    return;
                }

                const payload = (await response.json()) as LocationsPayload;
                if (!active) {
                    return;
                }

                const districts = payload.districts || [];
                setAvailableDistricts(districts);

                setFilters((previous) => {
                    if (previous.city !== filters.city) {
                        return previous;
                    }

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

                if (!response.ok) {
                    return;
                }

                const payload = (await response.json()) as LocationsPayload;
                if (!active) {
                    return;
                }

                const neighborhoods = payload.neighborhoods || [];
                setAvailableNeighborhoods(neighborhoods);

                setFilters((previous) => {
                    if (
                        previous.city !== filters.city ||
                        previous.district !== filters.district
                    ) {
                        return previous;
                    }

                    if (!previous.neighborhood || neighborhoods.includes(previous.neighborhood)) {
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

    const priceRange = useMemo<[number, number]>(() => {
        const minPrice = filters.minPrice ?? PRICE_MIN;
        const maxPrice = filters.maxPrice ?? PRICE_MAX;
        const boundedMin = Math.max(PRICE_MIN, Math.min(minPrice, PRICE_MAX));
        const boundedMax = Math.max(PRICE_MIN, Math.min(maxPrice, PRICE_MAX));
        return boundedMin <= boundedMax
            ? [boundedMin, boundedMax]
            : [boundedMax, boundedMax];
    }, [filters.minPrice, filters.maxPrice]);

    const areaRange = useMemo<[number, number]>(() => {
        const minArea = filters.minArea ?? AREA_MIN;
        const maxArea = filters.maxArea ?? AREA_MAX;
        const boundedMin = Math.max(AREA_MIN, Math.min(minArea, AREA_MAX));
        const boundedMax = Math.max(AREA_MIN, Math.min(maxArea, AREA_MAX));
        return boundedMin <= boundedMax
            ? [boundedMin, boundedMax]
            : [boundedMax, boundedMax];
    }, [filters.minArea, filters.maxArea]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams({ locale });

        filters.types.forEach((type) => params.append("type", type));
        filters.rooms.forEach((room) => params.append("rooms", room));

        if (filters.saleType) {
            params.set("saleType", filters.saleType);
        }
        if (filters.city) {
            params.set("city", filters.city);
        }
        if (filters.district) {
            params.set("district", filters.district);
        }
        if (filters.neighborhood.trim()) {
            params.set("neighborhood", filters.neighborhood.trim());
        }
        if (filters.minPrice !== undefined) {
            params.set("minPrice", String(filters.minPrice));
        }
        if (filters.maxPrice !== undefined) {
            params.set("maxPrice", String(filters.maxPrice));
        }
        if (filters.minArea !== undefined) {
            params.set("minArea", String(filters.minArea));
        }
        if (filters.maxArea !== undefined) {
            params.set("maxArea", String(filters.maxArea));
        }
        if (filters.sort !== DEFAULT_SORT) {
            params.set("sort", filters.sort);
        }

        return params.toString();
    }, [filters, locale]);

    const fetchListings = useCallback(
        async (mode: "initial" | "background" = "background") => {
            const controller = new AbortController();
            abortRef.current?.abort();
            abortRef.current = controller;

            if (mode === "initial") {
                setIsLoading(true);
            }

            try {
                const response = await fetch(`/api/public/listings?${queryString}`, {
                    signal: controller.signal,
                    cache: "no-store",
                    headers: {
                        "Cache-Control": "no-store",
                    },
                });

                if (!response.ok) {
                    const apiError = await parseApiErrorMessage(
                        response,
                        "İlanlar alınamadı."
                    );
                    throw new Error(apiError);
                }

                const data = (await response.json()) as { listings: Listing[] };
                const nextListings = Array.isArray(data.listings) ? data.listings : [];
                const nextSnapshot = nextListings
                    .map((listing) => {
                        const mediaSignature = listing.media.map((media) => media.url).join(",");
                        const tagSignature = listing.tags.map((item) => item.tag.name).join(",");
                        return `${listing.id}:${listing.updatedAt}:${mediaSignature}:${tagSignature}`;
                    })
                    .join("|");

                if (nextSnapshot !== snapshotRef.current) {
                    setListings(nextListings);
                    snapshotRef.current = nextSnapshot;
                }

                setError("");
            } catch (fetchError) {
                if (isAbortFetchError(fetchError)) {
                    return;
                }
                setError(
                    getFriendlyFetchErrorMessage(
                        fetchError,
                        "İlanlar yenilenirken bir hata oluştu.",
                        {
                            networkMessage:
                                "İlanlar yenilenirken bağlantı kesildi (Load failed). İnternet/proxy bağlantınızı kontrol edip tekrar deneyin.",
                        }
                    )
                );
            } finally {
                if (mode === "initial") {
                    setIsLoading(false);
                }
            }
        },
        [queryString]
    );

    useEffect(() => {
        const mode = hasInitializedRef.current ? "background" : "initial";
        void fetchListings(mode);
        hasInitializedRef.current = true;

        const intervalId = window.setInterval(() => {
            if (document.visibilityState === "visible") {
                void fetchListings("background");
            }
        }, REFRESH_INTERVAL_MS);

        const onFocus = () => {
            void fetchListings("background");
        };

        const onVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                void fetchListings("background");
            }
        };

        window.addEventListener("focus", onFocus);
        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("focus", onFocus);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            abortRef.current?.abort();
        };
    }, [fetchListings]);

    const typeCounts = useMemo(() => {
        return listings.reduce<Record<string, number>>((accumulator, listing) => {
            accumulator[listing.type] = (accumulator[listing.type] || 0) + 1;
            return accumulator;
        }, {});
    }, [listings]);

    useEffect(() => {
        setActiveImageIndexes((previous) => {
            const next: Record<string, number> = {};

            listings.forEach((listing) => {
                const maxIndex = Math.max(0, Math.min(3, listing.media.length - 1));
                const current = previous[listing.id] ?? 0;
                next[listing.id] = Math.min(current, maxIndex);
            });

            return next;
        });
    }, [listings]);

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

    const clearFilters = () => {
        setFilters((previous) => ({
            types: [],
            saleType: undefined,
            city: "",
            district: "",
            neighborhood: "",
            minPrice: undefined,
            maxPrice: undefined,
            minArea: undefined,
            maxArea: undefined,
            rooms: [],
            sort: previous.sort,
        }));
    };

    const updateImageIndex = (
        listingId: string,
        mediaLength: number,
        direction: "prev" | "next"
    ) => {
        if (mediaLength <= 1) {
            return;
        }

        setActiveImageIndexes((previous) => {
            const currentIndex = previous[listingId] ?? 0;
            const maxIndex = Math.max(0, Math.min(3, mediaLength - 1));
            const nextIndex =
                direction === "next"
                    ? currentIndex >= maxIndex
                        ? 0
                        : currentIndex + 1
                    : currentIndex <= 0
                        ? maxIndex
                        : currentIndex - 1;

            return {
                ...previous,
                [listingId]: nextIndex,
            };
        });
    };

    const clearMobileDrawerTimers = () => {
        if (mobileDrawerOpenTimerRef.current !== null) {
            window.clearTimeout(mobileDrawerOpenTimerRef.current);
            mobileDrawerOpenTimerRef.current = null;
        }

        if (mobileDrawerCloseTimerRef.current !== null) {
            window.clearTimeout(mobileDrawerCloseTimerRef.current);
            mobileDrawerCloseTimerRef.current = null;
        }
    };

    const toggleMobilePanel = (panel: MobilePanel) => {
        clearMobileDrawerTimers();

        if (activeMobilePanel === panel && isMobileDrawerOpen) {
            setIsMobileDrawerOpen(false);
            return;
        }

        if (activeMobilePanel && isMobileDrawerOpen && activeMobilePanel !== panel) {
            setActiveMobilePanel(panel);
            return;
        }

        setActiveMobilePanel(panel);
        setIsMobileDrawerOpen(false);
        mobileDrawerOpenTimerRef.current = window.setTimeout(() => {
            setIsMobileDrawerOpen(true);
        }, 16);
    };

    const closeMobilePanel = () => {
        clearMobileDrawerTimers();
        setIsMobileDrawerOpen(false);
    };

    const handleApplyFilters = (closeAfterApply = false) => {
        void fetchListings("background");
        if (closeAfterApply) {
            closeMobilePanel();
        }
    };

    useEffect(() => {
        if (!activeMobilePanel || isMobileDrawerOpen) {
            return;
        }

        mobileDrawerCloseTimerRef.current = window.setTimeout(() => {
            setActiveMobilePanel(null);
        }, MOBILE_DRAWER_ANIMATION_MS);

        return () => {
            if (mobileDrawerCloseTimerRef.current !== null) {
                window.clearTimeout(mobileDrawerCloseTimerRef.current);
                mobileDrawerCloseTimerRef.current = null;
            }
        };
    }, [activeMobilePanel, isMobileDrawerOpen]);

    useEffect(() => {
        return () => {
            clearMobileDrawerTimers();
        };
    }, []);

    useEffect(() => {
        if (!activeMobilePanel) {
            return;
        }

        const previousBodyOverflow = document.body.style.overflow;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, [activeMobilePanel]);

    const handleImageTouchStart = (
        listingId: string,
        event: ReactTouchEvent<HTMLDivElement>
    ) => {
        const point = event.touches[0];
        if (!point) {
            return;
        }

        swipeStartXRef.current[listingId] = point.clientX;
    };

    const handleImageTouchEnd = (
        listingId: string,
        mediaLength: number,
        event: ReactTouchEvent<HTMLDivElement>
    ) => {
        if (mediaLength <= 1) {
            return;
        }

        const startX = swipeStartXRef.current[listingId];
        const point = event.changedTouches[0];

        if (startX === undefined || !point) {
            return;
        }

        const deltaX = point.clientX - startX;
        delete swipeStartXRef.current[listingId];

        if (Math.abs(deltaX) < IMAGE_SWIPE_THRESHOLD_PX) {
            return;
        }

        updateImageIndex(listingId, mediaLength, deltaX < 0 ? "next" : "prev");
    };

    const handleImageTouchCancel = (listingId: string) => {
        delete swipeStartXRef.current[listingId];
    };

    const monoStyle = { fontFamily: "var(--font-ibm-plex-mono)" };

    const renderFilterPanelContent = (isMobile: boolean) => (
        <>
            <div className={`mb-5 flex ${isMobile ? "justify-end" : "items-center justify-between"}`}>
                {!isMobile && <h3 className="font-semibold text-gray-900">Filtreler</h3>}
                <button
                    type="button"
                    onClick={clearFilters}
                    className="cursor-pointer text-xs font-semibold text-orange-500 transition hover:text-orange-600"
                >
                    Temizle
                </button>
            </div>

            <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    İşlem Turu
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {saleTypes.map((saleType) => (
                        <button
                            key={saleType.value}
                            type="button"
                            onClick={() =>
                                setFilters((previous) => ({
                                    ...previous,
                                    saleType:
                                        previous.saleType === saleType.value
                                            ? undefined
                                            : saleType.value,
                                }))
                            }
                            className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                filters.saleType === saleType.value
                                    ? "border-orange-500 bg-orange-500 text-white"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                        >
                            {saleType.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Kategori
                </h4>
                <div className="space-y-1.5">
                    {propertyTypes.map((type) => (
                        <label
                            key={type.value}
                            className="group flex cursor-pointer items-center justify-between rounded-lg p-2 transition hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.types.includes(type.value)}
                                    onChange={() => toggleType(type.value)}
                                    className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">{type.label}</span>
                            </div>
                            <span
                                className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-400"
                                style={monoStyle}
                            >
                                {typeCounts[type.value] || 0}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Fiyat Aralığı
                </h4>
                <div className="mb-3 px-1">
                    <InlineRangeSlider
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={priceRange}
                        onChange={([nextMin, nextMax]) =>
                            setFilters((previous) => ({
                                ...previous,
                                minPrice: nextMin === PRICE_MIN ? undefined : nextMin,
                                maxPrice: nextMax === PRICE_MAX ? undefined : nextMax,
                            }))
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.minPrice ?? ""}
                        onChange={(event) =>
                            setFilters((previous) => ({
                                ...previous,
                                minPrice: event.target.value
                                    ? Math.max(
                                        PRICE_MIN,
                                        Math.min(PRICE_MAX, Number(event.target.value))
                                    )
                                    : undefined,
                            }))
                        }
                        placeholder="Min EUR"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                        style={monoStyle}
                    />
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.maxPrice ?? ""}
                        onChange={(event) =>
                            setFilters((previous) => ({
                                ...previous,
                                maxPrice: event.target.value
                                    ? Math.max(
                                        PRICE_MIN,
                                        Math.min(PRICE_MAX, Number(event.target.value))
                                    )
                                    : undefined,
                            }))
                        }
                        placeholder="Max EUR"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                        style={monoStyle}
                    />
                </div>
            </div>

            <div className="mb-6 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Konum
                </h4>
                <InlineDropdown
                    value={filters.city}
                    onChange={(nextCity) =>
                        setFilters((previous) => ({
                            ...previous,
                            city: nextCity,
                            district: "",
                            neighborhood: "",
                        }))
                    }
                    placeholder="Tüm İller"
                    options={[
                        { value: "", label: "Tüm İller" },
                        ...cityOptions.map((city) => ({
                            value: city,
                            label: city,
                        })),
                    ]}
                />

                <InlineDropdown
                    value={filters.district}
                    onChange={(district) =>
                        setFilters((previous) => ({
                            ...previous,
                            district,
                            neighborhood: "",
                        }))
                    }
                    disabled={!filters.city}
                    placeholder="Tüm İlçeler"
                    options={[
                        { value: "", label: "Tüm İlçeler" },
                        ...districtOptions.map((district) => ({
                            value: district,
                            label: district,
                        })),
                    ]}
                />

                <InlineDropdown
                    value={filters.neighborhood}
                    onChange={(neighborhood) =>
                        setFilters((previous) => ({
                            ...previous,
                            neighborhood,
                        }))
                    }
                    disabled={!filters.city || !filters.district}
                    placeholder="Tüm Mahalleler"
                    options={[
                        { value: "", label: "Tüm Mahalleler" },
                        ...neighborhoodOptions.map((neighborhood) => ({
                            value: neighborhood,
                            label: neighborhood,
                        })),
                    ]}
                />
            </div>

            <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Alan (<span className="normal-case">m<sup>2</sup></span>)
                </h4>
                <div className="mb-3 px-1">
                    <InlineRangeSlider
                        min={AREA_MIN}
                        max={AREA_MAX}
                        step={AREA_STEP}
                        value={areaRange}
                        onChange={([nextMin, nextMax]) =>
                            setFilters((previous) => ({
                                ...previous,
                                minArea: nextMin === AREA_MIN ? undefined : nextMin,
                                maxArea: nextMax === AREA_MAX ? undefined : nextMax,
                            }))
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.minArea ?? ""}
                        onChange={(event) =>
                            setFilters((previous) => ({
                                ...previous,
                                minArea: event.target.value
                                    ? Math.max(
                                        AREA_MIN,
                                        Math.min(AREA_MAX, Number(event.target.value))
                                    )
                                    : undefined,
                            }))
                        }
                        placeholder="Min m²"
                        min={AREA_MIN}
                        max={AREA_MAX}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                        style={monoStyle}
                    />
                    <input
                        type="number"
                        inputMode="numeric"
                        value={filters.maxArea ?? ""}
                        onChange={(event) =>
                            setFilters((previous) => ({
                                ...previous,
                                maxArea: event.target.value
                                    ? Math.max(
                                        AREA_MIN,
                                        Math.min(AREA_MAX, Number(event.target.value))
                                    )
                                    : undefined,
                            }))
                        }
                        placeholder="Max m²"
                        min={AREA_MIN}
                        max={AREA_MAX}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none ring-orange-500 focus:ring-2"
                        style={monoStyle}
                    />
                </div>
            </div>

            <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Oda Sayısı
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                    {roomOptions.map((room) => (
                        <button
                            key={room}
                            type="button"
                            onClick={() => toggleRoom(room)}
                            className={`cursor-pointer rounded-md px-2 py-1.5 text-xs font-medium transition ${
                                filters.rooms.includes(room)
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {room}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="button"
                onClick={() => handleApplyFilters(isMobile)}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
                <SlidersHorizontal className="h-4 w-4" />
                Filtreleri Uygula
            </button>
        </>
    );

    const renderSortDrawerContent = () => (
        <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sıralama
            </p>
            <div className="space-y-2">
                {sortOptions.map((option) => {
                    const isActive = filters.sort === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                setFilters((previous) => ({
                                    ...previous,
                                    sort: option.value,
                                }));
                                closeMobilePanel();
                            }}
                            className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                                isActive
                                    ? "border-orange-500 bg-orange-50 text-orange-700"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            <span>{option.label}</span>
                            {isActive ? <Check className="h-4 w-4" /> : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                    <p className="text-sm font-medium text-gray-500">İlanlar yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error && listings.length === 0) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center">
                    <p className="font-semibold text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="max-w-[1400px] mx-auto px-4 pb-28 sm:px-6 sm:pb-32 lg:px-8 lg:pb-16"
            style={{ fontFamily: "var(--font-ibm-plex-sans)" }}
        >
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-xs text-gray-400" style={monoStyle}>
                        <span>/</span>
                        <span className="text-gray-600">portföy</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Gayrimenkul Portföyü</h1>
                </div>

                <Link
                    href={mapHref}
                    className="group relative hidden w-[192px] aspect-video overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(30,40,57,0.22)] lg:block"
                >
                    <Image
                        src="/images/testimonials/portfolio-map-banner-image.webp"
                        alt="Harita görünümü arka planı"
                        fill
                        className="object-cover transition duration-300 ease-out group-hover:brightness-110 group-hover:saturate-110"
                        sizes="192px"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 transition-opacity duration-300 group-hover:from-white/10 group-hover:via-white/4 group-hover:to-transparent group-hover:opacity-100" />
                    <div className="relative z-10 flex h-full items-center justify-center p-2.5">
                        <span className="rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors duration-300 group-hover:bg-[#16202f]" style={{ backgroundColor: "#1E2839" }}>
                            Harita
                        </span>
                    </div>
                </Link>
            </div>

            <div className="mb-6 hidden rounded-xl border border-gray-200 bg-white p-4 lg:block">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-500">Filtreler:</span>
                        {filters.types.length === 0 ? (
                            <span className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                                Tüm Kategoriler
                            </span>
                        ) : (
                            filters.types.map((type) => {
                                const typeLabel = propertyTypes.find((option) => option.value === type)?.label || type;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleType(type)}
                                        className="cursor-pointer rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white"
                                    >
                                        {typeLabel}
                                    </button>
                                );
                            })
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <InlineDropdown
                            widthClassName="w-[220px]"
                            value={filters.sort}
                            onChange={(value) =>
                                setFilters((previous) => ({
                                    ...previous,
                                    sort: value as SortOption,
                                }))
                            }
                            placeholder="Sırala"
                            options={sortOptions.map((option) => ({
                                value: option.value,
                                label: `Sırala: ${option.label}`,
                            }))}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-6 text-sm text-gray-500">
                Toplam sonuç:{" "}
                <span className="font-semibold text-gray-900" style={monoStyle}>
                    {listings.length}
                </span>{" "}
                ilan
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                <aside className="hidden h-fit rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-24 lg:block">
                    {renderFilterPanelContent(false)}
                </aside>

                <div className="space-y-4">
                    {error && listings.length > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                            {error}
                        </div>
                    )}

                    {listings.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
                            <Search className="mx-auto h-8 w-8 text-gray-300" />
                            <p className="mt-3 font-semibold text-gray-700">
                                Aradığınız kriterlere uygun ilan bulunamadı.
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Filtreleri temizleyip tekrar deneyebilirsiniz.
                            </p>
                        </div>
                    ) : (
                        listings.map((listing) => {
                            const title = getListingTitle(listing, locale);
                            const description = getListingDescription(listing, locale);
                            const isDescriptionLong =
                                getWordCount(description) > DESCRIPTION_PREVIEW_WORD_COUNT;
                            const isDescriptionExpanded = Boolean(expandedDescriptions[listing.id]);
                            const locationLabel = buildLocationLabel(listing);
                            const galleryMedia = listing.media.slice(0, 4);
                            const maxImageIndex = Math.max(0, galleryMedia.length - 1);
                            const activeImageIndex = Math.min(
                                activeImageIndexes[listing.id] ?? 0,
                                maxImageIndex
                            );
                            const sortedTags = [...listing.tags].sort((left, right) =>
                                left.tag.name.localeCompare(right.tag.name, "tr")
                            );
                            const visibleTags = sortedTags.slice(0, 4);
                            const hiddenTagCount = Math.max(0, sortedTags.length - visibleTags.length);

                            return (
                                <article
                                    key={listing.id}
                                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-orange-200 hover:shadow-lg"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_200px]">
                                        <div className="relative min-h-[220px] overflow-hidden bg-gray-100">
                                            {visibleTags.length > 0 && (
                                                <div className="absolute left-3 top-3 z-10 flex max-w-[86%] flex-wrap gap-1.5">
                                                    {visibleTags.map((item) => (
                                                        <span
                                                            key={item.id}
                                                            className="rounded-md border px-2 py-1 text-[10px] font-semibold text-white shadow-sm"
                                                            style={{
                                                                borderColor: item.tag.color,
                                                                backgroundColor: item.tag.color,
                                                            }}
                                                        >
                                                            {item.tag.name}
                                                        </span>
                                                    ))}
                                                    {hiddenTagCount > 0 && (
                                                        <span
                                                            className="rounded-md border border-white/80 bg-black/45 px-2 py-1 text-[10px] font-semibold text-white"
                                                            style={monoStyle}
                                                        >
                                                            +{hiddenTagCount}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {galleryMedia.length > 0 ? (
                                                <div
                                                    className="absolute inset-0 overflow-hidden"
                                                    style={{ touchAction: "pan-y" }}
                                                    onTouchStart={(event) =>
                                                        handleImageTouchStart(listing.id, event)
                                                    }
                                                    onTouchEnd={(event) =>
                                                        handleImageTouchEnd(
                                                            listing.id,
                                                            galleryMedia.length,
                                                            event
                                                        )
                                                    }
                                                    onTouchCancel={() =>
                                                        handleImageTouchCancel(listing.id)
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
                                                                    `${listing.id}-media-${mediaIndex}`
                                                                }
                                                                className="relative h-full w-full shrink-0"
                                                            >
                                                                <Image
                                                                    src={getMediaUrl(media.url)}
                                                                    alt={`${title} - ${mediaIndex + 1}`}
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
                                                                listing.id,
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
                                                                listing.id,
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
                                            href={`/${locale}/ilan/${listing.slug}`}
                                            className="contents"
                                        >
                                            <div className="flex cursor-pointer flex-col justify-between border-r border-gray-100 p-5">
                                                <div>
                                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                                        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                                            {getPropertyTypeLabel(listing.type, locale)}
                                                        </span>
                                                        <span className="rounded bg-orange-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                                                            {getSaleTypeLabel(listing.saleType, locale)}
                                                        </span>
                                                        {listing.citizenshipEligible && (
                                                            <span className="rounded bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                                                                Vatandaşlık
                                                            </span>
                                                        )}
                                                        {listing.residenceEligible && (
                                                            <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-700">
                                                                İkamet
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h2 className="mb-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-orange-500">
                                                        {title}
                                                    </h2>

                                                    <p className="mb-3 flex items-center gap-1 text-sm text-gray-400">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {locationLabel || "Konum belirtilmedi"}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {isDescriptionExpanded
                                                            ? description
                                                            : truncateWords(
                                                                  description,
                                                                  DESCRIPTION_PREVIEW_WORD_COUNT
                                                              )}
                                                    </p>
                                                    {isDescriptionLong && (
                                                        <span
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                setExpandedDescriptions((previous) => ({
                                                                    ...previous,
                                                                    [listing.id]: !previous[listing.id],
                                                                }));
                                                            }}
                                                            onKeyDown={(event) => {
                                                                if (
                                                                    event.key !== "Enter" &&
                                                                    event.key !== " "
                                                                ) {
                                                                    return;
                                                                }
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                setExpandedDescriptions((previous) => ({
                                                                    ...previous,
                                                                    [listing.id]: !previous[listing.id],
                                                                }));
                                                            }}
                                                            className="mt-1 inline-flex cursor-pointer text-xs font-semibold text-orange-600 transition hover:text-orange-700"
                                                            aria-expanded={isDescriptionExpanded}
                                                        >
                                                            {isDescriptionExpanded
                                                                ? "Daha az göster"
                                                                : "Devamını oku"}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4">
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-sm font-semibold text-gray-900" style={monoStyle}>
                                                            {formatArea(listing.area).replace(" m²", "")}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            m<sup>2</sup>
                                                        </span>
                                                    </div>

                                                    {(listing.rooms || listing.bedrooms) && (
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-sm font-semibold text-gray-900" style={monoStyle}>
                                                                {listing.rooms || listing.bedrooms}
                                                            </span>
                                                            <span className="text-xs text-gray-400">oda</span>
                                                        </div>
                                                    )}

                                                    {listing.bathrooms && (
                                                        <div className="flex items-baseline gap-1.5">
                                                            <span className="text-sm font-semibold text-gray-900" style={monoStyle}>
                                                                {listing.bathrooms}
                                                            </span>
                                                            <span className="text-xs text-gray-400">banyo</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex cursor-pointer items-center justify-between gap-3 bg-gray-50 p-5 md:flex-col md:items-stretch md:justify-between">
                                                <div className="min-w-0 text-left md:text-right">
                                                    <p className="text-xl font-bold text-gray-900 sm:text-2xl" style={monoStyle}>
                                                        {formatPrice(listing.price, listing.currency)}
                                                    </p>
                                                    {listing.saleType === "RENT" && (
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
                            );
                        })
                    )}
                </div>
            </div>

            {activeMobilePanel && (
                <div
                    className={`fixed inset-0 z-[60] lg:hidden ${
                        isMobileDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
                    }`}
                >
                    <button
                        type="button"
                        aria-label="Çekmeceyi kapat"
                        onClick={closeMobilePanel}
                        className={`absolute inset-0 bg-slate-900/45 transition-opacity duration-300 ${
                            isMobileDrawerOpen ? "opacity-100" : "opacity-0"
                        }`}
                    />
                    <section
                        aria-modal="true"
                        role="dialog"
                        className={`absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-2xl bg-white shadow-[0_-14px_30px_rgba(15,23,42,0.24)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isMobileDrawerOpen ? "translate-y-0" : "translate-y-full"
                        }`}
                    >
                        <div className="border-b border-gray-200 px-4 pb-3 pt-2">
                            <span className="mx-auto mb-2 block h-1.5 w-12 rounded-full bg-gray-300" />
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">
                                    {activeMobilePanel === "filter" ? "Filtreler" : "Sıralama"}
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeMobilePanel}
                                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50"
                                    aria-label="Kapat"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[calc(82vh-64px)] overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-4">
                            {activeMobilePanel === "filter"
                                ? renderFilterPanelContent(true)
                                : renderSortDrawerContent()}
                        </div>
                    </section>
                </div>
            )}

            <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
                <div className="mx-auto max-w-[1400px] px-4 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-2">
                    <div className="grid grid-cols-3">
                        <Link
                            href={mapHref}
                            className="inline-flex items-center justify-center gap-1.5 rounded-l-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-700 shadow-[0_3px_14px_rgba(15,23,42,0.08)] transition hover:bg-gray-50"
                        >
                            <MapPin className="h-3.5 w-3.5" />
                            Harita
                        </Link>
                        <button
                            type="button"
                            onClick={() => toggleMobilePanel("filter")}
                            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 border-y border-r border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold uppercase tracking-wide shadow-[0_3px_14px_rgba(15,23,42,0.08)] transition ${
                                activeMobilePanel === "filter" && isMobileDrawerOpen
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                            Filtre
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleMobilePanel("sort")}
                            className={`inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-r-xl border-y border-r border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold uppercase tracking-wide shadow-[0_3px_14px_rgba(15,23,42,0.08)] transition ${
                                activeMobilePanel === "sort" && isMobileDrawerOpen
                                    ? "bg-gray-900 text-white"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            Sırala
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
