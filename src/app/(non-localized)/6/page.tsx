import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 6: Heritage Modern Minimal (Free Design)
 * 
 * Design philosophy: Editorial asymmetric grid, numbered sections, thin serif headlines,
 * generous margins, monochrome + orange accents. Refined, sophisticated, gallery-like.
 * 
 * Font: Playfair Display (display) + DM Sans (body)
 */
export default function HeritageModernMinimalFreePage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-8 lg:px-12">
                        <div className="flex items-center justify-between h-20 border-b border-gray-100">
                            {/* Logo */}
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 border border-gray-900 flex items-center justify-center">
                                    <span className="text-xl font-medium text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>G</span>
                                </div>
                                <div>
                                    <span className="text-lg tracking-wide text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        Güzel Invest
                                    </span>
                                    <span className="hidden md:inline text-xs text-gray-400 ml-3">Est. 2001</span>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="hidden lg:flex items-center gap-12">
                                {["Koleksiyon", "Hizmetler", "Hakkımızda", "İletişim"].map((item) => (
                                    <a
                                        key={item}
                                        href="#"
                                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors tracking-wide"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </nav>

                            {/* Actions */}
                            <div className="flex items-center gap-6">
                                {/* Language */}
                                <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                                    <span className="text-gray-900">TR</span>
                                    <span>/</span>
                                    <span className="hover:text-gray-900 cursor-pointer">EN</span>
                                    <span>/</span>
                                    <span className="hover:text-gray-900 cursor-pointer">DE</span>
                                    <span>/</span>
                                    <span className="hover:text-gray-900 cursor-pointer">AR</span>
                                </div>
                                {/* WhatsApp */}
                                <a
                                    href="https://wa.me/905551234567"
                                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                                    aria-label="WhatsApp"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-32 pb-24 px-8 lg:px-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Number */}
                        <div className="flex items-center gap-6 mb-12">
                            <span className="text-7xl font-light text-gray-200" style={{ fontFamily: "'Playfair Display', serif" }}>01</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-12 gap-8 items-start">
                            {/* Left Content - 5 cols */}
                            <div className="col-span-12 lg:col-span-5 space-y-8 lg:pr-8">
                                <h1
                                    className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-gray-900"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Akdeniz'de<br />
                                    <em className="font-normal">Zarif</em> Yaşam
                                </h1>

                                <p className="text-base text-gray-500 leading-relaxed max-w-md">
                                    Alanya'nın en seçkin gayrimenkullerini keşfedin. 2001'den bu yana,
                                    yatırımınıza değer katıyoruz.
                                </p>

                                <div className="flex items-center gap-6">
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-4 bg-gray-900 text-white px-8 py-4 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
                                    >
                                        <span>Koleksiyonu Gör</span>
                                        <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                                            <path d="M19.354 4.354a.5.5 0 000-.708L16.172.464a.5.5 0 10-.708.708L18.293 4l-2.829 2.828a.5.5 0 10.708.708l3.182-3.182zM0 4.5h19v-1H0v1z" fill="white" />
                                        </svg>
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-0 border-t border-gray-200 pt-8 mt-8">
                                    {[
                                        { value: "20+", label: "Yıl" },
                                        { value: "850", label: "Mutlu Aile" },
                                        { value: "45M €", label: "Portföy" },
                                    ].map((stat, idx) => (
                                        <div key={stat.label} className={`${idx !== 0 ? 'border-l border-gray-200 pl-6' : ''}`}>
                                            <p className="text-3xl font-light text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Image Grid - 7 cols */}
                            <div className="col-span-12 lg:col-span-7 grid grid-cols-12 gap-4">
                                {/* Main Large Image */}
                                <div className="col-span-8 aspect-[3/4] relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1000&fit=crop"
                                        alt="Luxury Villa"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                        <p className="text-white text-sm tracking-wider uppercase">Öne Çıkan</p>
                                        <p className="text-white text-xl mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>Kargıcak Villa Collection</p>
                                    </div>
                                </div>
                                {/* Side Images */}
                                <div className="col-span-4 flex flex-col gap-4">
                                    <div className="flex-1 relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=500&fit=crop"
                                            alt="Modern Apartment"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=500&fit=crop"
                                            alt="Luxury Interior"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Portfolio Categories */}
                <section className="py-24 px-8 lg:px-12 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Number */}
                        <div className="flex items-center gap-6 mb-12">
                            <span className="text-7xl font-light text-gray-200" style={{ fontFamily: "'Playfair Display', serif" }}>02</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <h2
                                    className="text-4xl font-normal text-gray-900"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Koleksiyon
                                </h2>
                                <p className="text-gray-500 mt-3 max-w-md">
                                    Seçkin gayrimenkul portföyümüzü kategorilere göre keşfedin.
                                </p>
                            </div>
                            <a href="#" className="hidden md:flex items-center gap-2 text-sm text-gray-900 hover:text-orange-500 transition-colors">
                                Tümünü İncele
                                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "Villalar", count: 48, image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=500&fit=crop" },
                                { name: "Daireler", count: 124, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=500&fit=crop" },
                                { name: "Arsalar", count: 32, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=500&fit=crop" },
                                { name: "Ticari", count: 18, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=500&fit=crop" },
                            ].map((cat, idx) => (
                                <a
                                    key={cat.name}
                                    href="#"
                                    className="group relative overflow-hidden"
                                >
                                    <div className="aspect-[3/4] relative">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        {/* Index */}
                                        <div className="absolute top-4 left-4 text-white/30 text-6xl font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                                            0{idx + 1}
                                        </div>
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <h3 className="text-white text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>{cat.name}</h3>
                                            <p className="text-white/60 text-sm mt-1">{cat.count} Gayrimenkul</p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-24 px-8 lg:px-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Number */}
                        <div className="flex items-center gap-6 mb-12">
                            <span className="text-7xl font-light text-gray-200" style={{ fontFamily: "'Playfair Display', serif" }}>03</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <h2
                            className="text-4xl font-normal text-gray-900 mb-16"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Hizmetlerimiz
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
                            {[
                                { title: "Yatırım Danışmanlığı", desc: "Portföy analizi ve değerlendirme" },
                                { title: "Hukuki Süreç Yönetimi", desc: "Tapu ve izin işlemleri desteği" },
                                { title: "Vatandaşlık Programı", desc: "Türk vatandaşlığı başvuru rehberliği" },
                                { title: "Mülk Yönetimi", desc: "Kiralama ve bakım hizmetleri" },
                                { title: "İç Mimari", desc: "Dekorasyon ve tasarım çözümleri" },
                                { title: "Finansman", desc: "Banka kredisi ve ödeme planları" },
                            ].map((service) => (
                                <div
                                    key={service.title}
                                    className="bg-white p-10 group hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="text-xl text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
                                    <div className="mt-6 w-8 h-px bg-gray-200 group-hover:bg-orange-500 group-hover:w-12 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Alanya */}
                <section className="py-24 px-8 lg:px-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Number */}
                        <div className="flex items-center gap-6 mb-12">
                            <span className="text-7xl font-light text-gray-200" style={{ fontFamily: "'Playfair Display', serif" }}>04</span>
                            <div className="h-px flex-1 bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-12 gap-12 items-center">
                            {/* Image */}
                            <div className="col-span-12 lg:col-span-7 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&h=700&fit=crop"
                                    alt="Alanya Coast"
                                    className="w-full h-auto"
                                />
                                {/* Accent frame */}
                                <div className="absolute -top-4 -left-4 w-32 h-32 border-t border-l border-orange-500 -z-10" />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 border-b border-r border-gray-200 -z-10" />
                            </div>
                            {/* Content */}
                            <div className="col-span-12 lg:col-span-5 lg:pl-8">
                                <h2
                                    className="text-4xl font-normal text-gray-900 mb-6"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Neden Alanya?
                                </h2>
                                <p className="text-gray-500 leading-relaxed mb-6">
                                    Yılda 300 güneşli gün, eşsiz doğa güzellikleri ve zengin tarihi dokusuyla
                                    Alanya, yaşam ve yatırım için ideal bir destinasyondur.
                                </p>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    Türkiye'nin en hızlı büyüyen turizm merkezlerinden biri olan şehir,
                                    sürekli değer artışı ile yatırımcılara cazip fırsatlar sunmaktadır.
                                </p>

                                <div className="grid grid-cols-2 gap-6 py-8 border-t border-b border-gray-100">
                                    {[
                                        { value: "300+", label: "Güneşli Gün" },
                                        { value: "3.2K €", label: "m² Ort. Fiyat" },
                                        { value: "18%", label: "Yıllık Değer Artışı" },
                                        { value: "25°C", label: "Ortalama Sıcaklık" },
                                    ].map((stat) => (
                                        <div key={stat.label}>
                                            <p className="text-2xl text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href="#"
                                    className="inline-flex items-center gap-3 text-gray-900 mt-8 group"
                                >
                                    <span className="text-sm tracking-wide">Detaylı Bilgi</span>
                                    <span className="w-8 h-px bg-gray-900 group-hover:w-12 transition-all" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="py-24 px-8 lg:px-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Number */}
                        <div className="flex items-center gap-6 mb-12">
                            <span className="text-7xl font-light text-gray-200" style={{ fontFamily: "'Playfair Display', serif" }}>05</span>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>

                        <div className="grid grid-cols-12 gap-12">
                            <div className="col-span-12 lg:col-span-5">
                                <h2
                                    className="text-4xl font-normal text-gray-900 mb-4"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    İletişime Geçin
                                </h2>
                                <p className="text-gray-500 leading-relaxed">
                                    Hayalinizdeki gayrimenkulü bulmak için uzman ekibimizle iletişime geçin.
                                </p>
                            </div>
                            <div className="col-span-12 lg:col-span-7">
                                <form className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">İsim</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white border-b border-gray-200 py-4 px-0 text-gray-900 focus:border-gray-900 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">E-posta</label>
                                        <input
                                            type="email"
                                            className="w-full bg-white border-b border-gray-200 py-4 px-0 text-gray-900 focus:border-gray-900 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Mesajınız</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-white border-b border-gray-200 py-4 px-0 text-gray-900 focus:border-gray-900 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center gap-4 bg-gray-900 text-white px-10 py-4 text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
                                        >
                                            <span>Gönder</span>
                                            <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                                                <path d="M19.354 4.354a.5.5 0 000-.708L16.172.464a.5.5 0 10-.708.708L18.293 4l-2.829 2.828a.5.5 0 10.708.708l3.182-3.182zM0 4.5h19v-1H0v1z" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 px-8 lg:px-12 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div className="flex items-center gap-5">
                                <div className="w-10 h-10 border border-gray-900 flex items-center justify-center">
                                    <span className="text-lg text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>G</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        Güzel Invest
                                    </span>
                                    <span className="text-xs text-gray-400 block">Est. 2001 · Alanya, Türkiye</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <a href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Gizlilik</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Şartlar</a>
                                <a href="#" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">İletişim</a>
                            </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">© 2024 Güzel Invest. Tüm hakları saklıdır.</p>
                        </div>
                    </div>
                </footer>
            </div>

            <RouteNavigator />
        </>
    );
}
