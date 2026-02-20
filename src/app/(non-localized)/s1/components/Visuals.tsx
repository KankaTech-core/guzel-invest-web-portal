import React from "react";
import Image from "next/image";
import { ArrowRight, Waves, Dumbbell, Film, Sparkles, Baby, Car, ZoomIn } from "lucide-react";
import { s1Data } from "../mockData";

export const Visuals = () => {
    const { exteriorVisuals, socialFacilities, interiorVisuals, floorPlans } = s1Data;

    const getFacilityIcon = (iconName: string) => {
        const props = { className: "w-8 h-8" };
        switch (iconName) {
            case "Waves": return <Waves {...props} />;
            case "Dumbbell": return <Dumbbell {...props} />;
            case "Film": return <Film {...props} />;
            case "Sparkles": return <Sparkles {...props} />;
            case "Baby": return <Baby {...props} />;
            case "Car": return <Car {...props} />;
            default: return null;
        }
    };

    return (
        <>
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">{exteriorVisuals.title}</h2>
                    <div className="grid grid-cols-2 gap-4 auto-rows-[200px]">
                        {exteriorVisuals.images.map((img, idx) => (
                            <div key={idx} className={`bg-gray-200 rounded-2xl overflow-hidden relative ${idx === 0 ? "row-span-2" : ""}`}>
                                <Image src={img} alt="Exterior" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 grid grid-cols-3 gap-8">
                        {socialFacilities.facilities.map((fac, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm border border-gray-100 group-hover:border-orange-500">
                                    {getFacilityIcon(fac.icon)}
                                </div>
                                <p className="text-sm font-bold text-gray-700">{fac.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="rounded-[2.5rem] overflow-hidden relative aspect-[4/3]">
                            <Image src={socialFacilities.image} alt="Facilities" fill className="object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-8 rounded-3xl max-w-xs shadow-lg">
                            <h3 className="text-2xl font-black mb-2">{socialFacilities.title}</h3>
                            <p className="text-sm text-white/90">{socialFacilities.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-end justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">{interiorVisuals.title}</h2>
                        <p className="text-orange-500 font-bold flex items-center gap-2 cursor-pointer hover:underline">
                            Tümünü Gör <ArrowRight className="w-5 h-5" />
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {interiorVisuals.images.map((img, idx) => (
                            <div key={idx} className={`aspect-[4/5] rounded-3xl overflow-hidden relative ${idx === 1 ? 'md:mt-12' : idx === 2 ? 'md:mt-24' : ''}`}>
                                <Image src={img} alt="Interior" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {floorPlans.plans.map((plan, idx) => (
                            <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <div className="w-full h-64 relative rounded-xl mb-4 overflow-hidden">
                                    <Image src={plan.image} alt={plan.title} fill className="object-cover" />
                                </div>
                                <div className="flex justify-between items-center text-gray-900">
                                    <span className="font-bold">{plan.title}</span>
                                    <span className="text-sm text-gray-500">{plan.area}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-1/3 flex flex-col justify-center">
                        <h2 className="text-4xl font-black mb-6 text-gray-900">{floorPlans.title}</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">{floorPlans.description}</p>
                        <button className="bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors">
                            <ZoomIn className="w-5 h-5" /> Tüm Planları İncele
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};
