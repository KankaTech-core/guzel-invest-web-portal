import React, { useMemo } from "react";
import { Bed, Building2, Sofa, PenTool, Star, ImageIcon, Phone, Download, Play } from "lucide-react";
import { s1Data } from "../mockData";
import Image from "next/image";

export const ProjectInfo = () => {
    const { propertiesRibbon, summary } = s1Data;

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Bed": return <Bed className="w-6 h-6 text-orange-500" />;
            case "Building2": return <Building2 className="w-6 h-6 text-orange-500" />;
            case "Sofa": return <Sofa className="w-6 h-6 text-orange-500" />;
            case "PenTool": return <PenTool className="w-6 h-6 text-orange-500" />;
            case "Star": return <Star className="w-6 h-6 text-orange-500" />;
            default: return null;
        }
    };

    return (
        <>
            <section className="bg-white py-8 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap justify-between gap-8 md:gap-4">
                        {propertiesRibbon.map((prop, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    {getIcon(prop.icon)}
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">{prop.label}</p>
                                    <p className="font-bold text-gray-900">{prop.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-[24px] p-8 flex flex-col lg:flex-row items-center gap-12 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100">
                        <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                            <ImageIcon className="w-16 h-16 text-gray-300" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                {summary.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-3 py-1 rounded-md text-xs font-bold ${idx === 0 ? "bg-orange-500/10 text-orange-500" : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-gray-900">{summary.title}</h2>
                            <p className="text-gray-600 leading-relaxed">{summary.description}</p>
                        </div>
                        <div className="flex flex-col gap-4 w-full lg:w-64">
                            <div className="bg-gray-50 p-4 rounded-xl mb-2 text-center">
                                <p className="text-xs text-gray-400 font-bold uppercase">Teslim Tarihi</p>
                                <p className="text-xl font-bold text-orange-500">{summary.deliveryDate}</p>
                            </div>
                            <button className="w-full bg-orange-500 text-white font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                                <Phone className="w-5 h-5" /> İletişim
                            </button>
                            <button className="w-full border-2 border-orange-500 text-orange-500 font-bold py-3.5 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                                <Download className="w-5 h-5" /> Sunum İndir
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden relative group">
                        <Image
quality={100} unoptimized                             fill
                            className="object-cover opacity-80"
                            alt="Video thumbnail"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmQOQjrEb7OZZz8_6s4Mdft9xtelVQCVMEQbHbccF_siaaMLBa4WWi49elnH5xosnyH7tyiVLAOa4SriILRcXKN7CpXkqiL7_PYMboEdOcKLgUuqrS818pSt2JDDskA2zT2qsHKakFICYax026UpDHZ2gfzQfIiIsq_zIC7QqyInckKuhT8wMfLwvt2jLTiTplRjdzeXgABtgD_JRGW0UrNNvYqEV7uHTA2yLqz9lwFyjanCRoreTQ3u-fnoiNB0OOg93vcfZMg08F"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-24 h-24 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(236,104,3,0.3)] hover:scale-110 transition-transform">
                                <Play className="w-10 h-10 ml-1" fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
