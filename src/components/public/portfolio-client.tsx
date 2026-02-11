"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListingGrid } from "@/components/public/listing-grid";
import { FilterPanel, FilterSection } from "@/components/ui/filter";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSlider } from "@/components/ui/range-slider";
import { Building2, DollarSign, Home, MapPin, Maximize } from "lucide-react";

interface PortfolioClientProps {
    locale: string;
}

const PRICE_MIN = 0;
const PRICE_MAX = 2000000;
const AREA_MIN = 0;
const AREA_MAX = 500;

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

const cityOptions = ["Alanya", "Antalya", "Gazipasa", "Mersin"] as const;

const districtsByCity: Record<(typeof cityOptions)[number], string[]> = {
    Alanya: ["Mahmutlar", "Kestel", "Oba", "Cikcilli", "Kargicak", "Avsallar", "Konakli", "Demirtas", "Merkez"],
    Antalya: ["Muratpasa", "Konyaalti", "Kepez", "Dosemealti", "Aksu"],
    Gazipasa: ["Pazarcı", "Cumhuriyet", "Yeni Mahalle", "Beyrebucak"],
    Mersin: ["Yenisehir", "Mezitli", "Erdemli", "Silifke"],
};

function parseNumber(value: string | null) {
    if (!value) {
        return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function findCaseInsensitiveMatch<T extends string>(
    target: string | null,
    values: readonly T[]
) {
    if (!target) {
        return undefined;
    }

    return values.find((value) => value.toLowerCase() === target.toLowerCase());
}

export function PortfolioClient({ locale }: PortfolioClientProps) {
    const searchParams = useSearchParams();

    const initialType = findCaseInsensitiveMatch(
        searchParams.get("type"),
        propertyTypes.map((item) => item.value)
    );
    const initialSaleType = findCaseInsensitiveMatch(
        searchParams.get("saleType"),
        saleTypes.map((item) => item.value)
    );
    const initialCity = findCaseInsensitiveMatch(searchParams.get("city"), cityOptions);
    const initialDistrict = initialCity
        ? findCaseInsensitiveMatch(searchParams.get("district"), districtsByCity[initialCity])
        : undefined;
    const initialMinPrice = parseNumber(searchParams.get("minPrice"));
    const initialMaxPrice = parseNumber(searchParams.get("maxPrice"));
    const initialMinArea = parseNumber(searchParams.get("minArea"));
    const initialMaxArea = parseNumber(searchParams.get("maxArea"));

    const [selectedTypes, setSelectedTypes] = useState<string[]>(
        initialType ? [initialType] : []
    );
    const [selectedSaleType, setSelectedSaleType] = useState<string | undefined>(
        initialSaleType
    );
    const [selectedCity, setSelectedCity] = useState<string>(initialCity ?? "");
    const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict ?? "");
    const [priceRange, setPriceRange] = useState<[number, number]>([
        initialMinPrice ?? PRICE_MIN,
        initialMaxPrice ?? PRICE_MAX,
    ]);
    const [areaRange, setAreaRange] = useState<[number, number]>([
        initialMinArea ?? AREA_MIN,
        initialMaxArea ?? AREA_MAX,
    ]);

    const districtOptions = useMemo(
        () =>
            selectedCity && selectedCity in districtsByCity
                ? districtsByCity[selectedCity as keyof typeof districtsByCity]
                : [],
        [selectedCity]
    );

    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const clearFilters = () => {
        setSelectedTypes([]);
        setSelectedSaleType(undefined);
        setSelectedCity("");
        setSelectedDistrict("");
        setPriceRange([PRICE_MIN, PRICE_MAX]);
        setAreaRange([AREA_MIN, AREA_MAX]);
    };

    const formatPriceLabel = (value: number) => {
        const sign = "€"; // Base currency for filters is EUR
        if (value >= 1000000) {
            return `${sign}${(value / 1000000).toFixed(1)}M`;
        }
        return `${sign}${(value / 1000).toFixed(0)}K`;
    };

    const formatArea = (value: number) => `${value} m²`;

    // Build filter object for API
    const filters = {
        type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
        saleType: selectedSaleType,
        city: selectedCity || undefined,
        district: selectedDistrict || undefined,
        minPrice: priceRange[0] > PRICE_MIN ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < PRICE_MAX ? priceRange[1] : undefined,
        minArea: areaRange[0] > AREA_MIN ? areaRange[0] : undefined,
        maxArea: areaRange[1] < AREA_MAX ? areaRange[1] : undefined,
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <FilterPanel title="Filtreler" onClearAll={clearFilters}>
                {/* Sale Type Filter */}
                <FilterSection
                    title="İşlem Türü"
                    icon={<Building2 className="w-4 h-4 text-gray-400" />}
                    showClear={Boolean(selectedSaleType)}
                    onClear={() => setSelectedSaleType(undefined)}
                >
                    <div className="space-y-3">
                        {saleTypes.map((saleType) => (
                            <Checkbox
                                key={saleType.value}
                                checked={selectedSaleType === saleType.value}
                                onChange={() =>
                                    setSelectedSaleType((prev) =>
                                        prev === saleType.value ? undefined : saleType.value
                                    )
                                }
                                label={saleType.label}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Location Filter */}
                <FilterSection
                    title="Konum"
                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                    showClear={Boolean(selectedCity) || Boolean(selectedDistrict)}
                    onClear={() => {
                        setSelectedCity("");
                        setSelectedDistrict("");
                    }}
                >
                    <div className="space-y-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">
                                İl
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(event) => {
                                    const nextCity = event.target.value;
                                    setSelectedCity(nextCity);
                                    if (
                                        !districtsByCity[
                                            nextCity as keyof typeof districtsByCity
                                        ]?.includes(selectedDistrict)
                                    ) {
                                        setSelectedDistrict("");
                                    }
                                }}
                                className="input"
                            >
                                <option value="">Tüm İller</option>
                                {cityOptions.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-500">
                                İlçe
                            </label>
                            <select
                                value={selectedDistrict}
                                onChange={(event) => setSelectedDistrict(event.target.value)}
                                className="input"
                                disabled={!selectedCity}
                            >
                                <option value="">Tüm İlçeler</option>
                                {districtOptions.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </FilterSection>

                {/* Price Range Filter */}
                <FilterSection
                    title="Fiyat Aralığı"
                    icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                >
                    <RangeSlider
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={50000}
                        value={priceRange}
                        onChange={setPriceRange}
                        formatLabel={formatPriceLabel}
                    />
                    <div className="flex gap-2 mt-4">
                        {[
                            { label: "< 100K €", value: [0, 100000] as [number, number] },
                            { label: "100K € - 500K €", value: [100000, 500000] as [number, number] },
                            { label: "> 500K €", value: [500000, 2000000] as [number, number] },
                        ].map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => setPriceRange(preset.value)}
                                className="flex-1 px-2 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </FilterSection>

                {/* Area Filter */}
                <FilterSection
                    title="Alan (m²)"
                    icon={<Maximize className="w-4 h-4 text-gray-400" />}
                >
                    <RangeSlider
                        min={AREA_MIN}
                        max={AREA_MAX}
                        step={10}
                        value={areaRange}
                        onChange={setAreaRange}
                        formatLabel={formatArea}
                    />
                </FilterSection>

                {/* Property Type Filter */}
                <FilterSection
                    title="Gayrimenkul Tipi"
                    icon={<Home className="w-4 h-4 text-gray-400" />}
                    showClear={selectedTypes.length > 0}
                    onClear={() => setSelectedTypes([])}
                >
                    <div className="space-y-3">
                        {propertyTypes.map((type) => (
                            <Checkbox
                                key={type.value}
                                checked={selectedTypes.includes(type.value)}
                                onChange={() => toggleType(type.value)}
                                label={type.label}
                            />
                        ))}
                    </div>
                </FilterSection>
            </FilterPanel>

            {/* Listing Grid */}
            <div className="flex-1">
                <ListingGrid locale={locale} filters={filters} />
            </div>
        </div>
    );
}
