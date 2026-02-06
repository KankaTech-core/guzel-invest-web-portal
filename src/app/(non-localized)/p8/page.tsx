import PortfolioNavigator from "@/components/portfolio/PortfolioNavigator";
import { mockListings, propertyTypes, locations } from "@/data/mockListings";

/**
 * Variant P8: Fintech-Trust Clarity (FREEFORM - NO wireframe)
 * 
 * Design philosophy: Crisp structure, ultra legible, "platform" feel.
 * FREEFORM LAYOUT: Compact table/list view with expandable rows, dashboard stats,
 * advanced multi-filter bar, comparison tool teaser.
 * 
 * Font: Space Grotesk (display) + Work Sans (body)
 */
export default function PortfolioFintechFreeformPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#F8F9FC]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                {/* Platform Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
                    <div className="max-w-[1440px] mx-auto px-6">
                        <div className="flex items-center justify-between h-14">
                            {/* Logo */}
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>GI</span>
                                    </div>
                                    <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Güzel Invest
                                    </span>
                                </div>
                                {/* Platform tabs */}
                                <nav className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                                    {["Dashboard", "Portföy", "Karşılaştır", "Favoriler"].map((item, idx) => (
                                        <a
                                            key={item}
                                            href="#"
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${idx === 1 ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            {item}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-4">
                                <div className="relative hidden md:block">
                                    <input
                                        type="text"
                                        placeholder="Hızlı arama..."
                                        className="w-56 pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                </div>
                                <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 border-l border-gray-200 pl-4">
                                    {["TR", "EN", "DE", "AR"].map((lang, idx) => (
                                        <button
                                            key={lang}
                                            className={`px-2 py-1 rounded ${idx === 0 ? "bg-gray-900 text-white" : "hover:text-gray-600"}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                                <button className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="pt-20 pb-12 px-6">
                    <div className="max-w-[1440px] mx-auto">
                        {/* Dashboard Header */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Toplam İlan", value: mockListings.length, change: "+3 bu hafta", color: "text-gray-900" },
                                { label: "Vatandaşlık Uygun", value: mockListings.filter(l => l.badges.includes("Vatandaşlık")).length, change: "250k € +", color: "text-green-600" },
                                { label: "Öne Çıkan", value: mockListings.filter(l => l.featured).length, change: "Premium", color: "text-orange-500" },
                                { label: "Ortalama m²", value: Math.round(mockListings.reduce((acc, l) => acc + l.sqm, 0) / mockListings.length), change: "Portföy ortalaması", color: "text-blue-600" },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-200">
                                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                    <p className={`text-3xl font-bold ${stat.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                                </div>
                            ))}
                        </div>

                        {/* Advanced Filter Bar */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Filtreler:</span>

                                {/* Type multi-select */}
                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                    {propertyTypes.map((type, idx) => (
                                        <button
                                            key={type.value}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${idx === 0 ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>

                                <span className="w-px h-6 bg-gray-200" />

                                {/* Location */}
                                <select className="text-sm text-gray-600 bg-gray-100 rounded-lg px-3 py-2 border-0">
                                    {locations.map((loc) => (
                                        <option key={loc}>{loc}</option>
                                    ))}
                                </select>

                                {/* Price range */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Min €"
                                        className="w-24 px-3 py-2 bg-gray-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <span className="text-gray-300">—</span>
                                    <input
                                        type="text"
                                        placeholder="Max €"
                                        className="w-24 px-3 py-2 bg-gray-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>

                                {/* Quick badges */}
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-200">
                                        ✓ Vatandaşlık
                                    </button>
                                    <button className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium border border-gray-200 hover:border-gray-300">
                                        Oturma İzni
                                    </button>
                                </div>

                                <div className="ml-auto flex items-center gap-3">
                                    <button className="text-sm text-orange-500 font-medium hover:text-orange-600">
                                        Filtreleri Temizle
                                    </button>
                                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                                        Uygula
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table Controls */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{mockListings.length}</span> sonuç gösteriliyor
                            </p>
                            <div className="flex items-center gap-3">
                                <select className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                    <option>Sırala: Varsayılan</option>
                                    <option>Fiyat ↑</option>
                                    <option>Fiyat ↓</option>
                                    <option>m² ↓</option>
                                </select>
                                <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                                    </svg>
                                    Harita Görünümü
                                </button>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-[auto_1fr_120px_100px_120px_100px_100px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="w-6">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                                </div>
                                <div>Gayrimenkul</div>
                                <div>Konum</div>
                                <div className="text-right">m²</div>
                                <div className="text-right">Fiyat</div>
                                <div className="text-center">Durum</div>
                                <div></div>
                            </div>

                            {/* Table Rows */}
                            {mockListings.map((listing, idx) => (
                                <div
                                    key={listing.id}
                                    className={`group grid grid-cols-[auto_1fr_120px_100px_120px_100px_100px] gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-0 hover:bg-orange-50/30 transition-colors ${idx === 0 ? "bg-orange-50/50" : ""}`}
                                >
                                    <div className="w-6">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked={idx === 0} />
                                    </div>
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={listing.images[0]}
                                                alt={listing.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                                {listing.title}
                                            </p>
                                            <p className="text-xs text-gray-400">{listing.propertyType} · {listing.rooms}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 truncate">{listing.location.split(",")[0]}</div>
                                    <div className="text-sm text-gray-900 font-medium text-right" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {listing.sqm}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {listing.priceLabel} {listing.currency}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        {listing.badges.includes("Vatandaşlık") ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                Uygun
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                Standart
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                        </button>
                                        <a
                                            href="#"
                                            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            İncele
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comparison CTA */}
                        <div className="mt-6 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl flex items-center justify-between">
                            <div>
                                <p className="text-white font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Gayrimenkulleri Karşılaştır
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Seçtiğiniz gayrimenkulleri yan yana karşılaştırın
                                </p>
                            </div>
                            <button className="px-6 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                                1 Seçili İlanı Karşılaştır
                            </button>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-6 px-6 bg-white border-t border-gray-200">
                    <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                        <p className="text-sm text-gray-500">© 2024 Güzel Invest · Est. 2001</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <a href="#" className="hover:text-gray-600">Gizlilik</a>
                            <a href="#" className="hover:text-gray-600">Şartlar</a>
                            <a href="#" className="hover:text-gray-600">API</a>
                        </div>
                    </div>
                </footer>
            </div>

            <PortfolioNavigator />
        </>
    );
}
