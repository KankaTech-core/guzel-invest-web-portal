import React from "react";
import { Info, Download } from "lucide-react";
import { s3Data } from "../mockData";

export const ProjectSummary = () => {
    const { summary } = s3Data;
    return (
        <section className="p-8 lg:p-12 bg-white">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#0F172A] text-white flex items-center justify-center font-bold text-xl rounded-sm">
                            PB
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#0F172A]">{summary.title}</h2>
                            <p className="text-gray-500 text-sm">{summary.subtitle}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        {summary.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {summary.tags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide rounded-sm border border-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-auto flex flex-col gap-3 min-w-[200px]">
                    <button className="w-full py-3 px-4 bg-white border border-gray-300 text-[#0F172A] font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors rounded-sm flex items-center justify-between group">
                        <span>Request Info</span>
                        <Info className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </button>
                    <button className="w-full py-3 px-4 bg-white border border-gray-300 text-[#0F172A] font-bold text-sm uppercase tracking-wide hover:bg-gray-50 transition-colors rounded-sm flex items-center justify-between group">
                        <span>Download PDF</span>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                    </button>
                </div>
            </div>
        </section>
    );
};
