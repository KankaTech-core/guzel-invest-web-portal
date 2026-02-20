import React from "react";
import Image from "next/image";
import { s2Data } from "../mockData";

export const MapAndCTA = () => {
    const { otherProjects } = s2Data;
    return (
        <>
            <section className="w-full bg-gray-900 py-16">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">CTA + Belgeler</h2>
                            <p className="text-gray-400 font-light">Proje hakkında daha detaylı bilgi ve teknik şartnameler.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none h-12 px-6 border border-gray-600 text-white hover:bg-white hover:text-gray-900 transition-colors font-medium rounded">
                                Info
                            </button>
                            <button className="flex-1 md:flex-none h-12 px-6 bg-orange-500 text-white hover:bg-orange-600 transition-colors font-bold rounded shadow-lg shadow-orange-900/20">
                                Proje Sunum Dosyası
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-24">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <h2 className="text-center text-4xl font-bold text-gray-900 mb-12">Harita Görselleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative aspect-square bg-gray-100 p-2 border border-gray-100 rounded">
                            <Image quality={100} unoptimized src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSWpTh6LoJQ94Ypdang6eUrWTN7EozQs7Mf3DtSb7BM9ywFShj8cVpd5-zcuAS2Rf-DSrBKopOqO2eb7jtC19v96wCkuflLWSbyWqcBj_qKD3JfrtYeXtjCtN5daUXuqcUBfDa5EAYfZXHlJ5x81mBXQ0KQguRqA4dj8-Q6q-9Qzs4Z81ismLchLTwYJ8yz6WXum_flTPVYchYtoY6MAy_28D0DBjJ0Ew4Bc4NVKso9ovk2hyg1HdmZr12WG6pYb3SyJIiC-rsO19q" alt="Map 1" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="relative aspect-square bg-gray-100 p-2 border border-gray-100 rounded">
                            <Image quality={100} unoptimized src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsvVX_9UtuJ3grqkmlgju8Q_7x_q4qxd4cL4I-ps_WesbVvL6PdYRrtFzdK9vcix6pCtYbY-jmJtNI1PsWQm-jFweTvyJvJ8d4nVwtUDKNK7M-8YPQ9kwT5NEQIQKqzlGZfNYgU5Ed8fVdxBxS9T7dvLgcS5F223dB3FZ2q0oK4QmmpmdCnBdg8B0IY-vUiZ2S7yNn8AOyM2nO1pVKdei0VlEv0VS39AF7aC6_rZkIU9axpEyurdsyZvdqKo58Ui-aFenCN4BHjkwk" alt="Map 2" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="relative aspect-square bg-gray-100 p-2 border border-gray-100 rounded">
                            <Image quality={100} unoptimized src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQbAfJsbrBrSJKdymMsF7yfdsm32lcg3RUQiCE19bHlTFlDOulacLGd5mEiJhqGPx6gfC75ZFY1iYSDMiEQ_8y-rXoMl6fwNrNoVBpeC-2jbZTp5te2xNFTZQDYDvmq4iZi-NhnxIXxswLqWXmntNhm-GLb6CyMSEZOO_ARYzCD36Tr01IC23wRe5zMoaaq-kSk2k52vOP-cHV-nvgPquuAUQQnTW5g4DiaQHw2S7yPXOdVvQVKlRwnPGEYQjfBNfjDT_WZ45zahcU" alt="Map 3" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full h-[500px] bg-gray-200 relative">
                <iframe allowFullScreen loading="lazy" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12037.904259836566!2d29.0034636!3d41.0422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a249767a47%3A0x7d00248c8236d3f2!2zQmVaWt0YcWfLCBJc3RhbmJ1bA!5e0!3m2!1sen!2str!4v1647890000000!5m2!1sen!2str" style={{ border: 0, filter: "grayscale(100%) contrast(1.1)", width: "100%", height: "100%" }}></iframe>
                <div className="absolute top-8 left-8 bg-white p-6 shadow-xl max-w-sm hidden md:block rounded">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">Lokasyon Avantajları</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                        <li className="flex items-center gap-2">Metro İstasyonuna 5dk</li>
                        <li className="flex items-center gap-2">Üniversitelere Yakın</li>
                        <li className="flex items-center gap-2">AVM&apos;lere 10dk</li>
                    </ul>
                </div>
            </section>

            <section className="w-full bg-white py-24 border-t border-gray-100">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Diğer Projeler</h2>
                        <a className="text-sm font-bold text-gray-900 border-b border-gray-900 pb-1 uppercase tracking-widest hover:text-orange-500 hover:border-orange-500 transition-colors" href="#">Tümünü Gör</a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {otherProjects.map((project) => (
                            <div key={project.id} className="group cursor-pointer">
                                <div className="overflow-hidden mb-4 rounded">
                                    <Image quality={100} unoptimized src={project.image} alt={project.title} width={600} height={400} className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-500 font-light">{project.location} — <span className="text-orange-500 font-medium">{project.status}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </>
    );
};
