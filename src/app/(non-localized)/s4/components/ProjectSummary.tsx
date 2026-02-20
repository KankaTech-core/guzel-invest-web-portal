import React from "react";
import { Play } from "lucide-react";
import { s4Data } from "../mockData";

export const ProjectSummary = () => {
    const { summary, promotionalVideo } = s4Data;

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-20 lg:py-32">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="flex-1 space-y-8">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#1e3a8a] leading-tight">
                        {summary.titleHeading} <span className="text-[#ec6804] italic">{summary.titleSpan}</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {summary.description}
                    </p>
                    <div className="pt-4">
                        <button className="bg-[#ec6804] hover:bg-orange-700 text-white font-bold py-4 px-10 rounded-full shadow-xl shadow-orange-500/20 transition-all hover:scale-105">
                            Inquire Now
                        </button>
                    </div>
                </div>

                {/* Promotional Video */}
                <div className="flex-1 w-full">
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('${promotionalVideo.bgImage}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                                <div className="w-14 h-14 rounded-full bg-white text-[#ec6804] flex items-center justify-center shadow-lg pl-1">
                                    <Play className="w-8 h-8" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
