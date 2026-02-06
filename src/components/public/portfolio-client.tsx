"use client";

import { useState } from "react";
import { ListingGrid } from "@/components/public/listing-grid";
import { FilterPanel, FilterSection } from "@/components/ui/filter";
import { Checkbox } from "@/components/ui/checkbox";
import { RangeSlider } from "@/components/ui/range-slider";
import { MapPin, DollarSign, Home, Maximize } from "lucide-react";

interface PortfolioClientProps {
    locale: string;
}

export function PortfolioClient({ locale }: PortfolioClientProps) {
    // Filter State
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
    const [areaRange, setAreaRange] = useState<[number, number]>([0, 500]);

    const propertyTypes = [
        { value: "VILLA", label: "Villa" },
        { value: "APARTMENT", label: "Daire" },
        { value: "HOME", label: "Müstakil Ev" },
        { value: "LAND", label: "Arsa" },
        { value: "COMMERCIAL", label: "Ticari" },
    ];

    const locations = [
        { value: "kestel", label: "Kestel" },
        { value: "mahmutlar", label: "Mahmutlar" },
        { value: "merkez", label: "Merkez" },
        { value: "oba", label: "Oba" },
        { value: "cikcilli", label: "Cikcilli" },
        { value: "kargicak", label: "Kargıcak" },
    ];

    const toggleType = (type: string) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const toggleLocation = (location: string) => {
        setSelectedLocations((prev) =>
            prev.includes(location)
                ? prev.filter((l) => l !== location)
                : [...prev, location]
        );
    };

    const clearFilters = () => {
        setSelectedTypes([]);
        setSelectedLocations([]);
        setPriceRange([0, 2000000]);
        setAreaRange([0, 500]);
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
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 2000000 ? priceRange[1] : undefined,
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <FilterPanel title="Filtreler" onClearAll={clearFilters}>
                {/* Location Filter */}
                <FilterSection
                    title="Konum"
                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                    showClear={selectedLocations.length > 0}
                    onClear={() => setSelectedLocations([])}
                >
                    <div className="space-y-3">
                        {locations.map((loc) => (
                            <Checkbox
                                key={loc.value}
                                checked={selectedLocations.includes(loc.value)}
                                onChange={() => toggleLocation(loc.value)}
                                label={loc.label}
                            />
                        ))}
                    </div>
                </FilterSection>

                {/* Price Range Filter */}
                <FilterSection
                    title="Fiyat Aralığı"
                    icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                >
                    <RangeSlider
                        min={0}
                        max={2000000}
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
                        min={0}
                        max={500}
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
