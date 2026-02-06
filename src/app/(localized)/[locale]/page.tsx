import Link from "next/link";
import { useTranslations } from "next-intl";
import { Building2, MapPin, Users, Award } from "lucide-react";
import { LandingAccordion } from "@/components/ui/interactive-image-accordion";

export default function HomePage() {
    const t = useTranslations();

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <LandingAccordion />

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <Building2 className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                            <div className="text-4xl font-bold text-slate-900">500+</div>
                            <div className="text-gray-600">İlan</div>
                        </div>
                        <div className="text-center">
                            <Users className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                            <div className="text-4xl font-bold text-slate-900">1000+</div>
                            <div className="text-gray-600">Mutlu Müşteri</div>
                        </div>
                        <div className="text-center">
                            <MapPin className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                            <div className="text-4xl font-bold text-slate-900">20+</div>
                            <div className="text-gray-600">Bölge</div>
                        </div>
                        <div className="text-center">
                            <Award className="w-12 h-12 mx-auto text-amber-500 mb-4" />
                            <div className="text-4xl font-bold text-slate-900">23+</div>
                            <div className="text-gray-600">Yıllık Deneyim</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Listings Placeholder */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        {t("listings.featured")}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-300" />
                                <div className="p-6">
                                    <h3 className="font-semibold text-lg mb-2">
                                        Örnek İlan Başlığı {i}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">Alanya, Merkez</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-amber-600 font-bold text-xl">
                                            250.000 €
                                        </span>
                                        <span className="text-gray-500 text-sm">120 m²</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link
                            href="/portfoy"
                            className="inline-flex items-center gap-2 border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white font-semibold px-8 py-3 rounded-full transition-all"
                        >
                            {t("common.seeAll")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-gray-400 italic mb-4">{t("footer.slogan")}</p>
                    <p className="text-gray-500 text-sm">{t("footer.copyright")}</p>
                </div>
            </footer>
        </main>
    );
}
