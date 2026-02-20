import React from "react";
import { s2Data } from "../mockData";

export const HeroSection = () => {
    const { hero } = s2Data;
    return (
        <header className="relative w-full h-[calc(100vh-72px)] min-h-[600px] flex items-end justify-start overflow-hidden bg-gray-900">
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center brightness-[0.75]"
                    style={{ backgroundImage: `url('${hero.bgImage}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 pb-16 md:px-12 md:pb-24 lg:px-20">
                <div className="flex flex-col gap-2 max-w-4xl">
                    <span className="text-white/90 text-xl md:text-2xl font-light tracking-[0.2em] uppercase mb-2 block pl-2 border-l-4 border-orange-500">
                        {hero.yearRange}
                    </span>
                    <h1 className="text-white text-6xl md:text-8xl lg:text-[140px] font-black leading-[0.85] tracking-tight">
                        {hero.title.split(" ")[0]}
                        <br />
                        <span className="text-orange-500">
                            {hero.title.split(" ").slice(1).join(" ")}
                        </span>
                    </h1>
                </div>
            </div>
        </header>
    );
};
