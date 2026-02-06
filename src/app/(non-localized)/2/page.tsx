import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 2: Mediterranean Coastal Premium
 * 
 * Design philosophy: Airy sunlit feeling, warm and welcoming, premium restraint (not touristy),
 * soft shadows, warm whites, coastal lifestyle imagery.
 * 
 * Font: DM Serif Display (display) + DM Sans (body)
 */
export default function MediterraneanCoastalPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#FDFBF7]">
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <span
                                className="text-2xl font-normal text-gray-900"
                                style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                                Güzel Invest
                            </span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {["Ana Sayfa", "Portföy", "Hakkımızda", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`text-sm transition-colors ${idx === 0 ? 'text-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button className="p-2.5 rounded-full hover:bg-orange-50 transition-colors text-gray-600">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                            <button className="bg-orange-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25">
                                Keşfet
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-28 pb-16 px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Main Content */}
                            <div className="lg:col-span-5 pt-8">
                                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm mb-6">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z" opacity=".3" />
                                    </svg>
                                    Akdeniz'in En Güzel Sahili
                                </div>

                                <h1
                                    className="text-5xl md:text-6xl leading-tight text-gray-900 mb-6"
                                    style={{ fontFamily: "'DM Serif Display', serif" }}
                                >
                                    Güzel Şehre<br />
                                    <span className="text-orange-500">Güzel</span> Projeler
                                </h1>

                                <p
                                    className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    2001'den bu yana Alanya'da güvenilir gayrimenkul danışmanlığı.
                                    Hayalinizdeki evi bulmanıza yardımcı oluyoruz.
                                </p>

                                <div className="flex items-center gap-4">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        Portföyü Gör
                                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm"
                                    >
                                        <span className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </span>
                                        Tanıtım Filmi
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
                                    <div>
                                        <p className="text-3xl font-medium text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>300+</p>
                                        <p className="text-sm text-gray-500">Mutlu Müşteri</p>
                                    </div>
                                    <div className="w-px h-12 bg-gray-200" />
                                    <div>
                                        <p className="text-3xl font-medium text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>20+</p>
                                        <p className="text-sm text-gray-500">Yıllık Tecrübe</p>
                                    </div>
                                    <div className="w-px h-12 bg-gray-200" />
                                    <div>
                                        <p className="text-3xl font-medium text-gray-900" style={{ fontFamily: "'DM Serif Display', serif" }}>150+</p>
                                        <p className="text-sm text-gray-500">Aktif İlan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image Grid */}
                            <div className="lg:col-span-7 grid grid-cols-12 gap-4">
                                {/* Main large image */}
                                <div className="col-span-8 aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40">
                                    <img
                                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1000&fit=crop"
                                        alt="Luxury Alanya Property"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Side images */}
                                <div className="col-span-4 flex flex-col gap-4">
                                    <div className="flex-1 rounded-2xl overflow-hidden shadow-lg">
                                        <img
                                            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=300&h=350&fit=crop"
                                            alt="Pool View"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 rounded-2xl overflow-hidden shadow-lg relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=350&fit=crop"
                                            alt="Interior"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                                            <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" className="text-orange-500">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-20 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <span className="text-sm text-orange-500 font-medium">Kategoriler</span>
                                <h2
                                    className="text-4xl text-gray-900 mt-2"
                                    style={{ fontFamily: "'DM Serif Display', serif" }}
                                >
                                    Gayrimenkul Türleri
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-colors text-gray-600">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "Konut", count: 124, icon: "🏠", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop" },
                                { name: "Arsa", count: 45, icon: "🌳", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop" },
                                { name: "Ticari", count: 32, icon: "🏢", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop" },
                                { name: "Özel Statü", count: 18, icon: "✨", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" },
                            ].map((category) => (
                                <a
                                    key={category.name}
                                    href="#"
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-orange-200/30 transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5 flex items-center justify-between">
                                        <div>
                                            <h3
                                                className="text-xl text-gray-900"
                                                style={{ fontFamily: "'DM Serif Display', serif" }}
                                            >
                                                {category.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-0.5">{category.count} İlan</p>
                                        </div>
                                        <span className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                            {category.icon}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-20 px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <span className="text-sm text-orange-500 font-medium">Hizmetlerimiz</span>
                            <h2
                                className="text-4xl text-gray-900 mt-2"
                                style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                                Size Nasıl Yardımcı Olabiliriz?
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            {[
                                { icon: "📊", title: "Yatırım Değerlendirme", desc: "Detaylı analiz" },
                                { icon: "📋", title: "Resmi Süreç", desc: "Evrak takibi" },
                                { icon: "🏠", title: "Kişisel Portföy", desc: "Özel seçenekler" },
                                { icon: "🤝", title: "Satış Sonrası", desc: "Sürekli destek" },
                                { icon: "💰", title: "Finansal Danışmanlık", desc: "Kredi desteği" },
                            ].map((service) => (
                                <div
                                    key={service.title}
                                    className="bg-[#FDFBF7] rounded-2xl p-6 text-center group hover:bg-orange-50 transition-colors cursor-pointer"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl group-hover:shadow-lg transition-shadow">
                                        {service.icon}
                                    </div>
                                    <h3
                                        className="font-medium text-gray-900 mb-1"
                                        style={{ fontFamily: "'DM Serif Display', serif" }}
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
                <section className="py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Image */}
                            <div className="relative">
                                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-gray-300/40">
                                    <img
                                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=675&fit=crop"
                                        alt="Alanya Coastal View"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Floating card */}
                                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-xl max-w-[200px]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                                            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">Yıllık 300+</span>
                                    </div>
                                    <p className="text-xs text-gray-500">Güneşli gün ile Akdeniz'in en güzel iklimine sahip.</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:pl-8">
                                <span className="text-sm text-orange-500 font-medium">Neden Alanya?</span>
                                <h2
                                    className="text-4xl text-gray-900 mt-3 mb-6"
                                    style={{ fontFamily: "'DM Serif Display', serif" }}
                                >
                                    Akdeniz'in Cenneti
                                </h2>
                                <p className="text-gray-500 leading-relaxed mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p className="text-gray-500 leading-relaxed mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                                </p>

                                {/* Features */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {["Güvenli Yatırım", "Premium Lokasyon", "Uluslararası Erişim", "Kaliteli Yaşam"].map((feature) => (
                                        <div key={feature} className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                                                <svg width="12" height="12" fill="none" stroke="#EA580C" strokeWidth="2.5" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            <span className="text-sm text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-7 py-4 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/25"
                                >
                                    Portföyü İncele
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-8 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-500">© 2024 Güzel Invest. Tüm hakları saklıdır.</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Gizlilik</a>
                            <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Şartlar</a>
                        </div>
                    </div>
                </footer>
            </div>

            <RouteNavigator />
        </>
    );
}
