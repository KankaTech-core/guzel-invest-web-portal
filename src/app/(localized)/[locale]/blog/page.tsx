import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";
import { formatDate, getMediaUrl } from "@/lib/utils";
import {
    SAMPLE_ARTICLE_PREVIEW,
    SAMPLE_ARTICLE_SLUG,
} from "@/data/sample-article";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";

type BlogPageProps = {
    params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
    const { locale } = await params;

    const publishedArticles = await prisma.article.findMany({
        where: {
            status: ArticleStatus.PUBLISHED,
        },
        select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            category: true,
            coverImageUrl: true,
            coverThumbnailUrl: true,
            publishedAt: true,
            createdAt: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    const sampleFromDb = publishedArticles.find(
        (article) => article.slug === SAMPLE_ARTICLE_SLUG
    );
    const sampleArticle = sampleFromDb ?? SAMPLE_ARTICLE_PREVIEW;
    const allArticles = sampleFromDb
        ? publishedArticles
        : [SAMPLE_ARTICLE_PREVIEW, ...publishedArticles];
    const listedArticles = [
        sampleArticle,
        ...allArticles.filter((article) => article.slug !== sampleArticle.slug),
    ];
    const newestArticle = sampleArticle;
    const totalArticleCount = allArticles.length;
    const latestPublishedDate =
        newestArticle.publishedAt || newestArticle.createdAt;

    return (
        <main className="relative isolate overflow-hidden bg-white pb-24 pt-24">
            <ScrollRevealSection as="section" className="container-custom relative z-10">
                <div className="grid grid-cols-12 gap-6 lg:items-stretch">
                    <div className="reveal relative col-span-12 overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8 lg:col-span-9 lg:px-9 lg:py-7">
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                                Yeni • Makale Merkezi
                            </span>
                            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                                Alanya piyasasında{" "}
                                <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                                    akıllı platform
                                </span>{" "}
                                içgörüsüyle daha net karar verin.
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                                Bölge dinamikleri, yatırım disiplini ve operasyonel içgörüyü tek
                                sayfada birleştiren net içerikler. Her makale doğrudan uygulamaya
                                dönük hazırlanır.
                            </p>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                                <Link
                                    href={`/${locale}/iletisim`}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-center text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:px-5 sm:text-sm"
                                >
                                    Uzman Ekiple Görüş
                                </Link>
                                <Link
                                    href={`/${locale}/blog/${newestArticle.slug}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-center text-[13px] font-semibold text-white transition-colors hover:bg-gray-800 sm:px-5 sm:text-sm"
                                >
                                    Yeni Makaleyi Oku
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.13]">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                                <path
                                    fill="#FF6B00"
                                    d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.4C93.5,8.4,82.2,21.1,71.4,32.1C60.6,43.1,50.3,52.4,39,60.6C27.7,68.8,15.4,75.9,2.4,71.7C-10.5,67.6,-24.1,52.1,-37.2,40.1C-50.3,28.1,-63,19.6,-68.8,7.9C-74.6,-3.8,-73.5,-18.7,-64.2,-29.6C-54.9,-40.5,-37.4,-47.4,-23.5,-54.8C-9.6,-62.2,0.7,-70.1,12.7,-72.3C24.7,-74.5,30.5,-83.6,44.7,-76.4Z"
                                    transform="translate(100 100)"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="reveal-stagger col-span-12 grid grid-cols-2 gap-2 lg:col-span-3 lg:flex lg:h-full lg:flex-col lg:gap-3">
                        <div className="reveal order-1 rounded-2xl border border-[#111828] bg-[#111828] px-4 py-4 shadow-sm sm:rounded-[2rem] sm:px-8 sm:py-5 lg:order-1 lg:flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-300 sm:text-[12px]">
                                Toplam İçerik
                            </p>
                            <p className="mt-1.5 text-3xl font-bold leading-none text-white sm:mt-2 sm:text-4xl">
                                {totalArticleCount}
                            </p>
                        </div>

                        <div className="reveal order-3 col-span-2 rounded-2xl border border-gray-200 bg-[#f2f4f7] px-4 py-4 shadow-sm sm:rounded-[2rem] sm:px-8 sm:py-5 lg:order-2 lg:flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085] sm:text-[12px]">
                                Yayın Odağı
                            </p>
                            <p className="mt-1.5 text-sm font-semibold leading-snug text-gray-900 sm:mt-2 sm:text-base">
                                Yatırım stratejileri, bölge analizi ve karar rehberleri
                            </p>
                        </div>

                        <div className="reveal order-2 relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:rounded-[2rem] sm:px-8 sm:py-5 lg:order-3 lg:flex-1">
                            <p className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085] sm:text-[12px]">
                                Son Güncelleme
                            </p>
                            <p className="relative z-10 mt-1.5 text-xl font-bold leading-tight text-gray-900 sm:mt-2 sm:text-2xl">
                                {latestPublishedDate
                                    ? formatDate(latestPublishedDate, locale)
                                    : "Yakında"}
                            </p>
                            <div
                                className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                                    backgroundSize: "16px 16px",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <ScrollRevealSection as="section" className="mt-10">
                    <div className="reveal mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-600">
                                Yayındaki Yazılar
                            </p>
                            <h2 className="mt-1 text-3xl font-bold text-gray-900">
                                Makaleler
                            </h2>
                        </div>
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {listedArticles.length} içerik
                        </span>
                    </div>

                    {listedArticles.length > 0 ? (
                        <div className="reveal-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {listedArticles.map((article, index) => {
                                const isNewest = index === 0;
                                const cardCover = article.coverThumbnailUrl || article.coverImageUrl;

                                if (isNewest) {
                                    return (
                                        <article
                                            key={article.id}
                                            className="reveal group overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 xl:col-span-3"
                                        >
                                            <Link href={`/${locale}/blog/${article.slug}`} className="grid md:grid-cols-12">
                                                <div className="relative h-52 bg-gray-100 md:col-span-4 md:h-full md:min-h-[220px]">
                                                    {cardCover ? (
                                                        <Image
                                                            src={getMediaUrl(cardCover)}
                                                            alt={article.title}
                                                            fill
                                                            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 40vw, 100vw"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                            <Newspaper className="h-12 w-12" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/15 to-transparent" />
                                                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-white">
                                                        <Newspaper className="h-3.5 w-3.5" />
                                                        Yeni
                                                    </span>
                                                </div>

                                                <div className="space-y-4 p-6 md:col-span-8 md:p-7">
                                                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                                                        <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold uppercase tracking-wide text-orange-700">
                                                            {article.category || "Genel"}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays className="h-3.5 w-3.5" />
                                                            {formatDate(
                                                                article.publishedAt || article.createdAt,
                                                                locale
                                                            )}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                                                        {article.title}
                                                    </h3>
                                                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                                                        {article.excerpt || "Makale özeti yakında eklenecek."}
                                                    </p>
                                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-orange-600">
                                                        Makaleyi Oku
                                                        <ArrowRight className="h-4 w-4" />
                                                    </span>
                                                </div>
                                            </Link>
                                        </article>
                                    );
                                }

                                return (
                                    <article
                                        key={article.id}
                                        className="reveal group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <Link href={`/${locale}/blog/${article.slug}`}>
                                            <div className="relative h-52 bg-gray-100">
                                                {cardCover ? (
                                                    <Image
                                                        src={getMediaUrl(cardCover)}
                                                        alt={article.title}
                                                        fill
                                                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                        <Newspaper className="h-12 w-12" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            </div>
                                        </Link>

                                        <div className="space-y-4 p-6">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-700">
                                                    {article.category || "Genel"}
                                                </span>
                                                <span className="text-xs font-medium text-gray-400">
                                                    {formatDate(
                                                        article.publishedAt || article.createdAt,
                                                        locale
                                                    )}
                                                </span>
                                            </div>

                                            <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-gray-900">
                                                <Link href={`/${locale}/blog/${article.slug}`}>
                                                    {article.title}
                                                </Link>
                                            </h3>

                                            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                                                {article.excerpt ||
                                                    "Makale özeti yakında eklenecek."}
                                            </p>

                                            <Link
                                                href={`/${locale}/blog/${article.slug}`}
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-orange-600"
                                            >
                                                Makaleyi Oku
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                            <p className="text-sm font-medium text-gray-600">
                                Henüz yayınlanmış makale yok.
                            </p>
                        </div>
                    )}
                </ScrollRevealSection>
            </ScrollRevealSection>
        </main>
    );
}
