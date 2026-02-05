import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations } from "@/data/mockListings";

/**
 * Variant P6: Heritage Modern Minimal (FREEFORM - NO wireframe)
 * 
 * Design philosophy: Timeless refinement, subtle heritage cues, "Est. 2001" trust moment.
 * FREEFORM LAYOUT: Editorial magazine style with vertical scrolling gallery,
 * full-width featured listings, inline filter pills.
 * 
 * Font: Fraunces (display) + Source Sans 3 (body)
 */
export default function PortfolioHeritageModernFreeformPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Source+Sans+3:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#FFFEF9]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {/* Editorial Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-[#FFFEF9] border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-8">
                        {/* Top bar */}
                        <div className="flex items-center justify-between h-12 border-b border-gray-50 text-xs text-gray-400">
                            <span>Est. 2001 · Alanya, Türkiye</span>
                            <div className="flex items-center gap-4">
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button key={lang} className={idx === 0 ? "text-gray-700" : "hover:text-gray-600"}>
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Main nav */}
                        <div className="flex items-center justify-between h-16">
                            <span
                                className="text-3xl font-semibold text-gray-900 tracking-tight"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Güzel Invest
                            </span>
                            <nav className="hidden md:flex items-center gap-10">
                                {["Ana Sayfa", "Portföy", "Hizmetler", "Hakkımızda", "İletişim"].map((item, idx) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className={`text-sm ${idx === 1 ? "text-gray-900 font-medium border-b border-gray-900 pb-0.5" : "text-gray-500 hover:text-gray-800"}`}
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>
                            <a
                                href="https://wa.me/905551234567"
                                className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800"
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                İletişim
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-32">
                    {/* Hero - Full Width Featured */}
                    <section className="relative h-[70vh] overflow-hidden">
                        <img
                            src={mockListings[0].images[0]}
                            alt={mockListings[0].title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-12">
                            <div className="max-w-7xl mx-auto">
                                <span className="text-white/80 text-sm tracking-widest uppercase mb-4 block">
                                    Öne Çıkan İlan
                                </span>
                                <h2
                                    className="text-5xl md:text-6xl font-semibold text-white mb-4 max-w-2xl"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    {mockListings[0].title}
                                </h2>
                                <div className="flex items-center gap-6 text-white/80 text-sm mb-6">
                                    <span>{mockListings[0].location}</span>
                                    <span>·</span>
                                    <span>{mockListings[0].sqm} m²</span>
                                    <span>·</span>
                                    <span>{mockListings[0].rooms}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span
                                        className="text-4xl font-semibold text-white"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        {mockListings[0].currency}{mockListings[0].priceLabel}
                                    </span>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 text-sm font-medium hover:bg-gray-100 transition-colors"
                                    >
                                        İncele
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filter Pills - Inline */}
                    <section className="py-8 px-8 border-b border-gray-100">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="text-sm text-gray-400">Filtrele:</span>
                                {propertyTypes.map((type, idx) => (
                                    <button
                                        key={type.value}
                                        className={`px-4 py-2 text-sm border transition-colors ${idx === 0 ? "border-gray-900 text-gray-900" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                                <span className="w-px h-6 bg-gray-200 mx-2" />
                                <select className="text-sm text-gray-500 border border-gray-200 px-4 py-2 bg-transparent">
                                    {locations.slice(0, 5).map((loc) => (
                                        <option key={loc}>{loc}</option>
                                    ))}
                                </select>
                                <select className="text-sm text-gray-500 border border-gray-200 px-4 py-2 bg-transparent">
                                    <option>Fiyat Aralığı</option>
                                    <option>€100k - €300k</option>
                                    <option>€300k - €500k</option>
                                    <option>€500k+</option>
                                </select>
                                <div className="ml-auto flex items-center gap-4">
                                    <span className="text-sm text-gray-500">{mockListings.length} sonuç</span>
                                    <button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                        </svg>
                                        Harita
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Editorial Grid */}
                    <section className="py-16 px-8">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-end justify-between mb-12">
                                <div>
                                    <span className="text-sm text-gray-400 tracking-widest uppercase">Koleksiyon</span>
                                    <h2
                                        className="text-4xl font-semibold text-gray-900 mt-2"
                                        style={{ fontFamily: "'Fraunces', serif" }}
                                    >
                                        Seçkin Gayrimenkuller
                                    </h2>
                                </div>
                                <span className="text-sm text-gray-400 italic" style={{ fontFamily: "'Fraunces', serif" }}>
                                    "Kaliteli yaşam, kaliteli yatırım"
                                </span>
                            </div>

                            {/* Alternating layout */}
                            <div className="space-y-16">
                                {mockListings.slice(1).map((listing, idx) => (
                                    <article
                                        key={listing.id}
                                        className={`group grid grid-cols-1 lg:grid-cols-2 gap-10 ${idx % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden lg:[direction:ltr]">
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {listing.featured && (
                                                <div className="absolute top-4 left-4 bg-gray-900 text-white text-[10px] tracking-widest uppercase px-3 py-1.5">
                                                    Öne Çıkan
                                                </div>
                                            )}
                                            {/* Number */}
                                            <div
                                                className="absolute -bottom-6 -right-4 text-8xl font-bold text-gray-100 -z-10"
                                                style={{ fontFamily: "'Fraunces', serif" }}
                                            >
                                                {String(idx + 2).padStart(2, '0')}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col justify-center lg:[direction:ltr]">
                                            <p className="text-sm text-gray-400 mb-3">{listing.location}</p>
                                            <h3
                                                className="text-3xl font-semibold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors"
                                                style={{ fontFamily: "'Fraunces', serif" }}
                                            >
                                                {listing.title}
                                            </h3>
                                            <p className="text-gray-500 leading-relaxed mb-6">
                                                {listing.description}
                                            </p>
                                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                                <span className="flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                    {listing.sqm} m²
                                                </span>
                                                {listing.rooms !== "-" && (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                                        {listing.rooms}
                                                    </span>
                                                )}
                                                {listing.badges.map((badge) => (
                                                    <span key={badge} className="text-orange-600">{badge}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                                <span
                                                    className="text-3xl font-semibold text-gray-900"
                                                    style={{ fontFamily: "'Fraunces', serif" }}
                                                >
                                                    {listing.currency}{listing.priceLabel}
                                                </span>
                                                <a
                                                    href="#"
                                                    className="inline-flex items-center gap-2 text-sm text-gray-900 border-b border-gray-900 pb-0.5 hover:text-orange-600 hover:border-orange-600 transition-colors"
                                                >
                                                    Detayları Gör
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Trust Section */}
                    <section className="py-20 px-8 bg-gray-50 border-y border-gray-100">
                        <div className="max-w-7xl mx-auto text-center">
                            <span
                                className="text-6xl font-bold text-gray-200"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                Est. 2001
                            </span>
                            <p className="text-gray-500 mt-4">20+ yıldır Alanya'da güvenilir gayrimenkul danışmanlığı</p>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="py-12 px-8 bg-[#FFFEF9]">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <span
                            className="text-2xl font-semibold text-gray-900"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            Güzel Invest
                        </span>
                        <p className="text-sm text-gray-400">© 2024 Güzel Invest. Tüm hakları saklıdır.</p>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
