const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/(non-localized)/admin/projeler/yeni/components/NewProjectForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add MessageSquareIcon (for FAQ) to imports
content = content.replace(
    /Home,\n} from "lucide-react";/g,
    'Home,\n    MessageSquare,\n} from "lucide-react";'
);

// 2. Add FAQ tab to TABS array
const oldTabsToken = '{ id: "units", label: "Kat Planları", icon: Building2 },';
const newTabsToken = '{ id: "units", label: "Kat Planları", icon: Building2 },\n    { id: "faq", label: "Sıkça Sorulan Sorular", icon: MessageSquare },';
content = content.replace(oldTabsToken, newTabsToken);

// 3. Update the Units & Plans section
const oldUnitsSection = `<div className="space-y-6 mt-6">
                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl transition-all duration-200 ease-in-out p-12 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-slate-100 text-slate-400 transition-colors">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">
                                            Kat planı görsellerini buraya sürükleyin veya seçin
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>`;

const newUnitsSection = `<div className="space-y-6 mt-6 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 bg-slate-50/50">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Kat Planı Grup Adı (Örn: 1+1 Daireler)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Grup adı giriniz..." 
                                        defaultValue="Standart Kat Planları"
                                        className="w-full bg-transparent border-none p-0 text-base font-medium text-slate-900 focus:ring-0 outline-none placeholder:text-slate-400" 
                                    />
                                </div>
                                <button className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Grubu Sil">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="relative border-2 border-dashed border-slate-200 rounded-xl transition-all duration-200 ease-in-out p-12 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 rounded-full bg-slate-100 text-slate-400 transition-colors">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-slate-900">
                                                Bu gruba ait kat planı görsellerini yükleyin
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add Floor Plan Button */}
                        <div className="mt-8">
                             <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-6 text-sm font-medium text-slate-600 transition-all hover:border-orange-500 hover:bg-orange-50/50 hover:text-orange-600 cursor-pointer">
                                <PlusCircle className="w-5 h-5" />
                                Yeni Kat Planı Grubu Ekle
                            </button>
                        </div>`;

content = content.replace(oldUnitsSection, newUnitsSection);

// 4. Update the location section to include "Map Images"
const oldLocationEndToken = `                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>`;
                    
const newLocationEndToken = `                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Konum / Çevre Görselleri */}
                            <div className="pt-6 border-t border-slate-100 space-y-4 mt-8">
                                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                    <ImagePlus className="w-4 h-4 text-orange-500" />
                                    Konum & Çevre Görselleri
                                </h3>
                                <p className="text-xs text-slate-500">Projenin çevresini veya harita üzerindeki konumunu gösteren özel krokiler/görseller.</p>
                                <div className="relative border-2 border-dashed border-slate-200 rounded-xl transition-all duration-200 ease-in-out p-8 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-3 rounded-full bg-slate-100 text-slate-400 transition-colors">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                Konum görsellerini buraya sürükleyin veya seçin
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </section>`;

content = content.replace(oldLocationEndToken, newLocationEndToken);

// 5. Add FAQ Section right before the closing div of "Form Sections Area"
const formSectionsEndToken = `                    </section>
                </div>
            </div>`;

const faqSectionBlock = `                    </section>

                    {/* SECTION: FAQ */}
                    <section id="section-faq" className="scroll-mt-28 space-y-6">
                        <div className="border-t border-slate-100 pt-8 border-b pb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-orange-500" />
                                Sıkça Sorulan Sorular
                            </h2>
                            <button className="text-orange-500 hover:bg-orange-500/5 px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1.5 transition-colors">
                                <Plus width={16} height={16} /> Soru Ekle
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {/* FAQ Item 1 */}
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4 relative group">
                                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors" title="Soruyu Sil">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Soru</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 font-medium" 
                                        placeholder="Örn: Proje ne zaman teslim edilecek?" 
                                        defaultValue="Vatandaşlık için uygun mu?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">Cevap</label>
                                    <textarea 
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none placeholder:text-slate-400 text-sm" 
                                        placeholder="Cevabı buraya yazın..." 
                                        rows={3}
                                        defaultValue="Evet, projemiz 400.000$ limitine uygundur ve vatandaşlık başvurusu için gereken şartları sağlamaktadır."
                                    ></textarea>
                                </div>
                            </div>
                            
                            {/* FAQ Placeholder / Add New */}
                            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-6 text-sm font-medium text-slate-500 transition-all hover:border-orange-500 hover:bg-orange-50/50 hover:text-orange-600 cursor-pointer">
                                <PlusCircle className="w-5 h-5" />
                                Yeni Soru Ekle
                            </button>
                        </div>
                    </section>
                </div>
            </div>`;

content = content.replace(formSectionsEndToken, faqSectionBlock);

fs.writeFileSync(filePath, content, 'utf8');

console.log("Successfully ran modify_form2.js");
