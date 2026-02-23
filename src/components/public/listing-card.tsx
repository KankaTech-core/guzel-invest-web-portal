"use client";

import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Square, MapPin, Star, Bookmark } from "lucide-react";
import { formatPrice, formatArea, getMediaUrl } from "@/lib/utils";
import { Badge, getPropertyTypeBadge } from "@/components/ui/badge";

export interface Listing {
    id: string;
    slug: string;
    type: string;
    saleType: string;
    price: number;
    currency: string;
    bedrooms?: number;
    bathrooms?: number;
    rooms?: string;
    area: number;
    district: string;
    city: string;
    isProject?: boolean;
    translations?: { title?: string }[];
    media?: { url: string }[];
}

interface ListingCardProps {
    listing: Listing;
    locale: string;
}

export function ListingCard({ listing, locale }: ListingCardProps) {
    const translation = listing.translations?.[0] || {};
    const mainImage = listing.media?.[0];
    const imageUrl = mainImage ? getMediaUrl(mainImage.url) : null;

    return (
        <div className="card card-interactive group bg-white">
            {/* Image Section */}
            <Link
                href={listing.isProject ? `/${locale}/proje/${listing.slug}` : `/${locale}/ilan/${listing.slug}`}
                className="block relative aspect-[4/3] overflow-hidden bg-gray-100"
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={translation.title || "Listing"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <Square className="w-16 h-16 text-gray-300" />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <Badge variant={getPropertyTypeBadge(listing.type)}>
                        {listing.type === "VILLA"
                            ? "Villa"
                            : listing.type === "APARTMENT"
                                ? "Daire"
                                : listing.type === "LAND"
                                    ? "Arsa"
                                    : listing.type === "COMMERCIAL"
                                        ? "Ticari"
                                        : "Ev"}
                    </Badge>
                </div>

                {/* Bookmark Button */}
                <button
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-lg
            flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Bookmark className="w-4 h-4 text-gray-500" />
                </button>

                {/* Gradient Overlay for Title */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 pt-12">
                    <h3 className="font-bold text-white text-lg line-clamp-1 mb-1">
                        {translation.title || "İsimsiz İlan"}
                    </h3>
                    <div className="flex items-center gap-1 text-white/90 text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>
                            {listing.district}, {listing.city}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-4 bg-white">
                {/* Price and Rating Row */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <span className="text-xl font-bold text-orange-500">
                            {formatPrice(listing.price, listing.currency)}
                        </span>
                        {listing.saleType === "RENT" && (
                            <span className="text-gray-400 text-sm ml-1">/ay</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-700">4.8</span>
                        <span className="text-gray-400">/5</span>
                    </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    <div className="flex flex-col items-center gap-1">
                        <BedDouble className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 font-medium">
                            {listing.rooms || listing.bedrooms || "-"} Oda
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 font-medium">
                            {listing.bathrooms || "-"} Banyo
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Square className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 font-medium">
                            {formatArea(listing.area)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
