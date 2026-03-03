"use client";

import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { formatPrice } from "@/lib/utils";

type ListingStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "REMOVED";

type StatusUi = Record<
    ListingStatusValue,
    {
        markerBg: string;
        markerText: string;
        markerRing: string;
    }
>;

export interface MapListing {
    id: string;
    price: number | string;
    currency: string;
    status: ListingStatusValue;
    latitude: number | null;
    longitude: number | null;
    /** When provided, shown on the marker instead of the formatted price. */
    label?: string;
}

const DEFAULT_CENTER: [number, number] = [36.5444, 31.999]; // Alanya
const DEFAULT_ZOOM = 12;

export default function ListingsLeafletMap({
    listings,
    activeId,
    onSelect,
    statusUi,
    className,
}: {
    listings: MapListing[];
    activeId: string | null;
    onSelect: (id: string) => void;
    statusUi: StatusUi;
    className?: string;
}) {
    const mapRef = useRef<L.Map | null>(null);
    const visibleListings = listings.filter(hasValidCoordinates);

    useEffect(() => {
        return () => {
            const map = mapRef.current;
            if (!map) return;
            const container = map.getContainer() as HTMLElement & { _leaflet_id?: number };
            map.remove();
            if (container && container._leaflet_id) {
                delete container._leaflet_id;
            }
            mapRef.current = null;
        };
    }, []);

    return (
        <MapContainer
            ref={mapRef}
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            className={className}
            zoomControl={false}
        >
            <ZoomControl position="bottomright" />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapSizeController />
            <MapBoundsController listings={visibleListings} />
            {visibleListings.map((listing) => {
                const isActive = listing.id === activeId;
                return (
                    <Marker
                        key={listing.id}
                        position={[listing.latitude as number, listing.longitude as number]}
                        icon={createLeafletIcon(listing, isActive, statusUi)}
                        zIndexOffset={isActive ? 1000 : 0}
                        eventHandlers={{
                            click: () => onSelect(listing.id),
                        }}
                    />
                );
            })}
        </MapContainer>
    );
}

function hasValidCoordinates(listing: MapListing) {
    return (
        isCoordinateInRange(listing.latitude, 90) &&
        isCoordinateInRange(listing.longitude, 180)
    );
}

function isCoordinateInRange(value: number | null, maxAbsValue: number) {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        Math.abs(value) <= maxAbsValue
    );
}

function MapSizeController() {
    const map = useMap();

    useEffect(() => {
        let frameId: number | null = null;

        const scheduleInvalidate = () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(() => {
                map.invalidateSize(false);
                frameId = null;
            });
        };

        scheduleInvalidate();
        const settleTimeout = window.setTimeout(scheduleInvalidate, 120);

        const resizeObserver =
            typeof ResizeObserver !== "undefined"
                ? new ResizeObserver(() => {
                    scheduleInvalidate();
                })
                : null;

        resizeObserver?.observe(map.getContainer());
        window.addEventListener("resize", scheduleInvalidate);

        return () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
            window.clearTimeout(settleTimeout);
            resizeObserver?.disconnect();
            window.removeEventListener("resize", scheduleInvalidate);
        };
    }, [map]);

    return null;
}

function MapBoundsController({ listings }: { listings: MapListing[] }) {
    const map = useMap();

    useEffect(() => {
        if (!listings.length) {
            map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
            return;
        }

        const bounds = L.latLngBounds(
            listings.map((listing) => [listing.latitude as number, listing.longitude as number])
        );
        map.fitBounds(bounds, {
            paddingTopLeft: [80, 80],
            paddingBottomRight: [80, 220],
        });

        if (listings.length === 1) {
            map.setZoom(14);
        }
    }, [listings, map]);

    return null;
}

function createLeafletIcon(
    listing: MapListing,
    isActive: boolean,
    statusUi: StatusUi
) {
    const displayLabel = listing.label ?? formatPrice(listing.price, listing.currency);

    // Use brand orange for project markers (those with a label), status colors for regular listings
    const bg = listing.label ? "#EC6803" : statusUi[listing.status].markerBg;
    const text = listing.label ? "#FFFFFF" : statusUi[listing.status].markerText;
    const ring = listing.label ? "rgba(236,104,3,0.45)" : statusUi[listing.status].markerRing;

    const html = `
        <div class="listing-marker ${isActive ? "is-active" : ""}" style="--marker-bg: ${bg}; --marker-text: ${text}; --marker-ring: ${ring};">
            <div class="listing-marker__label">${displayLabel}</div>
            <div class="listing-marker__pointer"></div>
        </div>
    `;

    return L.divIcon({
        html,
        className: "listing-marker-wrapper",
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
}
