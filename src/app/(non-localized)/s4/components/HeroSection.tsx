import React from "react";
import Image from "next/image";
import { ArrowRight, Bed, Bath, SquareAsterisk, Waves, Car, Verified } from "lucide-react";
import { s4Data } from "../mockData";

export const HeroSection = () => {
    const { hero, propertiesRibbon } = s4Data;

    const getIcon = (iconName: string) => {
        const props = { className: "w-8 h-8" };
        switch (iconName) {
            case "Bed": return <Bed {...props} />;
            case "Bath": return <Bath {...props} />;
            case "SquareFoot": return <SquareAsterisk {...props} />;
            case "Waves": return <Waves {...props} />;
            case "Car": return <Car {...props} />;
            default: return null;
        }
    };

    return (
        <>
            {/* 1. Hero Section */}
            <div className="relative h-screen min-h-[700px] w-full group overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${hero.bgImage}')` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 max-w-[1400px] mx-auto w-full pointer-events-none">
                    <div className="pointer-events-auto animate-fade-in-up">
                        <span className="inline-block px-4 py-2 mb-4 text-sm font-bold tracking-wider text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                            {hero.yearRange}
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight drop-shadow-lg mb-6 whitespace-pre-line">
                            {hero.title}
                        </h1>
                    </div>
                </div>

                {/* Floating CTA Card */}
                <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-white/50 pointer-events-auto transform hover:-translate-y-1 transition-transform duration-300 z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs font-bold text-[#ec6804] uppercase tracking-widest mb-1">Starting from</p>
                            <p className="text-3xl font-bold text-slate-900">{hero.price}</p>
                        </div>
                        <Verified className="text-[#ec6804] w-8 h-8" />
                    </div>
                    <button className="w-full bg-[#ec6804] hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-full transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group/btn">
                        Schedule a Visit
                        <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>

            {/* 2. Properties Ribbon */}
            <div className="bg-[#e5e0d8]/30 border-b border-[#e5e0d8]">
                <div className="max-w-[1400px] mx-auto px-6 py-10">
                    <div className="flex flex-wrap justify-center md:justify-between gap-8 md:gap-4">
                        {propertiesRibbon.map((prop, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 min-w-[100px] group">
                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-[#ec6804] transition-colors group-hover:bg-[#ec6804] group-hover:text-white">
                                    {getIcon(prop.icon)}
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg text-slate-900">{prop.value}</p>
                                    <p className="text-sm text-slate-500">{prop.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
