"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn, getPropertyTypeLabel } from "@/lib/utils";
import { Input, Select } from "@/components/ui";

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
type PlatformFilter = "HEPSIEMLAK" | "SAHIBINDEN";

const SALE_TYPE_OPTIONS: { value: SaleType; label: string }[] = [
    { value: "SALE", label: "Satılık" },
    { value: "RENT", label: "Kiralık" },
];

const PLATFORM_OPTIONS: {
    value: PlatformFilter;
    label: string;
    activeClassName: string;
}[] = [
    {
        value: "HEPSIEMLAK",
        label: "Hepsiemlak",
        activeClassName: "bg-[#E1241C] text-white border-[#E1241C] shadow-sm shadow-red-200",
    },
    {
        value: "SAHIBINDEN",
        label: "Sahibinden",
        activeClassName: "bg-[#FFE802] text-black border-[#FFE802] shadow-sm shadow-yellow-200",
    },
];

interface ListingsFiltersProps {
    companyOptions: string[];
}

export default function ListingsFilters({ companyOptions }: ListingsFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeSaleType = searchParams.get("saleType") || "";
    const activePlatform = searchParams.get("platform") || "";
    const activeType = searchParams.get("type") || "";
    const activeCompany = searchParams.get("company") || "";
    const activeQuery = searchParams.get("q") || "";

    const [queryInput, setQueryInput] = useState(activeQuery);

    const updateParams = useCallback(
        (updates: Record<string, string | undefined>, options?: { replace?: boolean }) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (!value) {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });
            const query = params.toString();
            const nextUrl = query ? `${pathname}?${query}` : pathname;
            if (options?.replace) {
                router.replace(nextUrl);
                return;
            }
            router.push(nextUrl);
        },
        [pathname, router, searchParams]
    );

    const updateParam = useCallback(
        (key: string, value?: string, options?: { replace?: boolean }) => {
            updateParams({ [key]: value }, options);
        },
        [updateParams]
    );

    const toggleSaleType = (value: SaleType) => {
        updateParam("saleType", activeSaleType === value ? "" : value);
    };

    const togglePlatform = (value: PlatformFilter) => {
        updateParam("platform", activePlatform === value ? "" : value);
    };

    useEffect(() => {
        setQueryInput(activeQuery);
    }, [activeQuery]);

    useEffect(() => {
        const normalizedQuery = queryInput.trim();
        if (normalizedQuery === activeQuery) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            updateParam("q", normalizedQuery || undefined, { replace: true });
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [activeQuery, queryInput, updateParam]);

    const propertyTypeOptions = [
        { value: "", label: "Tüm Mülk Tipleri" },
        ...PROPERTY_TYPES.map((type) => ({
            value: type,
            label: getPropertyTypeLabel(type, "tr"),
        })),
    ];

    const companySelectOptions = [
        { value: "", label: "Tüm Firmalar" },
        ...companyOptions.map((company) => ({
            value: company,
            label: company,
        })),
    ];

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 min-w-[220px] flex-1">
                <div className="w-full md:w-72">
                    <Input
                        value={queryInput}
                        onChange={(event) => setQueryInput(event.target.value)}
                        placeholder="SKU, ilan adı, il/ilçe/mahalle ara"
                        aria-label="SKU, ilan adı, il/ilçe/mahalle ara"
                        icon={<Search className="w-4 h-4" />}
                        className="py-2.5"
                    />
                </div>
                <Select
                    value={activeType}
                    onChange={(value) => updateParam("type", value === "" ? undefined : value)}
                    options={propertyTypeOptions}
                    placeholder="Tüm Mülk Tipleri"
                    className="w-full md:w-64"
                />
                <Select
                    value={activeCompany}
                    onChange={(value) => updateParam("company", value === "" ? undefined : value)}
                    options={companySelectOptions}
                    placeholder="Tüm Firmalar"
                    className="w-full md:w-64"
                />
            </div>

            <div className="flex flex-wrap items-center gap-2">
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

                {PLATFORM_OPTIONS.map((option) => {
                    const isActive = activePlatform === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => togglePlatform(option.value)}
                            aria-pressed={isActive}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                                isActive
                                    ? option.activeClassName
                                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500"
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}

                {(activeSaleType || activePlatform) && (
                    <button
                        type="button"
                        onClick={() => updateParams({ saleType: "", platform: "" })}
                        className="ml-2 text-sm text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        Temizle
                    </button>
                )}
            </div>
        </div>
    );
}
