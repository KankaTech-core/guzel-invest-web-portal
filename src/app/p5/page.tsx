import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations, roomOptions } from "@/data/mockListings";

/**
 * Variant P5: Photography-led Bright Premium (WITH wireframe)
 * 
 * Design philosophy: Images lead, UI is quiet, strong photo rhythm,
 * minimal chrome. Photography as hero element.
 * 
 * Layout: Left sidebar filters + horizontal listing cards (per wireframe)
 * Font: Syne (display) + Inter (body)
 */
export default function PortfolioPhotographyLedPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Minimal Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl">
                    <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
                        {/* Logo - minimal */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                                GÜZEL
                            </span>
                            <span className="text-[10px] text-gray-400 tracking-widest uppercase border-l border-gray-200 pl-3">
                                Invest · 2001
                            </span>
                        </div>

                        {/* Navigation - very minimal */}
                        <nav className="hidden md:flex items-center gap-10">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm transition-colors ${idx === 1 ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-5">
                            {/* Language - minimal */}
                            <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button
                                        key={lang}
                                        className={`px-2 py-1 transition-colors ${idx === 0 ? "text-gray-900" : "hover:text-gray-600"}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/905551234567"
                                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-28 pb-20">
                    <div className="max-w-[1600px] mx-auto px-8">
                        {/* Page Title - Big and Bold */}
                        <div className="mb-16">
                            <h1
                                className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-none tracking-tight mb-6"
                                style={{ fontFamily: "'Syne', sans-serif" }}
                            >
                                PORTFÖY
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl">
                                Alanya'nın en fotojenik gayrimenkulleri, sizin için seçildi.
                            </p>
                        </div>

                        {/* Toolbar - Minimal */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
                            <p className="text-sm text-gray-400">
                                <span className="text-gray-900 font-medium">{mockListings.length}</span> gayrimenkul
                            </p>
                            <div className="flex items-center gap-4">
                                {/* Sort */}
                                <select className="text-sm text-gray-600 bg-transparent border-0 focus:outline-none cursor-pointer">
                                    <option>Sırala</option>
                                    <option>Fiyat ↑</option>
                                    <option>Fiyat ↓</option>
                                    <option>En Yeni</option>
                                </select>
                                <span className="w-px h-4 bg-gray-200" />
                                {/* View Toggle */}
                                <button className="text-gray-900">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </button>
                                <button className="text-gray-300 hover:text-gray-500">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                                    </svg>
                                </button>
                                <span className="w-px h-4 bg-gray-200" />
                                {/* Map Button */}
                                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita
                                </button>
                            </div>
                        </div>

                        {/* Layout: Sidebar + Listings */}
                        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-16">
                            {/* Sidebar Filters - Minimal */}
                            <aside className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs tracking-widest uppercase text-gray-400">Filtreler</span>
                                    <button className="text-xs text-orange-500 hover:text-orange-600">Temizle</button>
                                </div>

                                {/* Category - Text only */}
                                <div>
                                    <h4 className="text-xs tracking-widest uppercase text-gray-300 mb-4">Kategori</h4>
                                    <div className="space-y-2">
                                        {propertyTypes.map((type, idx) => (
                                            <button
                                                key={type.value}
                                                className={`block text-left w-full text-sm transition-colors ${idx === 0 ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className="text-xs tracking-widest uppercase text-gray-300 mb-4">Fiyat</h4>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Min"
                                            className="flex-1 px-3 py-2 border-b border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-transparent"
                                        />
                                        <span className="text-gray-300">—</span>
                                        <input
                                            type="text"
                                            placeholder="Max"
                                            className="flex-1 px-3 py-2 border-b border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h4 className="text-xs tracking-widest uppercase text-gray-300 mb-4">Konum</h4>
                                    <select className="w-full px-0 py-2 border-0 border-b border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-gray-400 bg-transparent">
                                        {locations.map((loc) => (
                                            <option key={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Area */}
                                <div>
                                    <h4 className="text-xs tracking-widest uppercase text-gray-300 mb-4">m²</h4>
                                    <input
                                        type="text"
                                        placeholder="Minimum"
                                        className="w-full px-0 py-2 border-0 border-b border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-transparent"
                                    />
                                </div>

                                {/* Rooms */}
                                <div>
                                    <h4 className="text-xs tracking-widest uppercase text-gray-300 mb-4">Oda</h4>
                                    <div className="flex gap-2">
                                        {roomOptions.slice(0, 4).map((room, idx) => (
                                            <button
                                                key={room}
                                                className={`flex-1 py-2 text-xs transition-colors ${idx === 1 ? "text-gray-900 border-b-2 border-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                                            >
                                                {room}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Apply */}
                                <button className="w-full py-3 mt-4 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                                    Ara
                                </button>
                            </aside>

                            {/* Listings - Photo Forward */}
                            <div className="space-y-2">
                                {mockListings.map((listing) => (
                                    <article
                                        key={listing.id}
                                        className="group grid grid-cols-1 md:grid-cols-[400px_1fr] gap-0 border-b border-gray-100 last:border-0"
                                    >
                                        {/* Large Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            {/* Image count overlay */}
                                            {listing.images.length > 1 && (
                                                <div className="absolute bottom-4 left-4 flex gap-1.5">
                                                    {listing.images.map((_, imgIdx) => (
                                                        <span
                                                            key={imgIdx}
                                                            className={`w-8 h-0.5 transition-all ${imgIdx === 0 ? "bg-white" : "bg-white/30"}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {/* Featured */}
                                            {listing.featured && (
                                                <div className="absolute top-4 left-4 text-[10px] tracking-widest uppercase text-white bg-black/50 backdrop-blur-sm px-3 py-1.5">
                                                    Featured
                                                </div>
                                            )}
                                        </div>

                                        {/* Minimal Content */}
                                        <div className="p-8 flex flex-col justify-between">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-2 tracking-wider uppercase">{listing.location}</p>
                                                <h2
                                                    className="text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-orange-500 transition-colors"
                                                    style={{ fontFamily: "'Syne', sans-serif" }}
                                                >
                                                    {listing.title}
                                                </h2>
                                                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                                    {listing.description}
                                                </p>
                                            </div>

                                            {/* Minimal data + price */}
                                            <div className="flex items-end justify-between mt-8">
                                                <div className="flex items-center gap-6 text-xs text-gray-400">
                                                    <span>{listing.sqm} m²</span>
                                                    {listing.rooms !== "-" && <span>{listing.rooms}</span>}
                                                    {listing.badges.slice(0, 1).map((badge) => (
                                                        <span key={badge} className="text-orange-500">{badge}</span>
                                                    ))}
                                                </div>
                                                <div className="text-right">
                                                    <p
                                                        className="text-3xl font-bold text-gray-900 tracking-tight"
                                                        style={{ fontFamily: "'Syne', sans-serif" }}
                                                    >
                                                        {listing.currency}{listing.priceLabel}
                                                    </p>
                                                    <a
                                                        href="#"
                                                        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 transition-colors mt-2"
                                                    >
                                                        Detaylar
                                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
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

                {/* Minimal Footer */}
                <footer className="py-12 px-8 border-t border-gray-100">
                    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                            GÜZEL
                        </span>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <span>© 2024</span>
                            <span>Est. 2001</span>
                            <a href="#" className="hover:text-gray-600">Gizlilik</a>
                        </div>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
