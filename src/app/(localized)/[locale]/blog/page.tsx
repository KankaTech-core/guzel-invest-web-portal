import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";
import { translateBatch } from "@/lib/ai-translate";
import { formatDate, getMediaUrl } from "@/lib/utils";
import {
    SAMPLE_ARTICLE_PREVIEW,
    SAMPLE_ARTICLE_SLUG,
} from "@/data/sample-article";
import { ScrollRevealSection } from "@/components/ui/scroll-reveal-section";
import { getBlogListCopy } from "./copy";

type BlogPageProps = {
    params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
    const { locale } = await params;
    const copy = getBlogListCopy(locale);

    const publishedArticles = await prisma.article.findMany({
        where: { status: ArticleStatus.PUBLISHED },
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
            translations: {
                where: { locale },
                take: 1,
            },
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    const sampleFromDb = publishedArticles.find((a) => a.slug === SAMPLE_ARTICLE_SLUG);
    const allMixed = sampleFromDb ? publishedArticles : [SAMPLE_ARTICLE_PREVIEW, ...publishedArticles];
    const newestMixed = sampleFromDb ?? SAMPLE_ARTICLE_PREVIEW;
    const totalArticleCount = allMixed.length;
    const latestPublishedDate = newestMixed.publishedAt || newestMixed.createdAt;

    // Normalize to plain shape with DB translations applied
    type ListArticle = { id: string; slug: string; title: string; excerpt: string | null; category: string | null; coverImageUrl: string | null; coverThumbnailUrl: string | null; publishedAt: Date | null; createdAt: Date };
    const newestArticle: ListArticle = {
        id: newestMixed.id as string,
        slug: newestMixed.slug as string,
        title: newestMixed.title as string,
        excerpt: newestMixed.excerpt as string | null,
        category: newestMixed.category as string | null,
        coverImageUrl: newestMixed.coverImageUrl as string | null,
        coverThumbnailUrl: newestMixed.coverThumbnailUrl as string | null,
        publishedAt: newestMixed.publishedAt as Date | null,
        createdAt: newestMixed.createdAt as Date,
    };

    let listedArticles: ListArticle[] = [newestArticle, ...allMixed.filter((a) => a.slug !== newestMixed.slug)].map((a) => {
        const dbTr = "translations" in a && Array.isArray((a as Record<string, unknown>).translations) ? (a as unknown as { translations: { title: string; excerpt: string | null; category: string | null }[] }).translations[0] : null;
        return {
            id: a.id as string,
            slug: a.slug as string,
            title: (dbTr?.title || a.title) as string,
            excerpt: (dbTr?.excerpt ?? a.excerpt) as string | null,
            category: (dbTr?.category ?? a.category) as string | null,
            coverImageUrl: a.coverImageUrl as string | null,
            coverThumbnailUrl: a.coverThumbnailUrl as string | null,
            publishedAt: a.publishedAt as Date | null,
            createdAt: a.createdAt as Date,
        };
    });

    // AI-translate articles without DB translations
    if (locale !== "tr" && listedArticles.length > 0) {
        const allMixedArr = [newestMixed, ...allMixed.filter((a) => a.slug !== newestMixed.slug)];
        const batchItems: { key: string; text: string }[] = [];
        allMixedArr.forEach((a, i) => {
            const dbTr = "translations" in a && Array.isArray((a as Record<string, unknown>).translations) ? (a as unknown as { translations: { title: string }[] }).translations[0] : null;
            if (dbTr?.title) return;
            batchItems.push({ key: `title-${i}`, text: a.title as string });
            if (a.excerpt) batchItems.push({ key: `excerpt-${i}`, text: a.excerpt as string });
            if (a.category) batchItems.push({ key: `cat-${i}`, text: a.category as string });
        });

        if (batchItems.length > 0) {
            const translated = await translateBatch(batchItems, locale);
            listedArticles = listedArticles.map((article, i) => {
                if (translated[`title-${i}`]) {
                    return {
                        ...article,
                        title: translated[`title-${i}`] || article.title,
                        excerpt: article.excerpt ? (translated[`excerpt-${i}`] || article.excerpt) : article.excerpt,
                        category: article.category ? (translated[`cat-${i}`] || article.category) : article.category,
                    };
                }
                return article;
            });
        }
    }

    return (
        <main className="relative isolate overflow-hidden bg-white pb-24 pt-24">
            <ScrollRevealSection as="section" className="container-custom relative z-10">
                <div className="grid grid-cols-12 gap-6 lg:items-stretch">
                    <div className="reveal relative col-span-12 overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8 lg:col-span-9 lg:px-9 lg:py-7">
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                                {copy.badge}
                            </span>
                            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
                                {copy.title}{" "}
                                <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                                    {copy.titleHighlight}
                                </span>{" "}
                                {copy.titleEnd}
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                                {copy.subtitle}
                            </p>

                            <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                                <Link href={`/${locale}/iletisim`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-center text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:px-5 sm:text-sm">
                                    {copy.contactCta}
                                </Link>
                                <Link href={`/${locale}/blog/${newestArticle.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-center text-[13px] font-semibold text-white transition-colors hover:bg-gray-800 sm:px-5 sm:text-sm">
                                    {copy.readLatest}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.13]">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                                <path fill="#FF6B00" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.4C93.5,8.4,82.2,21.1,71.4,32.1C60.6,43.1,50.3,52.4,39,60.6C27.7,68.8,15.4,75.9,2.4,71.7C-10.5,67.6,-24.1,52.1,-37.2,40.1C-50.3,28.1,-63,19.6,-68.8,7.9C-74.6,-3.8,-73.5,-18.7,-64.2,-29.6C-54.9,-40.5,-37.4,-47.4,-23.5,-54.8C-9.6,-62.2,0.7,-70.1,12.7,-72.3C24.7,-74.5,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                            </svg>
                        </div>
                    </div>

                    <div className="reveal-stagger col-span-12 grid grid-cols-2 gap-2 lg:col-span-3 lg:flex lg:h-full lg:flex-col lg:gap-3">
                        <div className="reveal order-1 rounded-2xl border border-[#111828] bg-[#111828] px-4 py-4 shadow-sm sm:rounded-[2rem] sm:px-8 sm:py-5 lg:order-1 lg:flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-300 sm:text-[12px]">{copy.totalContent}</p>
                            <p className="mt-1.5 text-3xl font-bold leading-none text-white sm:mt-2 sm:text-4xl">{totalArticleCount}</p>
                        </div>

                        <div className="reveal order-3 col-span-2 rounded-2xl border border-gray-200 bg-[#f2f4f7] px-4 py-4 shadow-sm sm:rounded-[2rem] sm:px-8 sm:py-5 lg:order-2 lg:flex-1">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085] sm:text-[12px]">{copy.focusLabel}</p>
                            <p className="mt-1.5 text-sm font-semibold leading-snug text-gray-900 sm:mt-2 sm:text-base">{copy.focusValue}</p>
                        </div>

                        <div className="reveal order-2 relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm sm:rounded-[2rem] sm:px-8 sm:py-5 lg:order-3 lg:flex-1">
                            <p className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#667085] sm:text-[12px]">{copy.latestUpdate}</p>
                            <p className="relative z-10 mt-1.5 text-xl font-bold leading-tight text-gray-900 sm:mt-2 sm:text-2xl">
                                {latestPublishedDate ? formatDate(latestPublishedDate, locale) : copy.comingSoon}
                            </p>
                            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                        </div>
                    </div>
                </div>

                <ScrollRevealSection as="section" className="mt-10">
                    <div className="reveal mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-600">{copy.publishedPosts}</p>
                            <h2 className="mt-1 text-3xl font-bold text-gray-900">{copy.postsTitle}</h2>
                        </div>
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {listedArticles.length} {copy.contentCount}
                        </span>
                    </div>

                    {listedArticles.length > 0 ? (
                        <div className="reveal-stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {listedArticles.map((article, index) => {
                                const isNewest = index === 0;
                                const cardCover = article.coverThumbnailUrl || article.coverImageUrl;

                                if (isNewest) {
                                    return (
                                        <article key={article.id} className="reveal group overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2 xl:col-span-3">
                                            <Link href={`/${locale}/blog/${article.slug}`} className="grid md:grid-cols-12">
                                                <div className="relative h-52 bg-gray-100 md:col-span-4 md:h-full md:min-h-[220px]">
                                                    {cardCover ? (
                                                        <Image src={getMediaUrl(cardCover)} alt={article.title} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 40vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                            <Newspaper className="h-12 w-12" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/15 to-transparent" />
                                                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-white">
                                                        <Newspaper className="h-3.5 w-3.5" />
                                                        {copy.newestBadge}
                                                    </span>
                                                </div>

                                                <div className="space-y-4 p-6 md:col-span-8 md:p-7">
                                                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                                                        <span className="rounded-full bg-orange-50 px-3 py-1 font-semibold uppercase tracking-wide text-orange-700">{article.category || "General"}</span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays className="h-3.5 w-3.5" />
                                                            {formatDate(article.publishedAt || article.createdAt, locale)}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">{article.title}</h3>
                                                    <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 sm:text-base">{article.excerpt || copy.emptyExcerpt}</p>
                                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 transition-colors group-hover:text-orange-600">
                                                        {copy.readArticle}
                                                        <ArrowRight className="h-4 w-4" />
                                                    </span>
                                                </div>
                                            </Link>
                                        </article>
                                    );
                                }

                                return (
                                    <article key={article.id} className="reveal group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                                        <Link href={`/${locale}/blog/${article.slug}`}>
                                            <div className="relative h-52 bg-gray-100">
                                                {cardCover ? (
                                                    <Image src={getMediaUrl(cardCover)} alt={article.title} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
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
                                                <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-700">{article.category || "General"}</span>
                                                <span className="text-xs font-medium text-gray-400">
                                                    {formatDate(article.publishedAt || article.createdAt, locale)}
                                                </span>
                                            </div>

                                            <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-gray-900">
                                                <Link href={`/${locale}/blog/${article.slug}`}>{article.title}</Link>
                                            </h3>

                                            <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">{article.excerpt || copy.emptyExcerpt}</p>

                                            <Link href={`/${locale}/blog/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition-colors hover:text-orange-600">
                                                {copy.readArticle}
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                            <p className="text-sm font-medium text-gray-600">{copy.noPosts}</p>
                        </div>
                    )}
                </ScrollRevealSection>
            </ScrollRevealSection>
        </main>
    );
}
