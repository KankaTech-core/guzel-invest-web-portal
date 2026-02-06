import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@/generated/prisma";
import { formatPrice, formatArea, getMediaUrl } from "@/lib/utils";
import { BedDouble, Bath, Square, MapPin, Share2, Printer, Map as MapIcon, ChevronRight } from "lucide-react";

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
                where: { locale },
            },
            media: {
                orderBy: { order: "asc" },
            },
        },
    });

    if (!listing) {
        notFound();
    }

    const translation = listing.translations[0] || {};

    const priceValue =
        typeof listing.price === "object" && listing.price !== null && "toString" in listing.price
            ? listing.price.toString()
            : listing.price;
    const locationLabel = [
        listing.address,
        listing.neighborhood,
        listing.district,
        listing.city,
    ]
        .filter(Boolean)
        .join(", ");
    const latitudeValue =
        typeof listing.latitude === "number" && !Number.isNaN(listing.latitude)
            ? listing.latitude
            : null;
    const longitudeValue =
        typeof listing.longitude === "number" && !Number.isNaN(listing.longitude)
            ? listing.longitude
            : null;
    const hasCoordinates =
        latitudeValue !== null &&
        longitudeValue !== null &&
        !(latitudeValue === 0 && longitudeValue === 0);
    const mapSrc = hasCoordinates
        ? `https://www.google.com/maps?q=${latitudeValue},${longitudeValue}&z=15&output=embed`
        : locationLabel
            ? `https://www.google.com/maps?q=${encodeURIComponent(
                locationLabel
            )}&z=15&output=embed`
            : null;

    return (
        <main className="pt-24 pb-20">
            <div className="container-custom">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap">
                    <a href={`/${locale}`} className="hover:text-amber-600 transition-colors">Ana Sayfa</a>
                    <ChevronRight className="w-4 h-4" />
                    <a href={`/${locale}/portfoy`} className="hover:text-amber-600 transition-colors">Portföy</a>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 font-medium truncate">{translation.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Gallery Placeholder/Basic */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {listing.media.map((item: any, index: number) => (
                                <div key={item.id} className={index === 0 ? "md:col-span-2 aspect-video relative rounded-2xl overflow-hidden" : "aspect-video relative rounded-xl overflow-hidden"}>
                                    <Image
                                        src={getMediaUrl(item.url)}
                                        alt={`${translation.title} - ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                    />
                                </div>
                            ))}
                            {listing.media.length === 0 && (
                                <div className="md:col-span-2 aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-medium">
                                    Görsel bulunamadı
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    {listing.saleType === "SALE" ? "Satılık" : "Kiralık"}
                                </span>
                                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                    {listing.type}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                                {translation.title}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-500 mb-6">
                                <MapPin className="w-5 h-5 text-amber-600" />
                                <span className="text-lg">
                                    {[listing.neighborhood, listing.district, listing.city]
                                        .filter(Boolean)
                                        .join(", ")}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Fiyat</span>
                                    <span className="text-xl font-bold text-amber-600">{formatPrice(priceValue, listing.currency)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Alan</span>
                                    <span className="text-xl font-bold text-slate-900">{formatArea(listing.area)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Odalar</span>
                                    <span className="text-xl font-bold text-slate-900">{listing.rooms || listing.bedrooms || "-"}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Banyolar</span>
                                    <span className="text-xl font-bold text-slate-900">{listing.bathrooms || "-"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b pb-2">Açıklama</h2>
                            <div className="text-slate-600 whitespace-pre-line leading-relaxed">
                                {translation.description}
                            </div>
                        </div>

                        {mapSrc && (
                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <MapIcon className="w-4 h-4 text-amber-600" />
                                        Konum
                                    </div>
                                    <span className="text-xs text-slate-400">Google Maps</span>
                                </div>
                                <div className="aspect-[16/9] w-full">
                                    <iframe
                                        title="İlan konumu haritası"
                                        src={mapSrc}
                                        className="w-full h-full"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                                {locationLabel && (
                                    <div className="px-6 py-4 text-sm text-slate-500 bg-white border-t border-slate-100">
                                        {locationLabel}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Contact Form Placeholder */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 sticky top-28">
                            <h3 className="text-xl font-bold mb-6">İletişime Geçin</h3>
                            <form className="space-y-4">
                                <div>
                                    <input type="text" placeholder="Adınız Soyadınız" className="input" />
                                </div>
                                <div>
                                    <input type="email" placeholder="E-posta Adresiniz" className="input" />
                                </div>
                                <div>
                                    <input type="tel" placeholder="Telefon Numaranız" className="input" />
                                </div>
                                <div>
                                    <textarea placeholder="Mesajınız" rows={4} className="input resize-none"></textarea>
                                </div>
                                <button type="submit" className="w-full btn btn-primary py-4 text-lg">
                                    Gönder
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4">
                                <button className="flex items-center gap-3 text-slate-600 hover:text-amber-600 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                    <span className="font-medium">Paylaş</span>
                                </button>
                                <button className="flex items-center gap-3 text-slate-600 hover:text-amber-600 transition-colors">
                                    <Printer className="w-5 h-5" />
                                    <span className="font-medium">Yazdır (PDF)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
