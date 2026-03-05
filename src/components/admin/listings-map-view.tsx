"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSidebar } from "@/lib/context/sidebar-context";
import { cn, formatPrice, truncateText } from "@/lib/utils";
import type { MapListing as LeafletMapListing } from "./listings-leaflet-map";

type ListingStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";

interface MapListingInput {
    id: string;
    slug: string;
    title: string;
    description?: string | null;
    city: string;
    district: string;
    price: number | string;
    currency: string;
    status: ListingStatusValue;
    imageUrl?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
}

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

const LeafletMap = dynamic(() => import("./listings-leaflet-map"), {
    ssr: false,
});

export default function ListingsMapView({
    listings,
    closeHref,
}: {
    listings: MapListingInput[];
    closeHref: string;
}) {
    const { isCollapsed } = useSidebar();
    const visibleListings = useMemo(
        () => listings.filter((listing) => listing.status !== "ARCHIVED"),
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
    const missingCoordsCount = Math.max(
        0,
        visibleListings.length - mapListings.length
    );

    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        if (!activeId) return;
        const exists = visibleListings.some((listing) => listing.id === activeId);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!exists) setActiveId(null);
    }, [activeId, visibleListings]);

    const activeListing =
        visibleListings.find((listing) => listing.id === activeId) ?? null;

    return (
        <section
            className={cn(
                "fixed inset-y-0 right-0 left-0 z-40 bg-slate-100",
                isCollapsed ? "lg:left-20" : "lg:left-64"
            )}
            aria-label="Harita görünümü"
        >
            <div className="absolute inset-0 z-0">
                <LeafletMap
                    listings={mapListings}
                    activeId={activeId}
                    onSelect={setActiveId}
                    statusUi={STATUS_UI}
                    className="h-full w-full"
                />
            </div>

            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <Link href={closeHref} className="btn btn-secondary btn-sm">
                    Listeye Dön
                </Link>
            </div>

            <div className="absolute left-4 top-4 z-20 hidden sm:block">
                <div className="rounded-xl border border-white/40 bg-white/80 backdrop-blur px-4 py-3 shadow-lg">
                    <h2 className="text-base font-semibold text-gray-900">
                        Harita Görünümü
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Taslak sarı, Yayında yeşil, Kaldırıldı kırmızı. Arşiv görünmez.
                    </p>
                    {missingCoordsCount > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                            {missingCoordsCount} ilanda konum yok, haritada görünmez.
                        </p>
                    )}
                </div>
            </div>

            {activeListing && (
                <div className="absolute bottom-4 left-1/2 z-20 w-[92%] max-w-4xl -translate-x-1/2">
                    <div className="rounded-2xl border border-white/60 bg-white/95 backdrop-blur shadow-2xl p-4 flex flex-col lg:flex-row gap-4">
                        <div className="relative h-36 w-full overflow-hidden rounded-xl bg-gray-100 lg:w-56">
                            {activeListing.imageUrl ? (
                                <Image
                                    src={activeListing.imageUrl}
                                    alt=""
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 224px"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    📷
                                </div>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col min-h-[140px]">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {activeListing.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {activeListing.district}, {activeListing.city}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatPrice(
                                            activeListing.price,
                                            activeListing.currency
                                        )}
                                    </p>
                                    <span
                                        className={cn(
                                            "mt-1 inline-flex px-2 py-1 rounded text-xs font-medium",
                                            STATUS_UI[activeListing.status].badge
                                        )}
                                    >
                                        {STATUS_UI[activeListing.status].label}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                {activeListing.description
                                    ? truncateText(activeListing.description, 160)
                                    : "Açıklama bulunmuyor."}
                            </p>
                            <div className="mt-auto pt-4 flex flex-wrap items-center justify-end gap-2">
                                <Link
                                    href={`/admin/ilanlar/${activeListing.id}`}
                                    className="btn btn-outline btn-sm"
                                >
                                    Değiştir
                                </Link>
                                <Link
                                    href={`/tr/ilan/${activeListing.slug}`}
                                    className="btn btn-primary btn-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    İlanı Gör
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {mapListings.length === 0 && (
                <div className="absolute bottom-4 left-1/2 z-20 w-[92%] max-w-xl -translate-x-1/2">
                    <div className="rounded-xl border border-white/60 bg-white/90 px-4 py-3 text-sm text-gray-600 shadow">
                        Koordinatı olan ilan bulunamadı. Konum ekledikçe haritada
                        görünecek.
                    </div>
                </div>
            )}
        </section>
    );
}

function normalizeCoordinate(value: MapListingInput["latitude"]): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }
    const parsed = Number.parseFloat(String(value).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
}
