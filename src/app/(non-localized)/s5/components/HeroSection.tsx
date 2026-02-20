import React from "react";
import { ArrowRight, Bed, ShowerHead as Shower, SquareAsterisk as SquareFoot, CarFront as LocalParking, CalendarDays as CalendarMonth } from "lucide-react";
import { s5Data } from "../mockData";

export const HeroSection = () => {
    const { hero, propertiesRibbon } = s5Data;

    const getIcon = (iconName: string) => {
        const props = { className: "w-8 h-8 font-light text-gray-700/80" };
        switch (iconName) {
            case "Bed": return <Bed {...props} />;
            case "Shower": return <Shower {...props} />;
            case "SquareFoot": return <SquareFoot {...props} />;
            case "LocalParking": return <LocalParking {...props} />;
            case "CalendarMonth": return <CalendarMonth {...props} />;
            default: return null;
        }
    };

    return (
        <>
            {/* 1. Hero Section */}
            <section className="flex flex-col items-center pt-24 pb-12 text-center w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <span className="text-sm font-medium tracking-widest uppercase text-gray-700/60 mb-3">{hero.yearRange}</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#374151] mb-8">{hero.title}</h1>
                <div className="w-full h-[60vh] md:h-[70vh] relative overflow-hidden rounded-md mb-8">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${hero.bgImage}')` }}
                    ></div>
                </div>
                <a className="inline-flex items-center gap-2 text-[#ec6c04] font-bold text-sm tracking-wide border-b border-transparent hover:border-[#ec6c04] transition-colors pb-0.5 group cursor-pointer">
                    {hero.exploreText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </section>

            {/* 2. Properties Ribbon */}
            <section className="py-16 border-b border-gray-100 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 md:gap-x-24">
                    {propertiesRibbon.map((prop, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3 group">
                            {getIcon(prop.icon)}
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#374151]/60 font-semibold">{prop.value}</span>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};
