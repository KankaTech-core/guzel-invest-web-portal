const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/(non-localized)/admin/projeler/yeni/components/NewProjectForm.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Home to imports
content = content.replace(
    /Map as MapIcon,\n} from "lucide-react";/g,
    'Map as MapIcon,\n    Home,\n} from "lucide-react";'
);

// 2. Reorder TABS
const oldTabs = `const TABS = [
    { id: "details", label: "Temel Bilgiler", icon: FileText },
    { id: "location", label: "Konum", icon: MapPin },
    { id: "media", label: "Medya ve Dokümanlar", icon: ImageIcon },
    { id: "features", label: "Özellikler", icon: Settings },
    { id: "units", label: "Üniteler & Planlar", icon: Building2 },
];`;
const newTabs = `const TABS = [
    { id: "details", label: "Temel Bilgiler", icon: FileText },
    { id: "features", label: "Özellikler", icon: Settings },
    { id: "location", label: "Konum", icon: MapPin },
    { id: "media", label: "Medya ve Dokümanlar", icon: ImageIcon },
    { id: "units", label: "Üniteler & Planlar", icon: Building2 },
];`;
content = content.replace(oldTabs, newTabs);

// 3. Move Features Section
// Strategy: Find SECTION: FEATURES and SECTION: UNITS & PLANS. Extract Features. Delete it.
// Then insert before SECTION: LOCATION
const featuresStart = content.indexOf('{/* SECTION: FEATURES */}');
const unitsStart = content.indexOf('{/* SECTION: UNITS & PLANS */}');
const featuresBlock = content.substring(featuresStart, unitsStart).trim() + "\n\n                    ";
content = content.slice(0, featuresStart) + content.slice(unitsStart); // Remove it from end

const locationStart = content.indexOf('{/* SECTION: LOCATION */}');
content = content.slice(0, locationStart) + featuresBlock + content.slice(locationStart);

// 4. Update DETAILS with Cover Photo and remove Video Preview
const oldDetailsPromo = `{/* Right Col: Promo Video */}
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                        <PlayCircleIcon className="w-4 h-4 text-orange-500" />
                                        Tanıtım Videosu
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Video URL'si
                                            </label>
                                            <div className="relative">
                                                <PlayCircleIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                <input
                                                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400"
                                                    placeholder="https://youtube.com/..."
                                                    type="text"
                                                />
                                            </div>
                                            <p className="mt-1.5 text-xs text-slate-500">YouTube veya Vimeo bağlantılarını destekler.</p>
                                        </div>
                                        <div className="h-40 w-full rounded-lg border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                                            Video Önizleme
                                        </div>
                                    </div>
                                </div>
                            </div>`;
const newDetailsPromo = `{/* Right Col: Promo Video & Cover Photo */}
                            <div className="space-y-6">
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                            <PlayCircleIcon className="w-4 h-4 text-orange-500" />
                                            Tanıtım Videosu
                                        </h3>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Video URL'si
                                            </label>
                                            <div className="relative">
                                                <PlayCircleIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                                <input
                                                    className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400"
                                                    placeholder="https://youtube.com/..."
                                                    type="text"
                                                />
                                            </div>
                                            <p className="mt-1.5 text-xs text-slate-500">YouTube veya Vimeo bağlantılarını destekler.</p>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200 space-y-4">
                                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                            <ImagePlus className="w-4 h-4 text-orange-500" />
                                            Kapak Fotoğrafı
                                        </h3>
                                        <div className="flex flex-col items-center justify-center p-6 w-full rounded-lg border-2 border-dashed border-slate-300 bg-white hover:border-orange-400 hover:bg-orange-50/50 transition-colors cursor-pointer text-slate-400 hover:text-orange-500">
                                            <UploadCloud className="w-8 h-8 mb-3" />
                                            <p className="text-sm font-medium text-slate-700">Görsel yüklemek için tıklayın</p>
                                            <span className="text-xs mt-1">PNG, JPG, WebP (Max 3MB)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
content = content.replace(oldDetailsPromo, newDetailsPromo);

// 5. Update MEDIA section to include 3 galleries
const oldMedia = `{/* SECTION: MEDIA */}
                    <section id="section-media" className="scroll-mt-28 space-y-6">
                        <div className="border-t border-slate-100 pt-8 border-b pb-4">
                            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-orange-500" />
                                Medya
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl transition-all duration-200 ease-in-out p-12 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-slate-100 text-slate-400 transition-colors">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">
                                            Görsel yüklemek için tıklayın veya sürükleyin
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">
                                            PNG, JPG, WebP, GIF ve AVIF formatları desteklenmektedir. Max 3MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500">
                                İlk görsel kapak olarak kullanılır. Sonraki ilk 3 görsel portföy carouseli için mavi etiketle işaretlenir.
                            </p>
                        </div>
                    </section>`;

const newMedia = `{/* SECTION: MEDIA */}
                    <section id="section-media" className="scroll-mt-28 space-y-12">
                        {/* 1. Dış Görseller */}
                        <div className="space-y-6">
                            <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-orange-500" />
                                    Dış Görseller
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Projenin dış cephe, peyzaj ve genel vaziyet planı görselleri.
                                </p>
                            </div>
                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl transition-all duration-200 ease-in-out p-12 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-slate-100 text-slate-400 transition-colors">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">
                                            Dış görselleri buraya sürükleyin veya seçin
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Sosyal İmkanlar */}
                        <div className="space-y-6">
                            <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                    Sosyal İmkan Görselleri
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Havuz, fitness, lobi ve diğer ortak alan görselleri.
                                </p>
                            </div>
                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl transition-all duration-200 ease-in-out p-12 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-slate-100 text-slate-400 transition-colors">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">
                                            Sosyal alan görsellerini buraya sürükleyin veya seçin
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. İç Görseller */}
                        <div className="space-y-6">
                            <div className="border-t border-slate-100 pt-8 border-b pb-4">
                                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <Home className="w-5 h-5 text-orange-500" />
                                    İç Görseller
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Örnek daire iç mekan, mutfak ve banyo görselleri.
                                </p>
                            </div>
                            <div className="relative border-2 border-dashed border-slate-200 rounded-xl transition-all duration-200 ease-in-out p-12 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 bg-slate-50/50">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-slate-100 text-slate-400 transition-colors">
                                        <Upload className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">
                                            İç mekan görsellerini buraya sürükleyin veya seçin
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>`;
content = content.replace(oldMedia, newMedia);

fs.writeFileSync(filePath, content, 'utf8');

console.log("Successfully modified the file");
