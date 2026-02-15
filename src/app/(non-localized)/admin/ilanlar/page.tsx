import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getMediaUrl, cn, getPropertyTypeLabel, formatPrice } from "@/lib/utils";
import { Plus, Star } from "lucide-react";
import { ListingRowActions } from "@/components/admin/listing-row-actions";
import { ListingStatus } from "@/generated/prisma";
import ListingsFilters from "@/components/admin/listings-filters";
import ListingsMapView from "@/components/admin/listings-map-view";

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

const SALE_TYPES = ["SALE", "RENT"] as const;
const PLATFORM_FILTERS = ["HEPSIEMLAK", "SAHIBINDEN"] as const;

const SORT_KEYS = ["sku", "type", "price", "status", "createdAt"] as const;
type SortKey = (typeof SORT_KEYS)[number];
type SortDir = "asc" | "desc";

const SORT_DEFAULTS: Record<SortKey, SortDir> = {
    sku: "asc",
    type: "asc",
    price: "asc",
    status: "asc",
    createdAt: "desc",
};

interface AdminListingsPageProps {
    searchParams?: Promise<{
        status?: string;
        sort?: string;
        dir?: string;
        q?: string;
        type?: string;
        saleType?: string;
        company?: string;
        platform?: string;
        view?: string;
    }>;
}

export default async function AdminListingsPage({ searchParams }: AdminListingsPageProps) {
    const resolvedSearchParams = await searchParams;
    const statusParam = resolvedSearchParams?.status;
    const sortParam = resolvedSearchParams?.sort;
    const dirParam = resolvedSearchParams?.dir;
    const qParam = resolvedSearchParams?.q;
    const typeParam = resolvedSearchParams?.type;
    const saleTypeParam = resolvedSearchParams?.saleType;
    const companyParam = resolvedSearchParams?.company;
    const platformParam = resolvedSearchParams?.platform;
    const viewParam = resolvedSearchParams?.view;
    const isMapOpen = viewParam === "map";
    const validStatuses: ListingStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED", "REMOVED"];
    const statusFilter = validStatuses.includes(statusParam as ListingStatus)
        ? (statusParam as ListingStatus)
        : undefined;

    const typeFilter = PROPERTY_TYPES.includes(typeParam as (typeof PROPERTY_TYPES)[number])
        ? (typeParam as (typeof PROPERTY_TYPES)[number])
        : undefined;
    const saleTypeFilter = SALE_TYPES.includes(saleTypeParam as (typeof SALE_TYPES)[number])
        ? (saleTypeParam as (typeof SALE_TYPES)[number])
        : undefined;
    const queryFilter = qParam?.trim() ? qParam.trim() : undefined;
    const companyFilter = companyParam?.trim() ? companyParam.trim() : undefined;
    const platformFilter = PLATFORM_FILTERS.includes(
        platformParam as (typeof PLATFORM_FILTERS)[number]
    )
        ? (platformParam as (typeof PLATFORM_FILTERS)[number])
        : undefined;

    const sortKey: SortKey = SORT_KEYS.includes(sortParam as SortKey)
        ? (sortParam as SortKey)
        : "createdAt";
    const sortDir: SortDir =
        dirParam === "asc" || dirParam === "desc" ? dirParam : SORT_DEFAULTS[sortKey];

    const baseParams = new URLSearchParams();
    if (statusFilter) baseParams.set("status", statusFilter);
    if (queryFilter) baseParams.set("q", queryFilter);
    if (typeFilter) baseParams.set("type", typeFilter);
    if (saleTypeFilter) baseParams.set("saleType", saleTypeFilter);
    if (companyFilter) baseParams.set("company", companyFilter);
    if (platformFilter) baseParams.set("platform", platformFilter);
    if (SORT_KEYS.includes(sortParam as SortKey)) {
        baseParams.set("sort", sortKey);
        baseParams.set("dir", sortDir);
    }

    const buildUrl = (updates: Record<string, string | undefined>) => {
        const params = new URLSearchParams(baseParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        const query = params.toString();
        return query ? `/admin/ilanlar?${query}` : "/admin/ilanlar";
    };

    const nextSortDir = (column: SortKey) => {
        if (sortKey === column) {
            return sortDir === "asc" ? "desc" : "asc";
        }
        return SORT_DEFAULTS[column];
    };

    const renderSortHeader = (column: SortKey, label: string) => {
        const isActive = sortKey === column;
        const indicator = isActive ? (sortDir === "asc" ? "↑" : "↓") : "↕";
        return (
            <Link
                href={buildUrl({ sort: column, dir: nextSortDir(column) })}
                className={cn(
                    "inline-flex items-center gap-1 select-none",
                    isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                )}
            >
                <span>{label}</span>
                <span
                    className={cn(
                        "text-xs",
                        isActive ? "text-orange-500" : "text-gray-400"
                    )}
                >
                    {indicator}
                </span>
            </Link>
        );
    };

    const orderBy =
        sortKey === "sku"
            ? { sku: sortDir }
            : sortKey === "type"
            ? { type: sortDir }
            : sortKey === "price"
                ? { price: sortDir }
                : sortKey === "status"
                    ? { status: sortDir }
                    : { createdAt: sortDir };

    const statusFilterForQuery = isMapOpen ? undefined : statusFilter;

    const where = {
        ...(statusFilterForQuery
            ? { status: statusFilterForQuery }
            : { status: { not: "ARCHIVED" as ListingStatus } }),
        ...(queryFilter
            ? {
                OR: [
                    {
                        sku: {
                            contains: queryFilter,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        translations: {
                            some: {
                                locale: "tr",
                                title: {
                                    contains: queryFilter,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    },
                    {
                        city: {
                            contains: queryFilter,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        district: {
                            contains: queryFilter,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        neighborhood: {
                            contains: queryFilter,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),
        ...(typeFilter ? { type: typeFilter } : {}),
        ...(saleTypeFilter ? { saleType: saleTypeFilter } : {}),
        ...(companyFilter ? { company: companyFilter } : {}),
        ...(platformFilter === "HEPSIEMLAK" ? { publishToHepsiemlak: true } : {}),
        ...(platformFilter === "SAHIBINDEN" ? { publishToSahibinden: true } : {}),
    };

    const [listings, companyOptionsFromListings, companyOptionsFromConfig, homepageHeroListing] =
        await Promise.all([
            prisma.listing.findMany({
                where,
                include: {
                    translations: {
                        where: { locale: "tr" },
                    },
                    media: {
                        take: 1,
                        orderBy: { order: "asc" },
                    },
                },
                orderBy,
            }),
            prisma.listing.findMany({
                select: { company: true },
                distinct: ["company"],
                where: {
                    company: {
                        not: "",
                    },
                },
                orderBy: { company: "asc" },
            }),
            prisma.listingCompanyOption.findMany({
                select: { name: true },
                orderBy: { name: "asc" },
            }),
            prisma.listing.findFirst({
                where: {
                    status: "PUBLISHED",
                    showOnHomepageHero: true,
                },
                select: {
                    id: true,
                    sku: true,
                    translations: {
                        where: { locale: "tr" },
                        take: 1,
                        select: {
                            title: true,
                        },
                    },
                },
            }),
        ]);

    const companyOptions = Array.from(
        new Set([
            ...companyOptionsFromConfig.map((option) => option.name),
            ...companyOptionsFromListings.map((listing) => listing.company),
        ])
    ).sort((a, b) => a.localeCompare(b, "tr-TR", { sensitivity: "base" }));
    const homepageHeroTitle =
        homepageHeroListing?.translations[0]?.title || "İsimsiz İlan";

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">İlanlar</h1>
                    <p className="text-gray-500 mt-1">Tüm ilanları yönetin</p>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <Link
                        href={
                            homepageHeroListing
                                ? `/admin/ilanlar/${homepageHeroListing.id}`
                                : "#"
                        }
                        aria-disabled={!homepageHeroListing}
                        className={cn(
                            "btn btn-outline btn-md max-w-[320px]",
                            homepageHeroListing
                                ? "border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100"
                                : "opacity-60 cursor-not-allowed pointer-events-none"
                        )}
                        title={
                            homepageHeroListing
                                ? "Ana sayfada gösterilen ilanı aç"
                                : "Henüz ana sayfa hero için ilan seçilmedi"
                        }
                    >
                        <Star className="w-4 h-4" />
                        <span className="truncate">
                            {homepageHeroListing
                                ? `Ana Sayfada: ${homepageHeroListing.sku || homepageHeroTitle}`
                                : "Ana Sayfada: Seçili İlan Yok"}
                        </span>
                    </Link>
                    <Link
                        href="/admin/ilanlar/yeni"
                        className="btn btn-primary btn-md"
                    >
                        <Plus className="w-4 h-4" />
                        Yeni İlan
                    </Link>
                    <Link
                        href={buildUrl({ view: "map" })}
                        className="btn btn-outline btn-md"
                    >
                        Harita
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                    <Link
                        href={buildUrl({ status: undefined })}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                            !statusFilter
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Tümü
                    </Link>
                    <Link
                        href={buildUrl({ status: "ARCHIVED" })}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                            statusFilter === "ARCHIVED"
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Arşiv
                    </Link>
                </div>
                {(saleTypeFilter || platformFilter) && (
                    <Link
                        href={buildUrl({ saleType: undefined, platform: undefined })}
                        className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                    >
                        Temizle
                    </Link>
                )}
            </div>

            <div className="mb-1">
                <ListingsFilters companyOptions={companyOptions} />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                {renderSortHeader("sku", "SKU")}
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                İlan
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                {renderSortHeader("type", "Tür")}
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                {renderSortHeader("price", "Fiyat")}
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                {renderSortHeader("status", "Durum")}
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                {renderSortHeader("createdAt", "Tarih")}
                            </th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {listings.map((listing) => (
                            <tr key={listing.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                <td className="p-0">
                                    <Link href={`/admin/ilanlar/${listing.id}`} className="block px-6 py-4 text-sm text-gray-600 font-mono">
                                        {listing.sku || "-"}
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link href={`/admin/ilanlar/${listing.id}`} className="block px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                {listing.media[0] ? (
                                                    <img
                                                        src={getMediaUrl(listing.media[0].url)}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        📷
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                                    {listing.translations[0]?.title || "İsimsiz İlan"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {listing.district}, {listing.city}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link href={`/admin/ilanlar/${listing.id}`} className="block px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                            {getPropertyTypeLabel(listing.type, "tr")}
                                        </span>
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link href={`/admin/ilanlar/${listing.id}`} className="block px-6 py-4 font-semibold text-gray-900">
                                        {formatPrice(listing.price.toString(), listing.currency)}
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link href={`/admin/ilanlar/${listing.id}`} className="block px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${listing.status === "PUBLISHED"
                                                ? "bg-green-100 text-green-700"
                                                : listing.status === "DRAFT"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : listing.status === "REMOVED"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {listing.status === "PUBLISHED"
                                                ? "Yayında"
                                                : listing.status === "DRAFT"
                                                    ? "Taslak"
                                                    : listing.status === "REMOVED"
                                                        ? "Kaldırıldı"
                                                        : "Arşiv"}
                                        </span>
                                    </Link>
                                </td>
                                <td className="p-0">
                                    <Link href={`/admin/ilanlar/${listing.id}`} className="block px-6 py-4 text-sm text-gray-500">
                                        {new Date(listing.createdAt).toLocaleDateString("tr-TR")}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <ListingRowActions
                                        id={listing.id}
                                        slug={listing.slug}
                                        status={listing.status as ListingStatus}
                                        showOnHomepageHero={listing.showOnHomepageHero}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {listings.length === 0 && (
                    <div className="py-12 text-center text-gray-400">
                        Henüz ilan bulunmuyor.
                    </div>
                )}
            </div>

            <ListingsMapView
                listings={listings.map((listing) => ({
                    id: listing.id,
                    slug: listing.slug,
                    title: listing.translations[0]?.title || "İsimsiz İlan",
                    description: listing.translations[0]?.description || "",
                    city: listing.city,
                    district: listing.district,
                    price: listing.price.toString(),
                    currency: listing.currency,
                    status: listing.status as ListingStatus,
                    imageUrl: listing.media[0]
                        ? getMediaUrl(listing.media[0].url)
                        : null,
                    latitude: listing.latitude,
                    longitude: listing.longitude,
                }))}
                open={isMapOpen}
                closeHref={buildUrl({ view: undefined })}
            />
        </div>
    );
}
