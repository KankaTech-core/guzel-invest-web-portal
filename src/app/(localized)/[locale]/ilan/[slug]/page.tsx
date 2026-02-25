import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingStatus } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
    formatArea,
    formatPrice,
    getMediaUrl,
    getPropertyTypeLabel,
    getSaleTypeLabel,
} from "@/lib/utils";
import {
    isCategoryFieldVisibleForTypes,
    normalizeZoningStatus,
    type ListingCategoryFieldKey,
    ZONING_STATUS_OPTIONS,
} from "@/lib/listing-type-rules";
import {
    Bath,
    BedDouble,
    ChevronRight,
    MapPin,
    Square,
    Layers,
    Scaling,
    Trees,
} from "lucide-react";
import {
    ListingDetailGallery,
    type ListingGalleryItem,
} from "@/components/public/listing-detail-gallery";
import { ListingContactPanel } from "@/components/public/listing-contact-panel";
import { ListingPriceDisplay } from "@/components/public/listing-price-display";

const WHATSAPP_NUMBER = "902421234567";

function formatBoolean(value: boolean) {
    return value ? "Var" : "Yok";
}

function toNumber(value: unknown) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseRoomCount(value: string | null | undefined) {
    if (!value) {
        return null;
    }

    const match = value.match(/\d+/);
    if (!match) {
        return null;
    }

    const parsed = Number.parseInt(match[0], 10);
    return Number.isFinite(parsed) ? parsed : null;
}

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;

    const listing = await prisma.listing.findFirst({
        where: {
            slug,
            status: {
                in: [ListingStatus.PUBLISHED, ListingStatus.REMOVED],
            },
        },
        include: {
            translations: {
                where: {
                    locale: {
                        in: Array.from(new Set(["tr", locale])),
                    },
                },
            },
            media: {
                orderBy: [{ isCover: "desc" }, { order: "asc" }],
            },
        },
    });

    if (!listing) {
        notFound();
    }

    const isRemovedListing = listing.status === ListingStatus.REMOVED;

    const translation =
        listing.translations.find((item) => item.locale === "tr") ||
        listing.translations[0];

    const title = translation?.title?.trim() || "İlan Başlığı";
    const description =
        translation?.description?.trim() ||
        "Bu ilan için detaylı açıklama henüz eklenmemiştir.";
    const listedFeatures = (translation?.features || [])
        .map((feature) => feature.trim())
        .filter(Boolean);

    const priceValue =
        typeof listing.price === "object" &&
            listing.price !== null &&
            "toString" in listing.price
            ? listing.price.toString()
            : listing.price;
    const roomValue =
        listing.rooms ||
        (typeof listing.bedrooms === "number" ? `${listing.bedrooms}+0` : "-");
    const bathroomValue =
        typeof listing.bathrooms === "number" ? `${listing.bathrooms}` : "-";
    const formattedPrice = formatPrice(priceValue, listing.currency);
    const saleTypeLabel = getSaleTypeLabel(listing.saleType, "tr");
    const propertyTypeLabel = getPropertyTypeLabel(listing.type, "tr");
    const locationLabel = [listing.neighborhood, listing.district, listing.city]
        .filter(Boolean)
        .join(", ");
    const addressLabel = [
        listing.address,
        listing.neighborhood,
        listing.district,
        listing.city,
    ]
        .filter(Boolean)
        .join(", ");

    // Visibility Checks
    const selectedTypeOfListing = [listing.type];
    const isVisible = (key: ListingCategoryFieldKey) =>
        isCategoryFieldVisibleForTypes(key, selectedTypeOfListing);

    const showRooms = isVisible("rooms");
    const showBathrooms = isVisible("bathrooms");
    const showFloor = isVisible("floor");
    const showTotalFloors = isVisible("totalFloors");
    const showBuildYear = isVisible("buildYear");
    const showHeating = isVisible("heating");

    // Land / Commercial Fields
    const showZoning = isVisible("zoningStatus");
    const showParcel = isVisible("parcelNo");
    const showEmsal = isVisible("emsal");
    const showGroundArea = isVisible("groundFloorArea");
    const showBasementArea = isVisible("basementArea");

    const zoningLabel = ZONING_STATUS_OPTIONS.find(
        (opt) => opt.value === normalizeZoningStatus(listing.zoningStatus)
    )?.label || listing.zoningStatus || "-";


    const lat = toNumber(listing.latitude);
    const lng = toNumber(listing.longitude);
    const hasCoordinates =
        lat !== null && lng !== null && !(lat === 0 && lng === 0);

    const mapEmbedSrc = hasCoordinates
        ? `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
        : addressLabel
            ? `https://www.google.com/maps?q=${encodeURIComponent(
                addressLabel
            )}&z=15&output=embed`
            : null;

    const mapsLink = listing.googleMapsLink
        ? listing.googleMapsLink
        : hasCoordinates
            ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
            : addressLabel
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    addressLabel
                )}`
                : null;

    const imageItems: ListingGalleryItem[] = listing.media
        .filter((item) => item.type === "IMAGE")
        .map((item, index) => ({
            id: item.id,
            src: getMediaUrl(item.url),
            alt: `${title} - Görsel ${index + 1}`,
        }));

    const detailItems = [
        { label: "İlan Kodu", value: listing.sku || "-" },
        { label: "İlan Tipi", value: saleTypeLabel },
        { label: "Kategori", value: propertyTypeLabel },
        { label: "Brüt Alan", value: formatArea(listing.area) },
        ...(showRooms ? [{ label: "Oda Düzeni", value: roomValue }] : []),
        ...(showBathrooms
            ? [
                {
                    label: "Banyo",
                    value:
                        typeof listing.bathrooms === "number"
                            ? `${listing.bathrooms}`
                            : "-",
                },
            ]
            : []),
        ...(isVisible("wcCount")
            ? [
                {
                    label: "WC",
                    value:
                        typeof listing.wcCount === "number"
                            ? `${listing.wcCount}`
                            : "-",
                },
            ]
            : []),
        ...(showFloor
            ? [
                {
                    label: "Bulunduğu Kat",
                    value:
                        typeof listing.floor === "number"
                            ? `${listing.floor}`
                            : "-",
                },
            ]
            : []),
        ...(showTotalFloors
            ? [
                {
                    label: "Toplam Kat",
                    value:
                        typeof listing.totalFloors === "number"
                            ? `${listing.totalFloors}`
                            : "-",
                },
            ]
            : []),
        ...(showBuildYear
            ? [
                {
                    label: "Bina Yaşı",
                    value:
                        typeof listing.buildYear === "number"
                            ? `${new Date().getFullYear() - listing.buildYear}`
                            : "-",
                },
            ]
            : []),
        ...(showHeating ? [{ label: "Isıtma", value: listing.heating || "-" }] : []),
        ...(listing.furnished !== null
            ? [{ label: "Eşya Durumu", value: listing.furnished ? "Eşyalı" : "Eşyasız" }]
            : []),
        // Land Specific
        ...(showZoning ? [{ label: "İmar Durumu", value: zoningLabel }] : []),
        ...(showParcel ? [{ label: "Ada / Parsel", value: listing.parcelNo || "-" }] : []),
        ...(showEmsal
            ? [
                {
                    label: "Emsal (Kaks)",
                    value:
                        typeof listing.emsal === "number" ? `${listing.emsal}` : "-",
                },
            ]
            : []),
        // Commercial Specific
        ...(showGroundArea && listing.groundFloorArea
            ? [{ label: "Zemin Alanı", value: formatArea(listing.groundFloorArea) }]
            : []),
        ...(showBasementArea && listing.basementArea
            ? [{ label: "Bodrum Alanı", value: formatArea(listing.basementArea) }]
            : []),

        { label: "Asansör", value: formatBoolean(listing.elevator) },
        { label: "Otopark", value: formatBoolean(listing.parking) },
        { label: "Havuz", value: formatBoolean(listing.pool) },
        { label: "Bahçe", value: formatBoolean(listing.garden) },
        { label: "Güvenlik", value: formatBoolean(listing.security) },
        { label: "Deniz Manzarası", value: formatBoolean(listing.seaView) },
        ...(isVisible("citizenshipEligible")
            ? [
                {
                    label: "Vatandaşlığa Uygunluk",
                    value: listing.citizenshipEligible ? "Uygun" : "Uygun değil",
                },
            ]
            : []),
        ...(isVisible("residenceEligible")
            ? [
                {
                    label: "İkamete Uygunluk",
                    value: listing.residenceEligible ? "Uygun" : "Uygun değil",
                },
            ]
            : []),
    ];
    const visibleDetailItems = detailItems.filter(
        (item) => item.value && item.value !== "-"
    );
    const referenceRoomCount = parseRoomCount(listing.rooms);

    const similarCandidates = await prisma.listing.findMany({
        where: {
            status: ListingStatus.PUBLISHED,
            id: {
                not: listing.id,
            },
            type: listing.type,
        },
        include: {
            translations: {
                where: {
                    locale: {
                        in: Array.from(new Set(["tr", locale])),
                    },
                },
            },
            media: {
                orderBy: [{ isCover: "desc" }, { order: "asc" }],
            },
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 36,
    });

    const similarListings = similarCandidates
        .map((candidate) => {
            const candidateRoomCount = parseRoomCount(candidate.rooms);
            const areaDelta = Math.abs(candidate.area - listing.area);
            const areaRatio = listing.area > 0 ? areaDelta / listing.area : 1;

            let score = 1000;

            if (candidate.rooms && listing.rooms && candidate.rooms === listing.rooms) {
                score += 280;
            } else if (
                referenceRoomCount !== null &&
                candidateRoomCount !== null &&
                candidateRoomCount === referenceRoomCount
            ) {
                score += 220;
            } else if (
                typeof listing.bedrooms === "number" &&
                typeof candidate.bedrooms === "number" &&
                listing.bedrooms === candidate.bedrooms
            ) {
                score += 180;
            }

            if (candidate.saleType === listing.saleType) {
                score += 140;
            }

            if (areaRatio <= 0.08) {
                score += 120;
            } else if (areaRatio <= 0.15) {
                score += 90;
            } else if (areaRatio <= 0.25) {
                score += 70;
            } else if (areaRatio <= 0.4) {
                score += 40;
            } else if (areaRatio <= 0.55) {
                score += 20;
            }

            if (candidate.district === listing.district) {
                score += 22;
            }
            if (candidate.city === listing.city) {
                score += 12;
            }

            const candidateTranslation =
                candidate.translations.find((item) => item.locale === "tr") ||
                candidate.translations[0];
            const candidateTitle =
                candidateTranslation?.title?.trim() || "Benzer İlan";
            const candidateLocationLabel = [
                candidate.neighborhood,
                candidate.district,
                candidate.city,
            ]
                .filter(Boolean)
                .join(", ");
            const candidateImage = candidate.media.find(
                (item) => item.type === "IMAGE"
            );
            const candidatePriceValue =
                typeof candidate.price === "object" &&
                    candidate.price !== null &&
                    "toString" in candidate.price
                    ? candidate.price.toString()
                    : candidate.price;
            const candidateRoomValue =
                candidate.rooms ||
                (typeof candidate.bedrooms === "number"
                    ? `${candidate.bedrooms}+0`
                    : "-");

            return {
                id: candidate.id,
                slug: candidate.slug,
                title: candidateTitle,
                locationLabel: candidateLocationLabel,
                imageUrl: candidateImage ? getMediaUrl(candidateImage.url) : null,
                priceLabel: formatPrice(candidatePriceValue, candidate.currency),
                price: candidatePriceValue,
                currency: candidate.currency,
                areaLabel: formatArea(candidate.area),
                roomLabel: candidateRoomValue,
                typeLabel: getPropertyTypeLabel(candidate.type, "tr"),
                saleTypeLabel: getSaleTypeLabel(candidate.saleType, "tr"),
                areaDelta,
                score,
                createdAt: candidate.createdAt,
            };
        })
        .sort((left, right) => {
            if (right.score !== left.score) {
                return right.score - left.score;
            }
            if (left.areaDelta !== right.areaDelta) {
                return left.areaDelta - right.areaDelta;
            }
            return right.createdAt.getTime() - left.createdAt.getTime();
        })
        .slice(0, 4);
    const moreListingsParams = new URLSearchParams();
    moreListingsParams.set("type", listing.type);

    const listingRooms = listing.rooms?.trim();
    if (listingRooms) {
        moreListingsParams.set("rooms", listingRooms);
    }

    const moreListingsHref = `/${locale}/portfoy?${moreListingsParams.toString()}`;

    return (
        <main className="bg-white pb-28 pt-20 md:pt-24 md:pb-20">
            <div className="container-custom space-y-8">
                <nav className="hidden items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-[#6a7387] md:flex">
                    <Link
                        href={`/${locale}`}
                        className="transition-colors hover:text-[#ff6900]"
                    >
                        Ana Sayfa
                    </Link>
                    <ChevronRight className="h-4 w-4 text-[#94a1bb]" />
                    <Link
                        href={`/${locale}/portfoy`}
                        className="transition-colors hover:text-[#ff6900]"
                    >
                        Portföy
                    </Link>
                    <ChevronRight className="h-4 w-4 text-[#94a1bb]" />
                    <span className="truncate font-medium text-[#111828]">{title}</span>
                </nav>

                <section className="-mx-4 sm:-mx-6 md:mx-0">
                    <ListingDetailGallery
                        items={imageItems}
                        title={title}
                        isRemoved={isRemovedListing}
                    />
                    <div className="px-4 pt-3 sm:px-6 md:hidden">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="rounded-full bg-[#ff6900] px-4 py-2 text-white">
                                {saleTypeLabel}
                            </span>
                            <span className="rounded-full bg-[#5099ff] px-4 py-2 text-white">
                                {propertyTypeLabel}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-10">
                        <header className="space-y-4">
                            <div className="md:flex md:items-start md:justify-between md:gap-6">
                                <div className="space-y-2.5">
                                    <h1 className="text-[clamp(1.65rem,6vw,2.15rem)] font-semibold leading-tight text-[#111828] md:text-[clamp(1.8rem,2.7vw,2.25rem)]">
                                        {title}
                                    </h1>

                                    <p className="flex items-start gap-2 text-sm text-[#5b667f] sm:text-base">
                                        <MapPin className="h-4 w-4 shrink-0 text-[#5099ff]" />
                                        <span>{locationLabel || "Konum belirtilmedi"}</span>
                                    </p>
                                </div>

                                <div className="hidden min-w-[210px] rounded-[1.25rem] border border-gray-200 bg-white px-5 py-4 text-right md:block">
                                    <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Fiyat</p>
                                    <p className="mt-1 text-3xl font-semibold leading-none text-[#111828]">
                                        <ListingPriceDisplay price={priceValue} currency={listing.currency} />
                                    </p>
                                </div>
                            </div>

                            <p className="text-[clamp(2rem,8vw,3rem)] font-semibold leading-none text-[#111828] md:hidden">
                                <ListingPriceDisplay price={priceValue} currency={listing.currency} />
                            </p>

                            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm font-medium md:hidden">
                                {showRooms && roomValue && roomValue !== "-" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                        <BedDouble className="h-4 w-4 text-gray-400" />
                                        {roomValue} Oda
                                    </span>
                                )}
                                {showBathrooms && bathroomValue && bathroomValue !== "-" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                        <Bath className="h-4 w-4 text-gray-400" />
                                        {bathroomValue} Banyo
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                    <Square className="h-4 w-4 text-gray-400" />
                                    {formatArea(listing.area)}
                                </span>
                                {showZoning && zoningLabel && zoningLabel !== "-" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                        <Layers className="h-4 w-4 text-gray-400" />
                                        {zoningLabel}
                                    </span>
                                )}
                            </div>

                            <div className="hidden flex-wrap gap-2.5 text-sm font-medium md:flex">
                                <span className="rounded-full bg-[#ff6900] px-4 py-2 text-white">
                                    {saleTypeLabel}
                                </span>
                                <span className="rounded-full bg-[#5099ff] px-4 py-2 text-white">
                                    {propertyTypeLabel}
                                </span>
                                {showRooms && roomValue && roomValue !== "-" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                        <BedDouble className="h-4 w-4 text-gray-400" />
                                        {roomValue} Oda
                                    </span>
                                )}
                                {showBathrooms && bathroomValue && bathroomValue !== "-" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                        <Bath className="h-4 w-4 text-gray-400" />
                                        {bathroomValue} Banyo
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                    <Square className="h-4 w-4 text-gray-400" />
                                    {formatArea(listing.area)}
                                </span>
                                {showZoning && zoningLabel && zoningLabel !== "-" && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-[#111828]">
                                        <Layers className="h-4 w-4 text-gray-400" />
                                        {zoningLabel}
                                    </span>
                                )}
                            </div>
                        </header>

                        <section className="rounded-[1.9rem] border border-gray-200 bg-white p-6">
                            <h2 className="text-2xl font-semibold text-[#111828]">Açıklama</h2>
                            <p className="mt-4 whitespace-pre-line text-[1.02rem] leading-relaxed text-[#3d4962]">
                                {description}
                            </p>

                            {listedFeatures.length > 0 ? (
                                <div className="mt-7 border-t border-gray-100 pt-6">
                                    <h3 className="text-xl font-semibold text-[#111828]">
                                        Öne Çıkan Özellikler
                                    </h3>
                                    <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                                        {listedFeatures.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex items-start gap-3 text-[0.97rem] text-[#111828]"
                                            >
                                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff6900]" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </section>

                        <section className="rounded-[1.9rem] border border-gray-200 bg-white p-6">
                            <h2 className="text-2xl font-semibold text-[#111828]">İlan Detayları</h2>
                            <dl className="mt-5 grid gap-x-8 gap-y-3 md:grid-cols-2">
                                {visibleDetailItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-baseline justify-between gap-4 border-b border-gray-100 pb-2"
                                    >
                                        <dt className="text-sm font-medium text-[#62708c]">{item.label}</dt>
                                        <dd className="text-sm font-semibold text-[#111828]">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        {mapEmbedSrc ? (
                            <section className="overflow-hidden rounded-[1.9rem] border border-gray-200 bg-white">
                                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
                                    <h2 className="text-2xl font-semibold text-[#111828]">Harita</h2>
                                    {mapsLink ? (
                                        <a
                                            href={mapsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-[#ff6900] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e85f00]"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            Google Maps&apos;te Aç
                                        </a>
                                    ) : null}
                                </div>
                                <div className="aspect-[16/8] w-full bg-gray-100">
                                    <iframe
                                        title="İlan haritası"
                                        src={mapEmbedSrc}
                                        className="h-full w-full pointer-events-none md:pointer-events-auto"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </section>
                        ) : null}

                        {similarListings.length > 0 ? (
                            <section className="space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-2xl font-semibold text-[#111828]">
                                        Benzer İlanlar
                                    </h2>
                                    <Link
                                        href={moreListingsHref}
                                        className="inline-flex items-center rounded-xl bg-[#111f3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0c1830]"
                                    >
                                        Daha fazla göster
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
                                    {similarListings.map((similar) => (
                                        <article
                                            key={similar.id}
                                            className="group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-[0_12px_30px_rgba(17,24,40,0.10)]"
                                        >
                                            <div className="grid h-full grid-cols-1">
                                                <Link
                                                    href={`/${locale}/ilan/${similar.slug}`}
                                                    className="relative block overflow-hidden bg-gray-100"
                                                >
                                                    {similar.imageUrl ? (
                                                        <Image
                                                            src={similar.imageUrl}
                                                            alt={similar.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-400">
                                                            Görsel yok
                                                        </div>
                                                    )}

                                                    <div className="relative aspect-[16/10] md:aspect-[16/9]" />

                                                    <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
                                                        <span className="rounded bg-[#5099ff] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                                            {similar.typeLabel}
                                                        </span>
                                                        <span className="rounded bg-[#ff6900] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                                                            {similar.saleTypeLabel}
                                                        </span>
                                                    </div>
                                                </Link>

                                                <div className="relative flex min-w-0 flex-col justify-between p-4 lg:p-5">
                                                    <div>
                                                        <Link
                                                            href={`/${locale}/ilan/${similar.slug}`}
                                                            className="block"
                                                        >
                                                            <h3 className="line-clamp-2 break-words text-base font-semibold text-gray-900 transition-colors group-hover:text-orange-600">
                                                                {similar.title}
                                                            </h3>
                                                        </Link>

                                                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            <span className="line-clamp-1 min-w-0">
                                                                {similar.locationLabel || "Konum belirtilmedi"}
                                                            </span>
                                                        </p>

                                                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 md:hidden">
                                                            <p className="text-[1.45rem] font-semibold leading-none text-[#111828]">
                                                                <ListingPriceDisplay price={similar.price} currency={similar.currency} />
                                                            </p>
                                                            <Link
                                                                href={`/${locale}/ilan/${similar.slug}`}
                                                                className="inline-flex items-center rounded-[1.35rem] bg-[#111f3a] px-5 py-3 text-base font-semibold text-white"
                                                            >
                                                                incele -&gt;
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 hidden grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-xs md:grid">
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-400">
                                                                Oda
                                                            </p>
                                                            <p className="mt-1 font-semibold text-gray-700">
                                                                {similar.roomLabel}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-400">
                                                                Alan
                                                            </p>
                                                            <p className="mt-1 font-semibold text-gray-700">
                                                                {similar.areaLabel}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-400">
                                                                İşlem
                                                            </p>
                                                            <p className="mt-1 font-semibold text-gray-700">
                                                                {similar.saleTypeLabel}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 hidden items-end justify-between gap-3 border-t border-gray-100 pt-3 md:flex">
                                                        <p className="text-[clamp(1.45rem,1.9vw,1.8rem)] font-semibold leading-none text-[#111828]">
                                                            <ListingPriceDisplay price={similar.price} currency={similar.currency} />
                                                        </p>
                                                        <Link
                                                            href={`/${locale}/ilan/${similar.slug}`}
                                                            className="inline-flex shrink-0 items-center rounded-xl bg-[#111f3a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c1830]"
                                                        >
                                                            incele -&gt;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ) : null}
                    </div>

                    <ListingContactPanel
                        title={title}
                        listingSlug={slug}
                        locale={locale}
                        listingCode={listing.sku}
                        phoneNumber={WHATSAPP_NUMBER}
                        phoneLabel="+90 242 123 45 67"
                    />
                </section>
            </div>
        </main>
    );
}
