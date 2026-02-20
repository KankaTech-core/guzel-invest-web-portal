import React from "react";
import { Bed, SquareAsterisk, Calendar, Building2, MapPin, BuildingIcon, Play } from "lucide-react";
import { s2Data } from "../mockData";
import Image from "next/image";

export const ProjectInfo = () => {
    const { propertiesRibbon, summary, promotionalVideo } = s2Data;

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Bed": return <Bed className="w-8 h-8 font-light" />;
            case "SquareFoot": return <SquareAsterisk className="w-8 h-8 font-light" />;
            case "Calendar": return <Calendar className="w-8 h-8 font-light" />;
            case "Building2": return <Building2 className="w-8 h-8 font-light" />;
            case "MapPin": return <MapPin className="w-8 h-8 font-light" />;
            default: return null;
        }
    };

    return (
        <>
            <section className="w-full border-b border-gray-100 bg-white py-12">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
                        {propertiesRibbon.map((prop, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3 group cursor-default">
                                <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center text-gray-800 transition-colors group-hover:border-orange-500 group-hover:text-orange-500">
                                    {getIcon(prop.icon)}
                                </div>
                                <span className="text-sm font-medium tracking-widest uppercase text-gray-500">
                                    {prop.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-24 md:py-32">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                        <div className="flex-1 flex flex-col gap-8">
                            <div className="w-20 h-20 bg-gray-900 text-white flex items-center justify-center rounded">
                                <BuildingIcon className="w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-none mb-6 whitespace-pre-line">
                                    {summary.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl">
                                    {summary.description}
                                </p>
                            </div>
                        </div>
                        <div className="w-full lg:w-auto flex flex-col gap-8 lg:min-w-[400px]">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider text-sm">Lokasyon</span>
                                    <span className="text-gray-900 font-bold text-lg">{summary.location}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider text-sm">Durum</span>
                                    <span className="text-gray-900 font-bold text-lg">{summary.status}</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <button className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wide uppercase text-sm transition-all flex items-center justify-center px-8 rounded">
                                    İletişime Geç
                                </button>
                                <button className="flex-1 h-14 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold tracking-wide uppercase text-sm transition-all flex items-center justify-center px-8 rounded">
                                    Broşür İndir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-gray-50 py-12">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                    <div className="relative w-full aspect-video bg-gray-900 overflow-hidden group rounded-xl">
                        <Image
                            fill
                            className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                            alt="Video thumbnail"
                            src={promotionalVideo.bgImage}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center text-white transition-transform hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-500">
                                <Play className="w-12 h-12 ml-2" fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
