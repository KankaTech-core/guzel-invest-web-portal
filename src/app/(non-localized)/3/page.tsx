import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 3: Fintech-Trust Clarity
 * 
 * Design philosophy: Crisp structure, ultra legible, confident "platform" feel,
 * strong hierarchy and scanning, data-driven trust cues, precise grid alignment.
 * 
 * Font: Space Grotesk (display) → Actually using Sora for distinctiveness + Outfit (body)
 */
export default function FintechTrustClarityPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>GI</span>
                            </div>
                            <span
                                className="text-lg font-semibold text-gray-900"
                                style={{ fontFamily: "'Sora', sans-serif" }}
                            >
                                Güzel Invest
                            </span>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="hidden md:flex items-center bg-gray-50 rounded-lg p-1">
                            {["Ana Sayfa", "Portföy", "Harita", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${idx === 0
                                        ? 'bg-white shadow-sm text-gray-900'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                    style={{ fontFamily: "'Sora', sans-serif" }}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                <svg width="16" height="16" className="text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Ara..."
                                    className="bg-transparent text-sm w-32 outline-none text-gray-900 placeholder:text-gray-400"
                                    style={{ fontFamily: "'Sora', sans-serif" }}
                                />
                                <kbd className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-500">⌘K</kbd>
                            </div>
                            <button
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                                style={{ fontFamily: "'Sora', sans-serif" }}
                            >
                                Başvur
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-24 pb-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Top Bar Stats */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm text-gray-500">Canlı Veriler</span>
                                </div>
                                <span className="text-xs text-gray-400">Son güncelleme: 2 dk önce</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">Toplam Değer:</span>
                                <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>24.8M €</span>
                            </div>
                        </div>

                        {/* Hero Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-5 space-y-6">
                                <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 px-3 py-1.5 rounded-full text-xs font-medium">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Yeni İlanlar Eklendi
                                </div>

                                <h1
                                    className="text-4xl md:text-5xl font-bold leading-tight text-gray-900"
                                    style={{ fontFamily: "'Sora', sans-serif" }}
                                >
                                    Güzel Şehre<br />
                                    <span className="text-orange-500">Güzel</span> Projeler
                                </h1>

                                <p className="text-base text-gray-500 max-w-md leading-relaxed">
                                    2001'den bu yana Alanya'da güvenilir gayrimenkul platformu.
                                    Veriye dayalı yatırım kararları ile değerinizi koruyun.
                                </p>

                                {/* Quick Actions Grid */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <a
                                        href="#"
                                        className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                                        style={{ fontFamily: "'Sora', sans-serif" }}
                                    >
                                        İlanlara Git
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-3.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                        style={{ fontFamily: "'Sora', sans-serif" }}
                                    >
                                        Haritada Gör
                                    </a>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                                                {i === 4 ? "+" : ""}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">300+ Başarılı İşlem</p>
                                        <p className="text-xs text-gray-500">Son 12 ayda</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Cards */}
                            <div className="lg:col-span-7 grid grid-cols-12 gap-4">
                                {/* Main Featured Card */}
                                <div className="col-span-8 bg-gray-50 rounded-2xl overflow-hidden relative group">
                                    <img
                                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=500&fit=crop"
                                        alt="Featured Property"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-orange-500 text-white text-[10px] font-semibold rounded uppercase">Yeni</span>
                                            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium rounded">Villa</span>
                                        </div>
                                        <h3 className="text-white text-lg font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
                                            Kargıcak Premium Villa
                                        </h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-white/80 text-sm">4+1 · 320m² · Deniz Manzaralı</span>
                                            <span className="text-white text-lg font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>485.000 €</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Side Stats */}
                                <div className="col-span-4 flex flex-col gap-4">
                                    {/* Stat Card 1 */}
                                    <div className="flex-1 bg-gray-900 rounded-xl p-4 text-white">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-gray-400">Aktif İlan</span>
                                            <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">+12%</span>
                                        </div>
                                        <p className="text-3xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>156</p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-orange-500 rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stat Card 2 */}
                                    <div className="flex-1 bg-orange-500 rounded-xl p-4 text-white">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs text-orange-200">Bu Hafta</span>
                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <p className="text-3xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>24</p>
                                        <p className="text-xs text-orange-200 mt-1">Yeni Başvuru</p>
                                    </div>

                                    {/* Stat Card 3 */}
                                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-500">Tecrübe</span>
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>20+</p>
                                        <p className="text-xs text-gray-500 mt-1">Yıl</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-16 px-6 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>Kategoriler</span>
                                <h2
                                    className="text-2xl font-bold text-gray-900 mt-1"
                                    style={{ fontFamily: "'Sora', sans-serif" }}
                                >
                                    Gayrimenkul Türleri
                                </h2>
                            </div>
                            <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                                Tümü
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: "Konut", count: 124, trend: "+8%", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=250&fit=crop" },
                                { name: "Arsa", count: 45, trend: "+3%", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop" },
                                { name: "Ticari", count: 32, trend: "+5%", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop" },
                                { name: "Özel Statü", count: 18, trend: "+12%", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop" },
                            ].map((category) => (
                                <a
                                    key={category.name}
                                    href="#"
                                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all"
                                >
                                    <div className="aspect-[16/10] overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <h3
                                                className="font-semibold text-gray-900"
                                                style={{ fontFamily: "'Sora', sans-serif" }}
                                            >
                                                {category.name}
                                            </h3>
                                            <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                                                {category.trend}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{category.count} aktif ilan</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-10">
                            <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>Platform Özellikleri</span>
                            <h2
                                className="text-2xl font-bold text-gray-900 mt-1"
                                style={{ fontFamily: "'Sora', sans-serif" }}
                            >
                                Neden Güzel Invest?
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                                { icon: "📊", title: "Yatırım Analizi", desc: "Veriye dayalı kararlar" },
                                { icon: "📋", title: "Süreç Takibi", desc: "Anlık durum güncellemesi" },
                                { icon: "🎯", title: "Akıllı Eşleştirme", desc: "Size özel öneriler" },
                                { icon: "🤝", title: "7/24 Destek", desc: "Her zaman yanınızda" },
                                { icon: "💰", title: "Finansman", desc: "Kredi danışmanlığı" },
                            ].map((service) => (
                                <div
                                    key={service.title}
                                    className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-orange-200 transition-colors group cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xl mb-3 group-hover:border-orange-200 transition-colors">
                                        {service.icon}
                                    </div>
                                    <h3
                                        className="font-semibold text-gray-900 text-sm mb-1"
                                        style={{ fontFamily: "'Sora', sans-serif" }}
                                    >
                                        {service.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Highlight Section - Why Alanya */}
                <section className="py-16 px-6 bg-gray-900">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Content */}
                            <div>
                                <span className="text-xs text-orange-400 font-semibold uppercase tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>Lokasyon Analizi</span>
                                <h2
                                    className="text-3xl font-bold text-white mt-3 mb-6"
                                    style={{ fontFamily: "'Sora', sans-serif" }}
                                >
                                    Neden Alanya?
                                </h2>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                </p>

                                {/* Data Points */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {[
                                        { value: "300+", label: "Güneşli gün/yıl" },
                                        { value: "25°C", label: "Ortalama sıcaklık" },
                                        { value: "2.8K €", label: "m² ortalama fiyat" },
                                        { value: "15%", label: "Yıllık değer artışı" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-gray-800 rounded-lg p-4">
                                            <p className="text-2xl font-bold text-orange-500" style={{ fontFamily: "'Sora', sans-serif" }}>{stat.value}</p>
                                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                                    style={{ fontFamily: "'Sora', sans-serif" }}
                                >
                                    Detaylı Rapor İndir
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </a>
                            </div>

                            {/* Image */}
                            <div className="relative">
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=675&fit=crop"
                                        alt="Alanya Aerial View"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Floating metric */}
                                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <svg width="20" height="20" fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>Yatırım Getirisi</p>
                                            <p className="text-xs text-gray-500">Son 5 yıl: +78%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-6 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-xs" style={{ fontFamily: "'Sora', sans-serif" }}>GI</span>
                            </div>
                            <span className="text-sm text-gray-500">© 2024 Güzel Invest</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">API</a>
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">Gizlilik</a>
                            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">Şartlar</a>
                        </div>
                    </div>
                </footer>
            </div>

            <RouteNavigator />
        </>
    );
}
