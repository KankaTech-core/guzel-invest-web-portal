import React from "react";
import Image from "next/image";
import { s1Data } from "../mockData";

export const HeroSection = () => {
    const { hero } = s1Data;
    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('${hero.bgImage}')`,
                }}
            ></div>
            <div className="absolute bottom-12 left-12 text-white">
                <span className="bg-orange-500 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
                    {hero.yearRange}
                </span>
                <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none">
                    {hero.title.split(" ").slice(0, 1).join(" ")} <br />
                    {hero.title.split(" ").slice(1).join(" ")}
                </h1>
                <p className="text-lg text-slate-200 max-w-xl">{hero.description}</p>
            </div>
            <div className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl max-w-sm hidden lg:block">
                <h3 className="text-white text-xl font-bold mb-2">{hero.ctaTitle}</h3>
                <p className="text-slate-300 text-sm mb-6">{hero.ctaDescription}</p>
                <button className="w-full bg-white text-orange-500 font-bold py-3 rounded-lg hover:bg-slate-100 transition-colors">
                    {hero.ctaButton}
                </button>
            </div>
        </section>
    );
};
