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
    BedDouble,
    Building2,
    ChevronRight,
    CircleDollarSign,
    Mail,
    MapPin,
    MessageCircleMore,
    PhoneCall,
    Send,
    User,
} from "lucide-react";
import {
    ListingDetailGallery,
    type ListingGalleryItem,
} from "@/components/public/listing-detail-gallery";

const WHATSAPP_NUMBER = "902421234567";

function formatBoolean(value: boolean) {
    return value ? "Var" : "Yok";
}

function toNumber(value: unknown) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export default async function ListingDetailPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;

    const listing = await prisma.listing.findUnique({
        where: {
            slug,
            status: ListingStatus.PUBLISHED,
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
        { label: "İlan Tipi", value: getSaleTypeLabel(listing.saleType, "tr") },
        { label: "Kategori", value: getPropertyTypeLabel(listing.type, "tr") },
        { label: "Brüt Alan", value: formatArea(listing.area) },
        { label: "Oda Düzeni", value: roomValue },
        {
            label: "Banyo",
            value:
                typeof listing.bathrooms === "number"
                    ? `${listing.bathrooms}`
                    : "-",
        },
        {
            label: "WC",
            value: typeof listing.wcCount === "number" ? `${listing.wcCount}` : "-",
        },
        {
            label: "Bulunduğu Kat",
            value: typeof listing.floor === "number" ? `${listing.floor}` : "-",
        },
        {
            label: "Toplam Kat",
            value:
                typeof listing.totalFloors === "number"
                    ? `${listing.totalFloors}`
                    : "-",
        },
        {
            label: "Bina Yaşı",
            value:
                typeof listing.buildYear === "number"
                    ? `${new Date().getFullYear() - listing.buildYear}`
                    : "-",
        },
        { label: "Isıtma", value: listing.heating || "-" },
        { label: "Eşya Durumu", value: listing.furnished ? "Eşyalı" : "Eşyasız" },
        { label: "Asansör", value: formatBoolean(listing.elevator) },
        { label: "Otopark", value: formatBoolean(listing.parking) },
        { label: "Havuz", value: formatBoolean(listing.pool) },
        { label: "Bahçe", value: formatBoolean(listing.garden) },
        { label: "Güvenlik", value: formatBoolean(listing.security) },
        { label: "Deniz Manzarası", value: formatBoolean(listing.seaView) },
        {
            label: "Vatandaşlığa Uygunluk",
            value: listing.citizenshipEligible ? "Uygun" : "Uygun değil",
        },
        {
            label: "İkamete Uygunluk",
            value: listing.residenceEligible ? "Uygun" : "Uygun değil",
        },
    ];

    return (
        <main className="bg-white pt-24 pb-20">
            <div className="container-custom space-y-9">
                <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-gray-500">
                    <Link
                        href={`/${locale}`}
                        className="transition-colors hover:text-orange-600"
                    >
                        Ana Sayfa
                    </Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Link
                        href={`/${locale}/portfoy`}
                        className="transition-colors hover:text-orange-600"
                    >
                        Portföy
                    </Link>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="truncate font-medium text-gray-900">{title}</span>
                </nav>

                <section className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.95fr)_360px]">
                    <div className="space-y-8">
                        <ListingDetailGallery items={imageItems} title={title} />
                        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
                            <div className="rounded-[2rem] border border-[#d6dde8] bg-[#f5f7fb] px-5 py-4">
                                <p className="text-xs font-medium text-[#6b7382]">Konum</p>
                                <p className="mt-1 flex items-center gap-2 text-[1.8rem] font-semibold leading-tight text-[#111828]">
                                    <MapPin className="h-5 w-5 shrink-0 text-[#111828]" />
                                    <span className="text-xl">{locationLabel || "Belirtilmedi"}</span>
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-[#d6dde8] bg-[#f5f7fb] px-5 py-4">
                                <p className="text-xs font-medium text-[#6b7382]">Mülk Tipi</p>
                                <p className="mt-1 flex items-center gap-2 text-[1.8rem] font-semibold leading-tight text-[#111828]">
                                    <Building2 className="h-5 w-5 shrink-0 text-[#111828]" />
                                    <span className="text-xl">{getPropertyTypeLabel(listing.type, "tr")}</span>
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-[#d6dde8] bg-[#f5f7fb] px-5 py-4">
                                <p className="text-xs font-medium text-[#6b7382]">Fiyat</p>
                                <p className="mt-1 flex items-center gap-2 text-[1.8rem] font-semibold leading-tight text-[#111828]">
                                    <CircleDollarSign className="h-5 w-5 shrink-0 text-[#111828]" />
                                    <span className="text-xl">{formatPrice(priceValue, listing.currency)}</span>
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-[#d6dde8] bg-[#f5f7fb] px-5 py-4">
                                <p className="text-xs font-medium text-[#6b7382]">Oda</p>
                                <p className="mt-1 flex items-center gap-2 text-[1.8rem] font-semibold leading-tight text-[#111828]">
                                    <BedDouble className="h-5 w-5 shrink-0 text-[#111828]" />
                                    <span className="text-xl">{roomValue}</span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <article className="rounded-[2rem] border border-gray-300 bg-white/95 p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900">Açıklama</h2>
                                <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">
                                    {description}
                                </p>
                            </article>
                        </section>

                        <section className="rounded-[2rem] border border-gray-300 bg-white/95 p-6 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900">İlan Detayları</h2>
                            <div className="mt-5 grid gap-3 md:grid-cols-2">
                                {detailItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                                    >
                                        <span className="text-sm font-medium text-gray-500">{item.label}</span>
                                        <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            {listedFeatures.length > 0 ? (
                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <h3 className="text-lg font-bold text-gray-900">Öne Çıkan Özellikler</h3>
                                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                                        {listedFeatures.map((feature) => (
                                            <li
                                                key={feature}
                                                className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700"
                                            >
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </section>

                        {mapEmbedSrc ? (
                            <section className="overflow-hidden rounded-[2rem] border border-gray-300 bg-white/95 shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
                                    <h2 className="text-2xl font-bold text-gray-900">Harita</h2>
                                    {mapsLink ? (
                                        <a
                                            href={mapsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
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
                                        className="h-full w-full"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </section>
                        ) : null}
                    </div>

                    <aside className="sticky top-28 self-start space-y-4">
                        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[2rem] border border-gray-300 bg-white/95 p-6 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.4)] backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-gray-900">İletişime Geçin</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Uzman danışmanlarımız bu ilan için aynı gün içinde geri dönüş sağlar.
                            </p>

                            <form className="mt-5 space-y-3">
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                                    <User className="h-4 w-4 shrink-0 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Adınız Soyadınız *"
                                        className="w-full border-0 bg-transparent p-0 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                                    <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="E-posta Adresiniz *"
                                        className="w-full border-0 bg-transparent p-0 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                                    <PhoneCall className="h-4 w-4 shrink-0 text-gray-400" />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="Telefon Numaranız *"
                                        className="w-full border-0 bg-transparent p-0 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                                    <MessageCircleMore className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                                    <textarea
                                        rows={5}
                                        placeholder="Mesajınız"
                                        className="w-full resize-none border-0 bg-transparent p-0 text-base leading-relaxed text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                        defaultValue={`Merhaba, ${title} ilanı hakkında bilgi almak istiyorum.`}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
                                >
                                    <Send className="h-4 w-4" />
                                    Gönder
                                </button>
                            </form>

                            <a
                                href={`tel:+${WHATSAPP_NUMBER}`}
                                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
                            >
                                <PhoneCall className="h-4 w-4" />
                                +90 242 123 45 67
                            </a>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
    );
}
