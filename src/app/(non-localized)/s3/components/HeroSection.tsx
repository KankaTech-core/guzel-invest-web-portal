import React from "react";
import { ArrowRight, Info, Download, Play, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Image from "next/image";
import { s3Data } from "../mockData";

export const HeroSection = () => {
    const { hero } = s3Data;
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] border-b border-gray-200">
            {/* Left Side: Content */}
            <div className="relative flex flex-col justify-center p-8 lg:p-16 bg-white">
                <div className="mb-6">
                    <span className="inline-block bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm mb-4">
                        {hero.yearRange}
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.1] tracking-tight mb-4">
                        {hero.title}
                    </h1>
                    <p className="text-gray-500 text-lg lg:text-xl font-medium max-w-md">
                        {hero.description}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 pb-12">
                    <button className="flex items-center justify-center gap-2 h-12 px-8 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm tracking-wide rounded-sm transition-colors uppercase">
                        <span>Invest Now</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="flex items-center justify-center gap-2 h-12 px-8 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm tracking-wide rounded-sm transition-colors border border-gray-200 uppercase">
                        Download Prospectus
                    </button>
                </div>
                {/* Technical CTA Banner */}
                <div className="absolute bottom-0 left-0 w-full border-t border-gray-100 bg-gray-50 py-3 px-8 lg:px-16 flex items-center justify-between text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {hero.liveTradingText}
                    </span>
                    <span>ID: {hero.id}</span>
                </div>
            </div>
            {/* Right Side: Image */}
            <div className="relative h-64 lg:h-auto bg-gray-200">
                <Image src={hero.bgImage} alt="Hero image" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
            </div>
        </section>
    );
};

export const PropertiesRibbon = () => {
    const { propertiesRibbon } = s3Data;
    return (
        <div className="border-b border-gray-200 bg-white overflow-x-auto">
            <div className="flex min-w-max divide-x divide-gray-200">
                {propertiesRibbon.map((prop, idx) => (
                    <div key={idx} className="flex-1 flex items-center gap-4 px-8 py-5 group hover:bg-gray-50 transition-colors cursor-default">
                        {/* Using a placeholder circle instead of mapping all lucide icons for simplicity */}
                        <div className="w-8 h-8 rounded-sm bg-gray-100 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors text-gray-400">
                            <span className="text-xs font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{prop.label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-[#0F172A]">{prop.value}</span>
                                {prop.highlight && (
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-1 py-0.5 rounded-sm">{prop.highlight}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
