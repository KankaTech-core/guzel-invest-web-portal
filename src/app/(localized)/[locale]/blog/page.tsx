import Link from "next/link";
import { ArrowRight } from "lucide-react";

const blogPosts = [
    {
        title: "Alanya'da Arsa Alırken İlk Kontrol Edilmesi Gereken 6 Nokta",
        excerpt:
            "İmar uygunluğu, ulaşım aksları ve çevresel gelişim planlarını birlikte değerlendiren temel bir kontrol rehberi.",
        date: "12 Ocak 2026",
        category: "Arsa",
    },
    {
        title: "Proje Satın Alımında Teslim Riskini Azaltan Sözleşme Maddeleri",
        excerpt:
            "Yeni projelerde teslim takvimi ve ödeme adımlarını güvenceye alan kritik sözleşme maddelerine pratik bakış.",
        date: "4 Ocak 2026",
        category: "Proje",
    },
    {
        title: "Satış Sonrası Mülk Yönetimi Neden Yatırımın Parçasıdır?",
        excerpt:
            "Kiralama, bakım ve operasyon desteğinin uzun vadeli yatırım performansına etkisi üzerine uygulamalı bir değerlendirme.",
        date: "26 Aralık 2025",
        category: "Mülk Yönetimi",
    },
    {
        title: "Kiralık Portföy Seçerken Lokasyon Kararını Hızlandıran Kriterler",
        excerpt:
            "Kısa sürede doğru kiralık portföye ulaşmak için bölge, ulaşım ve yaşam alışkanlıklarına göre filtreleme yaklaşımı.",
        date: "18 Aralık 2025",
        category: "Kiralık",
    },
];

type BlogPageProps = {
    params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
    const { locale } = await params;

    return (
        <main className="min-h-screen bg-gray-50 pb-20 pt-28">
            <section className="container-custom">
                <div className="max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                        Makaleler
                    </p>
                    <h1 className="mt-2 text-4xl font-bold text-gray-900">Güzel Invest Blog</h1>
                    <p className="mt-4 text-gray-600">
                        Alanya odaklı gayrimenkul kararlarında sahadan veri, süreç bilgisi ve pratik rehberler.
                    </p>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    {blogPosts.map((post) => (
                        <article key={post.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between gap-3">
                                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                                    {post.category}
                                </span>
                                <span className="text-xs font-medium text-gray-400">{post.date}</span>
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-gray-900">{post.title}</h2>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
                            <Link
                                href={`/${locale}/iletisim`}
                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-orange-600"
                            >
                                Konuyla İlgili Danışmanlık Al
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

