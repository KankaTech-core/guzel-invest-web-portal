import React from "react";
import Image from "next/image";
import { s5Data } from "../mockData";

export const Visuals = () => {
    const { exteriorVisuals, socialFacilities, interiorVisuals, floorPlans } = s5Data;

    return (
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
            {/* 5. Exterior Visuals */}
            <section className="py-24">
                <div className="flex items-end justify-between mb-12">
                    <h3 className="text-xl font-bold text-[#374151]">{exteriorVisuals.title}</h3>
                    <span className="text-xs text-[#374151]/40 uppercase tracking-widest">{exteriorVisuals.subtitle}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {exteriorVisuals.images.map((img, idx) => (
                        <div key={idx} className="aspect-[4/5] bg-gray-100 rounded-md overflow-hidden relative group">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url('${img.src}')` }}
                            ></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Social Facilities */}
            <section className="py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1 space-y-12">
                        <div>
                            <h3 className="text-xl font-bold text-[#374151] mb-4">{socialFacilities.title}</h3>
                            <p className="text-[#374151]/70 font-light leading-relaxed max-w-md">
                                {socialFacilities.description}
                            </p>
                        </div>
                        <ul className="space-y-6">
                            {socialFacilities.facilities.map((fac, idx) => (
                                <li key={idx} className="flex items-center gap-4 group">
                                    <span className="w-8 h-[1px] bg-[#374151]/20 group-hover:bg-[#ec6c04] transition-colors"></span>
                                    <span className="text-sm tracking-wide font-medium text-[#374151]">{fac}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="order-1 lg:order-2 h-[500px] rounded-md overflow-hidden relative">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${socialFacilities.image}')` }}
                        ></div>
                    </div>
                </div>
            </section>

            {/* 7. Interior Visuals */}
            <section className="py-24">
                <div className="flex items-end justify-between mb-12">
                    <h3 className="text-xl font-bold text-[#374151]">{interiorVisuals.title}</h3>
                    <span className="text-xs text-[#374151]/40 uppercase tracking-widest">{interiorVisuals.subtitle}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {interiorVisuals.images.map((img, idx) => (
                        <div key={idx} className="aspect-[4/3] bg-gray-100 rounded-md overflow-hidden relative group">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url('${img.src}')` }}
                            ></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. Technical Diagrams (Floor Plans) */}
            <section className="py-24 border-t border-gray-100">
                <div className="text-center mb-16">
                    <h3 className="text-2xl font-bold text-[#374151] mb-2">{floorPlans.title}</h3>
                    <p className="text-[#374151]/50 text-sm">{floorPlans.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    {floorPlans.plans.map((plan, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-6">
                            <div className="w-full bg-white p-8 rounded-lg flex justify-center items-center">
                                <Image
quality={100} unoptimized                                     src={plan.image}
                                    alt={plan.type}
                                    width={400}
                                    height={400}
                                    className={`w-full h-auto mix-blend-multiply opacity-90 contrast-125 ${plan.rotate ? 'rotate-90' : ''}`}
                                />
                            </div>
                            <span className="text-xs uppercase tracking-widest font-bold text-[#374151]/60">{plan.type}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
