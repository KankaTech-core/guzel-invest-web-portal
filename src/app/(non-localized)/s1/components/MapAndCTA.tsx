import React from "react";
import Image from "next/image";
import { FileText, Download, MapPin, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { s1Data } from "../mockData";

export const MapAndCTA = () => {
    const { otherProjects } = s1Data;
    return (
        <>
            <section className="py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                <FileText className="w-8 h-8 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Proje Sunum Dosyası ve Belgeler</h3>
                                <p className="text-gray-500 text-sm">Yatırım detayları ve teknik şartnameyi içeren dökümanlar.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none border-2 border-gray-200 text-gray-700 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors">
                                Bilgi Al
                            </button>
                            <button className="flex-1 md:flex-none bg-orange-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_1px_3px_rgba(236,104,3,0.3)] flex items-center gap-2 justify-center hover:bg-orange-600 transition-colors">
                                <Download className="w-5 h-5" /> Sunumu İndir (PDF)
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Harita Görselleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-100 rounded-2xl aspect-square overflow-hidden group relative border border-gray-100">
                            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtY3wLlc28Xb_3IBCJjFOtqy3GiBs4vHXzrs-Cg0iSNtfeSIqqQitd2kvPz66kb6hPqe2SfybQVk5A5c_siRx5LM_TPsBV9209FS5omZ4SoII40xoDAIJBmfc0JZyBUnwi-7pEXXTsd3Ts88DGkqyIXC6Gwcex7c_lF15HLtFjiNh0Q4N2SNcBrTDj8s34JHrzXV_EihTCmv2mtnJWzaCi2DTzHzs8O4lI5Z2ykYx6NWnh1CielJDgeZ40EIK4K2xsEfaee1jwna-0" alt="Map" fill className="object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/20 flex items-end p-6"><p className="text-white font-bold text-lg">Ulaşım Ağı</p></div>
                        </div>
                        <div className="bg-gray-100 rounded-2xl aspect-square overflow-hidden group relative border border-gray-100">
                            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGW0peZlIgICmmq_nST08O_KRYZnLiK5NuhvsEq_BXiOD4A1hEW-at82oRIzvab2HfJBXQtksH0FBJEZcbhPZL52wvYjkDroPWW9lbVtG0ldk1u5WzS0UmGVQGSnKfaSVpF38XuDKaHmPFav-jHjMoWLk7WkL4WeZdWt93xge8QaNq5tLibuSORnufeGEdD2shKhbfJ9JZITKM9ZUH8PzDSMNv0iinwduKlG6IutVJkQAnKZdoTmb0IgkIFWuf47C3nKUbGLeUa1Ej" alt="Map" fill className="object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/20 flex items-end p-6"><p className="text-white font-bold text-lg">Çevre İmkanları</p></div>
                        </div>
                        <div className="bg-gray-100 rounded-2xl aspect-square overflow-hidden group relative border border-gray-100">
                            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5f-Azvhhj6hZyJjkuajQPz2PTzMO5tseCYRTXvPCaHvvsLXMF_hKXxC209U1bYS9-EtADhnPA85uD2XbV5ZQ1aUWnLzCSUoJL39JBstMbMTeEPbNACn40aJLzl3Cr9dsr92h14GOZaPlcxgv5QA5soAt63sOBbb6Aj5cOqemsjZ51rmsW0PJ_YJkfWJul3UmKDAssS5U9Ygjs_HIMtx5Zyg3mD77YvwmiZnoCfCQLtu7UxoQrJMLuPuIpyOR4ejlY_ZrxciCyLoQe" alt="Map" fill className="object-cover group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-black/20 flex items-end p-6"><p className="text-white font-bold text-lg">Konum Analizi</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="h-[500px] w-full bg-gray-100 relative">
                <div className="absolute inset-0 grayscale contrast-125 opacity-[0.3]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f6dfc0f?auto=format&fit=crop&q=80&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 border border-gray-100">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Proje Lokasyonu</h4>
                            <p className="text-sm text-gray-500">Google Haritalar&apos;da Görüntüle</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Diğer Projeler</h2>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors text-gray-600">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors text-gray-600">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {otherProjects.map((project) => (
                            <div key={project.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                                <div className="h-64 overflow-hidden relative">
                                    <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className={`absolute top-4 left-4 ${project.status === "YENİ PROJE" ? "bg-orange-500 text-white" : "bg-white/90 text-orange-500"} backdrop-blur px-3 py-1 rounded-lg text-xs font-bold`}>
                                        {project.status}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {project.location}
                                    </p>
                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                        <span className="text-orange-500 font-black text-lg">₺ {project.price}&apos;dan</span>
                                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
