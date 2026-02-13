import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CalendarDays,
    Clock3,
    Tag,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ArticleStatus } from "@/generated/prisma";
import { estimateReadingStats } from "@/lib/articles";
import { formatDate, getMediaUrl } from "@/lib/utils";
import {
    SAMPLE_ARTICLE,
    SAMPLE_ARTICLE_PREVIEW,
    SAMPLE_ARTICLE_SLUG,
} from "@/data/sample-article";

interface ArticleDetailPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function ArticleDetailPage({
    params,
}: ArticleDetailPageProps) {
    const { locale, slug } = await params;

    const articleFromDb = await prisma.article.findFirst({
        where: {
            slug,
            status: ArticleStatus.PUBLISHED,
        },
        select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            content: true,
            category: true,
            tags: true,
            coverImageUrl: true,
            coverThumbnailUrl: true,
            publishedAt: true,
            createdAt: true,
        },
    });

    const article =
        articleFromDb || (slug === SAMPLE_ARTICLE_SLUG ? SAMPLE_ARTICLE : null);

    if (!article) {
        notFound();
    }

    const coverImage = getMediaUrl(
        article.coverImageUrl || article.coverThumbnailUrl
    );
    const publishedDate = article.publishedAt || article.createdAt;
    const readingSource = [article.excerpt, article.content]
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        .join(" ");
    const { wordCount, readingMinutes } = estimateReadingStats(readingSource);

    const relatedArticlesFromDb = await prisma.article.findMany({
        where: {
            status: ArticleStatus.PUBLISHED,
            slug: {
                not: article.slug,
            },
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
        take: 3,
    });

    const shouldInjectSampleRelated =
        article.slug !== SAMPLE_ARTICLE_SLUG &&
        !relatedArticlesFromDb.some(
            (relatedArticle) => relatedArticle.slug === SAMPLE_ARTICLE_SLUG
        );

    const relatedArticles = shouldInjectSampleRelated
        ? [SAMPLE_ARTICLE_PREVIEW, ...relatedArticlesFromDb].slice(0, 3)
        : relatedArticlesFromDb;

    return (
        <main className="relative isolate overflow-hidden bg-white pb-24 pt-16">
            <section className="relative isolate overflow-hidden border-b border-gray-200 bg-gray-900">
                <div className="absolute inset-0">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={article.title}
                            fill
                            priority
                            sizes="100vw"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-900 to-gray-800" />
                    )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/55 via-gray-900/70 to-gray-900/90" />
                <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full border border-white/15" />

                <article className="container-custom relative z-10 py-24 sm:py-28 lg:flex lg:min-h-[640px] lg:flex-col">
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-200 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Makalelere dön
                    </Link>

                    <div className="mt-6 grid items-start gap-8 lg:mt-auto lg:items-end lg:grid-cols-[minmax(0,1fr)_340px]">
                        <header className="min-w-0 lg:pb-2">
                            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-200 sm:text-sm">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/40 bg-orange-500/20 px-3 py-1 font-semibold uppercase tracking-wide text-orange-100">
                                    <Tag className="h-3.5 w-3.5" />
                                    {article.category || "Genel"}
                                </span>
                                {Array.isArray(article.tags) && article.tags.length > 0 ? (
                                    <span className="inline-flex items-center gap-2 text-gray-200/90">
                                        {article.tags.slice(0, 3).map((tagValue) => (
                                            <span
                                                key={tagValue}
                                                className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-medium tracking-wide"
                                            >
                                                #{tagValue}
                                            </span>
                                        ))}
                                    </span>
                                ) : null}
                                <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4" />
                                    {formatDate(publishedDate, locale)}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock3 className="h-4 w-4" />
                                    {readingMinutes} dk okuma
                                </span>
                            </div>

                            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
                                {article.title}
                            </h1>
                        </header>

                        <aside className="lg:w-full lg:max-w-[340px] lg:justify-self-end">
                            <div className="rounded-3xl border border-white/20 bg-black/35 p-6 text-white backdrop-blur-sm">
                                <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/45 bg-orange-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-100">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    Hızlı Bilgi
                                </span>
                                <ul className="mt-4 space-y-3 text-sm text-gray-200">
                                    <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                                        <span className="text-gray-300">Kelime Sayısı</span>
                                        <strong className="font-semibold text-white">
                                            {wordCount.toLocaleString(locale)}
                                        </strong>
                                    </li>
                                    <li className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                                        <span className="text-gray-300">Tahmini Okuma</span>
                                        <strong className="font-semibold text-white">
                                            {readingMinutes} dakika
                                        </strong>
                                    </li>
                                    <li className="flex items-start justify-between gap-3">
                                        <span className="text-gray-300">Yayın Tarihi</span>
                                        <strong className="font-semibold text-white">
                                            {formatDate(publishedDate, locale)}
                                        </strong>
                                    </li>
                                </ul>

                                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <p className="text-sm leading-relaxed text-gray-200">
                                        Bu analiz için size özel karşılaştırmalı rapor ister misiniz?
                                    </p>
                                    <Link
                                        href={`/${locale}/iletisim`}
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-200 transition-colors hover:text-orange-100"
                                    >
                                        Uzmanla Görüş
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </article>
            </section>

            <section className="container-custom relative z-10 -mt-8 sm:-mt-10">
                <article className="mx-auto max-w-4xl rounded-[1.75rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
                    {article.excerpt ? (
                        <p className="rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-base leading-relaxed text-gray-700">
                            {article.excerpt}
                        </p>
                    ) : null}

                    <section
                        className="article-content mt-8 text-[17px] leading-8 text-gray-800"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </article>
            </section>

            <section className="container-custom mt-14">
                <div className="rounded-[1.75rem] border border-gray-200 bg-white p-6 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-600">
                        Sonraki Okuma
                    </p>
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        İlgili Makaleler
                    </h2>

                    {relatedArticles.length > 0 ? (
                        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {relatedArticles.map((relatedArticle) => (
                                <article
                                    key={relatedArticle.id}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <Link href={`/${locale}/blog/${relatedArticle.slug}`}>
                                        <div className="relative h-44 bg-gray-100">
                                            {relatedArticle.coverThumbnailUrl ||
                                            relatedArticle.coverImageUrl ? (
                                                <Image
                                                    src={getMediaUrl(
                                                        relatedArticle.coverThumbnailUrl ||
                                                            relatedArticle.coverImageUrl
                                                    )}
                                                    alt={relatedArticle.title}
                                                    fill
                                                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                            )}
                                        </div>
                                    </Link>

                                    <div className="space-y-3 p-5">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                                            {relatedArticle.category || "Genel"}
                                        </p>
                                        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-gray-900">
                                            <Link href={`/${locale}/blog/${relatedArticle.slug}`}>
                                                {relatedArticle.title}
                                            </Link>
                                        </h3>
                                        <p className="line-clamp-2 text-sm text-gray-600">
                                            {relatedArticle.excerpt ||
                                                "Makale özeti yakında eklenecek."}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-6 text-sm text-gray-600">
                            Henüz ilgili başka makale bulunmuyor.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
