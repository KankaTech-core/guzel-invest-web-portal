import React from "react";
import Image from "next/image";
import { Download, FileText, MapPin, ArrowRight } from "lucide-react";
import { s4Data } from "../mockData";

export const MapAndCTA = () => {
    const { documentCta, mapImages, interactiveMap, otherProjects } = s4Data;

    return (
        <>
            {/* 9. Document CTA */}
            <div className="bg-[#e5e0d8] py-20">
                <div className="max-w-[1000px] mx-auto px-6 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-8">{documentCta.title}</h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="bg-white hover:bg-gray-50 text-[#1e3a8a] font-bold py-4 px-8 rounded-full shadow-md transition-all flex items-center justify-center gap-3">
                            <Download className="w-6 h-6" />
                            Download Brochure
                        </button>
                        <button className="bg-[#ec6804] hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-full shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-3">
                            <FileText className="w-6 h-6" />
                            Technical Specs
                        </button>
                    </div>
                </div>
            </div>

            {/* 10 & 11. Maps & Location */}
            <div className="bg-white py-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    <h3 className="text-3xl font-bold text-[#1e3a8a] mb-12">Prime Location</h3>

                    {/* 3 Map Snapshots */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {mapImages.map((map, idx) => (
                            <div key={idx} className="relative group rounded-2xl overflow-hidden aspect-[4/3]">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${map.bgImage}')` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                                    <span className="text-white font-bold text-lg">{map.distance}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Full Width Map */}
                    <div className="w-full h-[400px] rounded-3xl overflow-hidden relative shadow-inner">
                        <Image quality={100} unoptimized src={interactiveMap.bgImage} alt="Map" fill className="object-cover filter contrast-75" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white py-3 px-6 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
                                <MapPin className="text-[#ec6804] w-6 h-6" />
                                <span className="font-bold text-slate-900">{interactiveMap.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 12. Other Projects */}
            <div className="bg-[#faf9f6] py-24">
                <div className="max-w-[1400px] mx-auto px-6">
                    <h3 className="text-3xl font-bold text-[#1e3a8a] mb-12">You might also like</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {otherProjects.map((project, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group">
                                <div className="h-64 overflow-hidden relative">
                                    <Image quality={100} unoptimized src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                    {project.badge && (
                                        <div className="absolute top-4 right-4 bg-[#ec6804] text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {project.badge}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h4>
                                    <p className="text-slate-500 mb-4 text-sm">{project.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#ec6804] font-bold">{project.price}</span>
                                        <button className="w-8 h-8 rounded-full bg-[#e5e0d8]/50 flex items-center justify-center hover:bg-[#ec6804] hover:text-white transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white py-10 border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Mediterranean Estates</h2>
                    <div className="flex gap-6 text-sm font-medium text-slate-600">
                        <a className="hover:text-[#ec6804] transition-colors cursor-pointer">Privacy Policy</a>
                        <a className="hover:text-[#ec6804] transition-colors cursor-pointer">Terms of Service</a>
                        <a className="hover:text-[#ec6804] transition-colors cursor-pointer">Contact</a>
                    </div>
                    <p className="text-sm text-slate-400">© 2026 Güzel Invest.</p>
                </div>
            </footer>
        </>
    );
};
