import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations, roomOptions } from "@/data/mockListings";

/**
 * Variant P3: Fintech-Trust Clarity (WITH wireframe)
 * 
 * Design philosophy: Crisp structure, ultra legible, "platform" feel,
 * strong hierarchy and scanning pattern. Data-forward presentation.
 * 
 * Layout: Left sidebar filters + horizontal listing cards (per wireframe)
 * Font: IBM Plex Sans (body) + IBM Plex Mono (accents)
 */
export default function PortfolioFintechTrustClarityPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
                    <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>GI</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900">
                                Güzel Invest
                            </span>
                            <span className="text-xs text-gray-400 border-l border-gray-200 pl-3 ml-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                v2.0
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${idx === 1 ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {/* Language Switcher */}
                            <div className="hidden md:flex items-center gap-1 text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button
                                        key={lang}
                                        className={`px-2 py-1 rounded font-medium transition-colors ${idx === 0 ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            {/* Search */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Ara..."
                                    className="w-48 pl-9 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/905551234567"
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Destek
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-24 pb-16 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        {/* Page Header */}
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                    <span>dashboard</span>
                                    <span>/</span>
                                    <span className="text-gray-600">portföy</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Gayrimenkul Portföyü
                                </h1>
                            </div>
                            {/* Stats */}
                            <div className="hidden lg:flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{mockListings.length}</p>
                                    <p className="text-xs text-gray-400">Toplam İlan</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200" />
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-orange-500" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                        {mockListings.filter(l => l.featured).length}
                                    </p>
                                    <p className="text-xs text-gray-400">Öne Çıkan</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200" />
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-green-500" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                        {mockListings.filter(l => l.badges.includes("Vatandaşlık")).length}
                                    </p>
                                    <p className="text-xs text-gray-400">Vatandaşlık</p>
                                </div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
                            {/* Filter chips */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-gray-500">Filtreler:</span>
                                {propertyTypes.slice(0, 3).map((type, idx) => (
                                    <button
                                        key={type.value}
                                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${idx === 0 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                                <button className="px-3 py-1.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-dashed border-gray-300">
                                    + Daha Fazla
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Sort */}
                                <select className="text-sm text-gray-600 bg-gray-100 border-0 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option>Sırala: Varsayılan</option>
                                    <option>Fiyat ↑</option>
                                    <option>Fiyat ↓</option>
                                    <option>En Yeni</option>
                                </select>
                                {/* View Toggle */}
                                <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                                    <button className="p-2 bg-gray-900 text-white">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Map Button */}
                                <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita
                                </button>
                            </div>
                        </div>

                        {/* Layout: Sidebar + Listings */}
                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                            {/* Sidebar Filters */}
                            <aside className="bg-white rounded-xl border border-gray-200 p-5 h-fit sticky top-24">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="font-semibold text-gray-900">Filtreler</h3>
                                    <button className="text-xs text-orange-500 hover:text-orange-600 font-medium">Temizle</button>
                                </div>

                                {/* Category */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Kategori</h4>
                                    <div className="space-y-2">
                                        {propertyTypes.map((type, idx) => (
                                            <label key={type.value} className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={idx === 0}
                                                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{type.label}</span>
                                                </div>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                                    {Math.floor(Math.random() * 50) + 10}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fiyat Aralığı</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            placeholder="Min €"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Max €"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Konum</h4>
                                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                        {locations.map((loc) => (
                                            <option key={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Area */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">m² Alanı</h4>
                                    <input
                                        type="text"
                                        placeholder="Minimum m²"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                                    />
                                </div>

                                {/* Rooms */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Oda Sayısı</h4>
                                    <div className="grid grid-cols-4 gap-1">
                                        {roomOptions.slice(0, 4).map((room, idx) => (
                                            <button
                                                key={room}
                                                className={`py-2 rounded-lg text-xs font-medium transition-colors ${idx === 1 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                            >
                                                {room}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <button className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                                    Filtrele
                                </button>
                            </aside>

                            {/* Listings */}
                            <div className="space-y-4">
                                {mockListings.map((listing, idx) => (
                                    <article
                                        key={listing.id}
                                        className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-200 hover:shadow-lg transition-all"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr_180px] gap-0">
                                            {/* Image */}
                                            <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[200px] overflow-hidden bg-gray-100">
                                                <img
                                                    src={listing.images[0]}
                                                    alt={listing.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {/* Image count */}
                                                {listing.images.length > 1 && (
                                                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                                                        </svg>
                                                        {listing.images.length}
                                                    </div>
                                                )}
                                                {/* ID badge */}
                                                <div className="absolute top-3 left-3 bg-white text-gray-500 text-[10px] font-medium px-2 py-1 rounded" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                                    #{String(idx + 1).padStart(3, '0')}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col justify-between border-r border-gray-100">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {listing.featured && (
                                                            <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                                Öne Çıkan
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                                            {listing.propertyType}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-500 transition-colors">
                                                        {listing.title}
                                                    </h2>
                                                    <p className="text-sm text-gray-400 mb-3 flex items-center gap-1">
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                        </svg>
                                                        {listing.location}
                                                    </p>
                                                    <p className="text-sm text-gray-500 line-clamp-2">
                                                        {listing.description}
                                                    </p>
                                                </div>
                                                {/* Data row */}
                                                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{listing.sqm}</span>
                                                        <span className="text-xs text-gray-400">m²</span>
                                                    </div>
                                                    {listing.rooms !== "-" && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{listing.rooms}</span>
                                                            <span className="text-xs text-gray-400">oda</span>
                                                        </div>
                                                    )}
                                                    {listing.badges.map((badge) => (
                                                        <span
                                                            key={badge}
                                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${badge === "Vatandaşlık" ? "text-green-700 bg-green-50" : "text-blue-700 bg-blue-50"}`}
                                                        >
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Price & CTA */}
                                            <div className="p-5 flex flex-col items-end justify-between bg-gray-50">
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                                        {listing.currency}{listing.priceLabel}
                                                    </p>
                                                    {listing.saleType === "RENT" && (
                                                        <p className="text-xs text-gray-400">/ ay</p>
                                                    )}
                                                </div>
                                                <a
                                                    href="#"
                                                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors w-full justify-center"
                                                >
                                                    İncele
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
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-8 px-6 border-t border-gray-200 bg-white">
                    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>GI</span>
                            </div>
                            <span className="text-sm text-gray-500">© 2024 Güzel Invest</span>
                            <span className="text-xs text-gray-300" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Est. 2001</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <a href="#" className="hover:text-gray-600 transition-colors">Gizlilik</a>
                            <a href="#" className="hover:text-gray-600 transition-colors">Şartlar</a>
                            <a href="#" className="hover:text-gray-600 transition-colors">API</a>
                        </div>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
