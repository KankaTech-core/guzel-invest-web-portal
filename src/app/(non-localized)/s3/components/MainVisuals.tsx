import React from "react";
import Image from "next/image";
import { Play, ArrowRight, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { s3Data } from "../mockData";

export const MainVisuals = () => {
    const { promotionalVideo, exteriorVisuals, socialFacilities, interiorVisuals, floorPlans, documentCta } = s3Data;

    return (
        <>
            {/* 4. Promotional Video */}
            <section className="aspect-video w-full bg-gray-900 relative group cursor-pointer overflow-hidden">
                <Image quality={100} unoptimized src={promotionalVideo.bgImage} alt="Video" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <Play className="text-white w-10 h-10 ml-1" fill="currentColor" />
                    </div>
                </div>
                <div className="absolute bottom-6 left-6 text-white">
                    <span className="uppercase text-xs font-bold tracking-widest text-orange-500 mb-1 block">{promotionalVideo.subtitle}</span>
                    <h3 className="text-xl font-bold">{promotionalVideo.title}</h3>
                </div>
            </section>

            {/* 5. Exterior Visuals */}
            <section className="p-8 lg:p-12 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#0F172A] uppercase tracking-tight">{exteriorVisuals.title}</h3>
                    <a className="text-orange-500 text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
                        View All <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2 aspect-[16/10] bg-gray-100 overflow-hidden rounded-sm relative group">
                        <Image quality={100} unoptimized src={exteriorVisuals.images[0].src} alt={exteriorVisuals.images[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2 py-1 text-white text-xs font-mono rounded-sm">{exteriorVisuals.images[0].label}</div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex-1 bg-gray-100 overflow-hidden rounded-sm relative group">
                            <Image quality={100} unoptimized src={exteriorVisuals.images[1].src} alt={exteriorVisuals.images[1].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 bg-gray-100 overflow-hidden rounded-sm relative group">
                            <Image quality={100} unoptimized src={exteriorVisuals.images[2].src} alt={exteriorVisuals.images[2].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Social Facilities */}
            <section className="grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-[#0F172A] uppercase tracking-tight mb-6">{socialFacilities.title}</h3>
                    <div className="border border-gray-200 bg-white rounded-sm divide-y divide-gray-100">
                        {socialFacilities.facilities.map((fac, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                <div className={`p-2 rounded-sm ${fac.colorClass}`}>
                                    {/* Using a generic icon for now */}
                                    <div className="w-6 h-6 flex items-center justify-center font-bold">{idx + 1}</div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[#0F172A] text-sm">{fac.name}</span>
                                    <span className="text-xs text-gray-500">{fac.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative min-h-[300px] lg:min-h-auto">
                    <Image quality={100} unoptimized src={socialFacilities.image} alt="Facilities" fill className="object-cover" />
                </div>
            </section>

            {/* 7. Interior Visuals */}
            <section className="p-8 lg:p-12 bg-white">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#0F172A] uppercase tracking-tight">{interiorVisuals.title}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 border border-gray-200 bg-gray-200 rounded-sm overflow-hidden">
                    {interiorVisuals.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square md:aspect-auto h-64 md:h-80">
                            <Image quality={100} unoptimized src={img.src} alt={img.label} fill className="object-cover group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white text-sm font-bold">{img.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. Floor Plans */}
            <section className="p-8 lg:p-12 bg-gray-50">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-[#0F172A] uppercase tracking-tight">{floorPlans.title}</h3>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm bg-white text-gray-600 hover:bg-gray-100">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm bg-white text-gray-600 hover:bg-gray-100">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {floorPlans.plans.map((plan, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-[#0F172A]">{plan.type}</h4>
                                    <p className="text-xs text-gray-500 font-mono">{plan.details}</p>
                                </div>
                                <span className={`${plan.soldOut ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-600'} text-xs font-bold px-2 py-1 rounded-sm uppercase`}>
                                    {plan.status}
                                </span>
                            </div>
                            <div className="aspect-square bg-gray-50 p-4 border border-dashed border-gray-200 flex items-center justify-center relative">
                                <Image quality={100} unoptimized src={plan.image} alt={plan.type} fill className="object-contain mix-blend-multiply" />
                            </div>
                            <button className="w-full mt-4 py-2 text-xs font-bold uppercase tracking-wide border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* 9. Document CTA */}
            <section className="bg-[#0F172A] p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold mb-2">{documentCta.title}</h3>
                    <p className="text-gray-400 text-sm max-w-md">{documentCta.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <button className="flex items-center justify-center gap-2 h-12 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm tracking-wide rounded-sm transition-colors uppercase whitespace-nowrap w-full sm:w-auto">
                        <FileText className="w-5 h-5" />
                        <span>Download All</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 h-12 px-6 bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold text-sm tracking-wide rounded-sm transition-colors uppercase whitespace-nowrap w-full sm:w-auto">
                        <span>Contact Agent</span>
                    </button>
                </div>
            </section>
        </>
    );
};
