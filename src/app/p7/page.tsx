import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations } from "@/data/mockListings";

/**
 * Variant P7: Mediterranean Coastal Premium (FREEFORM - NO wireframe)
 * 
 * Design philosophy: Airy sunlit feeling, warm and welcoming, premium restraint.
 * FREEFORM LAYOUT: Masonry grid, wave dividers, filter drawer, immersive hero.
 * 
 * Font: Libre Baskerville (display) + Nunito Sans (body)
 */
export default function PortfolioMediterraneanFreeformPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-white" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {/* Minimal Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-orange-100/50">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200">
                                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Libre Baskerville', serif" }}>G</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                Güzel Invest
                            </span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm font-medium ${idx === 1 ? "text-orange-500" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 text-xs">
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button
                                        key={lang}
                                        className={`px-2 py-1 rounded ${idx === 0 ? "bg-orange-500 text-white" : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            <a
                                href="https://wa.me/905551234567"
                                className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 hover:scale-110 transition-transform"
                            >
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Full Hero with Search */}
                <section className="relative h-[80vh] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop"
                        alt="Mediterranean Coast"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

                    {/* Overlaid content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <h1
                                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg"
                                style={{ fontFamily: "'Libre Baskerville', serif" }}
                            >
                                Akdeniz'in Güzeli
                            </h1>
                            <p className="text-white/80 text-xl mb-10 max-w-xl mx-auto">
                                Alanya'da hayalinizdeki gayrimenkulü keşfedin
                            </p>

                            {/* Search bar overlay */}
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl max-w-3xl mx-auto">
                                <div className="flex flex-wrap gap-3 items-center">
                                    <select className="flex-1 min-w-[140px] px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 border-0">
                                        <option>Tüm Kategoriler</option>
                                        {propertyTypes.map((type) => (
                                            <option key={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                    <select className="flex-1 min-w-[140px] px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 border-0">
                                        <option>Konum Seçin</option>
                                        {locations.map((loc) => (
                                            <option key={loc}>{loc}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Fiyat Aralığı"
                                        className="flex-1 min-w-[140px] px-4 py-3 bg-gray-50 rounded-xl text-sm border-0"
                                    />
                                    <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 hover:shadow-xl transition-all">
                                        Ara
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave divider */}
                    <svg className="absolute bottom-0 left-0 right-0 text-white" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
                        <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
                    </svg>
                </section>

                {/* Stats bar */}
                <section className="py-8 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-500" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                    {mockListings.length}+
                                </p>
                                <p className="text-sm text-gray-500">Aktif İlan</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-500" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                    23
                                </p>
                                <p className="text-sm text-gray-500">Yıllık Tecrübe</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-500" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                    500+
                                </p>
                                <p className="text-sm text-gray-500">Mutlu Müşteri</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-500" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                    ★ 4.9
                                </p>
                                <p className="text-sm text-gray-500">Müşteri Puanı</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Masonry Grid */}
                <section className="py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="text-orange-500 text-sm font-semibold mb-2">Keşfedin</p>
                                <h2
                                    className="text-3xl font-bold text-gray-800"
                                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                                >
                                    Tüm Gayrimenkuller
                                </h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <select className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5 border-0">
                                    <option>Varsayılan Sıralama</option>
                                    <option>Fiyat: Düşükten Yükseğe</option>
                                    <option>Fiyat: Yüksekten Düşüğe</option>
                                </select>
                                <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita
                                </button>
                            </div>
                        </div>

                        {/* Masonry-style grid */}
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {mockListings.map((listing, idx) => (
                                <article
                                    key={listing.id}
                                    className={`group break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 ${idx === 0 || idx === 3 ? "lg:row-span-2" : ""}`}
                                >
                                    {/* Image */}
                                    <div className={`relative overflow-hidden ${idx === 0 || idx === 3 ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {listing.featured && (
                                            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                ⭐ Öne Çıkan
                                            </div>
                                        )}
                                        {/* Hover overlay with CTA */}
                                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                            <a
                                                href="#"
                                                className="block w-full py-3 bg-white text-gray-900 rounded-xl text-sm font-semibold text-center shadow-lg"
                                            >
                                                Detayları Gör
                                            </a>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-orange-500 text-xs font-medium mb-2">
                                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                            {listing.location}
                                        </div>
                                        <h3
                                            className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors"
                                            style={{ fontFamily: "'Libre Baskerville', serif" }}
                                        >
                                            {listing.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                {listing.sqm} m²
                                            </span>
                                            {listing.rooms !== "-" && (
                                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                                    {listing.rooms}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p
                                                className="text-xl font-bold text-gray-800"
                                                style={{ fontFamily: "'Libre Baskerville', serif" }}
                                            >
                                                {listing.currency}{listing.priceLabel}
                                            </p>
                                            {listing.badges.slice(0, 1).map((badge) => (
                                                <span
                                                    key={badge}
                                                    className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full"
                                                >
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 bg-gradient-to-r from-orange-50 to-amber-50">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center">
                                <span className="text-white font-bold" style={{ fontFamily: "'Libre Baskerville', serif" }}>G</span>
                            </div>
                            <span className="font-bold text-gray-800" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                Güzel Invest
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">© 2024 Güzel Invest · Est. 2001</p>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
