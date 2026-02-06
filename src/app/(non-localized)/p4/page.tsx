import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations, roomOptions } from "@/data/mockListings";

/**
 * Variant P4: Scandinavian Calm Premium (WITH wireframe)
 * 
 * Design philosophy: Soft, human, calm composition, gentle rounded shapes,
 * lots of breathing room. Zen-like simplicity with warmth.
 * 
 * Layout: Left sidebar filters + horizontal listing cards (per wireframe)
 * Font: Quicksand (display) + Poppins (body)
 */
export default function PortfolioScandinavianCalmPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#FAFAF9]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAFAF9]/90 backdrop-blur-lg">
                    <div className="max-w-6xl mx-auto px-10 h-24 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center">
                                <span className="text-orange-500 font-bold text-2xl" style={{ fontFamily: "'Quicksand', sans-serif" }}>G</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-semibold text-gray-700" style={{ fontFamily: "'Quicksand', sans-serif" }}>
                                    Güzel Invest
                                </span>
                                <span className="text-xs text-gray-400 font-light">
                                    Huzurlu Yaşam Alanları
                                </span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-12">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm font-medium transition-colors ${idx === 1 ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            {/* Language Switcher */}
                            <div className="hidden md:flex items-center gap-3 text-sm text-gray-400">
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button
                                        key={lang}
                                        className={`transition-colors ${idx === 0 ? "text-gray-600 font-medium" : "hover:text-gray-500"}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/905551234567"
                                className="flex items-center gap-2 bg-green-50 text-green-600 px-5 py-3 rounded-2xl text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Mesaj
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-36 pb-24 px-10">
                    <div className="max-w-6xl mx-auto">
                        {/* Page Title */}
                        <div className="text-center mb-20">
                            <h1
                                className="text-4xl md:text-5xl font-semibold text-gray-700 mb-6 leading-tight"
                                style={{ fontFamily: "'Quicksand', sans-serif" }}
                            >
                                Huzur Dolu Yaşam Alanları
                            </h1>
                            <p className="text-gray-400 max-w-lg mx-auto text-lg font-light leading-relaxed">
                                Alanya'nın en güzel köşelerinde, size özel seçilmiş gayrimenkuller.
                            </p>
                        </div>

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                            <p className="text-sm text-gray-400">
                                <span className="font-medium text-gray-600">{mockListings.length}</span> sonuç
                            </p>
                            <div className="flex items-center gap-4">
                                {/* Sort */}
                                <select className="text-sm text-gray-500 bg-white border-0 rounded-2xl px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                                    <option>Sırala</option>
                                    <option>Fiyat ↑</option>
                                    <option>Fiyat ↓</option>
                                    <option>En Yeni</option>
                                </select>
                                {/* View Toggle */}
                                <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <button className="p-3 bg-orange-50 text-orange-500">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    </button>
                                    <button className="p-3 text-gray-300 hover:text-gray-400">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Map Button */}
                                <button className="flex items-center gap-2 bg-white text-gray-500 px-5 py-3 rounded-2xl text-sm font-medium shadow-sm hover:shadow-md transition-all">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita
                                </button>
                            </div>
                        </div>

                        {/* Layout: Sidebar + Listings */}
                        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-16">
                            {/* Sidebar Filters */}
                            <aside className="space-y-10">
                                <div>
                                    <h3
                                        className="text-lg font-semibold text-gray-600 mb-6"
                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                    >
                                        Filtreler
                                    </h3>
                                </div>

                                {/* Category */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-4">Kategori</h4>
                                    <div className="space-y-3">
                                        {propertyTypes.map((type, idx) => (
                                            <label key={type.value} className="flex items-center gap-4 cursor-pointer group">
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${idx === 0 ? "border-orange-400 bg-orange-50" : "border-gray-200 group-hover:border-gray-300"}`}>
                                                    {idx === 0 && (
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" className="text-orange-500" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                                    {type.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-4">Fiyat Aralığı</h4>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Minimum €"
                                            className="w-full px-5 py-4 bg-white border-0 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Maksimum €"
                                            className="w-full px-5 py-4 bg-white border-0 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-4">Konum</h4>
                                    <select className="w-full px-5 py-4 bg-white border-0 rounded-2xl text-sm text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
                                        {locations.map((loc) => (
                                            <option key={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Area */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-4">Alan (m²)</h4>
                                    <input
                                        type="text"
                                        placeholder="Minimum m²"
                                        className="w-full px-5 py-4 bg-white border-0 rounded-2xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>

                                {/* Rooms */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-4">Oda Sayısı</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {roomOptions.slice(0, 5).map((room, idx) => (
                                            <button
                                                key={room}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${idx === 2 ? "bg-orange-100 text-orange-600" : "bg-white text-gray-400 shadow-sm hover:shadow-md"}`}
                                            >
                                                {room}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <button className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-2xl font-medium shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all">
                                    Ara
                                </button>

                                {/* Trust cue */}
                                <div className="pt-6 border-t border-gray-100 text-center">
                                    <p className="text-xs text-gray-400">2001'den beri güvenle</p>
                                </div>
                            </aside>

                            {/* Listings */}
                            <div className="space-y-8">
                                {mockListings.map((listing) => (
                                    <article
                                        key={listing.id}
                                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0">
                                            {/* Image */}
                                            <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[240px] overflow-hidden">
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                {/* Soft overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
                                                {/* Image dots */}
                                                {listing.images.length > 1 && (
                                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                                        {listing.images.map((_, imgIdx) => (
                                                            <span
                                                                key={imgIdx}
                                                                className={`w-2.5 h-2.5 rounded-full transition-all ${imgIdx === 0 ? "bg-white" : "bg-white/40"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Featured badge */}
                                                {listing.featured && (
                                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-orange-500 text-xs font-medium px-4 py-2 rounded-xl">
                                                        ✨ Öne Çıkan
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-8 flex flex-col justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-400 mb-2">{listing.location}</p>
                                                    <h2
                                                        className="text-2xl font-semibold text-gray-700 mb-4"
                                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                                    >
                                                        {listing.title}
                                                    </h2>
                                                    <p className="text-gray-400 leading-relaxed line-clamp-2 font-light">
                                                        {listing.description}
                                                    </p>
                                                    {/* Meta pills */}
                                                    <div className="flex flex-wrap items-center gap-3 mt-6">
                                                        <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                                            </svg>
                                                            {listing.sqm} m²
                                                        </span>
                                                        {listing.rooms !== "-" && (
                                                            <span className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                                </svg>
                                                                {listing.rooms}
                                                            </span>
                                                        )}
                                                        {listing.badges.slice(0, 1).map((badge) => (
                                                            <span
                                                                key={badge}
                                                                className="text-xs font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-xl"
                                                            >
                                                                {badge}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Bottom row */}
                                                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
                                                    <p
                                                        className="text-3xl font-semibold text-gray-700"
                                                        style={{ fontFamily: "'Quicksand', sans-serif" }}
                                                    >
                                                        {listing.priceLabel} {listing.currency}
                                                    </p>
                                                    <a
                                                        href="#"
                                                        className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-medium hover:bg-orange-50 hover:text-orange-600 transition-colors"
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
                <footer className="py-16 px-10 bg-white/50">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-orange-500 font-bold text-2xl" style={{ fontFamily: "'Quicksand', sans-serif" }}>G</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">© 2024 Güzel Invest</p>
                        <p className="text-xs text-gray-300">Est. 2001 · Alanya</p>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
