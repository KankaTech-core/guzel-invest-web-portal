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

const SALE_TYPE_OPTIONS: { value: SaleType; label: string }[] = [
    { value: "SALE", label: "Satılık" },
    { value: "RENT", label: "Kiralık" },
];

interface ProjectsFiltersProps {
    companyOptions: string[];
}

export default function ProjectsFilters({ companyOptions }: ProjectsFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeSaleType = searchParams.get("saleType") || "";
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
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:flex-nowrap">
                <div className="w-full sm:w-[220px]">
                    <Input
                        value={queryInput}
                        onChange={(event) => setQueryInput(event.target.value)}
                        placeholder="SKU, proje adı, il/ilçe/mahalle ara"
                        aria-label="SKU, proje adı, il/ilçe/mahalle ara"
                        icon={<Search className="w-4 h-4" />}
                        className="py-2.5"
                    />
                </div>
                <Select
                    value={activeType}
                    onChange={(value) => updateParam("type", value === "" ? undefined : value)}
                    options={propertyTypeOptions}
                    placeholder="Tüm Mülk Tipleri"
                    className="w-full sm:w-[190px]"
                />
                <Select
                    value={activeCompany}
                    onChange={(value) => updateParam("company", value === "" ? undefined : value)}
                    options={companySelectOptions}
                    placeholder="Tüm Firmalar"
                    className="w-full sm:w-[190px]"
                />
            </div>

            <div className="inline-flex w-full overflow-hidden rounded-full border border-gray-200 bg-white lg:w-auto">
                {SALE_TYPE_OPTIONS.map((option, index) => {
                    const isActive = activeSaleType === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleSaleType(option.value)}
                            aria-pressed={isActive}
                            className={cn(
                                "px-5 py-2 text-sm font-medium transition-colors",
                                index > 0 && "border-l border-gray-200",
                                isActive
                                    ? "bg-orange-500 text-white"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                            )}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
