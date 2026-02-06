import { useTranslations } from "next-intl";
import { Building2, Users, Award, Clock } from "lucide-react";

export default function AboutPage() {
    const t = useTranslations();

    const stats = [
        { icon: Clock, value: "20+", label: "Yıllık Deneyim" },
        { icon: Building2, value: "500+", label: "Satılan Mülk" },
        { icon: Users, value: "1000+", label: "Mutlu Müşteri" },
        { icon: Award, value: "15+", label: "Ödül" },
    ];

    return (
        <main className="pt-24 pb-20 bg-white">
            {/* Hero Section - Light Version */}
            <section className="bg-gray-50 py-20">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Güzel Invest Hakkında
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            2001 yılından bu yana Alanya'da güvenilir gayrimenkul danışmanlığı
                            hizmeti sunuyoruz. Deneyimli ekibimiz ve geniş portföyümüzle
                            hayalinizdeki evi bulmanıza yardımcı oluyoruz.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-white border-b border-gray-100">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-7 h-7 text-orange-500" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Müşterilerimize en kaliteli gayrimenkul hizmetini sunarak,
                            Alanya'da mülk edinme süreçlerini kolaylaştırmak ve güvenli hale
                            getirmektir.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Akdeniz bölgesinin en güvenilir ve tercih edilen gayrimenkul
                            firması olmak, uluslararası yatırımcılara en iyi hizmeti sunmaktır.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Neden Biz?</h2>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>20 yılı aşkın sektör deneyimi</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>Çok dilli profesyonel ekip</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>Şeffaf ve güvenilir iş anlayışı</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>Geniş ve güncel mülk portföyü</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>Satış sonrası destek hizmetleri</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
}
