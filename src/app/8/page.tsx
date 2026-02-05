import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 8: Fintech-Trust Clarity (Free Design)
 * 
 * Design philosophy: Dashboard-inspired, modular grid, data-heavy but clean,
 * trust metrics, status indicators, platform UI patterns, confidence-inspiring.
 * 
 * Font: Plus Jakarta Sans (UI/Numeric) + Work Sans (Body)
 */
export default function FintechTrustClarityFreePage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Work+Sans:wght@400;500&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#F4F6F8]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
                {/* Navbar - Dashboard Style */}
                <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                    <div className="max-w-[1600px] mx-auto px-6 h-18 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold font-jakarta">
                                    GI
                                </div>
                                <span className="font-jakarta font-bold text-gray-900 tracking-tight text-lg">Güzel Invest</span>
                            </div>

                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-200 hidden md:block" />

                            {/* Nav Links */}
                            <nav className="hidden md:flex items-center gap-1">
                                {["Market", "Portföy", "Analizler", "Kurumsal"].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all font-jakarta"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-medium text-gray-600 font-jakarta">Market Açık · Alanya</span>
                            </div>
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg text-sm font-semibold font-jakarta shadow-sm transition-all">
                                Yatırıma Başla
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-[1600px] mx-auto px-6 py-8">
                    {/* Hero Grid */}
                    <div className="grid grid-cols-12 gap-6 mb-8">
                        {/* Main Value Prop - 8 cols */}
                        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
                            <div className="relative z-10 max-w-2xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-jakarta mb-6 border border-blue-100">
                                    NEW · 2024 Market Raporu Yayında
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 font-jakarta">
                                    Gayrimenkul yatırımında <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">akıllı platform</span> dönemi.
                                </h1>
                                <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                                    Alanya'nın en değerli portföylerine veri odaklı yaklaşım.
                                    Getiri analizi, vatandaşlık uygunluğu ve risk raporlarıyla güvenle yatırım yapın.
                                </p>
                                <div className="flex gap-4">
                                    <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold font-jakarta shadow-lg shadow-gray-900/10 hover:translate-y-[-2px] transition-all">
                                        Fırsatları İncele
                                    </button>
                                    <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold font-jakarta hover:bg-gray-50 transition-all">
                                        Nasıl Çalışır?
                                    </button>
                                </div>
                            </div>

                            {/* Abstract Chart Graphic BG */}
                            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none">
                                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <path fill="#FF6B00" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.4C93.5,8.4,82.2,21.1,71.4,32.1C60.6,43.1,50.3,52.4,39,60.6C27.7,68.8,15.4,75.9,2.4,71.7C-10.5,67.6,-24.1,52.1,-37.2,40.1C-50.3,28.1,-63,19.6,-68.8,7.9C-74.6,-3.8,-73.5,-18.7,-64.2,-29.6C-54.9,-40.5,-37.4,-47.4,-23.5,-54.8C-9.6,-62.2,0.7,-70.1,12.7,-72.3C24.7,-74.5,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                                </svg>
                            </div>
                        </div>

                        {/* Right Stats - 4 cols */}
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            {/* Stat Card 1 */}
                            <div className="flex-1 bg-gray-900 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium mb-1">Toplam Portföy Değeri</p>
                                        <h3 className="text-3xl font-bold font-jakarta">€45,2M</h3>
                                    </div>
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>Yıllık Değer Artışı</span>
                                        <span className="text-green-400 font-bold">+18.5%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[78%] rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Stat Card 2 */}
                            <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                                <p className="text-gray-500 text-sm font-medium mb-1 z-10">Aktif Yatırımcı</p>
                                <h3 className="text-3xl font-bold font-jakarta text-gray-900 z-10">850+</h3>
                                <p className="text-green-600 text-xs font-semibold mt-2 flex items-center gap-1 z-10">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Bu hafta 12 yeni katılım
                                </p>
                                {/* Subtle Grid BG */}
                                <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                            </div>
                        </div>
                    </div>

                    {/* Filter / Ticker Bar */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            <button className="whitespace-nowrap px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg font-jakarta">Tüm İlanlar</button>
                            <button className="whitespace-nowrap px-4 py-2 bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 font-jakarta">Konut</button>
                            <button className="whitespace-nowrap px-4 py-2 bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 font-jakarta">Ticari</button>
                            <button className="whitespace-nowrap px-4 py-2 bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-100 font-jakarta">Arsa</button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                            <span className="font-medium font-jakarta">USD/TRY 32.45</span>
                            <span className="font-medium font-jakarta text-red-500">EUR/USD 1.08</span>
                            <span className="font-medium font-jakarta text-green-600">BIST 100 9.250</span>
                        </div>
                    </div>

                    {/* Listings Table / Grid Layout */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 font-jakarta">Popüler Yatırım Fırsatları</h2>
                            <a href="#" className="text-sm font-semibold text-orange-600 hover:text-orange-700 font-jakarta">Tümünü Gör →</a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "Nova Plaza", type: "Ofis", price: "€450,000", roi: "7.2%", status: "Yüksek Getiri", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop" },
                                { name: "Kargıcak Villa", type: "Konut", price: "€725,000", roi: "5.5%", status: "Vatandaşlık", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" },
                                { name: "Oba Residence", type: "Daire", price: "€185,000", roi: "6.8%", status: "Fırsat", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop" },
                                { name: "Marina Land", type: "Arsa", price: "€1.2M", roi: "12%", status: "Premium", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop" },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                                    <div className="h-48 relative overflow-hidden">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-bold text-gray-900 rounded font-jakarta">
                                                {item.type}
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded font-jakarta ${item.status === 'Yüksek Getiri' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'Vatandaşlık' ? 'bg-purple-100 text-purple-700' :
                                                        item.status === 'Fırsat' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 font-jakarta">{item.name}</h3>
                                            <span className="font-bold text-orange-600 font-jakarta">{item.price}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase">Tahmini ROI</p>
                                                <p className="text-sm font-bold text-gray-700">{item.roi}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase">Risk Skoru</p>
                                                <div className="flex justify-end gap-1 mt-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feature 3-Col - Platform Features */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {[
                            { title: "Vergi Danışmanlığı", desc: "Türkiye'deki vergi mevzuatı ve avantajları hakkında uzman desteği.", icon: "⚖️" },
                            { title: "Vatandaşlık İşlemleri", desc: "$400.000 üzeri yatırımlarda vatandaşlık başvuru süreci yönetimi.", icon: "🇹🇷" },
                            { title: "Mülk Yönetimi", desc: "Kiralama, bakım ve aidat takibi ile pasif gelir yönetimi.", icon: "🔑" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-200 transition-colors">
                                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl mb-4 border border-gray-100">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 font-jakarta">{feature.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick ROI Calculator - Component CTA */}
                    <div className="bg-gray-900 text-white rounded-2xl p-8 lg:p-12 relative overflow-hidden">
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4 font-jakarta">Yatırım Getirisi Hesapla</h2>
                                <p className="text-gray-400 mb-8 max-w-md">
                                    Almayı düşündüğünüz mülkün tahmini kira getirisini ve değer artışını hesaplayın.
                                </p>
                                <div className="flex flex-col gap-4 max-w-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Bütçe</label>
                                            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm font-semibold border border-gray-700">
                                                € 250,000
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Vade</label>
                                            <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm font-semibold border border-gray-700">
                                                5 Yıl
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold font-jakarta transition-colors">
                                        Hesapla
                                    </button>
                                </div>
                            </div>

                            {/* Graphic Visualization */}
                            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm font-semibold text-gray-400">Tahmini Portföy Değeri (5. Yıl)</span>
                                    <span className="text-xl font-bold text-green-400">€ 412,500</span>
                                </div>
                                <div className="h-40 flex items-end gap-2 px-2">
                                    {[30, 45, 55, 60, 75, 85, 100].map((h, i) => (
                                        <div key={i} className="flex-1 bg-orange-500/20 rounded-t-sm relative group">
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-orange-500 rounded-t-sm transition-all duration-1000"
                                                style={{ height: `${h}%` }}
                                            />
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded pointer-events-none">
                                                Year {i + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer - Minimal Dashboard */}
                <footer className="bg-white border-t border-gray-200 mt-12 py-8">
                    <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500 font-jakarta">© 2024 Güzel Invest Technology A.Ş.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Security</a>
                            <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Terms</a>
                            <a href="#" className="text-gray-400 hover:text-gray-900 text-sm font-medium transition-colors">Privacy</a>
                            <div className="flex items-center gap-2 ml-4">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-xs text-gray-500 font-medium">Systems Normal</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <RouteNavigator />
        </>
    );
}
