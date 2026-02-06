"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn, getPropertyTypeLabel } from "@/lib/utils";
import { Select } from "@/components/ui";

const PROPERTY_TYPES = [
    "APARTMENT",
    "VILLA",
    "PENTHOUSE",
    "LAND",
    "COMMERCIAL",
    "OFFICE",
    "SHOP",
    "FARM",
] as const;

type SaleType = "SALE" | "RENT";

const SALE_TYPE_OPTIONS: { value: SaleType; label: string }[] = [
    { value: "SALE", label: "Satılık" },
    { value: "RENT", label: "Kiralık" },
];

export default function ListingsFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeSaleType = searchParams.get("saleType") || "";
    const activeType = searchParams.get("type") || "";

    const updateParam = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    const toggleSaleType = (value: SaleType) => {
        updateParam("saleType", activeSaleType === value ? "" : value);
    };

    const propertyTypeOptions = [
        { value: "", label: "Tüm Mülk Tipleri" },
        ...PROPERTY_TYPES.map((type) => ({
            value: type,
            label: getPropertyTypeLabel(type, "tr"),
        })),
    ];

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Property Type Selector */}
            <div className="flex items-center gap-2 min-w-[200px]">
                <Select
                    value={activeType}
                    onChange={(value) => updateParam("type", value === "" ? undefined : value)}
                    options={propertyTypeOptions}
                    placeholder="Tüm Mülk Tipleri"
                    className="w-full md:w-64"
                />
            </div>

            {/* Right: Sale Type Buttons */}
            <div className="flex items-center gap-2">
                {SALE_TYPE_OPTIONS.map((option) => {
                    const isActive = activeSaleType === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleSaleType(option.value)}
                            aria-pressed={isActive}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                                isActive
                                    ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
                {activeSaleType && (
                    <button
                        type="button"
                        onClick={() => updateParam("saleType", "")}
                        className="ml-2 text-sm text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        Temizle
                    </button>
                )}
            </div>
        </div>
    );
}
