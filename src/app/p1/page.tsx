import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations, roomOptions } from "@/data/mockListings";

/**
 * Variant P1: Heritage Modern Minimal (WITH wireframe)
 * 
 * Design philosophy: Timeless refinement, subtle heritage cues, "Est. 2001" trust moment,
 * generous white space, understated typography, editorial precision.
 * 
 * Layout: Left sidebar filters + horizontal listing cards (per wireframe)
 * Font: Cormorant Garamond (display) + Outfit (body)
 */
export default function PortfolioHeritageModernMinimalPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                        {/* Logo with Heritage Mark */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>G</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-semibold tracking-tight text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    Güzel Invest
                                </span>
                                <span className="text-[10px] tracking-[0.25em] text-gray-400 uppercase">Est. 2001 · Alanya</span>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-10">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm transition-colors tracking-wide ${idx === 1 ? "text-gray-900 font-medium" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            {/* Language Switcher */}
                            <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button
                                        key={lang}
                                        className={`px-2 py-1 transition-colors ${idx === 0 ? "text-gray-900 font-medium" : "hover:text-gray-600"}`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            {/* Search */}
                            <button className="text-gray-500 hover:text-gray-900 transition-colors">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/905551234567"
                                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 text-sm hover:bg-green-600 transition-colors"
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span className="hidden lg:inline">WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-28 pb-20 px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Title */}
                        <div className="mb-12">
                            <div className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-gray-400 uppercase mb-4">
                                <span className="w-8 h-px bg-gray-300" />
                                Portföy
                            </div>
                            <h1
                                className="text-4xl md:text-5xl font-medium text-gray-900 mb-4"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Gayrimenkul Portföyümüz
                            </h1>
                            <p className="text-gray-500 max-w-xl">
                                Alanya ve çevresindeki seçkin gayrimenkul fırsatlarını keşfedin.
                                20 yılı aşkın tecrübemizle size en uygun yatırımı buluyoruz.
                            </p>
                        </div>

                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{mockListings.length}</span> sonuç bulundu
                            </p>
                            <div className="flex items-center gap-4">
                                {/* Sort */}
                                <select className="text-sm text-gray-600 bg-transparent border border-gray-200 px-4 py-2 focus:outline-none focus:border-gray-400">
                                    <option>Sırala</option>
                                    <option>Fiyat: Düşükten Yükseğe</option>
                                    <option>Fiyat: Yüksekten Düşüğe</option>
                                    <option>En Yeni</option>
                                    <option>m²: Büyükten Küçüğe</option>
                                </select>
                                {/* View Toggle */}
                                <div className="flex items-center border border-gray-200">
                                    <button className="p-2 bg-gray-50 text-gray-900">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                        </svg>
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-gray-600">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                        </svg>
                                    </button>
                                </div>
                                {/* Map Button */}
                                <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-400 transition-colors">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita
                                </button>
                            </div>
                        </div>

                        {/* Layout: Sidebar + Listings */}
                        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
                            {/* Sidebar Filters */}
                            <aside className="space-y-8">
                                {/* Category */}
                                <div>
                                    <h3 className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-4">Kategori</h3>
                                    <div className="space-y-3">
                                        {propertyTypes.map((type) => (
                                            <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-500"
                                                />
                                                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                                    {type.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-4">Fiyat</h3>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder="Min €"
                                            className="min-w-0 flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
                                        />
                                        <span className="text-gray-300">—</span>
                                        <input
                                            type="text"
                                            placeholder="Max €"
                                            className="min-w-0 flex-1 px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
                                        />
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Location */}
                                <div>
                                    <h3 className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-4">Konum</h3>
                                    <select className="w-full px-3 py-2 border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-gray-400 bg-white">
                                        {locations.map((loc) => (
                                            <option key={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Area */}
                                <div>
                                    <h3 className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-4">m²</h3>
                                    <input
                                        type="text"
                                        placeholder="Min m²"
                                        className="w-full px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="h-px bg-gray-100" />

                                {/* Rooms */}
                                <div>
                                    <h3 className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-4">Oda Sayısı</h3>
                                    <select className="w-full px-3 py-2 border border-gray-200 text-sm text-gray-600 focus:outline-none focus:border-gray-400 bg-white">
                                        <option>Tümü</option>
                                        {roomOptions.map((room) => (
                                            <option key={room}>{room}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Apply Button */}
                                <button className="w-full py-3 bg-gray-900 text-white text-sm tracking-wide hover:bg-gray-800 transition-colors">
                                    Filtrele
                                </button>
                            </aside>

                            {/* Listings */}
                            <div className="space-y-6">
                                {mockListings.map((listing, idx) => (
                                    <article
                                        key={listing.id}
                                        className="group grid grid-cols-1 md:grid-cols-[320px_1fr_auto] gap-6 p-6 border border-gray-100 hover:border-gray-200 transition-colors"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[240px] overflow-hidden bg-gray-100">
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Image indicators */}
                                            {listing.images.length > 1 && (
                                                <div className="absolute bottom-3 left-3 flex gap-1">
                                                    {listing.images.map((_, imgIdx) => (
                                                        <span
                                                            key={imgIdx}
                                                            className={`w-1.5 h-1.5 rounded-full ${imgIdx === 0 ? "bg-white" : "bg-white/50"}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            {/* Featured badge */}
                                            {listing.featured && (
                                                <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] tracking-wider uppercase px-2 py-1">
                                                    Öne Çıkan
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col justify-between py-1">
                                            <div>
                                                <h2
                                                    className="text-xl font-medium text-gray-900 mb-1"
                                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                                >
                                                    {listing.title}
                                                </h2>
                                                <p className="text-sm text-gray-400 mb-4">{listing.location}</p>
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                                                    {listing.description}
                                                </p>
                                            </div>
                                            {/* Meta */}
                                            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
                                                <span className="text-xs text-gray-400">
                                                    <span className="text-gray-600 font-medium">{listing.sqm}</span> m²
                                                </span>
                                                {listing.rooms !== "-" && (
                                                    <span className="text-xs text-gray-400">
                                                        <span className="text-gray-600 font-medium">{listing.rooms}</span>
                                                    </span>
                                                )}
                                                {/* Badges */}
                                                {listing.badges.map((badge) => (
                                                    <span
                                                        key={badge}
                                                        className="text-[10px] tracking-wider uppercase text-orange-600 border border-orange-200 px-2 py-0.5"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price & CTA */}
                                        <div className="flex flex-col items-end justify-between py-1">
                                            <p
                                                className="text-2xl font-medium text-gray-900"
                                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                            >
                                                {listing.currency}{listing.priceLabel}
                                            </p>
                                            <a
                                                href="#"
                                                className="inline-flex items-center gap-2 border border-gray-200 px-5 py-2.5 text-sm text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                                            >
                                                İncele
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                                </svg>
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-12 px-8 border-t border-gray-100 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>G</span>
                            </div>
                            <span className="text-sm text-gray-500">© 2024 Güzel Invest. Tüm hakları saklıdır.</span>
                        </div>
                        <div className="text-xs tracking-[0.2em] text-gray-400 uppercase">Est. 2001</div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">Gizlilik</a>
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">Şartlar</a>
                        </div>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
