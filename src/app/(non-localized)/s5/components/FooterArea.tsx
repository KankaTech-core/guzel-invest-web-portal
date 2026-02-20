import React from "react";
import Image from "next/image";
import { Download, MapPin } from "lucide-react";
import { s5Data } from "../mockData";

export const FooterArea = () => {
    const { documentCta, location, otherProjects } = s5Data;

    return (
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pb-24">
            {/* 9. Document CTA */}
            <section className="py-16">
                <div className="bg-[#f3f4f6] rounded-xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h4 className="text-xl font-bold text-[#374151]">{documentCta.title}</h4>
                        <p className="text-[#374151]/60 font-light text-sm max-w-sm">{documentCta.description}</p>
                    </div>
                    <button className="bg-[#ec6c04] hover:bg-[#ec6c04]/90 text-white px-8 py-3 rounded-md text-sm font-bold tracking-wide transition-colors flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        DOWNLOAD PDF
                    </button>
                </div>
            </section>

            {/* 10 & 11. Location & Map */}
            <section className="py-24">
                <h3 className="text-xl font-bold text-[#374151] mb-12">{location.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                    {location.maps.map((map, idx) => (
                        <div key={idx} className={`aspect-square bg-gray-50 border border-gray-200 p-1 rounded-sm ${idx === 2 ? 'hidden md:block' : ''}`}>
                            <div
                                className="w-full h-full bg-cover bg-center grayscale opacity-80"
                                style={{ backgroundImage: `url('${map.image}')` }}
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="w-full h-[400px] bg-gray-200 rounded-md relative overflow-hidden">
                    {/* Simulated Grayscale Map */}
                    <div
                        className="absolute inset-0 bg-cover bg-center grayscale contrast-75 brightness-110"
                        style={{ backgroundImage: `url('${location.mainMap.image}')` }}
                    ></div>
                    {/* Map Overlay */}
                    <div className="absolute top-6 left-6 bg-white p-4 shadow-sm rounded-md max-w-xs z-10">
                        <p className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-1">{location.mainMap.title}</p>
                        <p className="text-sm text-[#374151]/70">{location.mainMap.subtitle}</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <MapPin className="text-[#ec6c04] w-12 h-12 drop-shadow-md" fill="currentColor" stroke="white" />
                    </div>
                </div>
            </section>

            {/* 12. Other Projects */}
            <section className="py-24 border-t border-gray-100">
                <h3 className="text-xl font-bold text-[#374151] mb-12">{otherProjects.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {otherProjects.projects.map((project, idx) => (
                        <div key={idx} className="group cursor-pointer">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100 mb-4 inline-block relative">
                                <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="flex justify-between items-baseline">
                                <h4 className="text-lg font-bold text-[#374151] group-hover:text-[#ec6c04] transition-colors">{project.title}</h4>
                                <span className="text-xs text-[#374151]/40">{project.year}</span>
                            </div>
                            <p className="text-sm text-[#374151]/60 mt-1">{project.type}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
