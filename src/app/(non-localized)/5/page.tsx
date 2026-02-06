import RouteNavigator from "@/components/homepage/RouteNavigator";

export default function PhotographyLedBrightPage() {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

            <div className="min-h-screen bg-white" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                {/* Minimal Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md">
                    <div className="max-w-[1440px] mx-auto px-10 h-16 flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900 tracking-tight">Güzel Invest</span>
                        <nav className="hidden md:flex items-center gap-8">
                            {["Portföy", "Hakkımızda", "İletişim"].map((i) => (
                                <a key={i} href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{i}</a>
                            ))}
                        </nav>
                        <button className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors">Randevu</button>
                    </div>
                </header>

                {/* Full-bleed Hero */}
                <section className="pt-16">
                    <div className="relative h-[85vh] min-h-[600px]">
                        <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&h=1100&fit=crop"
                            alt="Luxury Alanya Villa"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                            <div className="max-w-[1440px] mx-auto">
                                <p className="text-orange-400 text-sm mb-3 tracking-wide">Alanya&apos;da Gayrimenkul</p>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-4">
                                    Güzel Şehre<br />Güzel Projeler
                                </h1>
                                <p className="text-white/80 text-lg max-w-lg mb-8">
                                    2001'den bu yana güvenilir gayrimenkul danışmanlığı.
                                </p>
                                <div className="flex items-center gap-4">
                                    <a href="#" className="bg-orange-500 text-white px-7 py-3.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                                        Keşfet
                                    </a>
                                    <a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Hakkımızda →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Immersive Categories */}
                <section className="py-20 px-10">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="flex items-end justify-between mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900">Kategoriler</h2>
                            <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">Tümü →</a>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { name: "Konut", count: 124, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=650&fit=crop" },
                                { name: "Arsa", count: 45, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=650&fit=crop" },
                                { name: "Ticari", count: 32, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=650&fit=crop" },
                                { name: "Özel", count: 18, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=650&fit=crop" },
                            ].map((c) => (
                                <a key={c.name} href="#" className="group relative aspect-[3/4] overflow-hidden rounded-xl">
                                    <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-5 left-5">
                                        <h3 className="text-white text-xl font-medium">{c.name}</h3>
                                        <p className="text-white/60 text-xs mt-0.5">{c.count} ilan</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Minimal Services */}
                <section className="py-16 px-10 border-y border-gray-100">
                    <div className="max-w-[1440px] mx-auto">
                        <div className="grid grid-cols-5 divide-x divide-gray-100">
                            {[
                                { icon: "📊", title: "Yatırım Değer." },
                                { icon: "📋", title: "Süreç Yönetimi" },
                                { icon: "🏠", title: "Kişisel Portföy" },
                                { icon: "🤝", title: "Satış Desteği" },
                                { icon: "💰", title: "Finansal Danış." },
                            ].map((s) => (
                                <div key={s.title} className="px-8 py-6 text-center group cursor-pointer">
                                    <span className="text-2xl block mb-3 group-hover:scale-110 transition-transform">{s.icon}</span>
                                    <p className="text-sm text-gray-600">{s.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Photo-led Why Alanya */}
                <section className="py-0">
                    <div className="grid grid-cols-2 min-h-[80vh]">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&h=800&fit=crop"
                                alt="Alanya"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex items-center p-16 lg:p-24">
                            <div className="max-w-md">
                                <p className="text-sm text-orange-500 font-medium mb-3">Neden Alanya?</p>
                                <h2 className="text-4xl font-semibold text-gray-900 mb-6 leading-tight">
                                    Akdeniz'in en güzel kıyıları
                                </h2>
                                <p className="text-gray-500 leading-relaxed mb-8">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                                <a href="#" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                    Portföyü İncele
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Minimal Footer */}
                <footer className="py-8 px-10 border-t border-gray-100">
                    <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                        <span className="text-sm text-gray-400">© 2024 Güzel Invest</span>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-gray-400 hover:text-gray-600">Gizlilik</a>
                            <a href="#" className="text-sm text-gray-400 hover:text-gray-600">Şartlar</a>
                        </div>
                    </div>
                </footer>
            </div>
            <RouteNavigator />
        </>
    );
}
