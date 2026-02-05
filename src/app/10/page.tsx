import RouteNavigator from "@/components/homepage/RouteNavigator";

/**
 * Variant 10: Photography-led Bright Premium
 * 
 * Design philosophy: Immersive visual storytelling, large full-bleed imagery,
 * bold typography layered over images, magazine-style layout, emotional connection.
 * 
 * Font: Manrope (Headings) + Instrument Sans (Body)
 */
export default function PhotographyLedPage() {
    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
                {/* Fixed Overlay Header */}
                <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference text-white px-6 md:px-12 py-8 flex justify-between items-center pointer-events-none">
                    <div className="pointer-events-auto">
                        <span className="text-2xl font-bold tracking-tighter" style={{ fontFamily: "'Manrope', sans-serif" }}>
                            GÜZEL.
                        </span>
                    </div>
                    <nav className="pointer-events-auto hidden md:flex items-center gap-8">
                        {["Portfolio", "Services", "About", "Contact"].map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm font-medium hover:opacity-50 transition-opacity"
                            >
                                {item}
                            </a>
                        ))}
                    </nav>
                    <div className="pointer-events-auto">
                        <button className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                            <span className="sr-only">Menu</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                    </div>
                </header>

                {/* Full Screen Hero with Parallax Feel */}
                <section className="relative h-screen min-h-[800px] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1600&h=1200&fit=crop"
                            alt="Alanya Coast"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
                    </div>

                    <div className="relative h-full flex flex-col justify-end pb-32 px-6 md:px-12">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm md:text-base font-medium mb-4 text-orange-400">EST. 2001 — ALANYA</p>
                                    <h1
                                        className="text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tighter leading-[0.9] -ml-1 md:-ml-2"
                                        style={{ fontFamily: "'Manrope', sans-serif" }}
                                    >
                                        LIVING <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-white">ELEVATED</span>
                                    </h1>
                                </div>
                                <div className="hidden lg:block max-w-xs mb-4">
                                    <p className="text-white/80 leading-relaxed text-sm">
                                        Discover a curated portfolio of exceptional properties in the heart of the Turkish Riviera.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Staggered Gallery / Overlapping */}
                <section className="bg-black py-32 px-6 md:px-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-baseline mb-24">
                            <h2 className="text-4xl font-medium" style={{ fontFamily: "'Manrope', sans-serif" }}>Latest Additions</h2>
                            <span className="text-sm text-gray-500">(03 / 12)</span>
                        </div>

                        <div className="flex flex-col gap-32">
                            {/* Item 1 */}
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-full md:w-3/5">
                                    <div className="aspect-[16/9] overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop"
                                            alt="Villa"
                                            className="w-full h-full object-cover grayscale duration-500 hover:grayscale-0 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-2/5 md:-ml-24 z-10 p-8 md:p-12 bg-[#111] border border-white/10">
                                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-4 block">Exclusive</span>
                                    <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>The Cliff House</h3>
                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        Perched above the turquoise waters, this architectural masterpiece offers
                                        unobstructed views and complete privacy.
                                    </p>
                                    <a href="#" className="text-white border-b border-white pb-1 hover:text-orange-400 hover:border-orange-400 transition-colors">View Property</a>
                                </div>
                            </div>

                            {/* Item 2 - Reverse */}
                            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                                <div className="w-full md:w-3/5">
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop"
                                            alt="Apartment"
                                            className="w-full h-full object-cover grayscale duration-500 hover:grayscale-0 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-2/5 md:-mr-24 z-10 p-8 md:p-12 bg-[#111] border border-white/10">
                                    <span className="text-xs font-bold text-green-500 uppercase tracking-widest mb-4 block">New Listing</span>
                                    <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>Urban Penthouse</h3>
                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        Modern city living defined. Smart home integration, expansive terraces,
                                        and prime location in the city center.
                                    </p>
                                    <a href="#" className="text-white border-b border-white pb-1 hover:text-green-400 hover:border-green-400 transition-colors">View Property</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Big Text Statement */}
                <section className="py-32 bg-white text-black px-6 md:px-12 flex items-center justify-center min-h-[60vh]">
                    <div className="max-w-4xl text-center">
                        <p className="text-xl md:text-2xl font-medium mb-8 text-orange-500">OUR PHILOSOPHY</p>
                        <h2
                            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                            style={{ fontFamily: "'Manrope', sans-serif" }}
                        >
                            We don't just sell properties. We curate lifestyles for the discerning few.
                        </h2>
                    </div>
                </section>

                {/* Visual Grid - Instagram style */}
                <section className="bg-black py-32 px-6 md:px-12 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="aspect-square relative group cursor-pointer overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=500&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Lifestyle" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="font-bold underline decoration-orange-500 underline-offset-4">Lifestyle</span>
                                </div>
                            </div>
                            <div className="aspect-square relative group cursor-pointer overflow-hidden lg:translate-y-12">
                                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=500&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Interior" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="font-bold underline decoration-orange-500 underline-offset-4">Interiors</span>
                                </div>
                            </div>
                            <div className="aspect-square relative group cursor-pointer overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Nature" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="font-bold underline decoration-orange-500 underline-offset-4">Nature</span>
                                </div>
                            </div>
                            <div className="aspect-square relative group cursor-pointer overflow-hidden lg:translate-y-12">
                                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=500&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Architecture" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="font-bold underline decoration-orange-500 underline-offset-4">Architecture</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer - Big Block */}
                <footer className="bg-[#111] text-white pt-24 pb-12 px-6 md:px-12 border-t border-white/10">
                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                        <h2 className="text-[10vw] font-bold tracking-tighter leading-none text-white/10 select-none hover:text-white/20 transition-colors" style={{ fontFamily: "'Manrope', sans-serif" }}>
                            GÜZEL
                        </h2>

                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mt-12 mb-12">
                            <a href="#" className="font-medium hover:text-orange-500">Instagram</a>
                            <a href="#" className="font-medium hover:text-orange-500">Facebook</a>
                            <a href="#" className="font-medium hover:text-orange-500">LinkedIn</a>
                            <a href="#" className="font-medium hover:text-orange-500">YouTube</a>
                        </div>

                        <div className="text-sm text-gray-500">
                            &copy; 2024 Güzel Invest. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>

            <RouteNavigator />
        </>
    );
}
