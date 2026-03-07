"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { formatDate, getMediaUrl } from "@/lib/utils";

export type HomepageArticlePreview = {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    coverImageUrl: string | null;
    coverThumbnailUrl: string | null;
    publishedAt: string | null;
    createdAt: string;
};

type HomepageArticlesSectionProps = {
    locale: string;
    articles: HomepageArticlePreview[];
};

export function HomepageArticlesSection({
    locale,
    articles,
}: HomepageArticlesSectionProps) {
    const visibleArticles = articles.slice(0, 3);

    if (visibleArticles.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="reveal is-visible flex items-end justify-between mb-12 pb-6 border-b border-gray-100">
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-orange-500">
                            Blog
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">
                            Son Makaleler
                        </h2>
                    </div>
                    <Link
                        href={`/${locale}/blog`}
                        className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors font-medium"
                    >
                        Tüm Makaleleri Gör
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="reveal-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
                    {visibleArticles.map((article) => {
                        const articleImage = article.coverThumbnailUrl || article.coverImageUrl;
                        const articleDate = article.publishedAt || article.createdAt;

                        return (
                            <Link
                                key={article.id}
                                href={`/${locale}/blog/${article.slug}`}
                                className="reveal is-visible group rounded-xl border border-gray-100 overflow-hidden hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 bg-white"
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    {articleImage ? (
                                        <Image
                                            src={getMediaUrl(articleImage)}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 767px) 100vw, (min-width: 1280px) 411px, 33vw"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                                            <Newspaper className="h-10 w-10" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <span className="text-[11px] text-gray-400 font-medium">
                                        {formatDate(articleDate, locale)}
                                    </span>
                                    <h3 className="text-base font-semibold text-gray-900 mt-2 mb-2 group-hover:text-orange-600 transition-colors leading-snug">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                                        {article.excerpt || "Makale özeti yakında eklenecek."}
                                    </p>
                                    <div className="mt-4 flex items-center gap-1.5 text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                                        Devamını Oku
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href={`/${locale}/blog`}
                        className="inline-flex items-center gap-2 text-sm text-orange-500 font-semibold"
                    >
                        Tüm Makaleleri Gör
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
