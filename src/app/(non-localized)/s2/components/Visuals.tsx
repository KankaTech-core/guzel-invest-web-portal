import React from "react";
import Image from "next/image";
import { Waves, Dumbbell, Sparkles, TreePine, ArrowRight } from "lucide-react";
import { s2Data } from "../mockData";

export const Visuals = () => {
    const { exteriorVisuals, socialFacilities, interiorVisuals, floorPlans } = s2Data;

    const getFacilityIcon = (iconName: string) => {
        const props = { className: "w-10 h-10 font-light" };
        switch (iconName) {
            case "Waves": return <Waves {...props} />;
            case "Dumbbell": return <Dumbbell {...props} />;
            case "Sparkles": return <Sparkles {...props} />;
            case "TreePine": return <TreePine {...props} />;
            default: return null;
        }
    };

    return (
        <>
            <section className="w-full bg-white py-24 md:py-32 overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-16 max-w-3xl leading-tight">
                        {exteriorVisuals.titleHeading} <span className="text-orange-500 italic">{exteriorVisuals.titleSpan}</span>
                    </h3>
                    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">
                        <div className="md:col-span-7 relative z-10 w-full h-[500px]">
                            <Image quality={100} unoptimized src={exteriorVisuals.images[0]} alt="Exterior 1" fill className="object-cover shadow-2xl rounded" />
                        </div>
                        <div className="md:col-span-6 md:col-start-6 md:-mt-32 relative z-20 pt-8 md:pt-0 pl-4 md:pl-0 w-full h-[450px]">
                            <div className="relative w-full h-full shadow-2xl border-8 border-white rounded">
                                <Image quality={100} unoptimized src={exteriorVisuals.images[1]} alt="Exterior 2" fill className="object-cover" />
                            </div>
                        </div>
                        <div className="hidden md:block md:col-span-4 md:col-start-2 md:-mt-24 relative z-30 w-full h-[300px]">
                            <div className="relative w-full h-full shadow-xl border-8 border-white rounded">
                                <Image quality={100} unoptimized src={exteriorVisuals.images[2]} alt="Exterior 3" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#f8f7f5] py-24">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="flex flex-col md:flex-row gap-12 h-full">
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                                {socialFacilities.facilities.map((fac, idx) => (
                                    <div key={idx} className="flex flex-col gap-3">
                                        <div className="text-orange-500">{getFacilityIcon(fac.icon)}</div>
                                        <h4 className="text-lg font-bold uppercase tracking-widest text-gray-900">{fac.name}</h4>
                                        <p className="text-gray-500 text-sm font-light">{fac.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex gap-6 h-[600px]">
                            <div className="flex-1 h-full relative">
                                <Image quality={100} unoptimized src={socialFacilities.image} alt="Facilities" fill className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <div className="hidden md:flex items-end pb-8">
                                <h2 className="writing-vertical-rl text-6xl md:text-8xl font-black text-gray-300 uppercase tracking-tighter transform rotate-180" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                                    {socialFacilities.title}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-24 md:py-32">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <h3 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight whitespace-pre-line">
                            {interiorVisuals.title}
                        </h3>
                        <p className="text-gray-500 max-w-md text-right md:text-left">
                            {interiorVisuals.description}
                        </p>
                    </div>
                    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">
                        <div className="md:col-span-8 md:col-start-5 relative z-10 w-full h-[550px]">
                            <Image quality={100} unoptimized src={interiorVisuals.images[0]} alt="Interior 1" fill className="object-cover shadow-2xl rounded" />
                        </div>
                        <div className="md:col-span-5 md:col-start-2 md:-mt-48 relative z-20 pt-8 md:pt-0 pr-4 md:pr-0 w-full h-[400px]">
                            <div className="relative w-full h-full shadow-2xl border-8 border-white rounded">
                                <Image quality={100} unoptimized src={interiorVisuals.images[1]} alt="Interior 2" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-gray-50 py-24">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[500px] w-full flex items-center justify-center">
                            <div className="absolute left-0 top-10 w-3/4 h-3/4 bg-white shadow-xl p-4 transform -rotate-3 z-10 border border-gray-100 rounded">
                                <Image quality={100} unoptimized src={floorPlans.images[0]} alt="Plan A" fill className="object-contain" />
                            </div>
                            <div className="absolute right-0 bottom-10 w-3/4 h-3/4 bg-white shadow-xl p-4 transform rotate-2 z-20 border border-gray-100 rounded">
                                <Image quality={100} unoptimized src={floorPlans.images[1]} alt="Plan B" fill className="object-contain" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <h2 className="text-5xl font-bold text-gray-900">{floorPlans.title}</h2>
                            <p className="text-gray-600 text-lg font-light leading-relaxed">
                                {floorPlans.description}
                            </p>
                            <div className="flex flex-col gap-4">
                                {floorPlans.plans.map((plan, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-300 py-3">
                                        <span className="font-medium text-gray-800">{plan.type}</span>
                                        <span className="text-gray-500">{plan.area}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 text-orange-500 font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all w-fit rounded">
                                Tüm Planları İndir <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
