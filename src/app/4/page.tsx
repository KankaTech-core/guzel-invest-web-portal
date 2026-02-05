import RouteNavigator from "@/components/homepage/RouteNavigator";

export default function ScandinavianCalmPage() {
    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <div className="min-h-screen bg-[#F8F7F4]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-[#F8F7F4]/90 backdrop-blur-md">
                    <div className="max-w-6xl mx-auto px-8 h-24 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EC6803" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <span className="text-lg font-semibold text-gray-900">Güzel Invest</span>
                                <p className="text-[11px] text-gray-400 -mt-0.5">Alanya · Since 2001</p>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-10">
                            {["Keşfet", "Portföy", "Hakkımızda", "İletişim"].map((item) => (
                                <a key={item} href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{item}</a>
                            ))}
                        </nav>
                        <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 transition-colors">
                            İletişime Geçin
                        </button>
                    </div>
                </header>

                {/* Hero */}
                <section className="pt-36 pb-24 px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <p className="text-sm text-orange-500 font-medium mb-4">Akdeniz'in En Güzel Köşesi</p>
                            <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-gray-900 mb-6">
                                Güzel Şehre<br />Güzel Projeler
                            </h1>
                            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
                                Yirmi yılı aşkın süredir Alanya'da, hayalinizdeki evi bulmanıza yardımcı oluyoruz.
                            </p>
                            <div className="flex items-center justify-center gap-4 mt-10">
                                <a href="#" className="bg-orange-500 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-orange-600 transition-colors">
                                    Portföyü Keşfet
                                </a>
                                <a href="#" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
                                    Daha fazla bilgi
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-5 max-w-5xl mx-auto">
                            <div className="col-span-5 row-span-2">
                                <div className="h-full rounded-[32px] overflow-hidden bg-gray-200">
                                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=700&fit=crop" alt="Villa" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="col-span-7">
                                <div className="aspect-[16/9] rounded-[32px] overflow-hidden bg-gray-200">
                                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=450&fit=crop" alt="Interior" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="col-span-4">
                                <div className="aspect-square rounded-[32px] overflow-hidden bg-gray-200">
                                    <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=400&fit=crop" alt="Pool" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="aspect-square rounded-[32px] bg-orange-500 flex items-center justify-center p-6">
                                    <div className="text-center text-white">
                                        <p className="text-4xl font-bold">300+</p>
                                        <p className="text-sm text-orange-200 mt-1">Mutlu Aile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-24 px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <p className="text-sm text-orange-500 font-medium mb-2">Kategoriler</p>
                            <h2 className="text-3xl font-semibold text-gray-900">Ne Arıyorsunuz?</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: "Konut", count: 124, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=350&fit=crop" },
                                { name: "Arsa", count: 45, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=350&fit=crop" },
                                { name: "Ticari", count: 32, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=350&fit=crop" },
                                { name: "Özel Statü", count: 18, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=350&fit=crop" },
                            ].map((c) => (
                                <a key={c.name} href="#" className="group">
                                    <div className="aspect-[4/3.5] rounded-[28px] overflow-hidden mb-4 bg-gray-200">
                                        <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">{c.name}</h3>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">{c.count}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services */}
                <section className="py-24 px-8 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-14">
                            <p className="text-sm text-orange-500 font-medium mb-2">Hizmetlerimiz</p>
                            <h2 className="text-3xl font-semibold text-gray-900">Yanınızdayız</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                            {[
                                { icon: "📊", title: "Yatırım Değer." },
                                { icon: "📋", title: "Süreç Yönetimi" },
                                { icon: "🏠", title: "Kişisel Portföy" },
                                { icon: "🤝", title: "Satış Desteği" },
                                { icon: "💰", title: "Finansal Danış." },
                            ].map((s) => (
                                <div key={s.title} className="bg-[#F8F7F4] rounded-[24px] p-7 text-center group hover:bg-orange-50 transition-colors cursor-pointer">
                                    <div className="w-16 h-16 mx-auto mb-5 rounded-[20px] bg-white flex items-center justify-center text-3xl shadow-sm">{s.icon}</div>
                                    <h3 className="text-sm font-medium text-gray-900">{s.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Alanya */}
                <section className="py-24 px-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[40px] overflow-hidden bg-gray-200">
                                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=675&fit=crop" alt="Alanya" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-[24px] p-5 shadow-lg max-w-[180px]">
                                <p className="text-3xl font-bold text-orange-500">20+</p>
                                <p className="text-sm text-gray-500 mt-1">Yıllık tecrübe</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-orange-500 font-medium mb-3">Neden Alanya?</p>
                            <h2 className="text-4xl font-semibold text-gray-900 mb-6">Huzurlu bir yaşam sizi bekliyor</h2>
                            <p className="text-gray-500 leading-relaxed mb-8">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                            </p>
                            <div className="space-y-4 mb-10">
                                {["Yıl boyu ılıman iklim", "Havalimanına yakın", "Güvenli yatırım"].map((f) => (
                                    <div key={f} className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                            <svg width="14" height="14" fill="none" stroke="#EC6803" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                        </span>
                                        <span className="text-gray-700">{f}</span>
                                    </div>
                                ))}
                            </div>
                            <a href="#" className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                                Portföyü İncele
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-16 px-8 bg-white">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC6803" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                            </div>
                            <span className="text-sm text-gray-500">© 2024 Güzel Invest</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Gizlilik</a>
                            <a href="#" className="text-gray-400 hover:text-gray-600 text-sm">Şartlar</a>
                        </div>
                    </div>
                </footer>
            </div>
            <RouteNavigator />
        </>
    );
}
