import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations } from "@/data/mockListings";

/**
 * Variant P10: Photography-led Bright Premium (FREEFORM - NO wireframe)
 * 
 * Design philosophy: Images lead, UI is quiet, strong photo rhythm.
 * FREEFORM LAYOUT: Full-bleed image gallery, minimal text overlay, 
 * click-to-explore interaction, immersive visual journey.
 * 
 * Font: Archivo (display) + Manrope (body)
 */
export default function PortfolioPhotographyFreeformPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Manrope:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
                {/* Minimal Fixed Header */}
                <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
                    <div className="max-w-[1800px] mx-auto px-8 h-20 flex items-center justify-between">
                        <span
                            className="text-2xl font-bold text-white tracking-tight"
                            style={{ fontFamily: "'Archivo', sans-serif" }}
                        >
                            GÜZEL
                        </span>
                        <nav className="hidden md:flex items-center gap-8">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm ${idx === 1 ? "text-white" : "text-white/60 hover:text-white"}`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4 text-white">
                            <div className="hidden md:flex items-center gap-1 text-xs">
                                {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                    <button key={lang} className={`px-2 py-1 ${idx === 0 ? "opacity-100" : "opacity-40 hover:opacity-70"}`}>
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            <a href="https://wa.me/905551234567">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="opacity-80 hover:opacity-100">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </header>

                {/* Full-screen hero */}
                <section className="relative h-screen overflow-hidden">
                    <img
                        src={mockListings[0].images[0]}
                        alt={mockListings[0].title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />

                    {/* Hero content */}
                    <div className="absolute bottom-0 left-0 right-0 p-12 md:p-20">
                        <div className="max-w-[1800px] mx-auto">
                            <p className="text-white/60 text-sm tracking-widest uppercase mb-4">{mockListings[0].location}</p>
                            <h1
                                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6 max-w-4xl"
                                style={{ fontFamily: "'Archivo', sans-serif" }}
                            >
                                {mockListings[0].title}
                            </h1>
                            <div className="flex items-center gap-8 text-white/80 text-sm mb-8">
                                <span>{mockListings[0].sqm} m²</span>
                                <span>{mockListings[0].rooms}</span>
                                <span className="text-orange-400">{mockListings[0].priceLabel} {mockListings[0].currency}</span>
                            </div>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 font-semibold hover:bg-orange-500 hover:text-white transition-colors"
                            >
                                Keşfet
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
                        <span className="text-xs uppercase tracking-widest">Aşağı Kaydır</span>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="animate-bounce">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </section >

                {/* Filter bar */}
                < section className="sticky top-0 z-40 py-4 px-8 bg-white border-b border-gray-100" >
                    <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-xs uppercase tracking-widest text-gray-400">Filtre</span>
                            <div className="flex items-center gap-2">
                                {propertyTypes.map((type, idx) => (
                                    <button
                                        key={type.value}
                                        className={`px-4 py-2 text-xs font-medium transition-all ${idx === 0 ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                            <select className="text-xs text-gray-600 bg-gray-100 px-4 py-2 border-0">
                                {locations.slice(0, 5).map((loc) => (
                                    <option key={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-sm text-gray-500">{mockListings.length} özellik</span>
                            <button className="text-xs font-medium text-gray-600 flex items-center gap-2 hover:text-black">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                </svg>
                                Harita
                            </button>
                        </div>
                    </div>
                </section >

                {/* Full-bleed image gallery */}
                < section className="pb-1" >
                    {
                        mockListings.slice(1).map((listing, idx) => (
                            <article
                                key={listing.id}
                                className={`group relative overflow-hidden ${idx % 2 === 0 ? "h-[80vh]" : "h-[60vh]"}`}
                            >
                                {/* Full-bleed image */}
                                <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Content overlay */}
                                <div className="absolute inset-0 flex items-end p-12 md:p-16">
                                    <div className="flex-1 max-w-6xl">
                                        <div className="flex items-start justify-between gap-8">
                                            <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                                {/* Location */}
                                                <p className="text-white/60 text-sm tracking-wider uppercase mb-3 flex items-center gap-2">
                                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                    </svg>
                                                    {listing.location}
                                                </p>
                                                {/* Title */}
                                                <h2
                                                    className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none mb-4"
                                                    style={{ fontFamily: "'Archivo', sans-serif" }}
                                                >
                                                    {listing.title}
                                                </h2>
                                                {/* Meta */}
                                                <div className="flex items-center gap-6 text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                                    <span>{listing.sqm} m²</span>
                                                    {listing.rooms !== "-" && <span>{listing.rooms}</span>}
                                                    {listing.badges.slice(0, 2).map((badge) => (
                                                        <span key={badge} className="px-2 py-1 bg-white/20 text-white text-xs">
                                                            {badge}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Price + CTA */}
                                            <div className="text-right transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                                <p
                                                    className="text-4xl font-black text-white mb-4"
                                                    style={{ fontFamily: "'Archivo', sans-serif" }}
                                                >
                                                    {listing.priceLabel} {listing.currency}
                                                </p>
                                                <a
                                                    href="#"
                                                    className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 hover:bg-orange-500 hover:text-white"
                                                >
                                                    Detaylar
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Featured badge */}
                                {listing.featured && (
                                    <div className="absolute top-8 left-8 bg-orange-500 text-white text-xs font-bold tracking-wider uppercase px-4 py-2">
                                        Öne Çıkan
                                    </div>
                                )}

                                {/* Image count */}
                                {listing.images.length > 1 && (
                                    <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-2 flex items-center gap-2">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                        </svg>
                                        {listing.images.length}
                                    </div>
                                )}
                            </article>
                        ))
                    }
                </section >

                {/* Minimal Footer */}
                < footer className="py-12 px-8 bg-black text-white" >
                    <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <span
                                className="text-2xl font-bold"
                                style={{ fontFamily: "'Archivo', sans-serif" }}
                            >
                                GÜZEL
                            </span>
                            <span className="text-xs text-white/40 border-l border-white/20 pl-4">Est. 2001</span>
                        </div>
                        <p className="text-sm text-white/40">© 2024 Güzel Invest</p>
                    </div>
                </footer >
            </div >

            <PortfolioNavigator />
        </>
    );
}
