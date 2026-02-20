import React from "react";
import Image from "next/image";
import { Dumbbell, Sparkles, Umbrella } from "lucide-react";
import { s4Data } from "../mockData";

export const Visuals = () => {
    const { exteriorVisuals, socialFacilities, interiorVisuals, floorPlans } = s4Data;

    const getFacilityIcon = (iconName: string) => {
        switch (iconName) {
            case "Dumbbell": return <Dumbbell className="w-6 h-6" />;
            case "Sparkles": return <Sparkles className="w-6 h-6" />;
            case "Umbrella": return <Umbrella className="w-6 h-6" />;
            default: return null;
        }
    };

    return (
        <>
            {/* 5. Exterior Visuals */}
            <div className="bg-[#e5e0d8]/20 py-24 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-16 max-w-2xl">
                        <span className="text-[#ec6804] font-bold tracking-widest uppercase text-sm mb-2 block">Gallery</span>
                        <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a]">{exteriorVisuals.title}</h3>
                    </div>
                    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                        {/* Image 1: Large Main */}
                        <div className="md:col-span-7 h-[300px] md:h-full relative z-10 w-full">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl relative">
                                <Image src={exteriorVisuals.images[0].src} alt={exteriorVisuals.images[0].alt} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        </div>
                        {/* Right Column for overlapping images */}
                        <div className="md:col-span-5 flex flex-col gap-6 h-full relative">
                            <div className="h-[250px] md:h-[45%] w-full md:w-[110%] md:-ml-[10%] relative z-20 mt-8 md:mt-12">
                                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative">
                                    <Image src={exteriorVisuals.images[1].src} alt={exteriorVisuals.images[1].alt} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                            <div className="h-[250px] md:h-[45%] w-full relative z-10">
                                <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg relative">
                                    <Image src={exteriorVisuals.images[2].src} alt={exteriorVisuals.images[2].alt} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Social Facilities */}
            <div className="max-w-[1400px] mx-auto px-6 py-24">
                <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-8">
                        <h3 className="text-3xl font-bold text-[#1e3a8a] mb-6">{socialFacilities.title}</h3>
                        <ul className="space-y-6">
                            {socialFacilities.facilities.map((fac, idx) => (
                                <li key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#e5e0d8]/30 transition-colors cursor-default">
                                    <div className="w-12 h-12 rounded-full bg-[#ec6804]/10 flex items-center justify-center text-[#ec6804] shrink-0">
                                        {getFacilityIcon(fac.icon)}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-1">{fac.name}</h4>
                                        <p className="text-slate-500">{fac.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="h-[500px] w-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl relative">
                            <Image src={socialFacilities.image} alt="Lifestyle" fill className="object-cover" />
                            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md p-6 rounded-2xl">
                                <p className="text-[#1e3a8a] font-serif italic text-xl">{socialFacilities.quote}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7. Interior Visuals (Masonry-ish Grid) */}
            <div className="bg-[#faf9f6] py-20">
                <div className="max-w-[1400px] mx-auto px-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-12 text-center">{interiorVisuals.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="group relative overflow-hidden rounded-2xl h-[400px] lg:h-[500px] w-full">
                            <Image src={interiorVisuals.images[0].src} alt={interiorVisuals.images[0].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        <div className="flex flex-col gap-6 lg:h-[500px]">
                            <div className="group relative overflow-hidden rounded-2xl flex-1 h-[240px] w-full">
                                <Image src={interiorVisuals.images[1].src} alt={interiorVisuals.images[1].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                            <div className="group relative overflow-hidden rounded-2xl flex-1 h-[240px] w-full">
                                <Image src={interiorVisuals.images[2].src} alt={interiorVisuals.images[2].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl h-[400px] lg:h-[500px] w-full">
                            <Image src={interiorVisuals.images[3].src} alt={interiorVisuals.images[3].alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 8. Floor Plans */}
            <div className="bg-[#e5e0d8]/10 py-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-[#1e3a8a]">{floorPlans.title}</h3>
                        <p className="text-slate-500 mt-4 max-w-xl mx-auto">{floorPlans.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {floorPlans.plans.map((plan, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-[#e5e0d8]/50">
                                <h4 className="text-xl font-bold text-center mb-6 text-[#ec6804]">{plan.type}</h4>
                                <div
                                    className={`relative aspect-square bg-contain bg-center bg-no-repeat opacity-80 mix-blend-multiply ${plan.rotate ? 'rotate-180' : ''}`}
                                    style={{ backgroundImage: `url('${plan.image}')` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
