"use client";

import { useState, useEffect } from "react";
import { ListingCard, Listing } from "./listing-card";
import { Loader2, Search, LayoutGrid, List } from "lucide-react";
import {
    getFriendlyFetchErrorMessage,
    parseApiErrorMessage,
} from "@/lib/fetch-error";

interface ListingGridProps {
    locale: string;
    filters?: {
        type?: string;
        saleType?: string;
        city?: string;
        district?: string;
        minPrice?: number;
        maxPrice?: number;
        minArea?: number;
        maxArea?: number;
    };
}

export function ListingGrid({ locale, filters = {} }: ListingGridProps) {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        async function fetchListings() {
            setLoading(true);
            try {
                const params = new URLSearchParams({ locale });

                if (filters.type) params.append("type", filters.type);
                if (filters.saleType) params.append("saleType", filters.saleType);
                if (filters.city) params.append("city", filters.city);
                if (filters.district) params.append("district", filters.district);
                if (filters.minPrice) params.append("minPrice", filters.minPrice.toString());
                if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
                if (filters.minArea) params.append("minArea", filters.minArea.toString());
                if (filters.maxArea) params.append("maxArea", filters.maxArea.toString());

                const res = await fetch(`/api/public/listings?${params.toString()}`);
                if (!res.ok) {
                    const apiError = await parseApiErrorMessage(
                        res,
                        "İlanlar yüklenemedi."
                    );
                    throw new Error(apiError);
                }
                const data = await res.json();
                setListings(data.listings);
            } catch (err) {
                setError(
                    getFriendlyFetchErrorMessage(
                        err,
                        "İlanlar yüklenirken bir hata oluştu.",
                        {
                            networkMessage:
                                "İlanlar yüklenirken bağlantı kesildi (Load failed). İnternet/proxy bağlantınızı kontrol edip tekrar deneyin.",
                        }
                    )
                );
            } finally {
                setLoading(false);
            }
        }
        fetchListings();
    }, [locale, filters]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                <p className="text-gray-500 font-medium">İlanlar yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                    <Search className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-red-500 font-medium">{error}</p>
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                    Aradığınız kriterlere uygun ilan bulunamadı.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    Filtreleri değiştirmeyi deneyin.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">{listings.length}</span> ilan
                    bulundu
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${viewMode === "grid"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${viewMode === "list"
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div
                className={
                    viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                        : "flex flex-col gap-4"
                }
            >
                {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} locale={locale} />
                ))}
            </div>
        </div>
    );
}
