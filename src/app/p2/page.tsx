import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations, roomOptions } from "@/data/mockListings";

/**
 * Variant P2: Mediterranean Coastal Premium (WITH wireframe)
 * 
 * Design philosophy: Airy sunlit feeling, warm and welcoming, premium restraint.
 * Warm sandy tones, ocean-inspired accents, relaxed elegance.
 * 
 * Layout: Left sidebar filters + horizontal listing cards (per wireframe)
 * Font: Playfair Display (display) + DM Sans (body)
 */
export default function PortfolioMediterraneanCoastalPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen" style={{ backgroundColor: "#FDFBF8" }}>
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md" style={{ backgroundColor: "rgba(253, 251, 248, 0.95)" }}>
                    <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
                                <span className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>G</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Güzel Invest
                                </span>
                                <span className="text-xs text-orange-500/70 tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Akdeniz'in Güzel Yüzü
                                </span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm transition-all hover:-translate-y-0.5 ${idx === 1 ? "text-orange-500 font-medium" : "text-gray-500 hover:text-gray-800"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-5">
                            {/* Language Switcher */}
                            <div className="hidden md:flex items-center gap-0.5 bg-white rounded-full px-1 py-1 shadow-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button
                                        key={lang}
                                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${idx === 0 ? "bg-orange-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/905551234567"
                                className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-green-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                İletişim
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-32 pb-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-3 mb-6">
                                <span className="w-12 h-px bg-orange-300" />
                                <span className="text-sm text-orange-500 tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Portföy
                                </span>
                                <span className="w-12 h-px bg-orange-300" />
                            </div>
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-800 mb-6"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Akdeniz'in En Güzel <br />
                                <span className="italic text-orange-500">Gayrimenkulleri</span>
                            </h1>
                            <p className="text-gray-500 max-w-2xl mx-auto text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                Güneşin, denizin ve doğanın buluştuğu Alanya'da hayalinizdeki yaşamı keşfedin.
                            </p>
                        </div>

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 p-5 bg-white rounded-2xl shadow-sm">
                            <p className="text-sm text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                <span className="font-semibold text-gray-800">{mockListings.length}</span> sonuç
                            </p>
                            <div className="flex items-center gap-3">
                                {/* Sort */}
                                <select
                                    className="text-sm text-gray-600 bg-gray-50 border-0 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    <option>Sırala</option>
                                    <option>Fiyat: Düşükten Yükseğe</option>
                                    <option>Fiyat: Yüksekten Düşüğe</option>
                                    <option>En Yeni</option>
                                </select>
                                {/* View Toggle */}
                                <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden">
                                    <button className="p-2.5 bg-orange-500 text-white">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    </button>
                                    <button className="p-2.5 text-gray-400 hover:text-gray-600">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Map Button */}
                                <button
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-200/50 hover:shadow-xl transition-all"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita
                                </button>
                            </div>
                        </div>

                        {/* Layout: Sidebar + Listings */}
                        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
                            {/* Sidebar Filters */}
                            <aside className="bg-white rounded-3xl p-8 shadow-sm h-fit sticky top-32" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                <h3 className="text-lg font-semibold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Filtreler
                                </h3>

                                {/* Category */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-600 mb-4">Kategori</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {propertyTypes.map((type, idx) => (
                                            <button
                                                key={type.value}
                                                className={`px-4 py-2 rounded-full text-sm transition-all ${idx === 0 ? "bg-orange-500 text-white shadow-md" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-600 mb-4">Fiyat Aralığı</h4>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder="Min €"
                                            className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        />
                                        <span className="text-gray-300">—</span>
                                        <input
                                            type="text"
                                            placeholder="Max €"
                                            className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-600 mb-4">Konum</h4>
                                    <select className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200">
                                        {locations.map((loc) => (
                                            <option key={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Area */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-600 mb-4">m² Aralığı</h4>
                                    <input
                                        type="text"
                                        placeholder="Minimum m²"
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>

                                {/* Rooms */}
                                <div className="mb-8">
                                    <h4 className="text-sm font-medium text-gray-600 mb-4">Oda Sayısı</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {roomOptions.slice(0, 5).map((room, idx) => (
                                            <button
                                                key={room}
                                                className={`w-12 h-12 rounded-xl text-sm font-medium transition-all ${idx === 2 ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-600 hover:bg-orange-50"}`}
                                            >
                                                {room}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <button className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-orange-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                    Ara
                                </button>
                            </aside>

                            {/* Listings */}
                            <div className="space-y-6">
                                {mockListings.map((listing) => (
                                    <article
                                        key={listing.id}
                                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-0">
                                            {/* Image */}
                                            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                {/* Overlay gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                                {/* Image indicators */}
                                                {listing.images.length > 1 && (
                                                    <div className="absolute bottom-4 left-4 flex gap-1.5">
                                                        {listing.images.map((_, imgIdx) => (
                                                            <span
                                                                key={imgIdx}
                                                                className={`w-2 h-2 rounded-full transition-all ${imgIdx === 0 ? "bg-white w-6" : "bg-white/50"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Featured badge */}
                                                {listing.featured && (
                                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg">
                                                        ★ Öne Çıkan
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 flex flex-col justify-between" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                <div>
                                                    {/* Location tag */}
                                                    <div className="flex items-center gap-2 text-orange-500 text-sm mb-2">
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                        </svg>
                                                        {listing.location}
                                                    </div>
                                                    <h2
                                                        className="text-2xl font-medium text-gray-800 mb-3"
                                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                                    >
                                                        {listing.title}
                                                    </h2>
                                                    <p className="text-gray-500 leading-relaxed line-clamp-2 mb-4">
                                                        {listing.description}
                                                    </p>
                                                    {/* Meta */}
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                                            </svg>
                                                            {listing.sqm} m²
                                                        </span>
                                                        {listing.rooms !== "-" && (
                                                            <span className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                                </svg>
                                                                {listing.rooms}
                                                            </span>
                                                        )}
                                                        {/* Badges */}
                                                        {listing.badges.slice(0, 2).map((badge) => (
                                                            <span
                                                                key={badge}
                                                                className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg"
                                                            >
                                                                {badge}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Bottom row */}
                                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                                                    <p
                                                        className="text-3xl font-semibold text-gray-800"
                                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                                    >
                                                        {listing.currency}{listing.priceLabel}
                                                    </p>
                                                    <a
                                                        href="#"
                                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-orange-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                                    >
                                                        İncele
                                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-16 px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
                                    <span className="text-white font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>G</span>
                                </div>
                                <div>
                                    <span className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        Güzel Invest
                                    </span>
                                    <p className="text-sm text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Est. 2001 · Alanya, Türkiye
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                © 2024 Güzel Invest. Tüm hakları saklıdır.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
