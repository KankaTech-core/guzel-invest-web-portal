import React from "react";
import Image from "next/image";
import { s3Data } from "../mockData";

export const Sidebar = () => {
    const { sidebar } = s3Data;
    return (
        <div className="xl:col-span-4 bg-gray-50">
            <div className="flex flex-col sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar">
                {/* 10. Map Images */}
                <div className="grid grid-cols-3 gap-0.5 border-b border-gray-200">
                    {sidebar.maps.map((map, idx) => (
                        <div key={idx} className="aspect-square bg-gray-200 relative group overflow-hidden">
                            <Image quality={100} unoptimized src={map.image} alt={map.label} fill className={`object-cover ${map.grayscale ? 'grayscale' : ''}`} />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold uppercase">{map.label}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 11. Interactive Map Placeholder */}
                <div className="relative h-64 w-full bg-gray-200 group">
                    <Image quality={100} unoptimized src={sidebar.interactiveMapImage} alt={sidebar.locationDetails.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    {/* Minimal Overlay Card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-sm shadow-lg border-l-4 border-orange-600">
                        <h4 className="text-sm font-bold text-[#0F172A] uppercase mb-1">{sidebar.locationDetails.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{sidebar.locationDetails.distance}</p>
                        <div className="flex gap-2">
                            {sidebar.locationDetails.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 text-[10px] font-bold px-2 py-0.5 rounded text-gray-600">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 12. Other Projects (Ticker Style) */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Similar Opportunities</h3>
                    <div className="flex flex-col gap-3">
                        {sidebar.otherProjects.map((project, idx) => (
                            <div key={idx} className="group bg-white border border-gray-200 p-3 rounded-sm hover:border-orange-600/50 transition-colors cursor-pointer shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-[#0F172A] text-sm">{project.title}</span>
                                    <span className={`${project.trendColor} text-xs font-mono font-bold`}>{project.trend}</span>
                                </div>
                                <div className="flex justify-between items-end text-xs text-gray-500">
                                    <span>{project.location}</span>
                                    <span className="font-mono text-gray-900 font-bold">{project.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button className="w-full py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors">
                            Schedule a Call
                        </button>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
        </div >
    );
};
