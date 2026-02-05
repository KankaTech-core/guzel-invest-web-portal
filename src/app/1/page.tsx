import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 1: Heritage Modern Minimal
 * 
 * Design philosophy: Timeless refinement, subtle heritage cues, "Est. 2001" trust moment,
 * generous white space, understated typography, editorial precision.
 * 
 * Font: Cormorant Garamond (display) + Outfit (body)
 */
export default function HeritageModernMinimalPage() {
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
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item) => (
                                <a
                                    key={item}
                                    href="#"
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors tracking-wide"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            <button className="text-gray-500 hover:text-gray-900 transition-colors">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                            <button className="bg-black text-white px-5 py-2.5 text-sm tracking-wide hover:bg-gray-800 transition-colors">
                                Randevu Al
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-gray-400 uppercase">
                                    <span className="w-8 h-px bg-gray-300" />
                                    20+ Yıllık Tecrübe
                                </div>

                                <h1
                                    className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] text-gray-900"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Güzel Şehre<br />
                                    <span className="italic text-gray-600">Güzel</span> Projeler
                                </h1>

                                <p className="text-lg text-gray-500 max-w-md leading-relaxed">
                                    2001'den bu yana Alanya'da güvenilir gayrimenkul danışmanlığı.
                                    Yatırımınızı değerli kılıyoruz.
                                </p>

                                <div className="flex items-center gap-6 pt-4">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-3 bg-orange-500 text-white px-8 py-4 text-sm tracking-wide hover:bg-orange-600 transition-colors"
                                    >
                                        Portföyü Keşfet
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                        </svg>
                                    </a>
                                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors underline underline-offset-4">
                                        Hakkımızda
                                    </a>
                                </div>
                            </div>

                            {/* Right Image */}
                            <div className="relative">
                                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1000&fit=crop"
                                        alt="Luxury Alanya Property"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    {/* Minimal overlay badge */}
                                    <div className="absolute bottom-6 left-6 bg-white/95 px-5 py-3 backdrop-blur-sm">
                                        <p className="text-xs tracking-wider text-gray-500 uppercase mb-1">Öne Çıkan</p>
                                        <p className="text-lg font-medium text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Villa Mare</p>
                                    </div>
                                </div>
                                {/* Heritage accent */}
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-gray-200 -z-10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-20 px-8 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">Portföy</span>
                                <h2
                                    className="text-3xl font-medium text-gray-900 mt-2"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Gayrimenkul Kategorileri
                                </h2>
                            </div>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2">
                                Tümünü Gör
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "Konut", count: 124, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=500&fit=crop" },
                                { name: "Arsa", count: 45, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=500&fit=crop" },
                                { name: "Ticari", count: 32, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=500&fit=crop" },
                                { name: "Özel Statü", count: 18, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=500&fit=crop" },
                            ].map((category, idx) => (
                                <a
                                    key={category.name}
                                    href="#"
                                    className="group relative aspect-[3/4] overflow-hidden bg-gray-200"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <p className="text-white text-xl font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                            {category.name}
                                        </p>
                                        <p className="text-white/70 text-xs mt-1">{category.count} İlan</p>
                                    </div>
                                    {/* Index number */}
                                    <div className="absolute top-4 left-4 text-white/30 text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                        0{idx + 1}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">Hizmetlerimiz</span>
                            <h2
                                className="text-3xl font-medium text-gray-900 mt-2"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                Profesyonel Gayrimenkul Danışmanlığı
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-200">
                            {[
                                { icon: "📊", title: "Yatırım Değerlendirme" },
                                { icon: "📋", title: "Resmi Süreç Yönetimi" },
                                { icon: "🏠", title: "Kişisel Portföy" },
                                { icon: "🤝", title: "Satış Sonrası Sadakat" },
                                { icon: "💰", title: "Finansal Danışmanlık" },
                            ].map((service, idx) => (
                                <div
                                    key={service.title}
                                    className="bg-white p-8 text-center group hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-14 h-14 mx-auto mb-4 border border-gray-200 flex items-center justify-center text-2xl group-hover:border-orange-500 transition-colors">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900">{service.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Highlight Section - Why Alanya */}
                <section className="py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Content */}
                            <div className="lg:pr-8">
                                <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">Neden Alanya?</span>
                                <h2
                                    className="text-4xl font-medium text-gray-900 mt-4 mb-6"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Akdeniz'in Güzel Şehri
                                </h2>
                                <p className="text-gray-500 leading-relaxed mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-3 border border-gray-900 text-gray-900 px-8 py-4 text-sm tracking-wide hover:bg-gray-900 hover:text-white transition-all"
                                >
                                    Portföyü İncele
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>

                            {/* Image */}
                            <div className="relative">
                                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=675&fit=crop"
                                        alt="Alanya Coastal View"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Heritage frame accent */}
                                <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-orange-500" />
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-gray-200" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-8 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>G</span>
                            </div>
                            <span className="text-sm text-gray-500">© 2024 Güzel Invest. Tüm hakları saklıdır.</span>
                        </div>
                        <div className="flex items-center gap-6">
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
