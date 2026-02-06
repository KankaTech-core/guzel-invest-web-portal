import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 9: Scandinavian Calm Premium
 * 
 * Design philosophy: Hygge-inspired, ultra minimalist, generous whitespace, 
 * muted warm grays, soft focus, essentialism, subtle interactions.
 * 
 * Font: Libre Baskerville (Headings) + Nunito Sans (Body)
 */
export default function ScandinavianCalmPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,600&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-[#FDFDFD]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                {/* Header - Minimal Centered */}
                <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm pt-6 pb-6 px-8">
                    <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                        <div className="w-24 hidden md:block">{/* Spacer */}</div>

                        <div className="flex flex-col items-center">
                            <span className="text-2xl text-gray-800 tracking-tight" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                                Güzel Invest
                            </span>
                        </div>

                        <div className="w-24 flex justify-end">
                            <button className="group flex flex-col items-end gap-1.5 w-8">
                                <span className="h-px w-8 bg-gray-800 transition-all group-hover:w-6"></span>
                                <span className="h-px w-6 bg-gray-800 transition-all group-hover:w-8"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero - Split Horizontal with Lots of Air */}
                <section className="pt-40 pb-24 px-8 md:px-16 lg:px-24">
                    <div className="max-w-screen-xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                            <div className="lg:col-span-5 space-y-10">
                                <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">Alanya, Turkey</span>
                                <h1
                                    className="text-5xl md:text-6xl text-gray-800 leading-[1.2]"
                                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                                >
                                    Simplicity is the <br />
                                    <span className="italic text-gray-400">ultimate</span> luxury.
                                </h1>
                                <p className="text-lg text-gray-500 font-light leading-relaxed max-w-sm">
                                    Curated real estate for those who seek peace, comfort, and timeless value in the Mediterranean.
                                </p>
                                <div className="pt-4">
                                    <a href="#" className="inline-block border-b border-gray-800 pb-1 text-gray-900 text-sm hover:text-gray-500 hover:border-gray-300 transition-all">
                                        Explore Collection
                                    </a>
                                </div>
                            </div>

                            <div className="lg:col-span-7 relative">
                                <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&h=1100&fit=crop"
                                        alt="Minimal Interior"
                                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                                    />
                                </div>
                                {/* Ornamental floating image */}
                                <div className="hidden md:block absolute -bottom-12 -left-12 w-48 h-64 bg-white p-2 shadow-2xl shadow-gray-100">
                                    <img
                                        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=400&fit=crop"
                                        alt="Detail"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curated Selection - Horizontal Scroll */}
                <section className="py-24 overflow-hidden">
                    <div className="px-8 md:px-16 lg:px-24 mb-12 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl text-gray-800 mb-2" style={{ fontFamily: "'Libre Baskerville', serif" }}>Selected Works</h2>
                            <p className="text-gray-400 font-light">Winter 2024 Collection</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-sm text-gray-300">01 — 04</span>
                        </div>
                    </div>

                    <div className="flex gap-8 px-8 md:px-16 lg:px-24 overflow-x-auto pb-12 no-scrollbar scroll-smooth">
                        {[
                            { name: "The Nordic Villa", loc: "Tepe", price: "650.000 €", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=800&fit=crop" },
                            { name: "Loft No. 4", loc: "Mahmutlar", price: "210.000 €", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=800&fit=crop" },
                            { name: "Stone House", loc: "Kale", price: "1.2M €", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=800&fit=crop" },
                            { name: "Azure Flat", loc: "Kestel", price: "285.000 €", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=800&fit=crop" },
                        ].map((item, idx) => (
                            <div key={idx} className="min-w-[300px] md:min-w-[400px] group cursor-pointer">
                                <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex justify-between items-baseline border-t border-gray-100 pt-4">
                                    <div>
                                        <h3 className="text-xl text-gray-900 group-hover:text-gray-500 transition-colors" style={{ fontFamily: "'Libre Baskerville', serif" }}>{item.name}</h3>
                                        <p className="text-sm text-gray-400 mt-1">{item.loc}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Minimal Text Block */}
                <section className="py-24 px-8 md:px-16 lg:px-24 bg-[#F8F8F7]">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <div className="w-px h-16 bg-gray-300 mx-auto" />
                        <p
                            className="text-3xl md:text-4xl leading-relaxed text-gray-800"
                            style={{ fontFamily: "'Libre Baskerville', serif" }}
                        >
                            "We believe in spaces that breathe. Homes that are not just built,
                            but crafted with intention, blending the warmth of the Mediterranean
                            with the clarity of modern design."
                        </p>
                        <div className="flex justify-center gap-12 pt-8">
                            <div className="text-center">
                                <span className="block text-2xl mb-1 font-light text-gray-400">23</span>
                                <span className="text-xs uppercase tracking-widest text-gray-400">Years</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl mb-1 font-light text-gray-400">500+</span>
                                <span className="text-xs uppercase tracking-widest text-gray-400">Homes</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact - Clean & Simple */}
                <section className="py-24 px-8 md:px-16 lg:px-24">
                    <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
                        <div className="space-y-8">
                            <h2 className="text-4xl text-gray-800" style={{ fontFamily: "'Libre Baskerville', serif" }}>Get in touch</h2>
                            <p className="text-gray-500 font-light max-w-sm">
                                Reach out to discuss your investment goals or to schedule a viewing.
                            </p>
                            <div className="space-y-4 pt-4">
                                <p className="text-gray-800">hello@guzelinvest.com</p>
                                <p className="text-gray-800">+90 242 511 00 00</p>
                                <p className="text-gray-400 text-sm w-48">
                                    Atatürk Blv. No:142
                                    Alanya, Antalya
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-12">
                            <form className="space-y-8">
                                <div className="border-b border-gray-200 pb-2">
                                    <input type="text" placeholder="Name" className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-light" />
                                </div>
                                <div className="border-b border-gray-200 pb-2">
                                    <input type="email" placeholder="Email" className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-light" />
                                </div>
                                <div className="border-b border-gray-200 pb-2">
                                    <textarea rows={3} placeholder="Message" className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-light resize-none" />
                                </div>
                                <button className="text-sm uppercase tracking-widest border border-gray-800 px-8 py-4 hover:bg-gray-800 hover:text-white transition-all">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* Footer - Copyright Only */}
                <footer className="py-12 text-center">
                    <span className="text-[10px] text-gray-300 uppercase tracking-widest">© Güzel Invest 2001—2024</span>
                </footer>
            </div>

            <RouteNavigator />
        </>
    );
}
