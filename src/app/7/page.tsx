import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 7: Mediterranean Coastal Premium
 * 
 * Design philosophy: Vacation-inspired luxury, soft organic curves, wave motifs, 
 * warm coastal palette (sand, sea, sun), effortless flow, card mosaic layout.
 * 
 * Font: Crimson Pro (serif headings) + Source Sans 3 (clean UI)
 */
export default function MediterraneanCoastalPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#FAFAF9]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-orange-300 flex items-center justify-center shadow-lg shadow-orange-200">
                                <span className="text-white font-serif italic text-xl pr-0.5">G</span>
                            </div>
                            <span className="text-xl font-medium text-gray-800 tracking-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                                Güzel Invest
                            </span>
                        </div>

                        {/* Navigation - Pill Style */}
                        <nav className="hidden md:flex items-center bg-white rounded-full px-2 py-1.5 shadow-sm border border-gray-100">
                            {["Ana Sayfa", "Villalar", "Daireler", "Hizmetler", "İletişim"].map((item, idx) => (
                                <a
                                    key={item}
                                    href="#"
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${idx === 0
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:text-orange-500'
                                        }`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="hidden lg:flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <span>Ara</span>
                            </a>
                            <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                Bize Ulaşın
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Section - Full Bleed with Soft Curve */}
                <section className="relative pt-32 pb-48 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block py-1 px-4 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-6 animate-fade-in">
                                Alanya'nın En Güzel Hali
                            </span>
                            <h1
                                className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-[1.1] mb-8"
                                style={{ fontFamily: "'Crimson Pro', serif" }}
                            >
                                Hayalinizdeki yaşam <br />
                                <span className="italic text-orange-500">deniz kenarında</span> başlar.
                            </h1>
                            <p className="text-xl text-gray-500 font-light leading-relaxed">
                                Eşsiz Akdeniz manzarası ve konforlu yaşam alanları ile
                                yatırımınıza değer, hayatınıza keyif katın.
                            </p>
                        </div>

                        {/* Image Mosaic Hero */}
                        <div className="grid grid-cols-12 gap-4 md:gap-6 h-[500px]">
                            {/* Large Left */}
                            <div className="col-span-12 md:col-span-8 h-full relative group rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/5">
                                <img
                                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop"
                                    alt="Luxury Pool Villa"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <p className="text-emerald-300 font-medium mb-2 tracking-wide uppercase text-xs">Yeni Portföy</p>
                                    <h3 className="text-3xl italic" style={{ fontFamily: "'Crimson Pro', serif" }}>Azure Heights Villa</h3>
                                    <p className="opacity-90 mt-2">Kargıcak · 4+1 · Deniz Manzaralı</p>
                                </div>
                            </div>

                            {/* Right Column Stack */}
                            <div className="hidden md:flex col-span-4 flex-col gap-4 md:gap-6 h-full">
                                <div className="flex-1 relative group rounded-3xl overflow-hidden shadow-xl shadow-orange-900/5">
                                    <img
                                        src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&h=400&fit=crop"
                                        alt="Sea View"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 bg-white rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-xl shadow-orange-900/5 border border-orange-50 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-300 to-orange-500" />
                                    <h3 className="text-4xl text-gray-900 mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>20+</h3>
                                    <p className="text-gray-500 text-sm">Yıllık Güven ve<br />Tecrübe</p>
                                    <div className="mt-6 w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Wave Decoration */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-white" style={{ clipPath: "ellipse(70% 50% at 50% 100%)" }} />
                </section>

                {/* Featured Collection - Mosaic */}
                <section className="bg-white pb-32 pt-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2
                                    className="text-4xl text-gray-900 mb-4"
                                    style={{ fontFamily: "'Crimson Pro', serif" }}
                                >
                                    Özel Koleksiyon
                                </h2>
                                <p className="text-gray-500 max-w-md">Size özel seçilmiş, yüksek yatırım değerine sahip premium gayrimenkuller.</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-colors">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-colors">
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "Olive Hills Mansion", price: "€850,000", loc: "Bektaş", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=700&fit=crop" },
                                { title: "Sea Pearl Residence", price: "€245,000", loc: "Kestel", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=700&fit=crop" },
                                { title: "Sunset Bay Villa", price: "€550,000", loc: "Konaklı", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=700&fit=crop" },
                            ].map((item, idx) => (
                                <div key={idx} className="group relative rounded-[2rem] overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 pb-4">
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-1">{item.loc}</p>
                                                <h3 className="text-2xl text-gray-900 group-hover:text-orange-600 transition-colors" style={{ fontFamily: "'Crimson Pro', serif" }}>{item.title}</h3>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-2xl font-light text-gray-600 border-t border-gray-100 pt-4 mt-4">{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values / How it Works - Soft Organic Flow */}
                <section className="py-32 bg-[#FAFAF9] relative overflow-hidden">
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2
                                    className="text-4xl lg:text-5xl font-light text-gray-900 mb-8"
                                    style={{ fontFamily: "'Crimson Pro', serif" }}
                                >
                                    Yatırım Sürecini <br />
                                    <span className="italic text-orange-500">Keyifli Bir Yolculuğa</span> Dönüştürüyoruz
                                </h2>
                                <div className="space-y-10">
                                    {[
                                        { title: "Keşif & Analiz", desc: "Sizin için en uygun mülkleri yaşam tarzınıza ve yatırım hedeflerinize göre analiz ediyoruz." },
                                        { title: "Tur & Deneyim", desc: "Seçilen mülkleri yerinde inceliyor, bölgeyi ve yaşamı deneyimliyoruz." },
                                        { title: "Güvenli İşlem", desc: "Hukuki süreçler, tapu devri ve finansal işlemler uzman ekibimiz tarafından yönetiliyor." },
                                    ].map((step, idx) => (
                                        <div key={idx} className="flex gap-6 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl font-serif text-orange-500 border border-orange-50 group-hover:scale-110 transition-transform">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl text-gray-900 mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>{step.title}</h3>
                                                <p className="text-gray-500 leading-relaxed font-light text-lg">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-t-[10rem] rounded-b-[3rem] overflow-hidden border-4 border-white shadow-2xl relative z-10">
                                    <img
                                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=1000&fit=crop"
                                        alt="Lifestyle"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Floating Card */}
                                <div className="absolute bottom-12 -left-12 bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl border border-white z-20 max-w-xs animate-float">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Vatandaşlık Uygunluğu</p>
                                            <p className="text-sm text-gray-500 mt-1">Bu mülk Türk Vatandaşlığı programı için uygundur.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Newsletter / Contact - Rounded Container */}
                <section className="py-24 px-6">
                    <div className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center md:text-left">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-xl">
                                <h2 className="text-4xl md:text-5xl font-light text-white mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
                                    Alanya'da yaşamaya <br />hazır mısınız?
                                </h2>
                                <p className="text-gray-400 text-lg font-light">
                                    Size en uygun portföyleri sunmak için hemen tanışalım.
                                    Kahvemiz ve manzaramız hazır.
                                </p>
                            </div>
                            <div className="w-full md:w-auto flex flex-col gap-4">
                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-full text-lg transition-all shadow-lg shadow-orange-500/25 hover:scale-105">
                                    Randevu Oluştur
                                </button>
                                <p className="text-center text-gray-500 text-sm">veya <a href="#" className="text-white hover:underline">WhatsApp'tan yazın</a></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white py-12 px-6 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-medium text-gray-900 tracking-tight" style={{ fontFamily: "'Crimson Pro', serif" }}>
                                Güzel Invest
                            </span>
                            <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">Est. 2001</span>
                        </div>
                        <div className="flex gap-8 text-sm text-gray-500">
                            <a href="#" className="hover:text-orange-500 transition-colors">Portföy</a>
                            <a href="#" className="hover:text-orange-500 transition-colors">Hizmetler</a>
                            <a href="#" className="hover:text-orange-500 transition-colors">Blog</a>
                            <a href="#" className="hover:text-orange-500 transition-colors">İletişim</a>
                        </div>
                        <p className="text-xs text-gray-400">© 2024 Tüm hakları saklıdır.</p>
                    </div>
                </footer>
            </div>

            <RouteNavigator />
        </>
    );
}
