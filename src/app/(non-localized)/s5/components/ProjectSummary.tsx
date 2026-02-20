import React from "react";
import { Play } from "lucide-react";
import { s5Data } from "../mockData";

export const ProjectSummary = () => {
    const { summary, promotionalVideo } = s5Data;

    return (
        <>
            {/* 3. Project Summary */}
            <section className="py-24 max-w-[1200px] mx-auto px-6 md:px-12 lg:px-24 w-full">
                <div className="flex flex-col md:flex-row gap-12 items-end justify-between">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-6 text-[#374151]">{summary.title}</h2>
                        <p className="text-[#374151]/80 leading-relaxed text-lg font-light">
                            {summary.description}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                        <button className="bg-[#ec6c04] hover:bg-[#ec6c04]/90 text-white px-8 py-3 rounded-md text-sm font-bold tracking-wide transition-colors w-full sm:w-auto text-center">
                            INQUIRE NOW
                        </button>
                        <button className="bg-transparent border border-[#374151]/20 hover:border-[#374151] text-[#374151] px-8 py-3 rounded-md text-sm font-bold tracking-wide transition-colors w-full sm:w-auto text-center">
                            DOWNLOAD BROCHURE
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. Promotional Video */}
            <section className="py-12 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${promotionalVideo.bgImage}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-1 shadow-lg transition-transform group-hover:scale-110">
                            <Play className="text-[#ec6c04] w-8 h-8" fill="currentColor" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
