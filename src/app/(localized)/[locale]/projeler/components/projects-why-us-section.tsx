import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";

export function ProjectsWhyUsSection() {
    return (
        <ScrollRevealSection className="bg-gray-50 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="grid items-start gap-12 md:grid-cols-2">
                    <div className="reveal space-y-4">
                        <div className="mb-2 flex items-center gap-3 text-orange-500">
                            <span className="h-px w-8 bg-orange-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Güven ve Kalite
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            Neden Güzel İnşaat?
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-600">
                            Yüksek inşaat kalitesi, modern mimari ve zamanında teslimat
                            prensibiyle güven inşa ediyoruz. Her projemizde deprem yönetmeliğine
                            uygun, sürdürülebilir ve estetik çözümler sunarak yaşam alanlarınızı
                            değerli kılıyoruz.
                        </p>
                    </div>

                    <div className="reveal space-y-4">
                        <div className="mb-2 flex items-center gap-3 text-orange-500">
                            <span className="h-px w-8 bg-orange-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">
                                Lokasyon Avantajı
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            Neden Alanya?
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-600">
                            Akdeniz&apos;in incisi Alanya, hem yaşam kalitesi hem de yüksek yatırım
                            potansiyeli ile eşsiz bir lokasyon sunar. Yılın 300 günü güneşli havası,
                            eşsiz plajları ve gelişmiş altyapısıyla küresel bir çekim merkezidir.
                        </p>
                    </div>
                </div>
            </div>
        </ScrollRevealSection>
    );
}
