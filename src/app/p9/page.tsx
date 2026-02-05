import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations } from "@/data/mockListings";

/**
 * Variant P9: Scandinavian Calm Premium (FREEFORM - NO wireframe)
 * 
 * Design philosophy: Soft, human, calm composition, zen simplicity, lots of breathing room.
 * FREEFORM LAYOUT: Single-column focus, oversized imagery, storytelling-first approach,
 * scroll-guided experience, ambient flow.
 * 
 * Font: Gilda Display (display) + Karla (body)
 */
export default function PortfolioScandinavianFreeformPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Gilda+Display&family=Karla:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#FEFDFB]" style={{ fontFamily: "'Karla', sans-serif" }}>
                {/* Minimal Floating Header */}
                <header className="fixed top-6 left-6 right-6 z-40">
                    <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 px-8 h-16 flex items-center justify-between">
                        <span
                            className="text-xl text-gray-800"
                            style={{ fontFamily: "'Gilda Display', serif" }}
                        >
                            Güzel Invest
                        </span>
                        <nav className="hidden md:flex items-center gap-8">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm ${idx === 1 ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button
                                        key={lang}
                                        className={idx === 0 ? "text-gray-600" : "hover:text-gray-500"}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            <a
                                href="https://wa.me/905551234567"
                                className="text-green-600 hover:text-green-700"
                            >
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Hero - Calm statement */}
                <section className="pt-40 pb-24 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-gray-400 text-sm tracking-widest uppercase mb-6">
                            Huzur Dolu Yaşam
                        </p>
                        <h1
                            className="text-5xl md:text-6xl text-gray-800 leading-tight mb-8"
                            style={{ fontFamily: "'Gilda Display', serif" }}
                        >
                            Doğanın Kucağında<br />Ev Sahipliği
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-xl mx-auto">
                            Alanya&apos;nın en huzurlu köşelerinde, yaşam kalitenizi yükselten gayrimenkuller.
                        </p>
                    </div>
                </section>

                {/* Subtle Filters - Horizontal scroll */}
                <section className="sticky top-28 z-30 py-4 bg-[#FEFDFB]/90 backdrop-blur-lg border-y border-gray-100">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                            <span className="text-sm text-gray-400 flex-shrink-0">Filtre:</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {propertyTypes.map((type, idx) => (
                                    <button
                                        key={type.value}
                                        className={`px-4 py-2 rounded-full text-sm transition-all ${idx === 0 ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                            <span className="w-px h-5 bg-gray-200 flex-shrink-0" />
                            <select className="text-sm text-gray-500 bg-gray-100 rounded-full px-4 py-2 border-0 flex-shrink-0">
                                {locations.slice(0, 5).map((loc) => (
                                    <option key={loc}>{loc}</option>
                                ))}
                            </select>
                            <div className="ml-auto flex items-center gap-4 flex-shrink-0">
                                <span className="text-sm text-gray-400">{mockListings.length} sonuç</span>
                                <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Single Column Storytelling */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto space-y-32">
                        {mockListings.map((listing, idx) => (
                            <article key={listing.id} className="group">
                                {/* Large Image */}
                                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-10">
                                    <img
                                        src={listing.images[0]}
                                        alt={listing.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    {listing.featured && (
                                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-gray-800 text-xs tracking-widest uppercase px-4 py-2 rounded-full">
                                            Öne Çıkan
                                        </div>
                                    )}
                                    {/* Image counter */}
                                    {listing.images.length > 1 && (
                                        <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            {listing.images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Content - Calm layout */}
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-end">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">{listing.location}</p>
                                        <h2
                                            className="text-3xl md:text-4xl text-gray-800 mb-4 group-hover:text-orange-600 transition-colors"
                                            style={{ fontFamily: "'Gilda Display', serif" }}
                                        >
                                            {listing.title}
                                        </h2>
                                        <p className="text-gray-400 leading-relaxed mb-6">
                                            {listing.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-2">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                                </svg>
                                                {listing.sqm} m²
                                            </span>
                                            {listing.rooms !== "-" && (
                                                <span className="flex items-center gap-2">
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                    </svg>
                                                    {listing.rooms}
                                                </span>
                                            )}
                                            {listing.badges.map((badge) => (
                                                <span key={badge} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs">
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className="text-4xl text-gray-800 mb-3"
                                            style={{ fontFamily: "'Gilda Display', serif" }}
                                        >
                                            {listing.currency}{listing.priceLabel}
                                        </p>
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-full text-sm hover:bg-gray-700 transition-colors"
                                        >
                                            İncele
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                {/* Section divider */}
                                {idx < mockListings.length - 1 && (
                                    <div className="mt-20 flex justify-center">
                                        <div className="w-12 h-px bg-gray-200" />
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                </section>

                {/* Trust moment */}
                <section className="py-20 px-6 bg-gray-50">
                    <div className="max-w-3xl mx-auto text-center">
                        <p
                            className="text-6xl text-gray-200 mb-4"
                            style={{ fontFamily: "'Gilda Display', serif" }}
                        >
                            2001
                        </p>
                        <p className="text-gray-500">
                            23 yıldır Alanya&apos;da huzurlu yaşam alanları sunuyoruz.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-6 bg-[#FEFDFB]">
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <span
                            className="text-xl text-gray-800"
                            style={{ fontFamily: "'Gilda Display', serif" }}
                        >
                            Güzel Invest
                        </span>
                        <p className="text-sm text-gray-400">© 2024 · Tüm hakları saklıdır.</p>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
